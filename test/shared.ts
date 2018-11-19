"use strict";

var types = require("../main");
var n = types.namedTypes;
var path = require("path");
var fs = require("fs");

exports.esprimaParse = require("esprima").parse;

exports.validateECMAScript = function (file: any) {
  var fullPath = path.join(__dirname, "..", file);

  it("should validate " + file + " with Esprima", function (done) {
    fs.readFile(fullPath, "utf8", function(err: any, code: any) {
      if (err) {
        throw err;
      }

      n.Program.assert(exports.esprimaParse(code), true);
      n.Program.assert(exports.esprimaParse(code, {
        loc: true
      }), true);

      done();
    });
  });

  it("should validate " + file + " with Babylon", function (done) {
    fs.readFile(fullPath, "utf8", function (err: any, code: any) {
      if (err) {
        throw err;
      }
      var ast = babylonParse(code);
      n.Program.assert(ast, true);
      done();
    });
  });
};

var reifyBabylonParse = require("reify/lib/parsers/babylon").parse;
function babylonParse(source: any) {
  var ast = reifyBabylonParse(source);
  if (ast.type === "File") ast = ast.program;
  return ast;
}
exports.babylonParse = babylonParse;
