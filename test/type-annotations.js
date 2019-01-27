"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var main_1 = __importDefault(require("../main"));
describe("type annotations", function () {
    it("can build Identifier with Flow typeAnnotation", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.identifier.from({
                name: "x",
                typeAnnotation: main_1.default.builders.typeAnnotation(main_1.default.builders.stringTypeAnnotation())
            });
        });
    });
    it("can build Identifier with TS typeAnnotation", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.identifier.from({
                name: "x",
                typeAnnotation: main_1.default.builders.tsTypeAnnotation(main_1.default.builders.tsStringKeyword())
            });
        });
    });
    it("can build ObjectPattern with Flow typeAnnotation", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.objectPattern.from({
                properties: [
                    main_1.default.builders.objectProperty(main_1.default.builders.identifier("x"), main_1.default.builders.identifier("y")),
                ],
                typeAnnotation: main_1.default.builders.typeAnnotation(main_1.default.builders.genericTypeAnnotation(main_1.default.builders.identifier("SomeType"), null)),
            });
        });
    });
    it("can build ObjectPattern with TS typeAnnotation", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.objectPattern.from({
                properties: [
                    main_1.default.builders.objectProperty(main_1.default.builders.identifier("x"), main_1.default.builders.identifier("y")),
                ],
                typeAnnotation: main_1.default.builders.tsTypeAnnotation(main_1.default.builders.tsTypeReference(main_1.default.builders.identifier("SomeType")))
            });
        });
    });
    it("can build FunctionDeclaration with Flow typeParameters and returnType", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.functionDeclaration.from({
                id: main_1.default.builders.identifier("someFunction"),
                params: [],
                typeParameters: main_1.default.builders.typeParameterDeclaration([
                    main_1.default.builders.typeParameter("T")
                ]),
                returnType: main_1.default.builders.typeAnnotation(main_1.default.builders.genericTypeAnnotation(main_1.default.builders.identifier("SomeType"), null)),
                body: main_1.default.builders.blockStatement([])
            });
        });
    });
    it("can build FunctionDeclaration with TS typeParameters and returnType", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.functionDeclaration.from({
                id: main_1.default.builders.identifier("someFunction"),
                params: [],
                typeParameters: main_1.default.builders.tsTypeParameterDeclaration([
                    main_1.default.builders.tsTypeParameter("T")
                ]),
                returnType: main_1.default.builders.tsTypeAnnotation(main_1.default.builders.tsTypeReference(main_1.default.builders.identifier("SomeType"))),
                body: main_1.default.builders.blockStatement([])
            });
        });
    });
    it("can build ClassProperty with Flow typeAnnotation", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classProperty.from({
                key: main_1.default.builders.identifier("someClassProperty"),
                typeAnnotation: main_1.default.builders.typeAnnotation(main_1.default.builders.stringTypeAnnotation()),
                value: null
            });
        });
    });
    it("can build ClassProperty with TS typeAnnotation", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classProperty.from({
                key: main_1.default.builders.identifier("someClassProperty"),
                typeAnnotation: main_1.default.builders.tsTypeAnnotation(main_1.default.builders.tsStringKeyword()),
                value: null
            });
        });
    });
    it("can build ClassDeclaration with Flow typeParameters and superTypeParameters", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classDeclaration.from({
                id: main_1.default.builders.identifier("SomeClass"),
                typeParameters: main_1.default.builders.typeParameterDeclaration([
                    main_1.default.builders.typeParameter("T")
                ]),
                superClass: main_1.default.builders.identifier("SomeSuperClass"),
                superTypeParameters: main_1.default.builders.typeParameterInstantiation([
                    main_1.default.builders.genericTypeAnnotation(main_1.default.builders.identifier("U"), null)
                ]),
                body: main_1.default.builders.classBody([])
            });
        });
    });
    it("can build ClassDeclaration with TS typeParameters and superTypeParameters", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classDeclaration.from({
                id: main_1.default.builders.identifier("SomeClass"),
                typeParameters: main_1.default.builders.tsTypeParameterDeclaration([
                    main_1.default.builders.tsTypeParameter("T")
                ]),
                superClass: main_1.default.builders.identifier("SomeSuperClass"),
                superTypeParameters: main_1.default.builders.tsTypeParameterInstantiation([
                    main_1.default.builders.tsTypeReference(main_1.default.builders.identifier("U"))
                ]),
                body: main_1.default.builders.classBody([])
            });
        });
    });
    it("can build ClassExpression with Flow typeParameters and superTypeParameters", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classExpression.from({
                id: main_1.default.builders.identifier("SomeClass"),
                typeParameters: main_1.default.builders.typeParameterDeclaration([
                    main_1.default.builders.typeParameter("T")
                ]),
                superClass: main_1.default.builders.identifier("SomeSuperClass"),
                superTypeParameters: main_1.default.builders.typeParameterInstantiation([
                    main_1.default.builders.genericTypeAnnotation(main_1.default.builders.identifier("U"), null)
                ]),
                body: main_1.default.builders.classBody([])
            });
        });
    });
    it("can build ClassExpression with TS typeParameters and superTypeParameters", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classExpression.from({
                id: main_1.default.builders.identifier("SomeClass"),
                typeParameters: main_1.default.builders.tsTypeParameterDeclaration([
                    main_1.default.builders.tsTypeParameter("T")
                ]),
                superClass: main_1.default.builders.identifier("SomeSuperClass"),
                superTypeParameters: main_1.default.builders.tsTypeParameterInstantiation([
                    main_1.default.builders.tsTypeReference(main_1.default.builders.identifier("U"))
                ]),
                body: main_1.default.builders.classBody([])
            });
        });
    });
    it("can build ClassDeclaration with Flow implements", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classDeclaration.from({
                id: main_1.default.builders.identifier("SomeClass"),
                implements: [
                    main_1.default.builders.classImplements.from({
                        id: main_1.default.builders.identifier("SomeInterface"),
                        typeParameters: main_1.default.builders.typeParameterInstantiation([
                            main_1.default.builders.genericTypeAnnotation(main_1.default.builders.identifier("U"), null)
                        ]),
                    }),
                    main_1.default.builders.classImplements(main_1.default.builders.identifier("SomeOtherInterface"))
                ],
                body: main_1.default.builders.classBody([])
            });
        });
    });
    it("can build ClassDeclaration with TS implements", function () {
        assert_1.default.doesNotThrow(function () {
            main_1.default.builders.classDeclaration.from({
                id: main_1.default.builders.identifier("SomeClass"),
                implements: [
                    main_1.default.builders.tsExpressionWithTypeArguments.from({
                        expression: main_1.default.builders.identifier("SomeInterface"),
                        typeParameters: main_1.default.builders.tsTypeParameterInstantiation([
                            main_1.default.builders.tsTypeReference(main_1.default.builders.identifier("U"))
                        ]),
                    }),
                    main_1.default.builders.tsExpressionWithTypeArguments(main_1.default.builders.identifier("SomeOtherInterface"))
                ],
                body: main_1.default.builders.classBody([])
            });
        });
    });
});
