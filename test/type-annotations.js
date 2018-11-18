var assert = require("assert");
var types = require("../main.js");

describe("type annotations", function () {
  it("can build Identifier with Flow or TS typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.identifier.from({
        name: "x",
        typeAnnotation: types.builders.typeAnnotation(types.builders.stringTypeAnnotation())
      });
    })

    assert.doesNotThrow(function () {
      types.builders.identifier.from({
        name: "x",
        typeAnnotation: types.builders.tsTypeAnnotation(types.builders.tsStringKeyword())
      });
    });
  });

  it("can build ObjectPattern with Flow or TS typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.objectPattern.from({
        properties: [
          types.builders.objectProperty(
            types.builders.identifier("x"),
            types.builders.identifier("y")
          ),
        ],
        typeAnnotation: types.builders.typeAnnotation(
          types.builders.genericTypeAnnotation(types.builders.identifier("SomeType"), null)
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
          types.builders.tsTypeReference(types.builders.identifier("SomeType"))
        )
      });
    });
  });
  
  it("can build FunctionDeclaration with Flow or TS typeParameters and returnType", function () {
    assert.doesNotThrow(function () {
      types.builders.functionDeclaration.from({
        id: types.builders.identifier("someFunction"),
        params: [],
        typeParameters: types.builders.typeParameterDeclaration([
          types.builders.typeParameter("T")
        ]),
        returnType: types.builders.typeAnnotation(
          types.builders.genericTypeAnnotation(types.builders.identifier("SomeType"), null)
        ),
        body: types.builders.blockStatement([])
      });
    });

    assert.doesNotThrow(function () {
      types.builders.functionDeclaration.from({
        id: types.builders.identifier("someFunction"),
        params: [],
        typeParameters: types.builders.tsTypeParameterDeclaration([
          types.builders.tsTypeParameter("T")
        ]),
        returnType: types.builders.tsTypeAnnotation(
          types.builders.tsTypeReference(types.builders.identifier("SomeType"))
        ),
        body: types.builders.blockStatement([])
      });
    });
  });

  it("can build ClassProperty with Flow or TS typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.classProperty.from({
        key: types.builders.identifier("someClassProperty"),
        typeAnnotation: types.builders.typeAnnotation(types.builders.stringTypeAnnotation()),
        value: null
      });
    });

    assert.doesNotThrow(function () {
      types.builders.classProperty.from({
        key: types.builders.identifier("someClassProperty"),
        typeAnnotation: types.builders.tsTypeAnnotation(types.builders.tsStringKeyword()),
        value: null
      });
    });
  });
});
