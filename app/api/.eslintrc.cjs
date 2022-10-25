/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "eslint-plugin-node"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    rules: {
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-unused-vars": [
            "error",
            { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
        ],
    },
};
