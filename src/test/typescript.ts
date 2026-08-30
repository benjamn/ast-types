import assert from "assert";
import fs from "fs";
import path from "path";
import { globSync } from "glob";
import { parse as babelParse, ParseError, ParserOptions } from "@babel/parser";
import fork from "../fork";
import esProposalsDef from '../def/es-proposals';
import typescriptDef from "../def/typescript";
import jsxDef from "../def/jsx";
import { visit } from "../main";
import { ASTNode } from "../types";
import { NodePath } from "../node-path";
import { Visitor } from "../gen/visitor";
import { Context } from "../path-visitor";
import { hasNonEmptyErrorsArray } from "./shared";

var pkgRootDir = path.resolve(__dirname, "..", "..");
var tsTypes = fork([
  esProposalsDef,
  typescriptDef,
  jsxDef,
]);

const babelParserDir = path.resolve(
  pkgRootDir, "src", "test", "data", "babel-parser");

const babelTSFixturesDir =
  path.join(babelParserDir, "test", "fixtures", "typescript");

(() => {
  const files = globSync("**/input.ts", { cwd: babelTSFixturesDir });

  if (files.length < 10) {
    throw new Error(`Unexpectedly few **/input.ts files matched (${
      files.length
    }) in ${
      babelTSFixturesDir
    }`);
  }

  describe("Whole-program validation for Babel TypeScript tests", function () {
    files.forEach((tsPath: any) => {
      const fullPath = path.join(babelTSFixturesDir, tsPath);
      const pkgRootRelPath = path.relative(pkgRootDir, fullPath);

      if (
        fullPath.endsWith("/arrow-function/generic-tsx/input.ts") ||
        fullPath.endsWith("/tsx/invalid-gt-arrow-like/input.ts")
      ) {
        (it.skip || it)("[SKIPPED] " + pkgRootRelPath, done => done());
        return;
      }

      it("should validate " + pkgRootRelPath, function (done) {
        fs.readFile(fullPath, "utf8", function (error, code) {
          if (error) {
            done(error);
          } else try {
            const ast = tryParse(code, fullPath);
            if (ast) {
              const expected = readJSONOrNull(
                path.join(path.dirname(fullPath), "output.json"));

              if (
                hasNonEmptyErrorsArray(ast) ||
                hasNonEmptyErrorsArray(expected)
              ) {
                // Most parsing errors are checked this way, thanks to
                // errorRecovery: true.
                // Note: only one of ast/expected is guaranteed to have a
                // non-empty errors array here, so neither .errors access can
                // assume the other side has one.
                assert.deepEqual(
                  (ast.errors || []).map(normalizeErrorString),
                  (expected && expected.errors || []).map(normalizeErrorString),
                );
              } else if (
                ast.program &&
                // If there were parsing errors, there's a good chance the rest
                // of the parsed AST is not fully conformant with the Program
                // type. If this clause is commented out, only 8 tests fail (not
                // great, not terrible, TODO maybe worth looking into).
                !hasNonEmptyErrorsArray(ast)
              ) {
                tsTypes.namedTypes.Program.assert(ast.program, true);
              }
            }

            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });

  function readJSONOrNull(fullPath: string) {
    try {
      return JSON.parse(fs.readFileSync(fullPath).toString());
    } catch {
      return null;
    }
  }

  function tryParse(code: string, fullPath: string) {
    const parseOptions = {
      errorRecovery: true,
      ...getOptions(fullPath),
    };

    try {
      return babelParse(code, parseOptions);

    } catch (error: any) {
      // If parsing fails, check options.json to see if the failure was
      // expected.
      try {
        var options = JSON.parse(fs.readFileSync(
          path.join(path.dirname(fullPath), "options.json")).toString());
      } catch (optionsError: any) {
        console.error(optionsError.message);
      }

      if (
        options &&
        options.throws &&
        normalizeErrorString(options.throws) ===
          normalizeErrorString(error.message)
      ) {
        return null;
      }

      throw error;
    }
  }

  function normalizeErrorString(error: ParseError | Error | string) {
    // Sometimes the line or column numbers are slightly off for catastrophic
    // parse errors. TODO Investigate why this is necessary.
    return String(error).replace(/\(\d+:\d+\)/g, "(line:column)");
  }

  function getOptions(fullPath: string): ParserOptions {
    const dir = path.dirname(fullPath);
    return {
      // Babel's fixtures default to sourceType: "module", but a few opt
      // into "script" (e.g. to check that import/export is rejected).
      sourceType: findFixtureOption(dir, "sourceType") || "module",
      plugins: findFixtureOption(dir, "plugins") || ["typescript"],
    };
  }

  // Babel fixture directories may carry an options.json whose settings
  // apply to every fixture beneath them, so walk upward from the fixture's
  // own directory to the root of the TypeScript fixtures, returning the
  // first value found for the given option.
  function findFixtureOption(dir: string, name: string): any {
    try {
      var options = JSON.parse(fs.readFileSync(
        path.join(dir, "options.json")
      ).toString());
    } catch (ignored) {
      options = {};
    }

    if (Object.prototype.hasOwnProperty.call(options, name)) {
      return options[name];
    }

    if (dir !== babelTSFixturesDir) {
      return findFixtureOption(path.dirname(dir), name);
    }
  }
})();

var tsCompilerDir = path.resolve(
  pkgRootDir, "src", "test", "data", "typescript-compiler");

(() => {
  const files = globSync("**/*.ts", { cwd: tsCompilerDir });

  if (files.length < 10) {
    throw new Error(`Unexpectedly few **/*.ts files matched (${
      files.length
    }) in ${
      tsCompilerDir
    }`);
  }

  describe("Whole-program validation for TypeScript codebase", function () {
    this.timeout(20000);

    files.forEach((tsPath: string) => {
      var fullPath = path.join(tsCompilerDir, tsPath);

      // We have to skip checker.ts because of a bug in babel's typescript
      // parser plugin. See
      // https://github.com/babel/babel/issues/7235#issuecomment-549437974
      if (tsPath === "checker.ts") {
        return;
      }

      it("should validate " + path.relative(pkgRootDir, fullPath), function (done) {
        fs.readFile(fullPath, "utf8", function (error, code) {
          if (error) {
            done(error);
          } else try {
            var program = babelParse(code, {
              sourceType: "module",
              plugins: [
                "typescript",
                "objectRestSpread",
                "classProperties",
                "optionalCatchBinding",
                "numericSeparator",
                "optionalChaining",
                "nullishCoalescingOperator",
              ]
            }).program;

            tsTypes.namedTypes.Program.assert(program, true);

            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });

  describe('scope', () => {
    const scope = [
      "type Foo = {}",
      "interface Bar {}"
    ];

    const ast = babelParse(scope.join("\n"), {
      plugins: ['typescript']
    });

    it("should register typescript types with the scope", function() {
      visit(ast, {
        visitProgram(path) {
          assert(path.scope.declaresType('Foo'));
          assert(path.scope.declaresType('Bar'));
          assert.equal(path.scope.lookupType('Foo').getTypes()['Foo'][0].parent.node.type, 'TSTypeAliasDeclaration');
          assert.equal(path.scope.lookupType('Bar').getTypes()['Bar'][0].parent.node.type, 'TSInterfaceDeclaration');
          return false;
        }
      });
    });
  });

  function assertVisited(node: ASTNode, visitors: Visitor<any>): any {
    const visitedSet: Set<string> = new Set();
    const wrappedVisitors: Visitor<any> = {}
    for (const _key of Object.keys(visitors)) {
      const key = _key as keyof Visitor<any>
      wrappedVisitors[key] = function (this: Context, path: NodePath<any>) {
        visitedSet.add(key);
        (visitors[key] as any)?.call(this, path)
      }
    }
    tsTypes.visit(node, wrappedVisitors);

    for (const key of Object.keys(visitors)) {
      assert.equal(visitedSet.has(key), true);
    }
  }

  describe('typescript types', () => {
    it("issue #294 - function declarations", function () {
      const program = babelParse([
        "function foo<T>(): T { }",
        "let bar: T",
      ].join("\n"),
        { plugins: ['typescript'] }
      )

      assertVisited(program, {
        visitFunctionDeclaration(path) {
          assert.ok(path.scope.lookupType('T'));
          this.traverse(path);
        },
        visitVariableDeclarator(path) {
          assert.equal(path.scope.lookupType('T'), null);
          this.traverse(path);
        }
      });
    });

    it("issue #294 - function expressions", function () {
      const program = babelParse([
        "const foo = function <T>(): T { }",
        "let bar: T",
      ].join("\n"), {
        plugins: ["typescript"]
      });

      assertVisited(program, {
        visitFunctionExpression(path) {
          assert.ok(path.scope.lookupType('T'));
          this.traverse(path);
        },
        visitVariableDeclarator(path) {
          if (path.node.id.type === 'Identifier' && path.node.id.name === 'bar') {
            assert.equal(path.scope.lookupType('T'), null);
          }
          this.traverse(path);
        }
      });
    });

    it("issue #294 - arrow function expressions", function () {
      const program = babelParse([
        "const foo = <T>(): T => { }",
        "let bar: T"
      ].join("\n"), {
        plugins: ["typescript"]
      });

      assertVisited(program, {
        visitArrowFunctionExpression(path) {
          assert.ok(path.scope.lookupType('T'));
          this.traverse(path);
        },
        visitVariableDeclarator(path) {
          assert.equal(path.scope.lookupType('T'), null);
          this.traverse(path);
        }
      });
    });

    it("issue #294 - class declarations", function () {
      const program = babelParse([
        "class Foo<T> extends Bar<Array<T>> { }",
        "let bar: T"
      ].join("\n"), {
        plugins: ["typescript"]
      });

      assertVisited(program, {
        visitTSTypeParameterInstantiation(path) {
          assert.ok(path.scope.lookupType('T'));
          this.traverse(path);
        },
        visitVariableDeclarator(path) {
          assert.equal(path.scope.lookupType('T'), null);
          this.traverse(path);
        }
      });
    });

    it("issue #294 - class expressions", function () {
      const program = babelParse([
        "const foo = class Foo<T> extends Bar<Array<T>> { }",
        "let bar: T"
      ].join("\n"), {
        plugins: ["typescript"]
      });

      assertVisited(program, {
        visitTSTypeParameterInstantiation(path) {
          assert.ok(path.scope.lookupType('T'));
          this.traverse(path);
        },
        visitVariableDeclarator(path) {
          if (path.node.id.type === 'Identifier' && path.node.id.name === 'bar') {
            assert.equal(path.scope.lookupType('T'), null);
            assert.equal(path.scope.lookupType('Foo'), null);
          }
          this.traverse(path);
        }
      });
    });

    it("issue #296 - interface declarations", function () {
      const program = babelParse([
        "interface Foo<T> extends Bar<Array<T>> { }",
        "let bar: T"
      ].join("\n"), {
        plugins: ["typescript"]
      });

      assertVisited(program, {
        visitTSTypeParameterInstantiation(path) {
          assert.ok(path.scope.lookupType('T'));
          this.traverse(path);
        },
        visitVariableDeclarator(path) {
          assert.equal(path.scope.lookupType('T'), null);
          assert.ok(path.scope.lookupType('Foo'));
          this.traverse(path);
        }
      });
    });

    it("issue #343: CallExpression with type parameters", function () {
      const program = babelParse("fn<FetchResult>();", {
        plugins: ["typescript"]
      });

      const identifiers: string[] = [];
      
      assertVisited(program, {
        visitIdentifier(path) {
          identifiers.push(path.node.name);
          this.traverse(path);
        }
      });

      assert.deepEqual(identifiers, ["FetchResult", "fn"]);
    });

    it("NewExpression with type parameters", function () {
      const program = babelParse("new Container<Item>();", {
        plugins: ["typescript"]
      });

      const identifiers: string[] = [];
      
      assertVisited(program, {
        visitIdentifier(path) {
          identifiers.push(path.node.name);
          this.traverse(path);
        }
      });

      assert.deepEqual(identifiers, ["Item", "Container"]);
    });

    it("OptionalCallExpression with type parameters", function () {
      const program = babelParse("obj?.method<Result>();", {
        plugins: ["typescript"]
      });

      const identifiers: string[] = [];
      
      assertVisited(program, {
        visitIdentifier(path) {
          identifiers.push(path.node.name);
          this.traverse(path);
        }
      });

      assert.deepEqual(identifiers, ["Result", "obj", "method"]);
    });

    it("Complex nested type parameters in CallExpression", function () {
      const program = babelParse("func<Array<Map<string, User>>>(data);", {
        plugins: ["typescript"]
      });

      const identifiers: string[] = [];      
      assertVisited(program, {
        visitIdentifier(path) {
          identifiers.push(path.node.name);
          this.traverse(path);
        }
      });

      assert.deepEqual(identifiers, [ "User", "Map", "Array", "func", "data"]);
    });
  });
})();