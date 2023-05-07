import fork from "./fork";
import esProposalsDef from "./def/es-proposals";
import jsxDef from "./def/jsx";
import flowDef from "./def/flow";
import esprimaDef from "./def/esprima";
import babelDef from "./def/babel";
import typescriptDef from "./def/typescript";
import { ASTNode, Type, AnyType, Field } from "./types";
import { NodePath } from "./node-path";
import { namedTypes } from "./gen/namedTypes";
import { builders } from "./gen/builders";
import { Visitor } from "./gen/visitor";

let {
  astNodesAreEquivalent,
  builders,
  builtInTypes,
  defineMethod,
  eachField,
  finalize,
  getBuilderName,
  getFieldNames,
  getFieldValue,
  getSupertypeNames,
  namedTypes: n,
  NodePath,
  Path,
  PathVisitor,
  someField,
  Type,
  use,
  visit,
} = fork([
  // Feel free to add to or remove from this list of extension modules to
  // configure the precise type hierarchy that you need.
  esProposalsDef,
  jsxDef,
  flowDef,
  esprimaDef,
  babelDef,
  typescriptDef,
]);

// Populate the exported fields of the namedTypes namespace, while still
// retaining its member types.
Object.assign(namedTypes, n);

export function overrideDefs(defs: ReturnType<typeof fork>) {
  astNodesAreEquivalent = defs.astNodesAreEquivalent;
  builders = defs.builders;
  builtInTypes = defs.builtInTypes;
  defineMethod = defs.defineMethod;
  eachField = defs.eachField;
  finalize = defs.finalize;
  getBuilderName = defs.getBuilderName;
  getFieldNames = defs.getFieldNames;
  getFieldValue = defs.getFieldValue;
  getSupertypeNames = defs.getSupertypeNames;
  Object.assign(namedTypes, defs.namedTypes);
  NodePath = defs.NodePath;
  Path = defs.Path;
  PathVisitor = defs.PathVisitor;
  someField = defs.someField;
  Type = defs.Type;
  use = defs.use;
  visit = defs.visit;
}

export {
  AnyType,
  ASTNode,
  astNodesAreEquivalent,
  builders,
  builtInTypes,
  defineMethod,
  eachField,
  Field,
  finalize,
  getBuilderName,
  getFieldNames,
  getFieldValue,
  getSupertypeNames,
  namedTypes,
  NodePath,
  Path,
  PathVisitor,
  someField,
  Type,
  use,
  visit,
  Visitor,
};
