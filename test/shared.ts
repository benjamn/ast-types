import path from "path";
import fs from "fs";
import { parse as esprimaParse } from "esprima";
import { parse as reifyBabylonParse } from "reify/lib/parsers/babylon";
import { parse as rawBabelParse } from "@babel/parser";
import { parse as acornParse } from "acorn";
import { namedTypes as n } from "../main";

export type Parser = "esprima" | "babylon" | "babel-parser" | "acorn";

export function validateECMAScript(
  file: string,
  skipList?: Partial<Record<Parser, boolean>>
) {
  const fullPath = path.join(__dirname, "..", file);
  const codeP = fs.promises.readFile(fullPath, "utf8");

  it(`should validate ${file} with Esprima`, async function () {
    if (skipList?.esprima) {
      return;
    }
    const code = await codeP;
    n.Program.assert(esprimaParse(code), true);
    n.Program.assert(esprimaParse(code, {
      loc: true
    }), true);
  });

  it(`should validate ${file} with Babylon`, async function () {
    if (skipList?.babylon) {
      return;
    }
    const code = await codeP;
    var ast = babylonParse(code);
    n.Program.assert(ast, true);
  });

  it(`should validate ${file} with babel`, async function () {
    if (skipList?.["babel-parser"]) {
      return;
    }
    const code = await codeP;
    const ast = babelParse(code);
    n.Program.assert(ast, true);
  });

  it(`should validate ${file} with acorn`, async function () {
    if (skipList?.["acorn"]) {
      return;
    }
    const code = await codeP;
    const ast = acornStage3Parse(code, );
    n.Program.assert(ast, true);
  });
};

export function babylonParse(source: string, options?: any) {
  var ast = reifyBabylonParse(source, options);
  if (ast.type === "File") ast = ast.program;
  return ast;
}

export { esprimaParse };

function babelParse(source: string) {
  const ast = rawBabelParse(source, {
    sourceType: "module",
    plugins: [
      "typescript",
      "objectRestSpread",
      "classProperties",
      "optionalCatchBinding",
      "numericSeparator",
      "optionalChaining",
      "nullishCoalescingOperator",
      "classPrivateProperties",
      "classPrivateMethods",
    ]
  });
  return ast.program;
}

function acornStage3Parse(source: string) {
  const ast = acornParse(source, {
    sourceType: "module",
    ecmaVersion: "latest",
  });
  return ast;
}

// Helper for determining if we should care that a given type is not defined yet.
// TODO Periodically revisit this as proposals advance.
export function isEarlyStageProposalType(typeName: string) {
  switch (typeName) {
    // The pipeline operator syntax is still at Stage 1:
    // https://github.com/tc39/proposals#stage-1
    case "PipelineTopicExpression":
    case "PipelineBareFunction":
    case "PipelinePrimaryTopicReference":
    // A Babel-specific AST innovation:
    // https://github.com/babel/babel/pull/9364
    case "Placeholder":
    // Partial application proposal (stage 1):
    // https://github.com/babel/babel/pull/9474
    case "ArgumentPlaceholder":
      return true;
    default:
      return false;
  }
}
