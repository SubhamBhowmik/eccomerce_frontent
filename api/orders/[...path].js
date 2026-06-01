// Vercel Serverless Function — proxies /api/orders/* to the Orders backend
const { createProxy } = require('../_lib/proxy');
module.exports = createProxy(
  'https://eccomerce-orderhandling.onrender.com/api/orders',
  '/api/orders'
);
