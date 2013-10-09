var assert = require("assert");
var types = require("./types");
var Node = types.namedTypes.Node;
var isArray = types.builtInTypes.array;
var NodePath = require("./node-path");

module.exports = function(node, callback) {
    function traverse(path) {
        if (isArray.check(path.value)) {
            path.each(traverse);

        } else if (Node.check(path.value)) {
            var node = path.value;

            if (callback.call(path, node) === false) {
                return;
            }

            // Child paths are cached, so path.parentPath.get(path.name)
            // should return the same Path object unless path.replace was
            // called during the callback.
            path = path.parentPath.get(path.name);

            // The node might have been replaced during the callback.
            node = path.value;
            if (!Node.check(node)) {
                return;
            }

            types.eachField(node, function(name, child) {
                var childPath = path.get(name);
                assert.strictEqual(childPath.value, child);
                traverse(childPath);
            });
        }
    }

    // Just in case we call this.replace at the root, there needs to be an
    // additional parent Path to update.
    var rootPath = new NodePath({ root: node });
    traverse(rootPath.get("root"));
    return rootPath.value.root;
};
