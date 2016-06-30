var assert = require("assert");
var types = require("./types");
var n = types.namedTypes;
var b = types.builders;
var isNumber = types.builtInTypes.number;
var isArray = types.builtInTypes.array;
var Path = require("./path");
var Scope = require("./scope");

// The internal representation is an array reflecting the stack of
// steps that took the traversal to reach the current point.
// Each step is reflected by two values in the array: the name of
// the key (null for root) and the resulting value.
//
function StackPath(value, prevStack, name) {
    assert.ok(this instanceof StackPath);

    if (arguments.length > 0) {
        if (prevStack) {
            this.stack = prevStack.concat([name, wrap(value)]);
        } else {
            this.stack = [null, wrap(value)];
        }
    } else {
        this.stack = [null];
    }
}

var SPp = StackPath.prototype = Object.create(null);

Object.defineProperties(SPp, {
    node: {
        get: function() {
            var l = this.stack.length - 1;
            if (Array.isArray(this.stack[l])) {
                l -= 2;
            }
            return unwrap(this.stack[l]);
        }
    },

    name: {
        get: function () {
            var l = this.stack.length;
            return this.stack[ l - 2 ];
        }
    },

    value: {
        get: function() {
            var l = this.stack.length - 1;
            return unwrap(this.stack[l]);
        }
    },

    parent: {
        get: function() {
            var stack = this.stack;
            var l = stack.length - 3;

            if (Array.isArray(stack[l])) {
                l -= 2;
            }
            if (l <= 0) {
                return null;
            }

            return this.clone(stack.slice(0, l));
        }
    },

    parentNode: { // New!
        get: function () {
            var l = this.stack.length - 3;
            if (Array.isArray(this.stack[l])) {
                l -= 2;
            }
            if (l <= 0) {
                return null;
            }
            return unwrap(this.stack[l]);
        }
    },

    parentPath: {
        get: function() {
            var parent = this.clone();
            parent.stack.pop();  // value
            parent.stack.pop();  // name
            return parent;
        }
    },

    // The closest enclosing scope that governs this node.
    scope: {
        get: function() {
            var stack = this.stack;
            var l = stack.length;
            while (l--) {
                if (ScopedNode.check(stack[l])) {
                    return stack[l].scope;
                }
            }
            return null;
        }
    }
});

SPp.clone = function (stack) {
    var clone = new StackPath();
    clone.stack = stack || this.stack.slice(0);
    return clone;
};

SPp.get = function (name) {
    var clone = this.clone();
    clone.stack.push(name, this.value[name]);
    return clone;
};

SPp.replace = function() {
    var args = Array.prototype.slice.call(arguments);
    var stack = this.stack;
    var l = stack.length;
    var parent = stack[l - 1];
    var count = args.length;

    if (Array.isArray(parent)) {
        var idx = stack[l - 2];
        args = args.map(wrap);
        args.unshift(1);
        args.unshift(idx);
        parent.splice.apply(parent, args);
    } else if (count === 1) {
        this.parentNode[ this.name ] = args[0];
        ScopedNode.release(stack.pop());
        stack.push(wrap(args[0]));
    } else if (count === 0) {
        this.parentNode[ this.name ] = null;
        ScopedNode.release(stack.pop());  // value
        stack.pop();  // name
    } else {
        assert.ok(false, "Could not replace path");
    }
};

SPp.prune = function() {
    var remainingNodePath = this.parent;

    this.replace();

    return cleanUpNodesAfterPrune(remainingNodePath);
};

SPp.getValueProperty = function(name) {
    return types.getFieldValue(this.value, name);
};

/**
 * Determine whether this.node needs to be wrapped in parentheses in order
 * for a parser to reproduce the same local AST structure.
 *
 * For instance, in the expression `(1 + 2) * 3`, the BinaryExpression
 * whose operator is "+" needs parentheses, because `1 + 2 * 3` would
 * parse differently.
 *
 * If assumeExpressionContext === true, we don't worry about edge cases
 * like an anonymous FunctionExpression appearing lexically first in its
 * enclosing statement and thus needing parentheses to avoid being parsed
 * as a FunctionDeclaration with a missing name.
 */
SPp.needsParens = function(assumeExpressionContext) {
    var pp = this.parentPath;
    if (!pp) {
        return false;
    }

    var node = this.value;

    // Only expressions need parentheses.
    if (!n.Expression.check(node)) {
        return false;
    }

    // Identifiers never need parentheses.
    if (node.type === "Identifier") {
        return false;
    }

    while (!n.Node.check(pp.value)) {
        pp = pp.parentPath;
        if (!pp) {
            return false;
        }
    }

    var parent = pp.value;

    switch (node.type) {
    case "UnaryExpression":
    case "SpreadElement":
    case "SpreadProperty":
        return parent.type === "MemberExpression"
            && this.name === "object"
            && parent.object === node;

    case "BinaryExpression":
    case "LogicalExpression":
        switch (parent.type) {
        case "CallExpression":
            return this.name === "callee"
                && parent.callee === node;

        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
            return true;

        case "MemberExpression":
            return this.name === "object"
                && parent.object === node;

        case "BinaryExpression":
        case "LogicalExpression":
            var po = parent.operator;
            var pp = PRECEDENCE[po];
            var no = node.operator;
            var np = PRECEDENCE[no];

            if (pp > np) {
                return true;
            }

            if (pp === np && this.name === "right") {
                assert.strictEqual(parent.right, node);
                return true;
            }

        default:
            return false;
        }

    case "SequenceExpression":
        switch (parent.type) {
        case "ForStatement":
            // Although parentheses wouldn't hurt around sequence
            // expressions in the head of for loops, traditional style
            // dictates that e.g. i++, j++ should not be wrapped with
            // parentheses.
            return false;

        case "ExpressionStatement":
            return this.name !== "expression";

        default:
            // Otherwise err on the side of overparenthesization, adding
            // explicit exceptions above if this proves overzealous.
            return true;
        }

    case "YieldExpression":
        switch (parent.type) {
        case "BinaryExpression":
        case "LogicalExpression":
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "CallExpression":
        case "MemberExpression":
        case "NewExpression":
        case "ConditionalExpression":
        case "YieldExpression":
            return true;

        default:
            return false;
        }

    case "Literal":
        return parent.type === "MemberExpression"
            && isNumber.check(node.value)
            && this.name === "object"
            && parent.object === node;

    case "AssignmentExpression":
    case "ConditionalExpression":
        switch (parent.type) {
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "BinaryExpression":
        case "LogicalExpression":
            return true;

        case "CallExpression":
            return this.name === "callee"
                && parent.callee === node;

        case "ConditionalExpression":
            return this.name === "test"
                && parent.test === node;

        case "MemberExpression":
            return this.name === "object"
                && parent.object === node;

        default:
            return false;
        }

    default:
        if (parent.type === "NewExpression" &&
            this.name === "callee" &&
            parent.callee === node) {
            return containsCallExpression(node);
        }
    }

    if (assumeExpressionContext !== true &&
        !this.canBeFirstInStatement() &&
        this.firstInStatement())
        return true;

    return false;
};

function isBinary(node) {
    return n.BinaryExpression.check(node)
        || n.LogicalExpression.check(node);
}

function isUnaryLike(node) {
    return n.UnaryExpression.check(node)
        // I considered making SpreadElement and SpreadProperty subtypes
        // of UnaryExpression, but they're not really Expression nodes.
        || (n.SpreadElement && n.SpreadElement.check(node))
        || (n.SpreadProperty && n.SpreadProperty.check(node));
}

var PRECEDENCE = {};
[["||"],
 ["&&"],
 ["|"],
 ["^"],
 ["&"],
 ["==", "===", "!=", "!=="],
 ["<", ">", "<=", ">=", "in", "instanceof"],
 [">>", "<<", ">>>"],
 ["+", "-"],
 ["*", "/", "%"]
].forEach(function(tier, i) {
    tier.forEach(function(op) {
        PRECEDENCE[op] = i;
    });
});

function containsCallExpression(node) {
    if (n.CallExpression.check(node)) {
        return true;
    }

    if (isArray.check(node)) {
        return node.some(containsCallExpression);
    }

    if (n.Node.check(node)) {
        return types.someField(node, function(name, child) {
            return containsCallExpression(child);
        });
    }

    return false;
}

SPp.canBeFirstInStatement = function() {
    var node = this.node;
    return !n.FunctionExpression.check(node)
        && !n.ObjectExpression.check(node);
};

SPp.firstInStatement = function() {
    return firstInStatement(this);
};

function firstInStatement(path) {
    for (var node, parent; path.parent; path = path.parent) {
        node = path.node;
        parent = path.parent.node;

        if (n.BlockStatement.check(parent) &&
            path.parent.name === "body" &&
            path.name === 0) {
            assert.strictEqual(parent.body[0], node);
            return true;
        }

        if (n.ExpressionStatement.check(parent) &&
            path.name === "expression") {
            assert.strictEqual(parent.expression, node);
            return true;
        }

        if (n.SequenceExpression.check(parent) &&
            path.parent.name === "expressions" &&
            path.name === 0) {
            assert.strictEqual(parent.expressions[0], node);
            continue;
        }

        if (n.CallExpression.check(parent) &&
            path.name === "callee") {
            assert.strictEqual(parent.callee, node);
            continue;
        }

        if (n.MemberExpression.check(parent) &&
            path.name === "object") {
            assert.strictEqual(parent.object, node);
            continue;
        }

        if (n.ConditionalExpression.check(parent) &&
            path.name === "test") {
            assert.strictEqual(parent.test, node);
            continue;
        }

        if (isBinary(parent) &&
            path.name === "left") {
            assert.strictEqual(parent.left, node);
            continue;
        }

        if (n.UnaryExpression.check(parent) &&
            !parent.prefix &&
            path.name === "argument") {
            assert.strictEqual(parent.argument, node);
            continue;
        }

        return false;
    }

    return true;
}

/**
 * Pruning certain nodes will result in empty or incomplete nodes, here we clean those nodes up.
 */
function cleanUpNodesAfterPrune(remainingNodePath) {
    if (n.VariableDeclaration.check(remainingNodePath.node)) {
        var declarations = remainingNodePath.get('declarations').value;
        if (!declarations || declarations.length === 0) {
            return remainingNodePath.prune();
        }
    } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
        if (!remainingNodePath.get('expression').value) {
            return remainingNodePath.prune();
        }
    } else if (n.IfStatement.check(remainingNodePath.node)) {
        cleanUpIfStatementAfterPrune(remainingNodePath);
    }

    return remainingNodePath;
}

function cleanUpIfStatementAfterPrune(ifStatement) {
    var testExpression = ifStatement.get('test').value;
    var alternate = ifStatement.get('alternate').value;
    var consequent = ifStatement.get('consequent').value;

    if (!consequent && !alternate) {
        var testExpressionStatement = b.expressionStatement(testExpression);

        ifStatement.replace(testExpressionStatement);
    } else if (!consequent && alternate) {
        var negatedTestExpression = b.unaryExpression('!', testExpression, true);

        if (n.UnaryExpression.check(testExpression) && testExpression.operator === '!') {
            negatedTestExpression = testExpression.argument;
        }

        ifStatement.get("test").replace(negatedTestExpression);
        ifStatement.get("consequent").replace(alternate);
        ifStatement.get("alternate").replace();
    }
}


function ScopedNode(node) {
    this.node = node;
    this.scope = new Scope();
}

ScopedNode.prototype = Object.create(null);
ScopedNode.prototype.constructor = ScopedNode;

ScopedNode.prototype.reset = function (node) {
    scoped.node = node;
    scoped.scope = new Scope(); // TODO: we should just init it
};


ScopedNode.check = function (value) {
    // instanceof is kinda slow so try to avoid it if possible
    return value && value.scope && value instanceof ScopedNode;
};

ScopedNode.cache = [];

ScopedNode.acquire = function (node) {
    var scoped;
    if (ScopedNode.cache.length > 0) {
        scoped = ScopedNode.cache.pop();
        scoped.reset(node);
    } else {
        scoped = new ScopedNode(node);
    }
    return scoped;
};

ScopedNode.release = function (scoped) {
    // TODO: Since paths may be shared this is not safe
    return;
    if (ScopedNode.check(scoped)) {
        scoped.node = null;
        scoped.scope = null;  // TODO: we should simply reset it
        ScopedNode.cache.push(scoped);
    }
};


// Returns the node or a wrapped version of it
function wrap(node) {
    if (Scope.isEstablishedBy(node)) {
        return ScopedNode.acquire(node);
    }
    return node;
}
// the inverse of wrap :)
function unwrap(node) {
    if (ScopedNode.check(node)) {
        return node.node;
    }
    return node;
}


module.exports = StackPath;
