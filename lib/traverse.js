var assert = require("assert");
var types = require("./types");
var Node = types.namedTypes.Node;
var isArray = types.builtInTypes.array;

function Path(node, parentPath) {
    assert.ok(this instanceof Path);

    Node.assert(node);

    if (parentPath) {
        assert.ok(parentPath instanceof Path);
    } else {
        parentPath = null;
    }

    Object.defineProperties(this, {
        node: { value: node },
        parent: { value: parentPath }
    });
}

module.exports = function(node, callback) {
    function traverse(node, parentPath) {
        if (isArray.check(node)) {
            node.map(function(child) {
                traverse(child, parentPath);
            });
        } else if (Node.check(node)) {
            var path = new Path(node, parentPath);
            callback.call(path, node);
            types.eachField(node, function(name, child) {
                traverse(child, path);
            });
        }
    }

    traverse(node);
};
