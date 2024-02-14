// https://github.com/facebook/create-react-app/blob/main/packages/eslint-config-react-app/index.js

module.exports = {
  env: {
    es2020: true, // Bigint
    browser: true,
    node: true,
    mocha: true
  },
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:storybook/recommended",
    "plugin:jest-dom/recommended"
  ],
  rules: {
    "react/function-component-definition": [
      2,
      {
        namedComponents: ["function-declaration", "arrow-function"],
        unnamedComponents: "arrow-function"
      }
    ],
    "react/jsx-fragments": [2, "syntax"],
    "react/jsx-no-useless-fragment": [2],
    "react/jsx-key": "warn"
  },
  overrides: [
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off"
      }
    },
    {
      files: ["./e2e/**/*.*"],
      rules: {
        "testing-library/prefer-screen-queries": "off"
      }
    }
  ]
};
