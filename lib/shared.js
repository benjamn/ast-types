var types = require("./types");
var Type = types.Type;
var isNumber = types.builtInTypes.number;

// An example of constructing a new type with arbitrary constraints from
// an existing type.
exports.geq = function(than) {
    return new Type(function(value) {
        return isNumber.check(value) && value >= than;
    }, isNumber + " >= " + than);
};

// Default value-returning functions that may optionally be passed as a
// third argument to Def.prototype.field.
exports.defaults = {
    // Functions were used because (among other reasons) that's the most
    // elegant way to allow for the emptyArray one always to give a new
    // array instance.
    "null": function() { return null },
    "emptyArray": function() { return [] },
    "false": function() { return false },
    "true": function() { return true },
    "undefined": function() {}
};
