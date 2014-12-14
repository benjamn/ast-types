var assert = require("assert");
var Visitor = require('./visitor');
var types = require("./types");
var Node = types.namedTypes.Node;


var NodeVisitor = Visitor.create();

var NVp = NodeVisitor.prototype;

var recursiveVisitWarning = [
    "Recursively calling visitor.visit(node) resets visitor state.",
    "Try this.visit(node) or this.traverse(node) instead."
].join(" ");


NVp.visitWithoutReset = function(node) {
    assert.ok(node instanceof Object);

    var methodName = Node.check(node) && this._methodNameTable[node.type];
    if (methodName) {

        var result = this[methodName](node);

        assert.ok(
            !result,
            "This visitor doesn't support replacements, use PathNodeVisitor instead."
        );

        if (result === false) {
            // Visitor methods return false to indicate that they have handled
            // their own traversal needs, and we should not complain if
            // this.needToCallTraverse is still true.
            this._traversed = true;
        }

        if (!this._traversed) {
            // If this.traverse still hasn't been called, visit the
            // children of the replacement node.
            this.traverse(node);
        }

        assert.ok(
            this._traversed,
            "Must either call this.traverse or return false in " + methodName
        );

    } else {
        // If there was no visitor method to call, visit the children of
        // this node generically.
        this.traverse(node);
    }
};


module.exports = NodeVisitor;
