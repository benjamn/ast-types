import { Fork } from "../types";
import { LogicalOperators } from "./core-operators";
import es2019Def from "./es2019";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";

export default function (fork: Fork) {
  fork.use(es2019Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;

  const shared = fork.use(sharedPlugin);
  const defaults = shared.defaults;

  def("ImportExpression")
    .bases("Expression")
    .build("source")
    .field("source", def("Expression"));

  def("ExportAllDeclaration")
    .build("source", "exported")
    .field("source", def("Literal"))
    .field("exported", or(def("Identifier"), null));

  // Optional chaining
  def("ChainElement")
    .bases("Node")
    .field("optional", Boolean, defaults["false"]);

  def("CallExpression")
    .bases("Expression", "ChainElement");

  def("MemberExpression")
    .bases("Expression", "ChainElement");

  def("ChainExpression")
    .bases("Expression")
    .build("expression")
    .field("expression", def("ChainElement"));

  def("OptionalCallExpression")
    .bases("CallExpression")
    .build("callee", "arguments", "optional")
    .field("optional", Boolean, defaults["true"]);

  // Deprecated optional chaining type, doesn't work with babelParser@7.11.0 or newer
  def("OptionalMemberExpression")
    .bases("MemberExpression")
    .build("object", "property", "computed", "optional")
    .field("optional", Boolean, defaults["true"]);

  // Nullish coalescing
  const LogicalOperator = or(...LogicalOperators, "??");

  def("LogicalExpression")
    .field("operator", LogicalOperator)
};
