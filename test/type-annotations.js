var assert = require("assert");
var types = require("../main.js");

describe('type annotations', function () {
  it("issue #298", function () {
    const flowId = types.builders.identifier.from({
      name: 'x',
      typeAnnotation: types.builders.typeAnnotation(types.builders.stringTypeAnnotation())
    });
    assert.strictEqual(flowId.typeAnnotation.typeAnnotation.type, 'StringTypeAnnotation');

    const tsId = types.builders.identifier.from({
      name: 'x',
      typeAnnotation: types.builders.tsTypeAnnotation(types.builders.tsStringKeyword())
    });
    assert.strictEqual(tsId.typeAnnotation.typeAnnotation.type, 'TSStringKeyword');
  });
});
