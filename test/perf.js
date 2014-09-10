var path = require('path');
var fs = require('fs');
var astlib = require('../main');// require('ast-types');
var types = astlib.init(astlib.ESLang);
var visit = types.visit;
var parse = require("esprima").parse;

var backbone = fs.readFileSync(
  path.join(__dirname, "data", "backbone.js"),
  "utf-8"
);

var ast = parse(backbone);

var names = [];
var start = +new Date;

visit(ast, {
  visitNode: function(path) {
    names.push(path.name);
    this.traverse(path);
  }
});

console.log(names.length);
console.log(new Date - start, "ms");
