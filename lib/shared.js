/* global require, exports */

exports.init = function(types) {
var Type = types.Type;
var builtin = types.builtInTypes;
var isNumber = builtin.number;

var shared = types.shared = Object.create(null, {});

// An example of constructing a new type with arbitrary constraints from
// an existing type.
function geq(than) {
    return new Type(function(value) {
        return isNumber.check(value) && value >= than;
    }, isNumber + " >= " + than);
}

// Default value-returning functions that may optionally be passed as a
// third argument to Def.prototype.field.
var defaults = {
    // Functions were used because (among other reasons) that's the most
    // elegant way to allow for the emptyArray one always to give a new
    // array instance.
    "null": function() { return null; },
    "emptyArray": function() { return []; },
    "false": function() { return false; },
    "true": function() { return true; },
    "undefined": function() {}
};

var naiveIsPrimitive = Type.or(
    builtin.string,
    builtin.number,
    builtin.boolean,
    builtin.null,
    builtin.undefined
);

var isPrimitive = new Type(function(value) {
    if (value === null)
        return true;
    var type = typeof value;
    return !(type === "object" ||
             type === "function");
}, naiveIsPrimitive.toString());

Object.defineProperties(shared, {
    geq : {
        enumerable: true,
        value: geq
    },
    defaults: {
        enumerable: true,
        value: defaults
    },
    isPrimitive: {
        enumerable: true,
        value: isPrimitive
    }
});

};