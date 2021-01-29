import { Fork } from "../types";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";
import es2020Def from "./es2020";

export default function (fork: Fork) {
  fork.use(es2020Def);

  const types = fork.use(typesPlugin);
  const Type = types.Type;
  const def = types.Type.def;
  const or = Type.or;

  const shared = fork.use(sharedPlugin);
  const defaults = shared.defaults;

  def("AwaitExpression")
    .build("argument", "all")
    .field("argument", or(def("Expression"), null))
    .field("all", Boolean, defaults["false"]);

  // Decorators
  def("Decorator")
    .bases("Node")
    .build("expression")
    .field("expression", def("Expression"));

  def("Property")
    .field("decorators",
           or([def("Decorator")], null),
           defaults["null"]);

  def("MethodDefinition")
    .field("decorators",
           or([def("Decorator")], null),
           defaults["null"]);

  def("PrivateIdentifier")
    .bases("Node")
    .build("name")
    .field("name", String);

  def("MethodDefinition")
    .field("key", or(def("Expression"), def("PrivateIdentifier"))) // overrides es6.ts

  def("PropertyDefinition")
    .bases("Declaration")
    .build("key", "value", "computed", "static")
    .field("key", or(def("Expression"), def("PrivateIdentifier")))
    .field("value", or(def("Expression"), null))
    .field("computed", Boolean, defaults["false"])
    .field("static", Boolean, defaults["false"]);

  const ClassBodyElement = or(
    // es6 spec
    def("VariableDeclarator"),
    def("ClassPropertyDefinition"),
    def("ClassProperty"),
    // ESTree spec
    def("MethodDefinition"),
    def("PropertyDefinition"),
  );

  def("ClassBody")
    .field("body", [ClassBodyElement]); // overrides es6.ts
};
