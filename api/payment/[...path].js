// Vercel Serverless Function — proxies /api/payment/* to the Orders backend
const { createProxy } = require('../_lib/proxy');
module.exports = createProxy(
  'https://eccomerce-orderhandling.onrender.com/api/payment',
  '/api/payment'
);
