import fork from "./fork";
import coreDef from "./def/core";
import es6Def from "./def/es6";
import es7Def from "./def/es7";
import mozillaDef from "./def/mozilla";
import e4xDef from "./def/e4x";
import jsxDef from "./def/jsx";
import flowDef from "./def/flow";
import esprimaDef from "./def/esprima";
import babelDef from "./def/babel";
import typescriptDef from "./def/typescript";
import esProposalsDef from "./def/es-proposals";
import { Omit } from "./types";
import { NamedTypes as _NamedTypes } from "./gen/namedTypes";
import { Builders as _Builders } from "./gen/builders";
import { Visitor as _Visitor } from "./gen/visitor";

// We have to use a namespace to export types along with `export =`
// See https://github.com/Microsoft/TypeScript/issues/2719
namespace main {
  export type NamedTypes = _NamedTypes;
  export type Builders = _Builders;
  export type Visitor = _Visitor;
}

type GenTypes = {
  namedTypes: main.NamedTypes;
  builders: main.Builders;
  visit: (node: any, methods?: main.Visitor) => any;
};

type Main = Omit<ReturnType<typeof fork>, keyof GenTypes> & GenTypes;

const main = fork([
  // This core module of AST types captures ES5 as it is parsed today by
  // git://github.com/ariya/esprima.git#master.
  coreDef,

  // Feel free to add to or remove from this list of extension modules to
  // configure the precise type hierarchy that you need.
  es6Def,
  es7Def,
  mozillaDef,
  e4xDef,
  jsxDef,
  flowDef,
  esprimaDef,
  babelDef,
  typescriptDef,
  esProposalsDef,
]) as any as Main;

export = main;
