import path from "path";
import fs from "fs";
import { parse as esprimaParse } from "esprima";
import { parse as reifyBabylonParse } from "reify/lib/parsers/babylon";
import types from "../main";

var n = types.namedTypes;

function validateECMAScript(file: any) {
  var fullPath = path.join(__dirname, "..", file);

  it("should validate " + file + " with Esprima", function (done) {
    fs.readFile(fullPath, "utf8", function(err, code) {
      if (err) {
        throw err;
      }

      n.Program.assert(esprimaParse(code), true);
      n.Program.assert(esprimaParse(code, {
        loc: true
      }), true);

      done();
    });
  });

  it("should validate " + file + " with Babylon", function (done) {
    fs.readFile(fullPath, "utf8", function (err, code) {
      if (err) {
        throw err;
      }
      var ast = babylonParse(code);
      n.Program.assert(ast, true);
      done();
    });
  });
};

function babylonParse(source: any, options?: any) {
  var ast = reifyBabylonParse(source, options);
  if (ast.type === "File") ast = ast.program;
  return ast;
}

export = {
  esprimaParse,
  validateECMAScript,
  babylonParse,
};
