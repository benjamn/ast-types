var types = require("./types");
var def = types.Type.def;
var or = types.Type.or;
var defaults = require("./shared").defaults;

// TODO The Parser API calls this ArrowExpression, but Esprima uses
// ArrowFunctionExpression.
def("ArrowFunctionExpression")
    .bases("Function", "Expression")
    .build("params", "body", "expression")
    // The forced null value here is compatible with the overridden
    // definition of the "id" field in the Function interface.
    .field("id", null, defaults.null)
    // The current spec forbids arrow generators, so I have taken the
    // liberty of enforcing that. TODO Report this.
    .field("generator", false, defaults.false);

def("YieldExpression")
    .bases("Expression")
    .build("argument")
    .field("argument", or(def("Expression"), null));

def("GeneratorExpression")
    .bases("Expression")
    .build("body", "blocks", "filter")
    .field("body", def("Expression"))
    .field("blocks", [def("ComprehensionBlock")])
    .field("filter", or(def("Expression"), null));

def("ComprehensionExpression")
    .bases("Expression")
    .build("body", "blocks", "filter")
    .field("body", def("Expression"))
    .field("blocks", [def("ComprehensionBlock")])
    .field("filter", or(def("Expression"), null));

def("ComprehensionBlock")
    .bases("Node")
    .build("left", "right", "each")
    .field("left", def("Pattern"))
    .field("right", def("Expression"))
    .field("each", isBoolean);

def("ModuleDeclaration")
    .bases("Declaration")
    .build("id", "from", "body")
    .field("id", or(def("Literal"), def("Identifier")))
    .field("from", or(def("Path"), null))
    .field("body", or(def("BlockStatement"), null));

def("Path")
    .bases("Node")
    .build("body")
    // TODO This really ought be a recursive type.
    .field("body", [def("Identifier")]);

def("MethodDefinition")
    .bases("Declaration")
    .build("kind", "key", "value")
    .field("kind", or("init", "get", "set"))
    .field("key", or(def("Literal"), def("Identifier")))
    .field("value", def("Function"));

def("SpreadElement")
    .bases("Pattern")
    .build("argument")
    .field("argument", def("Pattern"));

types.finalize();
