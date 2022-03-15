module.exports = function(core, options) {
  return {
    plugins: ['@babel/plugin-syntax-jsx', [require('./lib/plugin.js'), options]]
  };
};

