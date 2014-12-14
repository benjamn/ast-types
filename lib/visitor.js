// Abstract implementation of the visitor pattern

var assert = require("assert");
var types = require("./types");
var isObject = types.builtInTypes.object;
var isFunction = types.builtInTypes.function;
var hasOwn = Object.prototype.hasOwnProperty;


function Visitor () {
    assert.ok(this instanceof Visitor);

    this._methodNameTable = computeMethodNameTable(this);

    // State reset every time Visitor.prototype.visit is called.
    this._visiting = false;
    this._traversed = false;
}

var Vp = Visitor.prototype;

// Create customized visitors
Visitor.create = function create(init) {
    function CreatedVisitor () {
        Visitor.call(this);
        init && init.apply(this, arguments);
    }

    CreatedVisitor.prototype = Object.create(Vp);
    CreatedVisitor.prototype.constructor = CreatedVisitor;

    CreatedVisitor.fromMethodsObject = fromMethodsObject.bind(null, CreatedVisitor);
    CreatedVisitor.visit = function (value, methods) {
        var visitor = CreatedVisitor.fromMethodsObject(methods);
        return visitor.visit(value);
    };

    return CreatedVisitor;
};

function extend(target, source) {
    for (var property in source) {
        if (hasOwn.call(source, property)) {
            target[property] = source[property];
        }
    }

    return target;
}

// Create an ad-hoc visitor for the given methods
function fromMethodsObject (ctor, methods) {
    if (methods instanceof Visitor) {
        return methods;
    }

    if (!isObject.check(methods)) {
        // An empty visitor?
        return new ctor;
    }

    function AdHoc () {
        ctor.apply(this, arguments);
    }
    AdHoc.prototype = Object.create(ctor.prototype);
    AdHoc.prototype.constructor = AdHoc;
    extend(AdHoc.prototype, methods);

    return new AdHoc;
};

var recursiveVisitWarning = [
    "Recursively calling visitor.visit(node) resets visitor state.",
    "Try this.visit(node) or this.traverse(node) instead."
].join(" ");


Vp.visit = function(value) {
    assert.ok(!this._visiting, recursiveVisitWarning);

    // Private state that needs to be reset before every traversal.
    this._visiting = true;
    this._traversed = false;

    // Called with the same arguments as .visit.
    this.reset.apply(this, arguments);

    try {
        return this.visitWithoutReset(value);
    } finally {
        this._visiting = false;
    }
};

Vp.visitWithoutReset = function visitWithoutReset(value) {
    assert(false, "Abstract implementation");
};

Vp.reset = function reset() {
    assert(false, "Abstract implementation");
};

Vp.traverse = function traverse(value, newVisitor) {
    var visitor = newVisitor
                ? this.constructor.fromMethodsObject(newVisitor)
                : this;

    this._traversed = true;

    if (Array.isArray(value)) {
        for (var l = value.length, i = 0; i < l; i++) {
            visitor.visitWithoutReset(value[i]);
        }
    } else if (!isObject.check(value)) {
        // No children to visit.
    } else {
        var childNames = types.getFieldNames(value);
        var childCount = childNames.length;
        var childName, childValue;

        for (var i = 0; i < childCount; ++i) {
            childName = childNames[i];
            if (!hasOwn.call(value, childName)) {
                value[childName] = types.getFieldValue(value, childName);
            }
            childValue = value[childName];

            // Only progress nodes and arrays
            if (childValue && childValue instanceof Object) {
                visitor.visitWithoutReset(value[childName]);
            }
        }
    }
};

Vp.visit = function visit(value, newVisitor) {
    var visitor = newVisitor
                ? this.constructor.fromMethodsObject(newVisitor)
                : this;

    this._traversed = true;
    visitor.visitWithoutReset(value);
};


function computeMethodNameTable(visitor) {
    var typeNames = Object.create(null);

    for (var methodName in visitor) {
        if (/^visit[A-Z]/.test(methodName)) {
            typeNames[methodName.slice("visit".length)] = true;
        }
    }

    var supertypeTable = types.computeSupertypeLookupTable(typeNames);
    var methodNameTable = Object.create(null);

    var typeNames = Object.keys(supertypeTable);
    var typeNameCount = typeNames.length;
    for (var i = 0; i < typeNameCount; ++i) {
        var typeName = typeNames[i];
        methodName = "visit" + supertypeTable[typeName];
        if (isFunction.check(visitor[methodName])) {
            methodNameTable[typeName] = methodName;
        }
    }

    return methodNameTable;
}

module.exports = Visitor;