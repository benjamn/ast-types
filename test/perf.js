var path = require('path');
var fs = require('fs');
var visit = require("ast-types").visit;
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
