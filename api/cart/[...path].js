// Vercel Serverless Function — proxies /api/cart/* to the Orders backend
const { createProxy } = require('../_lib/proxy');
module.exports = createProxy(
  'https://eccomerce-orderhandling.onrender.com/api/cart',
  '/api/cart'
);
