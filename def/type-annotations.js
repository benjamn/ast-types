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
      or(def("TypeAnnotation"), def("TSTypeAnnotation"), null), defaults["null"]);

  def("ObjectPattern")
    .field("typeAnnotation",
      or(def("TypeAnnotation"), def("TSTypeAnnotation"), null), defaults["null"]);
};
