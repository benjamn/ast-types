var assert = require("assert");
var types = require("./types");
var Type = types.Type;
var namedTypes = types.namedTypes;
var Node = namedTypes.Node;
var isArray = types.builtInTypes.array;
var hasOwn = Object.prototype.hasOwnProperty;

function Scope(node, parentScope) {
    assert.ok(this instanceof Scope);
    assert.ok(Scope.isEstablishedBy(node));

    if (parentScope) {
        assert.ok(parentScope instanceof Scope);
    } else {
        parentScope = null;
    }

    Object.defineProperties(this, {
        node: { value: node },
        isGlobal: { value: !parentScope, enumerable: true },
        parent: { value: parentScope },
        bindings: { value: {} }
    });
}

var scopeTypes = [
    // Program nodes introduce global scopes.
    namedTypes.Program,

    // Function is the supertype of FunctionExpression,
    // FunctionDeclaration, ArrowExpression, etc.
    namedTypes.Function,

    // In case you didn't know, the caught parameter shadows any variable
    // of the same name in an outer scope.
    namedTypes.CatchClause
];

if (namedTypes.ModuleDeclaration) {
    // Include ModuleDeclaration only if it exists (ES6).
    scopeTypes.push(namedTypes.ModuleDeclaration);
}

var ScopeType = Type.or.apply(Type, scopeTypes);

Scope.isEstablishedBy = function(node) {
    return ScopeType.check(node);
};

var Sp = Scope.prototype;

// Will be overridden after an instance lazily calls scanScope.
Sp.didScan = false;

Sp.declares = function(name) {
    if (!this.didScan) {
        for (var name in this.bindings) {
            // Empty out this.bindings, just in cases.
            delete this.bindings[name];
        }
        scanScope(this.node, this.bindings);
        this.didScan = true;
    }

    return hasOwn.call(this.bindings, name);
};

function scanScope(node, bindings) {
    if (isArray.check(node)) {
        node.forEach(function(child) {
            scanChild(child, bindings);
        });

    } else if (namedTypes.Function.check(node)) {
        node.params.map(function(param) {
            addPattern(param, bindings);
        });

        scanChild(node.body, bindings);

    } else if (namedTypes.VariableDeclarator.check(node)) {
        addPattern(node.id, bindings);
        scanChild(node.init, bindings);

    } else if (namedTypes.ImportSpecifier &&
               namedTypes.ImportSpecifier.check(node)) {
        addPattern(node.name || node.id);

    } else if (Node.check(node)) {
        types.eachField(node, function(name, child) {
            scanChild(child, bindings);
        });
    }
}

function scanChild(node, bindings) {
    if (namedTypes.FunctionDeclaration.check(node)) {
        addPattern(node.id, bindings);

    } else if (namedTypes.ClassDeclaration &&
               namedTypes.ClassDeclaration.check(node)) {
        addPattern(node.id, bindings);

    } else if (Scope.isEstablishedBy(node)) {
        // Don't descend into nested scopes.

    } else {
        scanScope(node, bindings);
    }
}

function addPattern(pattern, bindings) {
    namedTypes.Pattern.assert(pattern);

    if (namedTypes.Identifier.check(pattern)) {
        bindings[pattern.name] = pattern;
    } else if (namedTypes.SpreadElement &&
               namedTypes.SpreadElement.check(pattern)) {
        addPattern(pattern.argument, bindings);
    }
}

Sp.lookup = function(name) {
    for (var scope = this; scope; scope = scope.parent)
        if (scope.declares(name))
            break;
    return scope;
};

Sp.getGlobalScope = function() {
    var scope = this;
    while (!scope.isGlobal)
        scope = scope.parent;
    return scope;
};

module.exports = Scope;
