const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      // app.use('/api', ...) strips '/api' before proxying.
      // Keep '/api' on target so '/api/protein' reaches the Azure backend correctly.
      // This makes Azure the primary backend when running the frontend on localhost.
      target: "https://protein-backend-karthick-cthnh3awa4gybcgm.austriaeast-01.azurewebsites.net/api",
      changeOrigin: true,
      secure: true
    })
  );
};
