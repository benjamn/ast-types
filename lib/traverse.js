/* global exports, console */
exports.init = function(types) {

var visit = types.visit;
var warnedAboutDeprecation = false;
var typesP = Object.getPrototypeOf(types);

function traverseWithFullPathInfo(node, callback) {
    if (!warnedAboutDeprecation) {
        warnedAboutDeprecation = true;
        console.warn(
            "\033[33m", // yellow
            'DEPRECATED(ast-types): Please use require("ast-types").visit ' +
                "instead of .traverse for syntax tree manipulation." +
            "\033[0m" // reset
        );
    }

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
typesP.traverseWithFullPathInfo = traverseWithFullPathInfo;
typesP.traverse = traverseWithFullPathInfo;
};