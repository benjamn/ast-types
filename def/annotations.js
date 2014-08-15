require("./core");
var types = require("../lib/types");
var def = types.Type.def;
var or = types.Type.or;
var builtin = types.builtInTypes;
var isBoolean = builtin.boolean;
var defaults = require("../lib/shared").defaults;

def("Type")
  .bases("Node");

def("AnyTypeAnnotation")
  .bases("Type");

def("VoidTypeAnnotation")
  .bases("Type");

def("NumberTypeAnnotation")
  .bases("Type");

def("StringTypeAnnotation")
  .bases("Type");

def("BooleanTypeAnnotation")
  .bases("Type");

def("NullableTypeAnnotation")
  .bases("Type")
  .build("typeAnnotation")
  .field("typeAnnotation", def("Type"));

def("FunctionTypeAnnotation")
  .bases("Type")
  .build("params", "returnType", "rest", "typeParameters")
  .field("params", [def("FunctionTypeParam")])
  .field("returnType", def("Type"))
  .field("rest", or(def("FunctionTypeParam"), null))
  .field("typeParameters", [def("Type")]);

def("FunctionTypeParam")
  .bases("Node")
  .build("name", "typeAnnotation", "optional")
  .field("name", def("Identifier"))
  .field("typeAnnotation", def("Type"))
  .field("optional", isBoolean);

def("ObjectTypeAnnotation")
  .bases("Type")
  .build("properties")
  .field("properties", [def("ObjectTypeProperty")]);

def("ObjectTypeProperty")
  .bases("Node")
  .build("key", "value", "optional")
  .field("key", or(def("Literal"), def("Identifier")))
  .field("value", def("Type"))
  .field("optional", isBoolean);

def("GenericTypeAnnotation")
  .bases("Type")
  .build("id", "typeParameters")
  .field("id", def("Identifier"))
  .field("typeParameters", [def("Type")]);

def("Identifier")
  .build("name", "typeAnnotation")
  .field("typeAnnotation", or(def("Type"), null), defaults["null"]);

def("Function")
  .field("returnType", or(def("Type"), null), defaults["null"])
  .field("typeParameters", [def("Type")], defaults.emptyArray);

def("FunctionDeclaration")
    .build("id", "params", "body", "generator", "expression", "returnType", "typeParameters");

def("FunctionExpression")
    .build("id", "params", "body", "generator", "expression", "returnType", "typeParameters");

def("ClassProperty")
  .build("key", "typeAnnotation")
  .field("typeAnnotation", def("Type"));

def("InterfaceDeclaration")
  .bases("Statement")
  .build("id", "body", "extends")
  .field("id", def("GenericTypeAnnotation"))
  .field("body", def("ObjectTypeAnnotation"))
  .field("extends", [def("GenericTypeAnnotation")]);
