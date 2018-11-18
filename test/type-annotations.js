var assert = require("assert");
var types = require("../main.js");

describe('type annotations', function () {
  it("can build Identifier with either Flow or TS type annotation", function () {
    assert.doesNotThrow(function () {
      types.builders.identifier.from({
        name: 'x',
        typeAnnotation: types.builders.typeAnnotation(types.builders.stringTypeAnnotation())
      });
    })

    assert.doesNotThrow(function () {
      types.builders.identifier.from({
        name: 'x',
        typeAnnotation: types.builders.tsTypeAnnotation(types.builders.tsStringKeyword())
      });
    });
  });

  it("can build ObjectPattern with either Flow or TS type annotation", function () {
    assert.doesNotThrow(function () {
      types.builders.objectPattern.from({
        properties: [
          types.builders.objectProperty(
            types.builders.identifier("x"),
            types.builders.identifier("y")
          ),
        ],
        typeAnnotation: types.builders.typeAnnotation(
          types.builders.genericTypeAnnotation(types.builders.identifier('SomeType'), null)
        ),
      });
    });

    assert.doesNotThrow(function () {
      types.builders.objectPattern.from({
        properties: [
          types.builders.objectProperty(
            types.builders.identifier("x"),
            types.builders.identifier("y")
          ),
        ],
        typeAnnotation: types.builders.tsTypeAnnotation(
          types.builders.tsTypeReference(types.builders.identifier('SomeType'))
        )
      });
    });
  });
});
