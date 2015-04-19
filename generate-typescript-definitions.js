var fs = require('fs');
var path = require('path');
var types = require('./main');
var n = types.namedTypes;
var def = types.Type.def;

var typeDeclarations = [];
var builders = [];
var namedTypes = [];
var visitorMethods = [];

Object.keys(n).forEach(function(typeName) {
    if (!typeName) return;
    var d = def(typeName);
    typeDeclarations.push(d.tsDeclaration);
    if (d.buildable) {
        builders.push(d.tsBuilder);
    }
    namedTypes.push(d.typeName + ": TypeInstance");
    visitorMethods.push("visit" + d.typeName + "?(path:NodePathInstance, ...additionalArgs)")
});

fs.writeFileSync(path.join(__dirname, 'typescript/def/generated.d.ts'),
    '/// <reference path="../lib/types.d.ts"/>\n' +
    '/// <reference path="../lib/node-path.d.ts"/>\n\n' +
    'declare module AstTypes {\n\n ' +

    typeDeclarations.join('\n\n ') +

    '\n\n export interface Builders {\n  ' +
       builders.join('\n  ') +
    '\n }\n\n' +

    ' export interface NamedTypes {\n  ' +
      namedTypes.join('\n  ') +
    '\n }\n\n' +

    ' export interface PathVisitorMethods {\n  ' +
      visitorMethods.join('\n  ') +
    '\n }\n}\n'
);


console.log();
