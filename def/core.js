/* global exports */

exports.init = function(types) {
    var Type = types.Type;
    var def = Type.def;
    var or = Type.or;
    var builtin = types.builtInTypes;
    var isString = builtin.string;
    var isNumber = builtin.number;
    var isBoolean = builtin.boolean;
    var isRegExp = builtin.RegExp;
    var shared = types.shared;
    var defaults = shared.defaults;
    var geq = shared.geq;
    
    def("Node")
        .field("type", isString)
        .field("loc", or(
            def("SourceLocation"),
            null
        ), defaults["null"], true);
    
    def("SourceLocation")
        .build("start", "end", "source")
        .field("start", def("Position"))
        .field("end", def("Position"))
        .field("source", or(isString, null), defaults["null"]);
    
    def("Position")
        .build("line", "column")
        .field("line", geq(1))
    .field("column", geq(0));

};