var assert = require("assert");
var types = require("../main.js");

describe("type annotations", function () {
  it("can build Identifier with Flow typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.identifier.from({
        name: "x",
        typeAnnotation: types.builders.typeAnnotation(types.builders.stringTypeAnnotation())
      });
    })
  });

  it("can build Identifier with TS typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.identifier.from({
        name: "x",
        typeAnnotation: types.builders.tsTypeAnnotation(types.builders.tsStringKeyword())
      });
    });
  });

  it("can build ObjectPattern with Flow typeAnnotation", function () {
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
  });

  it("can build ObjectPattern with TS typeAnnotation", function () {
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

  it("can build FunctionDeclaration with Flow typeParameters and returnType", function () {
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
  });

  it("can build FunctionDeclaration with TS typeParameters and returnType", function () {
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

  it("can build ClassProperty with Flow typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.classProperty.from({
        key: types.builders.identifier("someClassProperty"),
        typeAnnotation: types.builders.typeAnnotation(types.builders.stringTypeAnnotation()),
        value: null
      });
    });
  });

  it("can build ClassProperty with TS typeAnnotation", function () {
    assert.doesNotThrow(function () {
      types.builders.classProperty.from({
        key: types.builders.identifier("someClassProperty"),
        typeAnnotation: types.builders.tsTypeAnnotation(types.builders.tsStringKeyword()),
        value: null
      });
    });
  });

  it("can build ClassDeclaration with Flow typeParameters and superTypeParameters", function () {
    assert.doesNotThrow(function () {
      types.builders.classDeclaration.from({
        id: types.builders.identifier("SomeClass"),
        typeParameters: types.builders.typeParameterDeclaration([
          types.builders.typeParameter("T")
        ]),
        superClass: types.builders.identifier("SomeSuperClass"),
        superTypeParameters: types.builders.typeParameterInstantiation([
          types.builders.genericTypeAnnotation(types.builders.identifier("U"), null)
        ]),
        body: types.builders.classBody([])
      });
    });
  });

  it("can build ClassDeclaration with TS typeParameters and superTypeParameters", function () {
    assert.doesNotThrow(function () {
      types.builders.classDeclaration.from({
        id: types.builders.identifier("SomeClass"),
        typeParameters: types.builders.tsTypeParameterDeclaration([
          types.builders.tsTypeParameter("T")
        ]),
        superClass: types.builders.identifier("SomeSuperClass"),
        superTypeParameters: types.builders.tsTypeParameterInstantiation([
          types.builders.tsTypeReference(types.builders.identifier("U"))
        ]),
        body: types.builders.classBody([])
      });
    });
  });

  it("can build ClassExpression with Flow typeParameters and superTypeParameters", function () {
    assert.doesNotThrow(function () {
      types.builders.classExpression.from({
        id: types.builders.identifier("SomeClass"),
        typeParameters: types.builders.typeParameterDeclaration([
          types.builders.typeParameter("T")
        ]),
        superClass: types.builders.identifier("SomeSuperClass"),
        superTypeParameters: types.builders.typeParameterInstantiation([
          types.builders.genericTypeAnnotation(types.builders.identifier("U"), null)
        ]),
        body: types.builders.classBody([])
      });
    });
  });

  it("can build ClassExpression with TS typeParameters and superTypeParameters", function () {
    assert.doesNotThrow(function () {
      types.builders.classExpression.from({
        id: types.builders.identifier("SomeClass"),
        typeParameters: types.builders.tsTypeParameterDeclaration([
          types.builders.tsTypeParameter("T")
        ]),
        superClass: types.builders.identifier("SomeSuperClass"),
        superTypeParameters: types.builders.tsTypeParameterInstantiation([
          types.builders.tsTypeReference(types.builders.identifier("U"))
        ]),
        body: types.builders.classBody([])
      });
    });
  });
});
