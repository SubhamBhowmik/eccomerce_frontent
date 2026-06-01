/**
 * Vercel Serverless Function — API Proxy
 * 
 * Forwards a request from Vercel's edge to a backend server, returning the
 * response transparently to the browser. This bypasses browser CORS because
 * the cross-origin request happens server-to-server.
 * 
 * Usage:
 *   import { createProxy } from '../_lib/proxy';
 *   const proxy = createProxy('https://api.example.com');
 *   export default proxy;
 * 
 *   // Or, to strip a prefix:
 *   const proxy = createProxy('https://api.example.com', '/api/foo');
 *   // /api/foo/bar  →  https://api.example.com/bar
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Build a list of headers to forward (and which to drop).
 * Hop-by-hop headers, content-length, and host are dropped because the
 * downstream server will set them.
 */
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

function buildForwardHeaders(req) {
  const headers = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers[key] = value;
    }
  }
  return headers;
}

/**
 * Make the upstream request using Node's http module (works in all runtimes).
 */
function upstreamRequest(targetUrl, options) {
  return new Promise((resolve, reject) => {
    let url;
    try {
      url = new URL(targetUrl);
    } catch (e) {
      return reject(new Error(`Invalid target URL: ${targetUrl}`));
    }
    const lib = url.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method,
      headers: options.headers,
    };
    const upstreamReq = lib.request(reqOptions, (upstreamRes) => {
      resolve(upstreamRes);
    });
    upstreamReq.on('error', reject);
    if (options.body) {
      upstreamReq.write(options.body);
    }
    upstreamReq.end();
  });
}

/**
 * Create a Vercel serverless handler that proxies to `baseUrl` + the
 * incoming path (after stripping `stripPrefix` if provided).
 */
function createProxy(baseUrl, stripPrefix = '') {
  return async function handler(req, res) {
    const startTime = Date.now();
    try {
      // Reconstruct the path after the function's own mount point.
      // Vercel sets `req.url` to the full incoming path, e.g. "/api/cart/add"
      // When using [...path], the captured segments are in `req.query.path`.
      let incomingPath = req.url || '/';

      // When the file is `api/cart/[...path].js`, Vercel provides the
      // matched suffix in `req.query.path` (array of segments).
      if (req.query && Array.isArray(req.query.path)) {
        incomingPath = '/' + req.query.path.join('/');
      } else if (req.query && typeof req.query.path === 'string') {
        incomingPath = '/' + req.query.path;
      }

      // Strip the function's prefix from the path
      // e.g. /api/cart/add → /add (when stripPrefix = '/api/cart')
      let pathPart = incomingPath;
      if (stripPrefix && pathPart.startsWith(stripPrefix)) {
        pathPart = pathPart.slice(stripPrefix.length);
      }
      if (!pathPart.startsWith('/')) pathPart = '/' + pathPart;

      const targetUrl = baseUrl.replace(/\/$/, '') + pathPart;

      // Collect request body (Vercel parses JSON for us, but for binary
      // we may need to read the raw stream).
      let body;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (req.body !== undefined) {
          // Vercel parsed the body for us
          body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        } else {
          // Fall back to reading the raw stream
          body = await new Promise((resolve) => {
            const chunks = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', () => resolve(Buffer.concat(chunks)));
          });
        }
      }

      const headers = buildForwardHeaders(req);
      // Ensure host is set correctly
      const target = new URL(targetUrl);
      headers.host = target.host;

      const upstreamRes = await upstreamRequest(targetUrl, {
        method: req.method,
        headers,
        body,
      });

      // Forward response headers (drop hop-by-hop)
      const resHeaders = {};
      for (const [key, value] of Object.entries(upstreamRes.headers)) {
        if (!HOP_BY_HOP.has(key.toLowerCase())) {
          resHeaders[key] = value;
        }
      }
      res.writeHead(upstreamRes.statusCode || 502, resHeaders);

      // Stream the response body
      upstreamRes.on('data', (chunk) => res.write(chunk));
      upstreamRes.on('end', () => {
        res.end();
        const ms = Date.now() - startTime;
        console.log(`[proxy] ${req.method} ${incomingPath} → ${upstreamRes.statusCode} (${ms}ms)`);
      });
      upstreamRes.on('error', (err) => {
        console.error('[proxy] upstream error:', err);
        if (!res.headersSent) res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'Upstream error', message: err.message }));
      });
    } catch (err) {
      console.error('[proxy] handler error:', err);
      if (!res.headersSent) res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
    }
  };
}

module.exports = { createProxy };
