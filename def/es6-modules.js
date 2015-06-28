var types = require("../lib/types");
var def = types.Type.def;
var or = types.Type.or;
var defaults = require("../lib/shared").defaults;

// Based on https://github.com/estree/estree


def("ModuleSpecifier2")
    .bases("Node")
    .field("local", def("Identifier"));

def("ImportSpecifier")
    .bases("ModuleSpecifier2")
    .build("imported")
    .field("imported", def("Identifier"));

def("ImportDefaultSpecifier")
    .bases("ModuleSpecifier2");

def("ImportNamespaceSpecifier")
    .bases("ModuleSpecifier2");

def("ImportDeclaration")
    .bases("Node")
    .build("specifiers", "source")
    .field("specifiers", [or(
        def("ImportSpecifier"),
        def("ImportDefaultSpecifier"),
        def("ImportNamespaceSpecifier")
    )], defaults.emptyArray)
    .field("source", def("Literal"));

def("ExportNamedDeclaration")
    .bases("Statement")
    .build("declaration", "specifiers", "source")
    .field("declaration", or(
        def("Declaration"),
        null
    ))
    .field("specifiers", [or(
        def("ExportSpecifier")
    )], defaults.emptyArray)
    .field("source", or(
        def("Literal"),
        null
    ), defaults["null"]);

def("ExportSpecifier")
    .bases("ModuleSpecifier2")
    .build("exported")
    .field("exported", def("Identifier"));

def("ExportDefaultDeclaration")
    .bases("Statement")
    .build("declaration")
    .field("declaration", or(
        def("Declaration"),
        def("Expression")
    ));

def("ExportAllDeclaration")
    .bases("Statement")
    .build("source")
    .field("source", def("Literal"));










