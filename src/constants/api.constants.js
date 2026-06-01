// ─── API Base URLs ────────────────────────────────────────────────────────────
export const BASE_URLS = {
  PRODUCTS: 'https://eccomerce-spring-2.onrender.com',
  ORDERS:   'https://eccomerce-orderhandling.onrender.com',
  NOTIFY:   'https://eccomerce-notification.onrender.com',
};

// ─── Product Endpoints ────────────────────────────────────────────────────────
export const PRODUCT_ENDPOINTS = {
  ALL:          `${BASE_URLS.PRODUCTS}/api/products`,
  BY_ID:        (id)       => `${BASE_URLS.PRODUCTS}/api/products/${id}`,
  BY_CATEGORY:  (category) => `${BASE_URLS.PRODUCTS}/api/products/category/${category}`,
  CREATE:       `${BASE_URLS.PRODUCTS}/api/products`,
  UPDATE:       (id)       => `${BASE_URLS.PRODUCTS}/api/products/${id}`,
  DELETE:       (id)       => `${BASE_URLS.PRODUCTS}/api/products/${id}`,
};

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:      `${BASE_URLS.PRODUCTS}/api/auth/login`,
  SIGNUP:     `${BASE_URLS.PRODUCTS}/api/auth/register`,
  REFRESH:    `${BASE_URLS.PRODUCTS}/api/auth/refresh`,
  LOGOUT:     `${BASE_URLS.PRODUCTS}/api/auth/logout`,
  SEND_OTP:   `${BASE_URLS.PRODUCTS}/api/auth/send-otp`,
  VERIFY_OTP: `${BASE_URLS.PRODUCTS}/api/auth/verify-otp`,
};

// ─── Notification Endpoints ───────────────────────────────────────────────────
export const NOTIFY_ENDPOINTS = {
  BY_USER: (userId) => `${BASE_URLS.NOTIFY}/api/notifications/${userId}`,
  CREATE:  `${BASE_URLS.NOTIFY}/api/notifications`,
};

// ─── Order / Payment Endpoints ────────────────────────────────────────────────
export const ORDER_ENDPOINTS = {
  PLACE: `${BASE_URLS.ORDERS}/api/orders/place`,
  VERIFY_PAYMENT: `${BASE_URLS.ORDERS}/api/payment/verify`,
  BY_USER: `${BASE_URLS.ORDERS}/api/orders`,
  BY_ID: (id) => `${BASE_URLS.ORDERS}/api/orders/${id}`,
  CANCEL: (id) => `${BASE_URLS.ORDERS}/api/orders/${id}/cancel`,
  ADMIN_ALL: `${BASE_URLS.ORDERS}/api/orders/admin/all`,
  ADMIN_STATUS: (id) => `${BASE_URLS.ORDERS}/api/orders/admin/${id}/status`,
};
