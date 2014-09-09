var path = require('path');
var fs = require('fs');
var types = require("ast-types").init(["../def/escore", "../def/e4x","../def/es6","../def/es7",
                                     "../def/fb-harmony","../def/mozilla"]);
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
