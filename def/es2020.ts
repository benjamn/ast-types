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
  def("OptionalMemberExpression")
    .bases("MemberExpression")
    .build("object", "property", "computed", "optional")
    .field("optional", Boolean, defaults["true"])

  def("OptionalCallExpression")
    .bases("CallExpression")
    .build("callee", "arguments", "optional")
    .field("optional", Boolean, defaults["true"])

  // Nullish coalescing
  const LogicalOperator = or(...LogicalOperators, "??");

  def("LogicalExpression")
    .field("operator", LogicalOperator)
};
