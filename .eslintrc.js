const acceptableCodePractices = {
  // Core acceptable code practices
  "no-nested-ternary": "warn",
  "no-plusplus": "off",
  yoda: "off"
};

const invalidCodeBlockRules = {
  // Invalid rules for embedded code-blocks
  "import/no-unresolved": "off",
  "no-console": "off",
  "no-undef": "off",
  "no-unused-expressions": "off",
  "no-unused-vars": "off",
  "no-unreachable": "off"
};

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
        ...acceptableCodePractices
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
    },
    {
      // Markdown JS code-blocks (virtual filepath)
      files: ["**/*.md/*.{js,jsx}"],
      rules: {
        ...invalidCodeBlockRules
      }
    },
    {
      // Markdown TS code-blocks (virtual filepath)
      files: ["**/*.md/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
      ],
      rules: {
        ...acceptableCodePractices,
        // Additional embedded code-block invalid rules
        ...invalidCodeBlockRules,
        "@typescript-eslint/no-unused-vars": "off",
        // Typescript rules that require a project tsconfig.json which is not possible
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/return-await": "off",
        // Readmes should be extra specific or generic as desired
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/ban-types": "warn"
      }
    }
  ]
};
