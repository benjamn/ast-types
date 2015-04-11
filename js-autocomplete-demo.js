
/** @type AstTypes.Base */
var types = require('ast-types');

var b = types.builders;


var hello = b.identifier('hello');
var world = b.identifier('world');
var returnHello = b.returnStatement(hello);

var assign = b.assignmentExpression('=', hello, world);
