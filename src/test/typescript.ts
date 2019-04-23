import fs from "fs";
import path from "path";
import glob from "glob";
import { parse as babelParse, ParserOptions, ParserPlugin } from "@babel/parser";
import fork from "../fork";
import typescriptDef from "../def/typescript";
import jsxDef from "../def/jsx";

var pkgRootDir = path.resolve(__dirname, "..");
var tsTypes = fork([
  typescriptDef,
  jsxDef,
]);

const babelParserDir = path.resolve(__dirname, "data", "babel-parser");

const babelTSFixturesDir =
  path.join(babelParserDir, "test", "fixtures", "typescript");

glob("**/input.js", {
  cwd: babelTSFixturesDir,
}, (error, files) => {
  if (error) {
    throw error;
  }

  describe("Whole-program validation for Babel TypeScript tests", function () {
    if (error) {
      throw error;
    }

    files.forEach((tsPath: any) => {
      var fullPath = path.join(babelTSFixturesDir, tsPath);

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

  function tryParse(code: any, fullPath: any) {
    var parseOptions = getOptions(fullPath);

    try {
      return babelParse(code, parseOptions).program;

    } catch (error) {
      // If parsing fails, check options.json to see if the failure was
      // expected.
      try {
        var options = JSON.parse(fs.readFileSync(
          path.join(path.dirname(fullPath), "options.json")).toString());
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

  function getOptions(fullPath: string): ParserOptions {
    var plugins = getPlugins(path.dirname(fullPath));
    return {
      sourceType: "module",
      plugins,
    };
  }

  function getPlugins(dir: string): ParserPlugin[] {
    try {
      var options = JSON.parse(fs.readFileSync(
        path.join(dir, "options.json")
      ).toString());
    } catch (ignored) {
      options = {};
    }

    if (options.plugins) {
      return options.plugins;
    }

    if (dir !== babelTSFixturesDir) {
      return getPlugins(path.dirname(dir));
    }

    return [
      "typescript",
    ];
  }
});

var tsCompilerDir =
  path.resolve( __dirname, "data", "typescript-compiler");

glob("**/*.ts", {
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

    files.forEach((tsPath: string) => {
      var fullPath = path.join(tsCompilerDir, tsPath);

      it("should validate " + path.relative(pkgRootDir, fullPath), function (done) {
        fs.readFile(fullPath, "utf8", function (error, code) {
          if (error) {
            throw error;
          }

          var program = babelParse(code, {
            sourceType: "module",
            plugins: [
              "typescript",
              "objectRestSpread",
              "classProperties",
              "optionalCatchBinding",
              "numericSeparator",
            ]
          }).program;

          tsTypes.namedTypes.Program.assert(program, true);

          done();
        });
      });
    });
  });
});
