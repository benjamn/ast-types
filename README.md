AST Types
===

This module provides an efficient, modular,
[Esprima](https://github.com/ariya/esprima)-compatible implementation of
the [abstract syntax
tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree) type hierarchy
pioneered by the [Mozilla Parser
API](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API).

Installation
---

From NPM:

    npm install ast-types

From GitHub:

    cd path/to/node_modules
    git clone git://github.com/benjamn/ast-types.git
    cd ast-types
    npm install .

Basic Usage
---

    var n = require("ast-types").namedTypes;
    var b = require("ast-types").builders;

    var fooId = b.identifier("foo");
    var ifFoo = b.ifStatement(fooId, b.blockStatement([
        b.expressionStatement(b.callExpression(fooId, []))
    ]));

    assert.ok(n.IfStatement.check(ifFoo));
    assert.ok(n.Statement.check(ifFoo));
    assert.ok(n.Node.check(ifFoo));

    assert.ok(n.BlockStatement.check(ifFoo.consequent));
    assert.strictEqual(
        ifFoo.consequent.body[0].expression.arguments.length,
        0);

    assert.strictEqual(ifFoo.test, fooId);
    assert.ok(n.Expression.check(ifFoo.test));
    assert.ok(n.Identifier.check(ifFoo.test));
    assert.ok(!n.Statement.check(ifFoo.test));
