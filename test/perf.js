"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var esprima_1 = require("esprima");
// @ts-ignore Cannot find module 'ast-types'. [2307]
var ast_types_1 = require("ast-types");
var backbone = fs_1.default.readFileSync(path_1.default.join(__dirname, "data", "backbone.js"), "utf-8");
var ast = esprima_1.parse(backbone);
var names = [];
var start = +new Date;
ast_types_1.visit(ast, {
    visitNode: function (path) {
        names.push(path.name);
        this.traverse(path);
    }
});
console.log(names.length);
console.log(+new Date - start, "ms");
