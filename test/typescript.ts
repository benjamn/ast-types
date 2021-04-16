import assert from "assert";
import fs from "fs";
import path from "path";
import glob from "glob";
import { parse as babelParse, ParserOptions, ParserPlugin } from "@babel/parser";
import fork from "../fork";
import esProposalsDef from '../def/es-proposals';
import typescriptDef from "../def/typescript";
import jsxDef from "../def/jsx";
import { visit } from "../main";
import { ASTNode } from "../lib/types";
import { NodePath } from "../lib/node-path";
import { Visitor } from "../gen/visitor";
import { Context } from "../lib/path-visitor";

var pkgRootDir = path.resolve(__dirname, "..");
var tsTypes = fork([
  esProposalsDef,
  typescriptDef,
  jsxDef,
]);

const babelParserDir = path.resolve(__dirname, "data", "babel-parser");

const babelTSFixturesDir =
  path.join(babelParserDir, "test", "fixtures", "typescript");

glob("**/input.js", {
  cwd: babelTSFixturesDir,
}, (error, files) => {
  if (error) {
    throw error;
  }

  describe("Whole-program validation for Babel TypeScript tests", function () {
    if (error) {
      throw error;
    }

    files.forEach((tsPath: any) => {
      var fullPath = path.join(babelTSFixturesDir, tsPath);

      if (tsPath === "class/method-readonly/input.js") {
        // This file intentionally triggers a parse error for a babel test, so
        // it doesn't make sense to test here.
        return;
      }

      it("should validate " + path.relative(pkgRootDir, fullPath), function (done) {
        fs.readFile(fullPath, "utf8", function (error, code) {
          if (error) {
            throw error;
          }
          var program = tryParse(code, fullPath);
          if (program !== null) {
            tsTypes.namedTypes.Program.assert(program, true);
          }
          done();
        });
      });
    });
  });

  function tryParse(code: any, fullPath: any) {
    var parseOptions = getOptions(fullPath);

    try {
      return babelParse(code, parseOptions).program;

    } catch (error) {
      // If parsing fails, check options.json to see if the failure was
      // expected.
      try {
        var options = JSON.parse(fs.readFileSync(
          path.join(path.dirname(fullPath), "options.json")).toString());
      } catch (optionsError) {
        console.error(optionsError.message);
      }

      if (options &&
          options.throws === error.message) {
        return null;
      }

      throw error;
    }
  }

  function getOptions(fullPath: string): ParserOptions {
    var plugins = getPlugins(path.dirname(fullPath));
    return {
      sourceType: "module",
      plugins,
    };
  }

  function getPlugins(dir: string): ParserPlugin[] {
    try {
      var options = JSON.parse(fs.readFileSync(
        path.join(dir, "options.json")
      ).toString());
    } catch (ignored) {
      options = {};
    }

    if (options.plugins) {
      return options.plugins;
    }

    if (dir !== babelTSFixturesDir) {
      return getPlugins(path.dirname(dir));
    }

    return [
      "typescript",
    ];
  }
});

var tsCompilerDir =
  path.resolve( __dirname, "data", "typescript-compiler");

glob("**/*.ts", {
  cwd: tsCompilerDir,
}, (error, files) => {
  if (error) {
    throw error;
  }

  describe("Whole-program validation for TypeScript codebase", function () {
    if (error) {
      throw error;
    }

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
            throw error;
          }

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
  });
});