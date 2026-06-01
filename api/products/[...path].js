// Vercel Serverless Function — proxies /api/products/* to the Spring Boot backend
const { createProxy } = require('../_lib/proxy');
module.exports = createProxy(
  'https://eccomerce-spring-2.onrender.com/api/products',
  '/api/products'
);
