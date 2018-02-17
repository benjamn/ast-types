var fs = require("fs");
var path = require("path");
var shared = require("./shared.js");
var pkgRootDir = path.resolve(__dirname, "..");
var tsRootDir = path.resolve(__dirname, "data", "typescript");
var tsTypes = require("../fork.js")([
  require("../def/typescript"),
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
        fs.readFile(fullPath, "utf8", function (err, code) {
          if (err) {
            throw err;
          }

          var program = require("babylon").parse(code, {
            sourceType: "module",
            plugins: [
              "typescript",
              "classProperties",
              "decorators",
            ]
          }).program;

          tsTypes.namedTypes.Program.assert(program, true);

          done();
        });
      });
    });
  });
});
