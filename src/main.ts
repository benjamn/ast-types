import fork from "./fork";
import esProposalsDef from "./def/es-proposals";
import jsxDef from "./def/jsx";
import flowDef from "./def/flow";
import esprimaDef from "./def/esprima";
import babelDef from "./def/babel";
import typescriptDef from "./def/typescript";
import { ASTNode, Type as TypeClass, AnyType, Field } from "./types";
import { NodePath as NodePathClass } from "./node-path";
import { namedTypes } from "./gen/namedTypes";
import { builders as Builders } from "./gen/builders";
import { Visitor } from "./gen/visitor";

const {
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

// Type, NodePath, and builders are both values (produced by the fork above)
// and types (declared in their own modules). Importing the type meanings
// under different names and re-declaring them here, next to the consts,
// lets the single `export { ... }` below carry both meanings, without an
// import that conflicts with a local value (which TypeScript >= 5.4 rejects
// under isolatedModules; see #948).
type Type<T> = TypeClass<T>;
type NodePath<N = any, V = any> = NodePathClass<N, V>;
type builders = Builders;

// Populate the exported fields of the namedTypes namespace, while still
// retaining its member types.
Object.assign(namedTypes, n);

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
