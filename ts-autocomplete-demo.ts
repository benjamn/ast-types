/// <reference path="typings/tsd.d.ts"/>
/// <reference path="typescript/main.d.ts"/>

var types:AstTypes.Base = require('ast-types');

var b = types.builders;

var assign:AstTypes.AssignmentExpressionType = b.assignmentExpression(
  '=',
  b.identifier('a'),
  b.binaryExpression('+', b.identifier('b'), b.identifier('c'))
);

types.visit({},{
  visitAnyTypeAnnotation(path:AstTypes.NodePathInstance){
    this.traverse(path);
  }
});

b.templateElement({cooked:"foo", raw:"bar"}, true);