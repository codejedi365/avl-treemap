const isProduction = process.env.NODE_ENV === "production";
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const thisModule = require("./package.json");

function buildConfig(env) {
  return {
    entry: "./src/treemap.ts",
    output: {
      path: path.resolve(
        __dirname,
        /^\.{1,2}|\/$/.test(path.dirname(thisModule.main))
          ? "dist"
          : path.dirname(thisModule.main)
      ),
      filename: path.basename(thisModule.main),
      library: {
        type: "umd",
        export: "default"
      },
      // prevent error: `Uncaught ReferenceError: self is not defined `
      globalObject: "this"
    },
    plugins: [
      new ESLintPlugin({
        fix: env.WEBPACK_WATCH
      })
    ],
    module: {
      rules: [
        {
          test: /(?<!\.test)\.(ts)$/i,
          loader: "ts-loader",
          options: {
            onlyCompileBundledFiles: true
          },
          exclude: ["/node_modules/"]
        }
      ]
    },
    optimization: {
      // minimize & mangle the output files (TerserPlugin w/ webpack@v5)
      minimize: isProduction,
      // determine which exports are used by modules and removed unused ones
      usedExports: true
    },
    resolve: {
      extensions: [".ts", ".js", ".json"]
    },
    externals: [nodeExternals()], // ignore all modules in node_modules folder (ie. do not bundle runtime dependencies)
    externalsPresets: {
      node: true // ignore node built-in modules like path, fs, etc.
    }
  };
}

module.exports = (env) => {
  const config = buildConfig(env);
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
