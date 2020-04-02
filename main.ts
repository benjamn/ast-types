import fork from "./fork";
import coreDef from "./def/core";
import es6Def from "./def/es6";
import es2016Def from "./def/es2016";
import es2017Def from "./def/es2017";
import es2018Def from "./def/es2018";
import es2019Def from "./def/es2019";
import es2020Def from "./def/es2020";
import jsxDef from "./def/jsx";
import flowDef from "./def/flow";
import esprimaDef from "./def/esprima";
import babelDef from "./def/babel";
import typescriptDef from "./def/typescript";
import esProposalsDef from "./def/es-proposals";
import { ASTNode, Type, AnyType, Field } from "./lib/types";
import { NodePath } from "./lib/node-path";
import { namedTypes } from "./gen/namedTypes";
import { builders } from "./gen/builders";
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
  // This core module of AST types captures ES5 as it is parsed today by
  // git://github.com/ariya/esprima.git#master.
  coreDef,

  // Feel free to add to or remove from this list of extension modules to
  // configure the precise type hierarchy that you need.
  es6Def,
  es2016Def,
  es2017Def,
  es2018Def,
  es2019Def,
  es2020Def,
  jsxDef,
  flowDef,
  esprimaDef,
  babelDef,
  typescriptDef,
  esProposalsDef,
]);

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
