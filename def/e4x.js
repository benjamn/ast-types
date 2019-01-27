"use strict";;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __importDefault(require("../lib/types"));
var core_1 = __importDefault(require("./core"));
function default_1(fork) {
    fork.use(core_1.default);
    var types = fork.use(types_1.default);
    var def = types.Type.def;
    var or = types.Type.or;
    // Note that none of these types are buildable because the Mozilla Parser
    // API doesn't specify any builder functions, and nobody uses E4X anymore.
    def("XMLDefaultDeclaration")
        .bases("Declaration")
        .field("namespace", def("Expression"));
    def("XMLAnyName").bases("Expression");
    def("XMLQualifiedIdentifier")
        .bases("Expression")
        .field("left", or(def("Identifier"), def("XMLAnyName")))
        .field("right", or(def("Identifier"), def("Expression")))
        .field("computed", Boolean);
    def("XMLFunctionQualifiedIdentifier")
        .bases("Expression")
        .field("right", or(def("Identifier"), def("Expression")))
        .field("computed", Boolean);
    def("XMLAttributeSelector")
        .bases("Expression")
        .field("attribute", def("Expression"));
    def("XMLFilterExpression")
        .bases("Expression")
        .field("left", def("Expression"))
        .field("right", def("Expression"));
    def("XMLElement")
        .bases("XML", "Expression")
        .field("contents", [def("XML")]);
    def("XMLList")
        .bases("XML", "Expression")
        .field("contents", [def("XML")]);
    def("XML").bases("Node");
    def("XMLEscape")
        .bases("XML")
        .field("expression", def("Expression"));
    def("XMLText")
        .bases("XML")
        .field("text", String);
    def("XMLStartTag")
        .bases("XML")
        .field("contents", [def("XML")]);
    def("XMLEndTag")
        .bases("XML")
        .field("contents", [def("XML")]);
    def("XMLPointTag")
        .bases("XML")
        .field("contents", [def("XML")]);
    def("XMLName")
        .bases("XML")
        .field("contents", or(String, [def("XML")]));
    def("XMLAttribute")
        .bases("XML")
        .field("value", String);
    def("XMLCdata")
        .bases("XML")
        .field("contents", String);
    def("XMLComment")
        .bases("XML")
        .field("contents", String);
    def("XMLProcessingInstruction")
        .bases("XML")
        .field("target", String)
        .field("contents", or(String, null));
}
exports.default = default_1;
module.exports = exports["default"];
