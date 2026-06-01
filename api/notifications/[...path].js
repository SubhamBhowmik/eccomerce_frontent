// Vercel Serverless Function — proxies /api/notifications/* to the Notify backend
const { createProxy } = require('../_lib/proxy');
module.exports = createProxy(
  'https://eccomerce-notification.onrender.com/api/notifications',
  '/api/notifications'
);
