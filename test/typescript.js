var assert = require("assert");
var fs = require("fs");
var path = require("path");
var shared = require("./shared.js");
var pkgRootDir = path.resolve(__dirname, "..");
var tsRootDir = path.resolve(__dirname, "data", "typescript");
var tsTypes = require("../fork.js")([
  require("../def/typescript"),
  require("../def/jsx"),
]);

require("glob")("**/input.js", {
  cwd: tsRootDir,
}, (error, files) => {
  describe("TypeScript whole-program validation", function () {
    if (error) {
      throw error;
    }

    files.forEach(tsPath => {
      var fullPath = path.join(tsRootDir, tsPath);

      it("should validate " + path.relative(pkgRootDir, fullPath), function (done) {
        fs.readFile(fullPath, "utf8", function (error, code) {
          if (error) {
            throw error;
          }
          var program = tryParse(code, fullPath);
          if (program !== null) {
            tsTypes.namedTypes.Program.assert(program, true);
          }
          done();
        });
      });
    });
  });
});

function tryParse(code, fullPath) {
  var parseOptions = getOptions(fullPath);

  try {
    return require("babylon").parse(code, parseOptions).program;

  } catch (error) {
    // If parsing fails, check options.json to see if the failure was
    // expected.
    try {
      var options = JSON.parse(fs.readFileSync(
        path.join(path.dirname(fullPath), "options.json")));
    } catch (optionsError) {
      console.error(optionsError.message);
    }

    if (options &&
        options.throws === error.message) {
      return null;
    }

    throw error;
  }
}

function getOptions(fullPath) {
  var plugins = getPlugins(path.dirname(fullPath));
  return {
    sourceType: "module",
    plugins,
  };
}

function getPlugins(dir) {
  try {
    var options = JSON.parse(fs.readFileSync(
      path.join(dir, "options.json")
    ));
  } catch (ignored) {
    options = {};
  }

  if (options.plugins) {
    return options.plugins;
  }

  if (dir !== tsRootDir) {
    return getPlugins(path.dirname(dir));
  }

  return [
    "typescript",
  ];
}
