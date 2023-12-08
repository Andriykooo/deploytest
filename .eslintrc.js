module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "off",
    "no-useless-escape": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off",
  },
};
