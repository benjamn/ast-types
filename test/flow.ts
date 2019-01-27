import assert from "assert";
import flowParser from "flow-parser";
import forkFn from "../fork";
import flowDef from "../def/flow";

var types = forkFn([
  flowDef,
]);

describe("flow types", function () {
  it("issue #242", function () {
    const parser = {
      parse(code: string) {
        return flowParser.parse(code, {
          types: true
        });
      }
    };

    const program = parser.parse([
      "class A<B> extends C<D> {}",
      "function f<E>() {}",
    ].join("\n"));

    const identifierNames: any[] = [];
    const typeParamNames: any[] = []

    types.visit(program, {
      visitIdentifier(path: any) {
        identifierNames.push(path.node.name);
        this.traverse(path);
      },

      visitTypeParameter(path: any) {
        typeParamNames.push(path.node.name);
        this.traverse(path);
      }
    });

    assert.deepEqual(identifierNames, ["A", "C", "D", "f"]);
    assert.deepEqual(typeParamNames, ["B", "E"]);
  });

  it("issue #261", function () {
    const parser = {
      parse(code: string) {
        return flowParser.parse(code, {
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
