var visit = require("./path-visitor").visit;

function traverseWithFullPathInfo(node, callback) {
    return visit(node, {
        visitNode: function(path) {
            if (callback.call(path, path.value) !== false) {
                this.traverse(path);
            }

            return false;
        }
    });
}

traverseWithFullPathInfo.fast = traverseWithFullPathInfo;
module.exports = traverseWithFullPathInfo;
