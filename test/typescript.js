"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var shared = require("./shared.js");
var pkgRootDir = path.resolve(__dirname, "..");
var tsTypes = require("../fork.js")([
  require("../def/typescript"),
  require("../def/jsx"),
]);

const babylonDir = path.resolve(__dirname, "data", "babylon");

const babylonTSFixturesDir =
  path.join(babylonDir, "test", "fixtures", "typescript");

require("glob")("**/input.js", {
  cwd: babylonTSFixturesDir,
}, (error, files) => {
  if (error) {
    throw error;
  }

  describe("Whole-program validation for Babylon TypeScript tests", function () {
    if (error) {
      throw error;
    }

    files.forEach(tsPath => {
      var fullPath = path.join(babylonTSFixturesDir, tsPath);

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

    if (dir !== babylonTSFixturesDir) {
      return getPlugins(path.dirname(dir));
    }

    return [
      "typescript",
    ];
  }
});

var tsCompilerDir =
  path.resolve( __dirname, "data", "typescript-compiler");

require("glob")("**/*.ts", {
  cwd: tsCompilerDir,
}, (error, files) => {
  if (error) {
    throw error;
  }

  describe("Whole-program validation for TypeScript codebase", function () {
    if (error) {
      throw error;
    }

    this.timeout(20000);

    files.forEach(tsPath => {
      var fullPath = path.join(tsCompilerDir, tsPath);

      it("should validate " + path.relative(pkgRootDir, fullPath), function (done) {
        fs.readFile(fullPath, "utf8", function (error, code) {
          if (error) {
            throw error;
          }

          var program = require("babylon").parse(code, {
            sourceType: "module",
            plugins: [
              "typescript",
              "objectRestSpread",
              "classProperties",
              "optionalCatchBinding",
            ]
          }).program;

          tsTypes.namedTypes.Program.assert(program, true);

          done();
        });
      });
    });
  });
});
