// eslint.config.js
import { defineConfig } from "eslint/config";
import globals from "globals";
import jsPlugin from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import stylisticJsPlugin from "@stylistic/eslint-plugin-js";
import nextJsPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      js: jsPlugin,
      react: reactPlugin,
      "@stylistic/js": stylisticJsPlugin,
    },
    extends: [
      "js/recommended",
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.nodeBuiltin,
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.mocha,
      }
    },
    rules: {
      "@stylistic/js/indent": [
        "error",
        2
      ],
      "@stylistic/js/quotes": [
        "error",
        "double"
      ],
      "@stylistic/js/semi": [
        "error",
        "always"
      ],
      "@stylistic/js/no-trailing-spaces": "error",
      // "@stylistic/js/max-len": [
      //   "warn",
      //   { "code": 80 }
      // ],
      // "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-unused-vars": "off",
    }
  },
  {
    files: ["**/*.{jsx,mjsx,tsx,mtsx}"],
    plugins: {
      "@next/next": nextJsPlugin,
    },
    rules: {
      ...nextJsPlugin.configs.recommended.rules,
      ...nextJsPlugin.configs["core-web-vitals"].rules,
      // FIXME: temporarily disable warnings for non-usage of
      // the better image component provided by Next.js.
      "@next/next/no-img-element": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": [
        "error",
        {
          "ignore": ["jsx", "global"]
        }
      ],
    },
  }
]);
