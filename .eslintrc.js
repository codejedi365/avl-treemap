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
    "plugin:import/recommended",
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
      excludedFiles: ["*.m{d,dx}/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 8,
        project: "tsconfig.json"
      },
      plugins: ["@typescript-eslint", "jest", "import"],
      extends: [
        "eslint:recommended",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:jest/recommended",
        "plugin:jest/style",
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
        "jest/globals": true
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
