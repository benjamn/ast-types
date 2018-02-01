module.exports = function (fork) {
  fork.use(require("./es7"));

  var types = fork.use(require("../lib/types"));
  var def = types.Type.def;

  def("TSNumberKeyword")
    .bases("Node")
    .build();

  def("TSTypeParameter")
    .bases("Node")
    .build("name")
    .field("name", def("Identifier"))

  def("TSTypeAliasDeclaration")
    .bases("Declaration")
    .build("id")
    .field("id", def("Identifier"))
    .field("typeAnnotation", def("Identifier"));

  def("TSTypeParameterDeclaration")
    .bases("Declaration")
    .field("params", def("Identifier"));
};
