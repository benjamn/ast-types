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
    .field("typeParameters",
           or(def("TSTypeParameterInstantiation"), null),
           defaults["null"]);

  def("TSQualifiedName")
    .bases("Node")
    .build("left", "right")
    .field("left", or("Identifier", "TSQualifiedName"))
    .field("right", or("Identifier", "TSQualifiedName"));

  def("TSAsExpression")
    .bases("Expression")
    .build("expression")
    .field("expression", def("Expression"))
    .field("typeAnnotation", def("TSType"))
    .field("extra",
           or({ parenthesized: Boolean }, null),
           defaults["null"]);

  def("TSNonNullExpression")
    .bases("Expression")
    .build("expression")
    .field("expression", def("Expression"));

  [ // Define all the simple keyword types.
    "TSAnyKeyword",
    "TSBooleanKeyword",
    "TSNeverKeyword",
    "TSNullKeyword",
    "TSNumberKeyword",
    "TSObjectKeyword",
    "TSStringKeyword",
    "TSSymbolKeyword",
    "TSUndefinedKeyword",
    "TSVoidKeyword",
  ].forEach(keywordType => {
    def(keywordType)
      .bases("TSType")
      .build();
  });

  def("TSArrayType")
    .bases("TSType")
    .build("elementType")
    .field("elementType", "TSType")

  def("TSLiteralType")
    .bases("TSType")
    .build("literal")
    .field("literal",
           or(def("NumericLiteral"),
              def("StringLiteral"),
              def("BooleanLiteral")));

  ["TSUnionType",
   "TSIntersectionType",
  ].forEach(typeName => {
    def(typeName)
      .bases("TSType")
      .build("types")
      .field("types", [def("TSType")]);
  });

  ["TSFunctionType",
   "TSConstructorType",
  ].forEach(typeName => {
    def(typeName)
      .bases("TSType")
      .build("parameters")
      .field("typeParameters", def("TSTypeParameterDeclaration"))
      .field("parameters", [or(def("Identifier"), def("RestElement"))])
      .field("typeAnnotation", def("TSTypeAnnotation"));
  });

  def("TSMappedType")
    .bases("TSType")
    .build("typeParameter", "typeAnnotation")
    .field("readonly", Boolean, defaults["false"])
    .field("typeParameter", def("TSTypeParameter"))
    .field("optional", Boolean, defaults["false"])
    .field("typeAnnotation",
           or(def("TSType"), null),
           defaults["null"]);

  def("TSTupleType")
    .bases("TSType")
    .build("elementTypes")
    .field("elementTypes", [def("TSType")]);

  def("TSIndexedAccessType")
    .bases("TSType")
    .build("objectType", "indexType")
    .field("objectType", def("TSType"))
    .field("indexType", def("TSType"))

  def("TSTypeOperator")
    .bases("TSType")
    .build("operator")
    .field("operator", or(def("Literal"), def("StringLiteral")))
    .field("typeAnnotation", def("TSType"));

  def("TSTypeAnnotation")
    .bases("Node")
    .build("typeAnnotation")
    .field("typeAnnotation", def("TSType"));

  def("TSIndexSignature")
    .bases("Node")
    .build("parameters")
    .field("parameters", [def("Identifier")]) // Length === 1
    .field("readonly", Boolean, defaults["false"])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSPropertySignature")
    .bases("Node")
    .build("key")
    .field("key", def("Expression"))
    .field("computed", Boolean, defaults["false"])
    .field("readonly", Boolean, defaults["false"])
    .field("optional", Boolean, defaults["false"])
    .field("initializer",
           or(def("Expression"), null),
           defaults["null"])
    .field("typeAnnotation", def("TSTypeAnnotation"))

  def("TSMethodSignature")
    .bases("Node")
    .build("key")
    .field("key", def("Identifier"))
    .field("computed", Boolean, defaults["false"])
    .field("optional", Boolean, defaults["false"])
    .field("typeParameters", def("TSTypeParameterDeclaration"))
    .field("parameters", [or(def("Identifier"), def("RestElement"))])
    .field("typeAnnotation", def("TSTypeAnnotation"));

  def("TSTypePredicate")
    .bases("TSTypeAnnotation")
    .build("parameterName", "typeAnnotation")
    .field("parameterName",
           or(def("Identifier"),
              def("TSThisType")))
    .field("typeAnnotation", def("TSTypeAnnotation"));

  ["TSCallSignatureDeclaration",
   "TSConstructSignatureDeclaration",
  ].forEach(typeName => {
    def(typeName)
      .bases("Declaration")
      .build("parameters")
      .field("typeParameters", def("TSTypeParameterDeclaration"))
      .field("parameters", [or(def("Identifier"), def("RestElement"))])
      .field("typeAnnotation", def("TSTypeAnnotation"));
  });

  def("TSEnumMember")
    .bases("Node")
    .build("id", "initializer")
    .field("id", or(def("Identifier"), def("StringLiteral")))
    .field("initializer",
           or(def("Expression"), null),
           defaults["null"]);

  // Inferred from Babylon's tsParseTypeMember method.
  var TSTypeMember = or(
    def("TSCallSignatureDeclaration"),
    def("TSConstructSignatureDeclaration"),
    def("TSIndexSignature"),
    def("TSMethodSignature"),
    def("TSPropertySignature")
  );

  def("TSTypeLiteral")
    .bases("TSType")
    .build("members")
    .field("members", [TSTypeMember]);

  def("TSTypeParameter")
    .bases("Identifier")
    .field("name", or(def("Literal"), def("StringLiteral")))
    .field("constraint", or(def("TSType"), null), defaults["null"])
    .field("default", or(def("TSType"), null), defaults["null"]);

  def("TSTypeAssertion")
    .bases("Expression")
    .build("typeAnnotation", "expression")
    .field("typeAnnotation", def("TSType"))
    .field("expression", def("Expression"))
    .field("extra",
           or({ parenthesized: Boolean }, null),
           defaults["null"]);

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
    .build("id", "members")
    .field("id", def("Identifier"))
    .field("const", Boolean, defaults["false"])
    .field("declare", Boolean, defaults["false"])
    .field("members", [def("TSEnumMember")])
    .field("initializer",
           or(def("Expression"), null),
           defaults["null"]);

  def("TSTypeAliasDeclaration")
    .bases("Declaration")
    .build("id")
    .field("id", def("Identifier"))
    .field("declare", Boolean, defaults["false"])
    .field("typeParameters",
           or(def("TSTypeParameterDeclaration"), null),
           defaults["null"])
    .field("typeAnnotation", def("TSType"));

  def("TSModuleBlock")
    .bases("Node")
    .build("body")
    .field("body", [def("Statement")]);

  def("TSModuleDeclaration")
    .bases("Declaration")
    .build("id", "body")
    .field("id", def("Identifier"))
    .field("declare", Boolean, defaults["false"])
    .field("global", Boolean, defaults["false"])
    .field("body", or(def("TSModuleBlock"),
                      def("TSModuleDeclaration")));

  def("TSInterfaceBody")
    .bases("Node")
    .build("body")
    .field("body", [TSTypeMember]);

  def("TSExpressionWithTypeArguments")
    .bases("TSType")
    .build("expression", "typeParameters")
    .field("expression", def("Identifier"))
    .field("typeParameters",
           or(def("TSTypeParameterInstantiation"), null),
           defaults["null"]);

  def("TSInterfaceDeclaration")
    .bases("Declaration")
    .build("id")
    .field("typeParameters", def("TSTypeParameterDeclaration"))
    .field("extends", [def("TSExpressionWithTypeArguments")])
    .field("body", def("TSInterfaceBody"));
};
