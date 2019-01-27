"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var flow_parser_1 = __importDefault(require("flow-parser"));
var fork_1 = __importDefault(require("../fork"));
var flow_1 = __importDefault(require("../def/flow"));
var types = fork_1.default([
    flow_1.default,
]);
describe("flow types", function () {
    it("issue #242", function () {
        var parser = {
            parse: function (code) {
                return flow_parser_1.default.parse(code, {
                    types: true
                });
            }
        };
        var program = parser.parse([
            "class A<B> extends C<D> {}",
            "function f<E>() {}",
        ].join("\n"));
        var identifierNames = [];
        var typeParamNames = [];
        types.visit(program, {
            visitIdentifier: function (path) {
                identifierNames.push(path.node.name);
                this.traverse(path);
            },
            visitTypeParameter: function (path) {
                typeParamNames.push(path.node.name);
                this.traverse(path);
            }
        });
        assert_1.default.deepEqual(identifierNames, ["A", "C", "D", "f"]);
        assert_1.default.deepEqual(typeParamNames, ["B", "E"]);
    });
    it("issue #261", function () {
        var parser = {
            parse: function (code) {
                return flow_parser_1.default.parse(code, {
                    types: true
                });
            }
        };
        var program = parser.parse('declare module.exports: {};');
        assert_1.default.strictEqual(program.body[0].type, 'DeclareModuleExports');
        assert_1.default.notEqual(program.body[0].typeAnnotation, undefined);
        assert_1.default.strictEqual(program.body[0].typeAnnotation.type, 'TypeAnnotation');
    });
});
