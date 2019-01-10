import fork from "./fork";
import coreDef from "./def/core";
import es6Def from "./def/es6";
import es7Def from "./def/es7";
import jsxDef from "./def/jsx";
import flowDef from "./def/flow";
import esprimaDef from "./def/esprima";
import babelDef from "./def/babel";
import typescriptDef from "./def/typescript";
import esProposalsDef from "./def/es-proposals";
import { Omit } from "./types";
import { ASTNode, Type, AnyType, Field } from "./lib/types";
import { NodePath } from "./lib/node-path";
import { NamedTypes } from "./gen/namedTypes";
import { Builders } from "./gen/builders";
import { Visitor } from "./gen/visitor";

type GenTypes = {
  namedTypes: NamedTypes;
  builders: Builders;
  visit<M = {}>(node: ASTNode, methods?: Visitor<M> & M): any;
};

type Main = Omit<ReturnType<typeof fork>, keyof GenTypes> & GenTypes;

const defs = [
  // This core module of AST types captures ES5 as it is parsed today by
  // git://github.com/ariya/esprima.git#master.
  coreDef,

  // Feel free to add to or remove from this list of extension modules to
  // configure the precise type hierarchy that you need.
  es6Def,
  es7Def,
  jsxDef,
  flowDef,
  esprimaDef,
  babelDef,
  typescriptDef,
  esProposalsDef,
];

const main = fork(defs) as any as Main;
export default main;

export {
  ASTNode,
  Type,
  AnyType,
  Field,
  NodePath,
  NamedTypes,
  Builders,
  Visitor,
};
