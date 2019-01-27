"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __importDefault(require("./core"));
var types_1 = __importDefault(require("../lib/types"));
var shared_1 = __importDefault(require("../lib/shared"));
function default_1(fork) {
    fork.use(core_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    var shared = fork.use(shared_1.default);
    var geq = shared.geq;
    var defaults = shared.defaults;
    def("Function")
        // SpiderMonkey allows expression closures: function(x) x+1
        .field("body", or(def("BlockStatement"), def("Expression")));
    def("ForInStatement")
        .build("left", "right", "body", "each")
        .field("each", Boolean, defaults["false"]);
    def("LetStatement")
        .bases("Statement")
        .build("head", "body")
        // TODO Deviating from the spec by reusing VariableDeclarator here.
        .field("head", [def("VariableDeclarator")])
        .field("body", def("Statement"));
    def("LetExpression")
        .bases("Expression")
        .build("head", "body")
        // TODO Deviating from the spec by reusing VariableDeclarator here.
        .field("head", [def("VariableDeclarator")])
        .field("body", def("Expression"));
    def("GraphExpression")
        .bases("Expression")
        .build("index", "expression")
        .field("index", geq(0))
        .field("expression", def("Literal"));
    def("GraphIndexExpression")
        .bases("Expression")
        .build("index")
        .field("index", geq(0));
}
exports.default = default_1;
;
