module.exports = function (fork) {
  fork.use(require("./es7"));

  var types = fork.use(require("../lib/types"));
  var def = types.Type.def;
  var or = types.Type.or;

  def("TSType")
    .bases("Node");

  def("TSTypeReference")
    .bases("TSType")
    .field("typeName", def("Identifier"))
    .field("typeParameters", [def("TSType")]);

  def("TSAsExpression")
    .bases("Expression")
    .build()
    .field("expression", def("Identifier"))
    .field("typeAnnotation", def("TSTypeReference"))
    .field("extra", or({parenthesized: Boolean}, null));

  def("TSNumberKeyword")
    .bases("TSType")
    .build();

  def("TSBooleanKeyword")
    .bases("TSType")
    .build();

  def("TSStringKeyword")
    .bases("TSType")
    .build();

  def("TSAnyKeyword")
    .bases("TSType")
    .build();

  def("TSVoidKeyword")
    .bases("TSType")
    .build();

  def("TSUndefinedKeyword")
    .bases("TSType")
    .build();

  def("TSNeverKeyword")
    .bases("TSType")
    .build();

  def("TSArrayType")
    .bases("TSType")
    .build()
    .field("elementType", "TSType")

  def("TSLiteralType")
    .bases("TSType")
    .build()
    .field("literal", def("StringLiteral"))

  def("TSUnionType")
    .bases("TSType")
    .build()
    .field("types", [def("TSType")])

  def("TSFunctionType")
    .bases("TSType")
    .build()
    .field("typeParameters", def("TSTypeParameterDeclaration"))
    .field("parameters", [def("Identifier")])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSTupleType")
    .bases("TSType")
    .build()
    .field("elementTypes", [def("TSType")]);

  def("TSTypeAnnotation")
    .bases("Node")
    .build()
    .field("typeAnnotation", def("TSType"));

  def("TSPropertySignature")
    .bases("Node")
    .build("key")
    .field("key", def("Identifier"))
    .field("computed", or(Boolean), false)
    .field("typeAnnotation", def("TSTypeAnnotation"))

  def("TSEnumMember")
    .bases("Node")
    .build("id")
    .field("id", def("Identifier"))
    .field("initializer", def("Literal"));

  def("TSTypeLiteral")
    .bases("TSTypeAnnotation")
    .field("members", [def("TSPropertySignature")]);

  def("TSTypeParameter")
    .bases("Identifier");

  def("TSTypeAssertion")
    .bases("Node")
    .build()
    .field("typeAnnotation", def("TSType"))
    .field("expression", def("Identifier"))
    .field("extra", or({parenthesized: Boolean}, null));

  def("TSTypeParameterDeclaration")
    .bases("Declaration")
    .build("params")
    .field("params", [def("TSTypeParameter")]);

  def("TSTypeParameterInstantiation")
    .bases("Node")
    .build("params")
    .field("params", [def("TSType")]);

  def("TSEnumDeclaration")
    .bases("Declaration")
    .build("id")
    .field("id", def("Identifier"))
    .field("members", [def("TSEnumMember")]);

  def("TSTypeAliasDeclaration")
    .bases("Declaration")
    .build("id")
    .field("id", def("Identifier"))
    .field("typeAnnotation", def("TSType"));
};
