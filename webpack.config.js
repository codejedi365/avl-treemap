const isProduction = process.env.NODE_ENV === "production";
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const thisModule = require("./package.json");

function buildConfig(env) {
  return {
    entry: "./src/treemap.ts",
    target: "node",
    output: {
      path: path.resolve(
        __dirname,
        /^\.{1,2}|\/$/.test(path.dirname(thisModule.main))
          ? "dist"
          : path.dirname(thisModule.main)
      ),
      filename: path.basename(thisModule.main)
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
      minimize: env.mode === "production",
      // determine which exports are used by modules and removed unused ones
      usedExports: true
    },
    resolve: {
      extensions: [".ts", ".js", ".json"]
    },
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
