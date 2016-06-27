/**
 * @exports Scope
 * @exports Scope.isEstablishedBy
 */
'use strict';
var has = require('has');

var NodePath = require("./node-path");

var types = require("./types");
var b = types.builders;
var isArray = types.builtInTypes.array;
var Type = types.Type;
var namedTypes = types.namedTypes;

var Node = namedTypes.Node;
var Expression = namedTypes.Expression;

/**
 * Class that represents a set of variable bindings
 * @class
 * @public
 * @property {Scope?} parent
 * @property {Node} node
 * @property {boolean} isGlobal
 * @property {number} depth
 * @property {Object} bindings
 * @property {Object} types
 */
class Scope {
    constructor(path, parentScope) {
        if (!(path instanceof NodePath)) {
            throw new Error("Scope path must be a NodePath");
        }
        ScopeType.assert(path.value);

        var depth = 0;

        if (parentScope) {
            if (!(parentScope instanceof Scope)) {
                throw new Error("Scope parentScope must be a Scope or null");
            }
            depth = parentScope.depth + 1;
        } else {
            parentScope = null;
        }

        Object.defineProperties(this, {
            path: { value: path },
            node: {
                get: function getNode() {
                    return path.value;
                },
                set: function setNode() {
                    throw Error("Cannot assign .node of a Scope");
                }
            },
            isGlobal: { value: !parentScope, enumerable: true },
            depth: { value: depth },
            parent: { value: parentScope },
            bindings: { value: {} },
            types: { value: {} },
        });
    }

    /**
     * Determines if the type of `node` establishes a new scope. This does not
     * determine the type of scope that is established.
     *
     * @param {Node} node - Node to check for scoping
     * @return {boolean}
     */
    static isEstablishedBy(node) {
        return ScopeType.check(node);
    };
}


const SCOPE_TYPES = [
    // Program nodes introduce global scopes.
    namedTypes.Program,

    // Function is the supertype of FunctionExpression,
    // FunctionDeclaration, ArrowExpression, etc.
    namedTypes.Function,

    // In case you didn't know, the caught parameter shadows any variable
    // of the same name in an outer scope.
    namedTypes.CatchClause
];

var ScopeType = Type.or.apply(Type, SCOPE_TYPES);

/**
 * Will be overridden after an instance lazily calls scanScope.
 *
 * This will be set to true to prevent scanning a Node multiple times.
 */
Scope.prototype.didScan = false;

/**
 * Returns true if a Scope declares a variable with a specific name
 *
 * @param {string} name - Name of the variable to check
 * @return {boolean}
 */
Scope.prototype.declares = function declares(name) {
    this.scan();
    return has(this.bindings, name);
};

Scope.prototype.declaresType = function declaresType(name) {
    this.scan();
    return has(this.types, name);
};

/**
 * Produces a Node which has an identifier that is not declared by this or
 * any parent of this Scope.
 *
 * @param {string} prefix - Name to prefix the variable identifier with
 * @return {Node}
 */
Scope.prototype.declareTemporary = function declareTemporary(prefix) {
    if (prefix) {
        if (!/^[a-z$_]/i.test(prefix)) {
            throw new Error("Prefix must be a valid start to a JS variable identifier");
        }
    } else {
        prefix = "t$";
    }

    // Include this.depth in the name to make sure the name does not
    // collide with any variables in nested/enclosing scopes.
    prefix += this.depth.toString(36) + "$";

    this.scan();

    var index = 0;
    while (this.declares(prefix + index)) {
        ++index;
    }

    var name = prefix + index;
    return this.bindings[name] = types.builders.identifier(name);
};

/**
 * Inserts a variable into the AST
 *
 * @param {Node} identifier - Identifier Node to insert
 * @param {Node} init - Expression to initialize the identifier with
 * @return {Node} identifier
 */
Scope.prototype.injectTemporary = function injectTemporary(identifier, init) {
    identifier || (identifier = this.declareTemporary());

    // convert expression arrow function to block arrow function
    if (namedTypes.Function.check(this.path.node)) {
        if (this.path.node.expression) {
            var body = types.builders.blockStatement();
            body.body.unshift(this.path.node.body);
            this.path.node.body = body;
        }
        this.path.node.expression = false;
    }
    var bodyPath = this.path.get("body");
    // some things can nest "body", Function => BlockStatement
    while (!Array.isArray(bodyPath.value)) {
        bodyPath = bodyPath.get("body");
    }

    bodyPath.unshift(
        b.variableDeclaration(
            "var",
            [b.variableDeclarator(identifier, init || null)]
        )
    );

    return identifier;
};

/**
 * @param {boolean} force - scan even if we have already scanned the path
 */
Scope.prototype.scan = function scan(force) {
    if (force || !this.didScan) {
        for (var name in this.bindings) {
            // Empty out this.bindings, just in cases.
            delete this.bindings[name];
        }
        scanScope(this.path, this);
        this.didScan = true;
    }
};

Scope.prototype.getBindings = function getBindings() {
    this.scan();
    return this.bindings;
};

Scope.prototype.getTypes = function getTypes() {
    this.scan();
    return this.types;
};

function scanScope(path, scope) {
    var node = path.value;
    ScopeType.assert(node);

    if (namedTypes.CatchClause.check(node)) {
        // A catch clause establishes a new scope but the only variable
        // bound in that scope is the catch parameter. Any other
        // declarations create bindings in the outer scope.
        addPattern(path.get("param"), scope.bindings);

    } else {
        recursiveScanScope(path, scope);
    }
}

function recursiveScanScope(path, scope) {
    var node = path.value;

    if (path.parent &&
        namedTypes.FunctionExpression.check(path.parent.node) &&
        path.parent.node.id) {
        addPattern(path.parent.get("id"), scope.bindings);
    }

    if (!node) {
        // None of the remaining cases matter if node is falsy.

    } else if (isArray.check(node)) {
        path.each(function scanChildPath(childPath) {
            recursiveScanChild(childPath, scope);
        });

    } else if (namedTypes.Function.check(node)) {
        path.get("params").each(function addParam(paramPath) {
            addPattern(paramPath, scope.bindings);
        });

        recursiveScanChild(path.get("body"), scope);

    } else if (namedTypes.TypeAlias && namedTypes.TypeAlias.check(node)) {
        addTypePattern(path.get("id"), scope.types);

    } else if (namedTypes.VariableDeclarator.check(node)) {
        addPattern(path.get("id"), scope.bindings);
        recursiveScanChild(path.get("init"), scope);

    } else if (node.type === "ImportSpecifier" ||
               node.type === "ImportNamespaceSpecifier" ||
               node.type === "ImportDefaultSpecifier") {
        addPattern(
            // Esprima used to use the .name field to refer to the local
            // binding identifier for ImportSpecifier nodes, but .id for
            // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
            // ESTree/Acorn/ESpree use .local for all three node types.
            path.get(node.local ? "local" :
                     node.name ? "name" : "id"),
            scope.bindings
        );

    } else if (Node.check(node) && !Expression.check(node)) {
        types.eachField(node, function (name, child) {
            var childPath = path.get(name);
            if (childPath.value !== child) {
                throw new Error("");
            }
            recursiveScanChild(childPath, scope);
        });
    }
}

function recursiveScanChild(path, scope) {
    var node = path.value;

    if (!node || Expression.check(node)) {
        // Ignore falsy values and Expressions.

    } else if (namedTypes.FunctionDeclaration.check(node)) {
        addPattern(path.get("id"), scope.bindings);

    } else if (namedTypes.ClassDeclaration &&
               namedTypes.ClassDeclaration.check(node)) {
        addPattern(path.get("id"), scope.bindings);

    } else if (ScopeType.check(node)) {
        if (namedTypes.CatchClause.check(node)) {
            var catchParamName = node.param.name;
            var hadBinding = has(scope.bindings, catchParamName);

            // Any declarations that occur inside the catch body that do
            // not have the same name as the catch parameter should count
            // as bindings in the outer scope.
            recursiveScanScope(path.get("body"), scope);

            // If a new binding matching the catch parameter name was
            // created while scanning the catch body, ignore it because it
            // actually refers to the catch parameter and not the outer
            // scope that we're currently scanning.
            if (!hadBinding) {
                delete scope.bindings[catchParamName];
            }
        }

    } else {
        recursiveScanScope(path, scope);
    }
}

/** looks up a pattern and adds it to bindings
 *
 * [x] => x
 * {x: {y: z}} => z
 */
function addPattern(patternPath, bindings) {
    var pattern = patternPath.value;
    namedTypes.Pattern.assert(pattern);

    if (namedTypes.Identifier.check(pattern)) {
        if (has(bindings, pattern.name)) {
            bindings[pattern.name].push(patternPath);
        } else {
            bindings[pattern.name] = [patternPath];
        }

    } else if (namedTypes.ObjectPattern &&
               namedTypes.ObjectPattern.check(pattern)) {
        patternPath.get('properties').each(function addPropertyPattern(propertyPath) {
            var property = propertyPath.value;
            if (namedTypes.Pattern.check(property)) {
                addPattern(propertyPath, bindings);
            } else  if (namedTypes.Property.check(property)) {
                addPattern(propertyPath.get('value'), bindings);
            } else if (namedTypes.SpreadProperty &&
                       namedTypes.SpreadProperty.check(property)) {
                addPattern(propertyPath.get('argument'), bindings);
            }
        });

    } else if (namedTypes.ArrayPattern &&
               namedTypes.ArrayPattern.check(pattern)) {
        patternPath.get('elements').each(function addElementPattern(elementPath) {
            var element = elementPath.value;
            if (namedTypes.Pattern.check(element)) {
                addPattern(elementPath, bindings);
            } else if (namedTypes.SpreadElement &&
                       namedTypes.SpreadElement.check(element)) {
                addPattern(elementPath.get("argument"), bindings);
            }
        });

    } else if (namedTypes.PropertyPattern &&
               namedTypes.PropertyPattern.check(pattern)) {
        addPattern(patternPath.get('pattern'), bindings);

    } else if ((namedTypes.SpreadElementPattern &&
                namedTypes.SpreadElementPattern.check(pattern)) ||
               (namedTypes.SpreadPropertyPattern &&
                namedTypes.SpreadPropertyPattern.check(pattern))) {
        addPattern(patternPath.get('argument'), bindings);
    }
}

function addTypePattern(patternPath, types) {
    var pattern = patternPath.value;
    namedTypes.Pattern.assert(pattern);

    if (namedTypes.Identifier.check(pattern)) {
        if (has(types, pattern.name)) {
            types[pattern.name].push(patternPath);
        } else {
            types[pattern.name] = [patternPath];
        }

    }
}

/**
 *
 * @param {string} name - The name of the variable to search for.
 * @return {Scope} The scope that declares `name`
 */
Scope.prototype.lookup = function lookup(name) {
    for (var scope = this; scope; scope = scope.parent)
        if (scope.declares(name)) {
            return scope;
        }
};

Scope.prototype.lookupType = function lookupType(name) {
    for (var scope = this; scope; scope = scope.parent)
        if (scope.declaresType(name)) {
            return scope;
        }
};

/**
 * @return {Scope}
 */
Scope.prototype.getGlobalScope = function getGlobalScope() {
    return this.isGlobal ?
        this :
        this.parent.getGlobalScope();
};

module.exports = Scope;
