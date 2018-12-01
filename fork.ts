import typesPlugin from "./lib/types";
import pathVisitorPlugin from "./lib/path-visitor";
import equivPlugin from "./lib/equiv";
import pathPlugin from "./lib/path";
import nodePathPlugin from "./lib/node-path";
import { Def, Fork, Plugin } from "./types";

export default function (defs: Def[]) {
  var fork = createFork();

  var types = fork.use(typesPlugin);

  defs.forEach(fork.use);

  types.finalize();

  var PathVisitor = fork.use(pathVisitorPlugin);

  var exports = {
    Type: types.Type,
    builtInTypes: types.builtInTypes,
    namedTypes: types.namedTypes,
    builders: types.builders,
    defineMethod: types.defineMethod,
    getFieldNames: types.getFieldNames,
    getFieldValue: types.getFieldValue,
    eachField: types.eachField,
    someField: types.someField,
    getSupertypeNames: types.getSupertypeNames,
    astNodesAreEquivalent: fork.use(equivPlugin),
    finalize: types.finalize,
    Path: fork.use(pathPlugin),
    NodePath: fork.use(nodePathPlugin),
    PathVisitor,
    use: fork.use,
    visit: PathVisitor.visit
  };

  return exports;
};

export function createFork(): Fork {
  var used: Plugin<unknown>[] = [];
  var usedResult: unknown[] = [];

  function use<T>(plugin: Plugin<T>): T {
    var idx = used.indexOf(plugin);
    if (idx === -1) {
      idx = used.length;
      used.push(plugin);
      usedResult[idx] = plugin(fork);
    }
    return usedResult[idx] as T;
  }

  var fork: Fork = { use };

  return fork;
}
