const tailwindcss = require("tailwindcss");

module.exports = {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  plugins: [tailwindcss("./tailwind.config.js"), require("autoprefixer")]
};
