/// <reference path="typings/tsd.d.ts"/>

/// <reference path="typescript/ast-types.d.ts"/>

var types:AstTypes.Base = require('ast-types');

var b = types.builders;

var hello = b.identifier('hello');
var world = b.identifier('world');
var returnHello = b.returnStatement(hello);

var assign = b.assignmentExpression('=', hello, world);

var x:Array<string>  = [];
