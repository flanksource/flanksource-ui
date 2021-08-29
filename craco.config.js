// craco.config.js
module.exports = {

  eslint: {
    enable: false
  },

  style: {
    postcss: {
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      plugins: [require("tailwindcss"), require("autoprefixer")]
    }
  }
};
