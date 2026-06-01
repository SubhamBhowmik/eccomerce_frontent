// ─── API Base URLs (relative paths — proxied by Vercel) ──────────────────────
// These are relative paths that Vercel's `rewrites` config forwards to the
// appropriate backend. This avoids CORS issues because the request originates
// from Vercel's edge (not the browser).
export const BASE_URLS = {
  PRODUCTS: '/api/products',
  AUTH:     '/api/auth',
  ORDERS:   '/api/orders',
  CART:     '/api/cart',
  PAYMENT:  '/api/payment',
  NOTIFY:   '/api/notifications',
};

// ─── Product Endpoints ────────────────────────────────────────────────────────
export const PRODUCT_ENDPOINTS = {
  ALL:          `${BASE_URLS.PRODUCTS}`,
  BY_ID:        (id)       => `${BASE_URLS.PRODUCTS}/${id}`,
  BY_CATEGORY:  (category) => `${BASE_URLS.PRODUCTS}/category/${category}`,
  CREATE:       `${BASE_URLS.PRODUCTS}`,
  UPDATE:       (id)       => `${BASE_URLS.PRODUCTS}/${id}`,
  DELETE:       (id)       => `${BASE_URLS.PRODUCTS}/${id}`,
};

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:      `${BASE_URLS.AUTH}/login`,
  SIGNUP:     `${BASE_URLS.AUTH}/register`,
  REFRESH:    `${BASE_URLS.AUTH}/refresh`,
  LOGOUT:     `${BASE_URLS.AUTH}/logout`,
  SEND_OTP:   `${BASE_URLS.AUTH}/send-otp`,
  VERIFY_OTP: `${BASE_URLS.AUTH}/verify-otp`,
};

// ─── Notification Endpoints ───────────────────────────────────────────────────
export const NOTIFY_ENDPOINTS = {
  BY_USER: (userId) => `${BASE_URLS.NOTIFY}/${userId}`,
  CREATE:  `${BASE_URLS.NOTIFY}`,
};

// ─── Order / Payment Endpoints ────────────────────────────────────────────────
export const ORDER_ENDPOINTS = {
  PLACE:           `${BASE_URLS.ORDERS}/place`,
  VERIFY_PAYMENT:  `${BASE_URLS.PAYMENT}/verify`,
  BY_USER:         `${BASE_URLS.ORDERS}`,
  BY_ID:           (id) => `${BASE_URLS.ORDERS}/${id}`,
  CANCEL:          (id) => `${BASE_URLS.ORDERS}/${id}/cancel`,
  ADMIN_ALL:       `${BASE_URLS.ORDERS}/admin/all`,
  ADMIN_STATUS:    (id) => `${BASE_URLS.ORDERS}/admin/${id}/status`,
};

// ─── Cart Endpoints (uses orders backend) ─────────────────────────────────────
export const CART_ENDPOINTS = {
  ADD:    `${BASE_URLS.CART}/add`,
  REMOVE: `${BASE_URLS.CART}/remove`,
  LIST:   `${BASE_URLS.CART}`,
  UPDATE: `${BASE_URLS.CART}/update`,
  CLEAR:  `${BASE_URLS.CART}/clear`,
};
