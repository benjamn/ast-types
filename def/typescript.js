module.exports = function (fork) {
  fork.use(require("./es7"));

  var types = fork.use(require("../lib/types"));
  var def = types.Type.def;
  var or = types.Type.or;
  var defaults = fork.use(require("../lib/shared")).defaults;

  def("TSType")
    .bases("Node");

  def("TSTypeReference")
    .bases("TSType")
    .field("typeName", def("Identifier"))
    .field("typeParameters", [def("TSType")]);

  def("TSQualifiedName")
    .bases("Node")
    .build("left", "right")
    .field("left", or("Identifier", "TSQualifiedName"))
    .field("right", or("Identifier", "TSQualifiedName"));

  def("TSAsExpression")
    .bases("Expression")
    .build()
    .field("expression", def("Identifier"))
    .field("typeAnnotation", def("TSTypeReference"))
    .field("extra", or({parenthesized: Boolean}, null));

  def("TSNonNullExpression")
    .bases("Expression")
    .build("expression")
    .field("expression", def("Identifier"));

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

  def("TSNullKeyword")
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

  def("TSIntersectionType")
    .bases("TSType")
    .build("types")
    .field("types", [def("TSType")]);

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

  def("TSIndexedAccessType")
    .bases("TSType")
    .build("objectType", "indexType")
    .field("objectType", def("TSTypeReference"))
    .field("indexType", def("TSTypeReference"))

  def("TSTypeOperator")
    .bases("Node")
    .field("operator", def("Literal"))
    .field("typeAnnotation", def("TSTypeReference"));

  def("TSTypeAnnotation")
    .bases("Node")
    .build()
    .field("typeAnnotation", def("TSType"));

  def("TSIndexSignature")
    .bases("Node")
    .build()
    .field("readonly", Boolean, defaults["false"])
    .field("parameters", [def("Identifier")])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSPropertySignature")
    .bases("Node")
    .build("key")
    .field("key", def("Identifier"))
    .field("computed", Boolean, defaults["false"])
    .field("readonly", Boolean, defaults["false"])
    .field("typeAnnotation", def("TSTypeAnnotation"))

  def("TSMethodSignature")
    .bases("Node")
    .build("key")
    .field("key", def("Identifier"))
    .field("computed", Boolean, defaults["false"])
    .field("typeParameters", def("TSTypeParameterDeclaration"))
    .field("parameters", [def("Identifier")])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSTypePredicate")
    .bases("TSTypeAnnotation")
    .build("parameterName", "typeAnnotation")
    .field("parameterName", def("Identifier"))
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSCallSignatureDeclaration")
    .bases("Declaration")
    .build()
    .field("typeParameters", def("TSTypeParameterDeclaration"))
    .field("parameters", [def("Identifier")])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSConstructSignatureDeclaration")
    .bases("Declaration")
    .build()
    .field("typeParameters", [def("TSTypeParameterDeclaration")])
    .field("parameters", [def("Identifier")])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSEnumMember")
    .bases("Node")
    .build("id")
    .field("id", def("Identifier"))
    .field("initializer", def("Literal"));

  def("TSTypeLiteral")
    .bases("TSTypeAnnotation")
    .field("members", [def("TSPropertySignature")]);

  def("TSTypeParameter")
    .bases("Identifier")
    .field("name", def("Literal"))
    .field("constraint", def("TSTypeReference"));

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
    .field("const", Boolean, false)
    .field("declare", Boolean, false)
    .field("members", [def("TSEnumMember")]);

  def("TSTypeAliasDeclaration")
    .bases("Declaration")
    .build("id")
    .field("id", def("Identifier"))
    .field("typeAnnotation", def("TSType"));

  def("TSInterfaceBody")
    .bases("Node")
    .build()
    .field("body", [def("TSPropertySignature")]);

  def("TSExpressionWithTypeArguments")
    .bases("Node")
    .build()
    .field("expression", def("Identifier"))
    .field("typeParameters", [def("TSTypeParameter")]);

  def("TSInterfaceDeclaration")
    .bases("Declaration")
    .build("id")
    .field("typeParameters", def("TSTypeParameterDeclaration"))
    .field("extends", [def("TSExpressionWithTypeArguments")])
    .field("body", def("TSInterfaceBody"));
};
