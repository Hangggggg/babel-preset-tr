module.exports = function() {
  return {
    plugins: ["@babel/plugin-syntax-jsx", require('./plugin.js')]
  };
};