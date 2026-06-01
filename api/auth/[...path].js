// Vercel Serverless Function — proxies /api/auth/* to the Spring Boot backend
const { createProxy } = require('../_lib/proxy');
module.exports = createProxy(
  'https://eccomerce-spring-2.onrender.com/api/auth',
  '/api/auth'
);
