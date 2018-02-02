module.exports = function (fork) {
  fork.use(require("./es7"));

  var types = fork.use(require("../lib/types"));
  var def = types.Type.def;
  var or = types.Type.or;

  def("TSType")
    .bases("Node");

  def("TSNumberKeyword")
    .bases("TSType")
    .build();

  def("TSTypeReference")
    .bases("TSType")
    .field("typeName", def("Identifier"));

  def("TSTypeAnnotation")
    .bases("Node")
    .field("typeAnnotation", def("TSType"))
    .build();

  def("TSPropertySignature")
    .bases("Node")
    .build("key")
    .field("key", def("Identifier"))
    .field("computed", or(Boolean), false)
    .field("typeAnnotation", def("TSTypeAnnotation"))

  def("TSTypeLiteral")
    .bases('TSTypeAnnotation')
    .field('members', [def("TSPropertySignature")]);

  def("TSTypeParameter")
    .bases("Identifier");

  def("TSTypeParameterDeclaration")
    .bases("Declaration")
    .build("params")
    .field("params", [def("TSTypeParameter")]);

  def("TSTypeAliasDeclaration")
    .bases("Declaration")
    .build("id")
    .field("id", def("Identifier"))
    .field("typeAnnotation", def("TSType"));
};
