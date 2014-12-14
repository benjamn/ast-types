var path = require('path');
var fs = require('fs');
var visit = require("../").visit;
var NodeVisitor = require("../").NodeVisitor;
var parse = require("esprima").parse;

var backbone = fs.readFileSync(
  path.join(__dirname, "data", "backbone.js"),
  "utf-8"
);

var ast = parse(backbone);


function timeit(label, cb) {
    var names = [];

    var start = +new Date;
    cb(names);
    var stop = +new Date;

    console.log("%s took %dms (name count: %d)", label, stop - start, names.length);
}

timeit('PathVisitor', function (names) {
    visit(ast, {
        visitNode: function (path) {
            names.push(path.node.type);
            this.traverse(path);
        }
    });
});

timeit('NodeVisitor', function (names) {
    NodeVisitor.visit(ast, {
        visitNode: function(node) {
            names.push(node.type)
            this.traverse(node);
        }
    });
});
