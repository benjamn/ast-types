import { Fork } from "../types";
import es7Def from "./es7";
import typesPlugin from "../lib/types";

export default function (fork: Fork) {
  fork.use(es7Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;

  def("ImportExpression")
    .bases("Expression")
    .build("source")
    .field("source", def("Expression"));
};
