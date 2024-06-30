const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: { use: (arg0: string, arg1: any) => void; }) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.coingecko.com/api/v3',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // İsteğin başındaki '/api' kısmını kaldır
      },
    })
  );
};
