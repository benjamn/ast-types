import { Fork } from "../types";
import es2021Def from "./es2021";
import typesPlugin from "../lib/types";

export default function (fork: Fork) {
  fork.use(es2021Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;

  def("StaticBlock")
    .bases("Node")
    .build("body")
    .field("body", [def("Statement")]);
}
