import typesPlugin from "./lib/types";
import pathVisitorPlugin from "./lib/path-visitor";
import equivPlugin from "./lib/equiv";
import pathPlugin from "./lib/path";
import nodePathPlugin from "./lib/node-path";
import { Def, Fork, Plugin } from "./types";

export = function (defs: Def[]) {
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

  var types = use(typesPlugin);

  defs.forEach(use);

  types.finalize();

  var PathVisitor = use(pathVisitorPlugin);

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
    astNodesAreEquivalent: use(equivPlugin),
    finalize: types.finalize,
    Path: use(pathPlugin),
    NodePath: use(nodePathPlugin),
    PathVisitor,
    use: use,
    visit: PathVisitor.visit
  };

  return exports;
};
