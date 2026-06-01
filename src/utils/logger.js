/**
 * Logger — Structured console logging utility
 * Provides namespaced logging with emoji prefixes.
 * In production, certain log levels can be filtered out.
 */

const PREFIXES = {
  HTTP:   '🔐 [HTTP]',
  CART:   '🛒 [Cart]',
  AUTH:   '🔑 [Auth]',
  STORE:  '📦 [Store]',
  PAGE:   '📄 [Page]',
  REFRESH: '🔄 [Refresh]',
  WARN:   '⚠️',
  ERROR:  '❌',
  SUCCESS:'✅',
};

const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  http: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.HTTP} ${msg}`, ...args);
  },
  cart: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.CART} ${msg}`, ...args);
  },
  auth: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.AUTH} ${msg}`, ...args);
  },
  store: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.STORE} ${msg}`, ...args);
  },
  page: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.PAGE} ${msg}`, ...args);
  },
  refresh: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.REFRESH} ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    if (isDev) console.log(`${PREFIXES.SUCCESS} ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    if (isDev) console.warn(`${PREFIXES.WARN} ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    // Always log errors, even in production
    console.error(`${PREFIXES.ERROR} ${msg}`, ...args);
  },
};

export default logger;