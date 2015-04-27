var types = require("../lib/types");
var def = types.Type.def;
var or = types.Type.or;
var defaults = require("../lib/shared").defaults;

// Specifier and NamedSpecifier2 are abstract non-standard types that I
// introduced for definitional convenience.
def("NamedSpecifier2")
    .bases("Specifier")
    // Note: this abstract type is intentionally not buildable.
    .field("local", def("Identifier"))
    .field("name", or(def("Identifier"), null), defaults["null"]);

// Like NamedSpecifier2, except type:"ExportSpecifier" and buildable.
// export {<id [as name]>} [from ...];
def("ExportSpecifier")
    .bases("NamedSpecifier2")
    .build("local", "name");

// export <*> from ...;
def("ExportAllDeclaration")
    .bases("Statement")
    .field("source", def("ModuleSpecifier"));

// Like NamedSpecifier2, except type:"ImportSpecifier2" and buildable.
// import {<id [as name]>} from ...;
def("ImportSpecifier2")
    .bases("NamedSpecifier2")
    .build("local", "name");

// import <* as id> from ...;
def("ImportNamespaceSpecifier2")
    .bases("Specifier")
    .build("local")
    .field("local", def("Identifier"));

// import <id> from ...;
def("ImportDefaultSpecifier2")
    .bases("Specifier")
    .build("local")
    .field("local", def("Identifier"));

def("ExportDefaultDeclaration")
    .bases("Declaration")
    .build("declaration", "specifiers", "source")
    .field("declaration", or(
        def("Declaration"),
        def("Expression"), // Implies default.
        null
    ))
    .field("specifiers", [or(
        def("ExportSpecifier"),
        def("ExportBatchSpecifier")
    )], defaults.emptyArray)
    .field("source", or(
        def("Literal"),
        def("ModuleSpecifier"),
        null
    ), defaults["null"]);

def("ExportNamedDeclaration")
    .bases("Declaration")
    .build("declaration", "specifiers", "source")
    .field("declaration", or(
        def("Declaration"),
        def("Expression"), // Implies default.
        null
    ))
    .field("specifiers", [or(
        def("ExportSpecifier"),
        def("ExportBatchSpecifier")
    )], defaults.emptyArray)
    .field("source", or(
        def("Literal"),
        def("ModuleSpecifier"),
        null
    ), defaults["null"]);

def("ImportDeclaration")
    .bases("Declaration")
    .build("specifiers", "source")
    .field("specifiers", [or(
        def("ImportSpecifier2"),
        def("ImportNamespaceSpecifier2"),
        def("ImportDefaultSpecifier2")
    )], defaults.emptyArray)
    .field("source", or(
        def("Literal"),
        def("ModuleSpecifier")
    ));