/**
 * httpClient — thin wrapper around fetch
 * Centralises error handling, JSON parsing, and default headers.
 * Automatically intercepts 401 responses and refreshes the access token.
 */

import logger from '../utils/logger';

class HttpError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name    = 'HttpError';
    this.status  = status;
    this.data    = data;
  }
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept':       'application/json',
};

// ─── Token helpers ──────────────────────────────────────────────────────────

const getAccessToken = () => {
  try {
    let token = localStorage.getItem('shopindia_access_token');
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    return token;
  } catch {
    return null;
  }
};

const getRefreshToken = () => {
  try {
    let token = localStorage.getItem('shopindia_refresh_token');
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    return token;
  } catch {
    return null;
  }
};

const setAccessToken = (token) => {
  try {
    localStorage.setItem('shopindia_access_token', JSON.stringify(token));
  } catch { /* silent */ }
};

const clearAuthData = () => {
  try {
    localStorage.removeItem('shopindia_access_token');
    localStorage.removeItem('shopindia_refresh_token');
    localStorage.removeItem('shopindia_user');
  } catch { /* silent */ }
};

// ─── Public endpoints that don't need authentication ────────────────────────

const PUBLIC_ENDPOINTS = [
  '/api/products',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/ping',
];

const isPublicEndpoint = (url) =>
  PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));

// ─── Token refresh state & queue ────────────────────────────────────────────

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  logger.refresh('Calling /api/auth/refresh...');

  const response = await fetch(
    '/api/auth/refresh',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!response.ok) {
    logger.error('Refresh token request failed with status:', response.status);
    clearAuthData();
    throw new Error('Refresh token expired. Please login again.');
  }

  const data = await response.json();
  setAccessToken(data.accessToken);
  logger.success('Access token refreshed successfully');
  return data.accessToken;
};

// ─── Response processor ─────────────────────────────────────────────────────

async function processResponse(response) {
  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { data = await response.json(); } catch (_) {}
  } else {
    try { data = await response.text(); } catch (_) {}
  }

  if (!response.ok) {
    const message = data?.message || data || `HTTP ${response.status}`;
    throw new HttpError(response.status, message, data);
  }

  return data;
}

// ─── Main request function ──────────────────────────────────────────────────

async function request(url, options = {}) {
  const accessToken = getAccessToken();
  const isPublic = isPublicEndpoint(url);
  const isRefreshCall = url.includes('/api/auth/refresh');

  logger.http(`Request: ${url} | Token: ${!!accessToken} | Public: ${isPublic}`);

  // Only add Authorization header for non-public endpoints
  const authHeader = (accessToken && !isPublic)
    ? { 'Authorization': `Bearer ${accessToken}` }
    : {};

  const config = {
    ...options,
    headers: { ...DEFAULT_HEADERS, ...authHeader, ...(options.headers || {}) },
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new HttpError(0, `Network error: ${networkError.message}`);
  }

  // ── 401 Interceptor: try token refresh ─────────────────────────────────
  // Only attempt refresh for non-public, non-refresh endpoints
  if (response.status === 401 && !isPublic && !isRefreshCall) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      logger.warn('401 received but no refresh token available — redirecting to login');
      clearAuthData();
      window.location.href = '/login';
      throw new HttpError(401, 'Session expired. Please login again.');
    }

    if (!isRefreshing) {
      // First 401 — start the refresh process
      isRefreshing = true;
      logger.refresh('401 detected — starting token refresh...');

      try {
        const newToken = await refreshAccessToken();

        // Process any queued requests
        processQueue(null, newToken);
        logger.refresh('Queued requests processed');

        // Retry the original request with the new token
        config.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, config);
        logger.http(`Retry after refresh: ${url} | Status: ${response.status}`);
        return processResponse(response);
      } catch (refreshError) {
        logger.error('Token refresh failed:', refreshError.message);

        // Reject all queued requests
        processQueue(refreshError, null);

        // Redirect to login
        window.location.href = '/login';
        throw new HttpError(401, 'Session expired. Please login again.');
      } finally {
        isRefreshing = false;
      }
    } else {
      // Another refresh is already in progress — queue this request
      logger.refresh('Refresh already in progress — queuing request:', url);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(async (newToken) => {
        logger.refresh('Retrying queued request:', url);
        config.headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, config);
        return processResponse(retryResponse);
      });
    }
  }

  // ── Normal response processing (non-401 or public/refresh endpoint) ──
  return processResponse(response);
}

// ─── Exports ────────────────────────────────────────────────────────────────

const httpClient = {
  get:    (url, opts = {})       => request(url, { ...opts, method: 'GET' }),
  post:   (url, body, opts = {}) => request(url, { ...opts, method: 'POST',  body: JSON.stringify(body) }),
  put:    (url, body, opts = {}) => request(url, { ...opts, method: 'PUT',   body: JSON.stringify(body) }),
  patch:  (url, body, opts = {}) => request(url, { ...opts, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url, opts = {})       => request(url, { ...opts, method: 'DELETE' }),
};

export default httpClient;
export { HttpError };