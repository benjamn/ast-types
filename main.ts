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
import { NamedTypes } from "./gen/namedTypes";

type Main = ReturnType<typeof fork> & {
  namedTypes: NamedTypes;
};

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
]) as Main;

export = main;
