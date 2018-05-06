var assert = require("assert");
var types = require("../fork.js")([
  require("../def/flow"),
]);

describe("flow types", function () {
  it("issue #242", function () {
    const parser = {
      parse(code) {
        return require('flow-parser').parse(code, {
          types: true
        });
      }
    };

    const program = parser.parse([
      "class A<B> extends C<D> {}",
      "function f<E>() {}",
    ].join("\n"));

    const typeParam = program.body[0].typeParameters.params[0];
    const superTypeParam =
      program.body[0].superTypeParameters.params[0].id;
    const functionTypeParam = program.body[1].typeParameters.params[0];

    const identifierNames = [];
    const typeParamNames = []

    types.visit(program, {
      visitIdentifier(path) {
        identifierNames.push(path.node.name);
        this.traverse(path);
      },

      visitTypeParameter(path) {
        typeParamNames.push(path.node.name);
        this.traverse(path);
      }
    });

    assert.deepEqual(identifierNames, ["A", "C", "D", "f"]);
    assert.deepEqual(typeParamNames, ["B", "E"]);
  });

  it("issue #261", function () {
    const parser = {
      parse(code) {
        return require('flow-parser').parse(code, {
          types: true
        });
      }
    };

    const program = parser.parse('declare module.exports: {};');

    assert.strictEqual(program.body[0].type, 'DeclareModuleExports');
    assert.notEqual(program.body[0].typeAnnotation, undefined);
    assert.strictEqual(program.body[0].typeAnnotation.type, 'TypeAnnotation');
  });
});
