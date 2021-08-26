module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2017: true,
    node: true
  },
  extends: [
    // JS
    "eslint:recommended",
    "airbnb-base",
    "plugin:prettier/recommended"
  ],
  ignorePatterns: [
    "**/node_modules",
    "dist/**",
    "**/package-lock.json",
    "**/tsconfig.json",
    ".vscode/**",
    "!.*"
  ],
  rules: {
    // webpack handles all dependencies to generate remaining bundle
    "import/no-extraneous-dependencies": "off"
  },
  overrides: [
    {
      files: ["*.json", ".remarkrc"],
      plugins: ["json-format"]
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 8,
        project: "tsconfig.json"
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended"
      ],
      rules: {
        // webpack handles all dependencies to generate remaining bundle
        "import/no-extraneous-dependencies": "off",
        "no-plusplus": "off",
        "no-nested-ternary": "warn",
        yoda: "off"
      }
    },
    {
      files: ["**.test.ts"],
      env: {
        jest: true
      }
    },
    {
      files: ["*.md", "*.mdx"],
      extends: ["plugin:mdx/recommended"],
      settings: {
        "mdx/code-blocks": true
      }
    }
  ]
};
