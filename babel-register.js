const path = require("path");
const { DEFAULT_EXTENSIONS } = require("@babel/core");

require("@babel/register")({
  configFile: path.resolve(__dirname, ".babelrc"),
  ignore: [path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "test/data")],
  extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
});
