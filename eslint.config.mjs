/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/*.d.ts",
    "**/*.spec.ts",
    "**/main.browser.ts",
    "node_modules/*",
    "**/*.e2e.*",
    "**/*.js",
    "lib/*",
    "coverage/*",
  ]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "prettier",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ),

    plugins: {
      prettier,
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {},

    rules: {
      "prefer-const": "warn",
      "no-var": "error",
      "no-unused-vars": "warn",
      "object-shorthand": "warn",
      "quote-props": ["warn", "as-needed"],
      // Disallow console.* calls - use Logger.log from the _infrastructure folder instead
      "no-console": ["error"],

      // Add TypeScript naming convention rules
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase"],
        },
        // Exception for constants
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE"],
        },
        // Class types should be PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],

      "@typescript-eslint/array-type": [
        "warn",
        {
          default: "array",
        },
      ],

      "@typescript-eslint/consistent-type-assertions": [
        "warn",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "never",
        },
      ],

      "prettier/prettier": "warn",
    },
  },
]);
