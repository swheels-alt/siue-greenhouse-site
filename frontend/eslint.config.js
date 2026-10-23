// ESLint rules for the front end (QA plan 3.1 and 3.2).
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  { ignores: ["dist/", "coverage/"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  {
    files: ["**/*.{js,jsx}"],
    plugins: { jsdoc },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "no-console": "error",
      complexity: ["error", 10],
      "max-statements": ["error", 50],
      "max-lines-per-function": ["error", { max: 60, skipBlankLines: true, skipComments: true }],
      // Names say what a thing holds; single letters only for loop indexes and coordinates (3.1).
      "id-length": ["error", { min: 2, exceptions: ["i", "j", "k", "_", "x", "y"] }],
      "react/prop-types": "off",
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          require: { FunctionDeclaration: true, ArrowFunctionExpression: true },
        },
      ],
    },
  },
  {
    // Functional components and hooks only; no class components (3.1).
    files: ["src/**/*.{js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration",
          message: "Use a function component and hooks, not a class (QA plan 3.1).",
        },
      ],
    },
  },
  {
    // Components never call fetch directly; every API call goes through src/api/ (3.1).
    files: ["src/**/*.{js,jsx}"],
    ignores: ["src/api/**"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "Call the API through src/api/ only (QA plan 3.1)." },
      ],
    },
  },
  {
    files: ["*.config.js", "**/*.test.{js,jsx}", "src/test/**"],
    languageOptions: { globals: { ...globals.node } },
  },
];
