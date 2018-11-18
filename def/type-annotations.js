/**
 * Type annotation defs shared between Flow and TypeScript.
 * These defs could not be defined in ./flow.js or ./typescript.js directly
 * because they use the same name.
 */
module.exports = function (fork) {
  var types = fork.use(require("../lib/types"));
  var def = types.Type.def;
  var or = types.Type.or;
  var defaults = fork.use(require("../lib/shared")).defaults;

  def("Identifier")
    .field("typeAnnotation",
           or(def("TypeAnnotation"), def("TSTypeAnnotation"), null),
           defaults["null"]);

  def("ObjectPattern")
    .field("typeAnnotation",
           or(def("TypeAnnotation"), def("TSTypeAnnotation"), null),
           defaults["null"]);

  def("Function")
    .field("returnType",
           or(def("TypeAnnotation"), def("TSTypeAnnotation"), null),
           defaults["null"])
    .field("typeParameters",
           or(def("TypeParameterDeclaration"), def("TSTypeParameterDeclaration"), null),
           defaults["null"]);

  def("ClassProperty")
    .build("key", "value", "typeAnnotation", "static")
    .field("value", or(def("Expression"), null))
    .field("static", Boolean, defaults["false"])
    .field("typeAnnotation",
           or(def("TypeAnnotation"), def("TSTypeAnnotation"), null),
           defaults["null"]);

  ["ClassDeclaration",
    "ClassExpression",
  ].forEach(typeName => {
    def(typeName)
      .field("typeParameters",
             or(def("TypeParameterDeclaration"), def("TSTypeParameterDeclaration"), null),
             defaults["null"])
      .field("superTypeParameters",
             or(def("TypeParameterInstantiation"), def("TSTypeParameterInstantiation"), null),
             defaults["null"]);
  });

  ["ClassDeclaration",
   "ClassExpression",
  ].forEach(typeName => {
    def(typeName)
      .field("implements",
             or([def("ClassImplements")], [def("TSExpressionWithTypeArguments")]),
             defaults.emptyArray);
  });
};
