"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var recast_1 = require("recast");
var main_1 = __importDefault(require("../main"));
var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var b = main_1.default.builders, n = main_1.default.namedTypes, getBuilderName = main_1.default.getBuilderName;
var RESERVED_WORDS = {
    extends: true,
    default: true,
    arguments: true,
    static: true,
};
var NODES_ID = b.identifier("N");
var NODES_IMPORT = b.importDeclaration([b.importNamespaceSpecifier(NODES_ID)], b.stringLiteral("./nodes"));
var KINDS_ID = b.identifier("K");
var KINDS_IMPORT = b.importDeclaration([b.importNamespaceSpecifier(KINDS_ID)], b.stringLiteral("./kinds"));
var supertypeToSubtypes = getSupertypeToSubtypes();
var builderTypeNames = getBuilderTypeNames();
var out = [
    {
        file: "kinds.ts",
        ast: moduleWithBody([
            NODES_IMPORT
        ].concat(Object.keys(supertypeToSubtypes).map(function (supertype) {
            var buildableSubtypes = getBuildableSubtypes(supertype);
            if (buildableSubtypes.length === 0) {
                // Some of the XML* types don't have buildable subtypes,
                // so fall back to using the supertype's node type
                return b.exportNamedDeclaration(b.tsTypeAliasDeclaration(b.identifier(supertype + "Kind"), b.tsTypeReference(b.tsQualifiedName(NODES_ID, b.identifier(supertype)))));
            }
            return b.exportNamedDeclaration(b.tsTypeAliasDeclaration(b.identifier(supertype + "Kind"), b.tsUnionType(buildableSubtypes.map(function (subtype) {
                return b.tsTypeReference(b.tsQualifiedName(NODES_ID, b.identifier(subtype)));
            }))));
        }))),
    },
    {
        file: "nodes.ts",
        ast: moduleWithBody([
            b.importDeclaration([b.importSpecifier(b.identifier("Omit"))], b.stringLiteral("../types")),
            KINDS_IMPORT
        ].concat(Object.keys(main_1.default.namedTypes).map(function (typeName) {
            var typeDef = main_1.default.Type.def(typeName);
            var ownFieldNames = Object.keys(typeDef.ownFields);
            return b.exportNamedDeclaration(b.tsInterfaceDeclaration.from({
                id: b.identifier(typeName),
                extends: typeDef.baseNames.map(function (baseName) {
                    var baseDef = main_1.default.Type.def(baseName);
                    var commonFieldNames = ownFieldNames
                        .filter(function (fieldName) { return !!baseDef.allFields[fieldName]; });
                    if (commonFieldNames.length > 0) {
                        return b.tsExpressionWithTypeArguments(b.identifier("Omit"), b.tsTypeParameterInstantiation([
                            b.tsTypeReference(b.identifier(baseName)),
                            b.tsUnionType(commonFieldNames.map(function (fieldName) {
                                return b.tsLiteralType(b.stringLiteral(fieldName));
                            })),
                        ]));
                    }
                    else {
                        return b.tsExpressionWithTypeArguments(b.identifier(baseName));
                    }
                }),
                body: b.tsInterfaceBody(ownFieldNames.map(function (fieldName) {
                    var field = typeDef.allFields[fieldName];
                    if (field.name === "type" && field.defaultFn) {
                        return b.tsPropertySignature(b.identifier("type"), b.tsTypeAnnotation(b.tsLiteralType(b.stringLiteral(field.defaultFn()))));
                    }
                    return b.tsPropertySignature(b.identifier(field.name), b.tsTypeAnnotation(getTSTypeAnnotation(field.type)));
                })),
            }));
        }), [
            b.exportNamedDeclaration(b.tsTypeAliasDeclaration(b.identifier("ASTNode"), b.tsUnionType(Object.keys(main_1.default.namedTypes)
                .filter(function (typeName) { return main_1.default.Type.def(typeName).buildable; })
                .map(function (typeName) { return b.tsTypeReference(b.identifier(typeName)); }))))
        ])),
    },
    {
        file: "namedTypes.ts",
        ast: moduleWithBody([
            b.importDeclaration([b.importSpecifier(b.identifier("Type"))], b.stringLiteral("../lib/types")),
            NODES_IMPORT,
            b.exportNamedDeclaration(b.tsInterfaceDeclaration(b.identifier("NamedTypes"), b.tsInterfaceBody(Object.keys(main_1.default.namedTypes).map(function (typeName) {
                return b.tsPropertySignature(b.identifier(typeName), b.tsTypeAnnotation(b.tsTypeReference(b.identifier("Type"), b.tsTypeParameterInstantiation([
                    b.tsTypeReference(b.tsQualifiedName(NODES_ID, b.identifier(typeName))),
                ]))));
            })))),
        ]),
    },
    {
        file: "builders.ts",
        ast: moduleWithBody([
            KINDS_IMPORT,
            NODES_IMPORT
        ].concat(builderTypeNames.map(function (typeName) {
            var typeDef = main_1.default.Type.def(typeName);
            var returnType = b.tsTypeAnnotation(b.tsTypeReference(b.tsQualifiedName(NODES_ID, b.identifier(typeName))));
            var buildParamAllowsUndefined = {};
            var buildParamIsOptional = {};
            typeDef.buildParams.slice().reverse().forEach(function (cur, i, arr) {
                var field = typeDef.allFields[cur];
                if (field && field.defaultFn) {
                    if (i === 0) {
                        buildParamIsOptional[cur] = true;
                    }
                    else {
                        if (buildParamIsOptional[arr[i - 1]]) {
                            buildParamIsOptional[cur] = true;
                        }
                        else {
                            buildParamAllowsUndefined[cur] = true;
                        }
                    }
                }
            });
            return b.exportNamedDeclaration(b.tsInterfaceDeclaration(b.identifier(typeName + "Builder"), b.tsInterfaceBody([
                b.tsCallSignatureDeclaration(typeDef.buildParams
                    .filter(function (buildParam) { return !!typeDef.allFields[buildParam]; })
                    .map(function (buildParam) {
                    var field = typeDef.allFields[buildParam];
                    var name = RESERVED_WORDS[buildParam] ? buildParam + "Param" : buildParam;
                    return b.identifier.from({
                        name: name,
                        typeAnnotation: b.tsTypeAnnotation(!!buildParamAllowsUndefined[buildParam]
                            ? b.tsUnionType([getTSTypeAnnotation(field.type), b.tsUndefinedKeyword()])
                            : getTSTypeAnnotation(field.type)),
                        optional: !!buildParamIsOptional[buildParam],
                    });
                }), returnType),
                b.tsMethodSignature(b.identifier("from"), [
                    b.identifier.from({
                        name: "params",
                        typeAnnotation: b.tsTypeAnnotation(b.tsTypeLiteral(Object.keys(typeDef.allFields)
                            .filter(function (fieldName) { return fieldName !== "type"; })
                            .sort() // Sort field name strings lexicographically.
                            .map(function (fieldName) {
                            var field = typeDef.allFields[fieldName];
                            return b.tsPropertySignature(b.identifier(field.name), b.tsTypeAnnotation(getTSTypeAnnotation(field.type)), field.defaultFn != null || field.hidden);
                        }))),
                    }),
                ], returnType),
            ])));
        }), [
            b.exportNamedDeclaration(b.tsInterfaceDeclaration(b.identifier("Builders"), b.tsInterfaceBody(builderTypeNames.map(function (typeName) {
                return b.tsPropertySignature(b.identifier(getBuilderName(typeName)), b.tsTypeAnnotation(b.tsTypeReference(b.identifier(typeName + "Builder"))));
            }).concat([
                b.tsIndexSignature([
                    b.identifier.from({
                        name: "builderName",
                        typeAnnotation: b.tsTypeAnnotation(b.tsStringKeyword()),
                    }),
                ], b.tsTypeAnnotation(b.tsAnyKeyword())),
            ])))),
        ])),
    },
    {
        file: "visitor.ts",
        ast: moduleWithBody([
            b.importDeclaration([b.importSpecifier(b.identifier("NodePath"))], b.stringLiteral("../lib/node-path")),
            b.importDeclaration([b.importSpecifier(b.identifier("Context"))], b.stringLiteral("../lib/path-visitor")),
            NODES_IMPORT,
            b.exportNamedDeclaration(b.tsInterfaceDeclaration.from({
                id: b.identifier("Visitor"),
                typeParameters: b.tsTypeParameterDeclaration([
                    b.tsTypeParameter("M", undefined, b.tsTypeLiteral([])),
                ]),
                body: b.tsInterfaceBody(Object.keys(main_1.default.namedTypes).map(function (typeName) {
                    return b.tsMethodSignature.from({
                        key: b.identifier("visit" + typeName),
                        parameters: [
                            b.identifier.from({
                                name: "this",
                                typeAnnotation: b.tsTypeAnnotation(b.tsIntersectionType([
                                    b.tsTypeReference(b.identifier("Context")),
                                    b.tsTypeReference(b.identifier("M")),
                                ])),
                            }),
                            b.identifier.from({
                                name: "path",
                                typeAnnotation: b.tsTypeAnnotation(b.tsTypeReference(b.identifier("NodePath"), b.tsTypeParameterInstantiation([
                                    b.tsTypeReference(b.tsQualifiedName(NODES_ID, b.identifier(typeName))),
                                ]))),
                            }),
                        ],
                        optional: true,
                        typeAnnotation: b.tsTypeAnnotation(b.tsAnyKeyword()),
                    });
                }).slice()),
            })),
        ]),
    },
];
out.forEach(function (_a) {
    var file = _a.file, ast = _a.ast;
    fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "../gen/" + file), recast_1.prettyPrint(ast, { tabWidth: 2, includeComments: true }).code);
});
function moduleWithBody(body) {
    return b.file.from({
        comments: [b.commentBlock(" !!! THIS FILE WAS AUTO-GENERATED BY `npm run gen` !!! ")],
        program: b.program(body),
    });
}
function getSupertypeToSubtypes() {
    var supertypeToSubtypes = {};
    Object.keys(main_1.default.namedTypes).map(function (typeName) {
        main_1.default.Type.def(typeName).supertypeList.forEach(function (supertypeName) {
            supertypeToSubtypes[supertypeName] = supertypeToSubtypes[supertypeName] || [];
            supertypeToSubtypes[supertypeName].push(typeName);
        });
    });
    return supertypeToSubtypes;
}
function getBuilderTypeNames() {
    return Object.keys(main_1.default.namedTypes).filter(function (typeName) {
        var typeDef = main_1.default.Type.def(typeName);
        var builderName = getBuilderName(typeName);
        return !!typeDef.buildParams && !!main_1.default.builders[builderName];
    });
}
function getBuildableSubtypes(supertype) {
    return Array.from(new Set(Object.keys(main_1.default.namedTypes).filter(function (typeName) {
        var typeDef = main_1.default.Type.def(typeName);
        return typeDef.allSupertypes[supertype] != null && typeDef.buildable;
    })));
}
function getTSTypeAnnotation(type) {
    switch (type.kind) {
        case "ArrayType": {
            var elemTypeAnnotation = getTSTypeAnnotation(type.elemType);
            // TODO Improve this test.
            return n.TSUnionType.check(elemTypeAnnotation)
                ? b.tsArrayType(b.tsParenthesizedType(elemTypeAnnotation))
                : b.tsArrayType(elemTypeAnnotation);
        }
        case "IdentityType": {
            if (type.value === null) {
                return b.tsNullKeyword();
            }
            switch (typeof type.value) {
                case "undefined":
                    return b.tsUndefinedKeyword();
                case "string":
                    return b.tsLiteralType(b.stringLiteral(type.value));
                case "boolean":
                    return b.tsLiteralType(b.booleanLiteral(type.value));
                case "number":
                    return b.tsNumberKeyword();
                case "object":
                    return b.tsObjectKeyword();
                case "function":
                    return b.tsFunctionType([]);
                case "symbol":
                    return b.tsSymbolKeyword();
                default:
                    return b.tsAnyKeyword();
            }
        }
        case "ObjectType": {
            return b.tsTypeLiteral(type.fields.map(function (field) {
                return b.tsPropertySignature(b.identifier(field.name), b.tsTypeAnnotation(getTSTypeAnnotation(field.type)));
            }));
        }
        case "OrType": {
            return b.tsUnionType(type.types.map(function (type) { return getTSTypeAnnotation(type); }));
        }
        case "PredicateType": {
            if (typeof type.name !== "string") {
                return b.tsAnyKeyword();
            }
            if (hasOwn.call(n, type.name)) {
                return b.tsTypeReference(b.tsQualifiedName(KINDS_ID, b.identifier(type.name + "Kind")));
            }
            if (/^[$A-Z_][a-z0-9_$]*$/i.test(type.name)) {
                return b.tsTypeReference(b.identifier(type.name));
            }
            if (/^number [<>=]+ \d+$/.test(type.name)) {
                return b.tsNumberKeyword();
            }
            // Not much else to do...
            return b.tsAnyKeyword();
        }
        default:
            return assertNever(type);
    }
}
function assertNever(x) {
    throw new Error("Unexpected: " + x);
}
