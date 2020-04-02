import { Fork } from "../types";
import { BinaryOperators, AssignmentOperators } from "./core-operators";
import es6Def from "./es6";
import typesPlugin from "../lib/types";

export default function (fork: Fork) {
  fork.use(es6Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;

  const BinaryOperator = or(
    ...BinaryOperators,
    "**",
  );

  def("BinaryExpression")
    .field("operator", BinaryOperator)

  const AssignmentOperator = or(
    ...AssignmentOperators,
    "**=",
  );

  def("AssignmentExpression")
    .field("operator", AssignmentOperator)
};
