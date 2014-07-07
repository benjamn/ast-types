var assert = require("assert");
var types = require("./types");
var NodePath = require("./node-path");
var Node = types.namedTypes.Node;
var isArray = types.builtInTypes.array;
var isObject = types.builtInTypes.object;
var isFunction = types.builtInTypes.function;
var hasOwn = Object.prototype.hasOwnProperty;
var undefined;

function PathVisitor() {
    assert.ok(this instanceof PathVisitor);
    this._reusableContextStack = [];
    this._methodNameTable = computeMethodNameTable(this);
}

function computeMethodNameTable(visitor) {
    var typeNames = Object.create(null);

    for (var methodName in visitor) {
        if (/^visit[A-Z]/.test(methodName)) {
            typeNames[methodName.slice("visit".length)] = true;
        }
    }

    var supertypeTable = types.computeSupertypeLookupTable(typeNames);
    var methodNameTable = Object.create(null);

    for (var typeName in supertypeTable) {
        if (hasOwn.call(supertypeTable, typeName)) {
            methodName = "visit" + supertypeTable[typeName];
            if (isFunction.check(visitor[methodName])) {
                methodNameTable[typeName] = methodName;
            }
        }
    }

    return methodNameTable;
}

PathVisitor.fromMethodsObject = function(methods) {
    if (methods instanceof PathVisitor) {
        return methods;
    }

    if (!isObject.check(methods)) {
        // An empty visitor?
        return new PathVisitor;
    }

    function Visitor() {
        assert.ok(this instanceof Visitor);
        PathVisitor.call(this);
    }

    var Vp = Visitor.prototype = Object.create(PVp);
    Vp.constructor = Visitor;

    extend(Vp, methods);
    extend(Visitor, PathVisitor);

    isFunction.assert(Visitor.Context);

    return new Visitor;
};

function extend(target, source) {
    for (var property in source) {
        if (hasOwn.call(source, property)) {
            target[property] = source[property];
        }
    }

    return target;
}

PathVisitor.visit = function(node, methods) {
    var visitor = PathVisitor.fromMethodsObject(methods);

    if (node instanceof NodePath) {
        visitor.visit(node);
        return node.value;
    }

    var rootPath = new NodePath({ root: node });
    visitor.visit(rootPath.get("root"));
    return rootPath.value.root;
};

var PVp = PathVisitor.prototype;

PVp.visit = function(path) {
    assert.ok(path instanceof NodePath);
    var value = path.value;

    var methodName = Node.check(value) && this._methodNameTable[value.type];
    if (methodName) {
        var context = this.acquireContext(path);
        try {
            context.invokeVisitorMethod(methodName);
        } finally {
            this.releaseContext(context);
        }

    } else {
        // If there was no visitor method to call, visit the children of
        // this node generically.
        visitChildren(path, this);
    }
};

function visitChildren(path, visitor) {
    assert.ok(path instanceof NodePath);
    assert.ok(visitor instanceof PathVisitor);

    var value = path.value;

    if (isArray.check(value)) {
        path.each(visitor.visit, visitor);
    } else if (!isObject.check(value)) {
        // No children to visit.
    } else {
        var name, names = types.getFieldNames(value);
        for (var i = 0, len = names.length; i < len; ++i) {
            if (!hasOwn.call(value, name = names[i])) {
                value[name] = types.getFieldValue(value, name);
            }
            visitor.visit(path.get(name));
        }
    }
}

PVp.acquireContext = function(path) {
    if (this._reusableContextStack.length === 0) {
        return new this.constructor.Context(this).reset(path);
    }
    return this._reusableContextStack.pop().reset(path);
};

PVp.releaseContext = function(context) {
    this._reusableContextStack.push(context);
    context.currentPath = null;
};

PathVisitor.Context = function Context(visitor) {
    assert.ok(this instanceof Context);
    assert.ok(visitor instanceof PathVisitor);
    Object.defineProperty(this, "visitor", { value: visitor });
    this.currentPath = null;
    this.needToCallTraverse = true;
};

var Cp = PathVisitor.Context.prototype;

Cp.reset = function(path) {
    assert.ok(path instanceof NodePath);
    this.currentPath = path;
    this.needToCallTraverse = true;
    return this;
};

Cp.invokeVisitorMethod = function(methodName) {
    assert.ok(this.currentPath instanceof NodePath);

    var result = this.visitor[methodName].call(this, this.currentPath);

    if (result === false) {
        // Visitor methods return false to indicate that they have handled
        // their own traversal needs, and we should not complain if
        // this.needToCallTraverse is still true.
        this.needToCallTraverse = false;

    } else if (result !== undefined) {
        // Any other non-undefined value returned from the visitor method
        // is interpreted as a replacement value.
        this.currentPath = this.currentPath.replace(result)[0];

        if (this.needToCallTraverse) {
            // If this.traverse still hasn't been called, visit the
            // children of the replacement node.
            this.traverse(this.currentPath);
        }
    }

    assert.strictEqual(
        this.needToCallTraverse, false,
        "Must either call this.traverse or return false in " + methodName
    );
};

Cp.traverse = function(path, newVisitor) {
    assert.ok(path instanceof NodePath);
    assert.ok(this.currentPath instanceof NodePath);
    this.needToCallTraverse = false;
    visitChildren(path, PathVisitor.fromMethodsObject(
        newVisitor || this.visitor
    ));
};

module.exports = PathVisitor;
