import { Fork } from "../types";
import typesPlugin from "../lib/types";
import babelCoreDef from "./babel-core";
import flowDef from "./flow";

export default function (fork: Fork) {
  const types = fork.use(typesPlugin);
  const def = types.Type.def;

  fork.use(babelCoreDef);
  fork.use(flowDef);

  // https://github.com/babel/babel/pull/10148
  def("V8IntrinsicIdentifier")
    .bases("Expression")
    .build("name")
    .field("name", String);
}
