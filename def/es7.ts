import { Fork } from "../types";
import es6Def from "./es6";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";

export default function (fork: Fork) {
  fork.use(es6Def);

  var types = fork.use(typesPlugin);
  var def = types.Type.def;
  var or = types.Type.or;
  var defaults = fork.use(sharedPlugin).defaults;

  def("Function")
    .field("async", Boolean, defaults["false"]);

  def("SpreadProperty")
    .bases("Node")
    .build("argument")
    .field("argument", def("Expression"));

  def("ObjectExpression")
    .field("properties", [or(
      def("Property"),
      def("SpreadProperty"),
      def("SpreadElement")
    )]);

  def("SpreadPropertyPattern")
    .bases("Pattern")
    .build("argument")
    .field("argument", def("Pattern"));

  def("ObjectPattern")
    .field("properties", [or(
      def("Property"),
      def("PropertyPattern"),
      def("SpreadPropertyPattern")
    )]);

  def("AwaitExpression")
    .bases("Expression")
    .build("argument", "all")
    .field("argument", or(def("Expression"), null))
    .field("all", Boolean, defaults["false"]);
};
