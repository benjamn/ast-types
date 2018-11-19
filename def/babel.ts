import { Fork } from "../types";
import babelCoreDef from "./babel-core";
import flowDef from "./flow";

export = function (fork: Fork) {
  fork.use(babelCoreDef);
  fork.use(flowDef);
};
