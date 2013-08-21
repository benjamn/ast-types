var assert = require("assert");
var types = require("./types");
var namedTypes = types.namedTypes;
var Node = namedTypes.Node;
var isArray = types.builtInTypes.array;

function Path(node, parentPath) {
    assert.ok(this instanceof Path);

    Node.assert(node);

    if (parentPath) {
        assert.ok(parentPath instanceof Path);
    } else {
        parentPath = null;
    }

    var parentScope = parentPath && parentPath.scope;
    var scope = null;

    if (Scope.isEstablishedBy(node)) {
        scope = new Scope(node, parentScope);
    } else if (parentScope) {
        scope = parentScope;
    }

    Object.defineProperties(this, {
        node: { value: node },
        parent: { value: parentPath },
        scope: { value: scope }
    });
}

function Scope(node, parentScope) {
    assert.ok(Scope.isEstablishedBy(node));

    if (parentScope) {
        assert.ok(parentScope instanceof Scope);
    } else {
        parentScope = null;
    }

    Object.defineProperties(this, {
        node: { value: node },
        isGlobal: { value: !parentScope },
        parent: { value: parentScope }
    });
}

var ScopeType = types.Type.or(
    // Program introduces the global scope.
    namedTypes.Program,

    // Function is the supertype of FunctionExpression,
    // FunctionDeclaration, ArrowExpression, etc.
    namedTypes.Function,

    // In case you didn't know, the caught parameter shadows any variable
    // of the same name in an outer scope.
    namedTypes.CatchClause
);

Scope.isEstablishedBy = function(node) {
    return ScopeType.check(node);
};

module.exports = function(node, callback) {
    function traverse(node, parentPath) {
        if (isArray.check(node)) {
            node.map(function(child) {
                traverse(child, parentPath);
            });
        } else if (Node.check(node)) {
            var path = new Path(node, parentPath);

            if (callback.call(path, node) === false) {
                return;
            }

            types.eachField(node, function(name, child) {
                traverse(child, path);
            });
        }
    }

    traverse(node);
};
