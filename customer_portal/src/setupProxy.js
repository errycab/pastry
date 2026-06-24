const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/Capstone--Development/customer',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/Capstone--Development/customer': '',
      },
      logLevel: 'warn',
    })
  );
};
