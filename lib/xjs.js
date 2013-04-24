var types = require("./types");
var def = types.Type.def;
var or = types.Type.or;
var builtin = types.builtInTypes;
var isString = builtin.string;
var isBoolean = builtin.boolean;
var defaults = require("./shared").defaults;

def("XJSAttribute")
    .bases("Node")
    .build("name", "value")
    .field("name", def("XJSIdentifier"))
    .field("value", or(def("XJSExpression"), null));

def("XJSIdentifier")
    .bases("Node")
    .build("name", "namespace")
    .field("name", isString)
    .field("namspace", or(isString, null));

def("XJSExpression")
    .bases("Expression")
    .build("value")
    .field("value", def("Expression"));

def("XJSElement")
    .bases("Expression")
    .build("openingElement", "closingElement", "children")
    .field("openingElement", def("XJSOpeningElement"))
    .field("closingElement", or(def("XJSClosingElement"), null))
    .field("children", [or(
        def("XJSElement"),
        def("XJSExpression"),
        def("XJSText")
    )], defaults.emptyArray)
    // Little-known fact: default functions have access to the same
    // arguments as the builder function.
    .field("name", def("XJSIdentifier"), function(openingElement) {
        return openingElement.name;
    })
    .field("selfClosing", isBoolean, function(openingElement) {
        return openingElement.selfClosing;
    })
    .field("attributes", [def("XJSAttribute")], function(openingElement) {
        return openingElement.attributes;
    });

def("XJSOpeningElement")
    .bases("Node") // TODO Does this make sense? Can't really be an XJSElement.
    .build("name", "attributes", "selfClosing")
    .field("name", def("XJSIdentifier"))
    .field("attributes", [def("XJSAttribute")], defaults.emptyArray)
    .field("selfClosing", isBoolean, defaults.false);

def("XJSClosingElement")
    .bases("Node") // TODO Same concern.
    .build("name")
    .field("name", def("XJSIdentifier"));

def("XJSText")
    .bases("Literal")
    .build("value")
    .field("value", isString);

types.finalize();
