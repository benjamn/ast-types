var types = require("../main");
var n = types.namedTypes;
var b = types.builders;
var path = require("path");
var fs = require("fs");
var esprima = require("esprima");
var esprimaSyntax = esprima.Syntax;
var parse = esprima.parse;

exports.testBasic = function(t, assert) {
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

    t.finish();
};

exports.testIsSupertypeOf = function(t, assert) {
    var def = types.Type.def;

    assert.ok(def("Node").isSupertypeOf(def("Node")));
    assert.ok(def("Node").isSupertypeOf(def("Expression")));
    assert.ok(!def("Expression").isSupertypeOf(def("Node")));
    assert.ok(!def("Expression").isSupertypeOf(
        def("DebuggerStatement")));

    // TODO Make this test case more exhaustive.

    t.finish();
};

exports.testShallowAndDeepChecks = function(t, assert) {
    var index = b.identifier("foo");
    var decl = b.variableDeclaration(
        "var", [b.variableDeclarator(
            index, b.literal(42))]);

    assert.ok(n.Node.check(decl));
    assert.ok(n.Statement.check(decl));
    assert.ok(n.Declaration.check(decl));
    assert.ok(n.VariableDeclaration.check(decl));

    assert.ok(n.Node.check(decl, true));
    assert.ok(n.Statement.check(decl, true));
    assert.ok(n.Declaration.check(decl, true));
    assert.ok(n.VariableDeclaration.check(decl, true));

    // Not an Expression.
    assert.ok(!n.Expression.check(decl));

    // This makes decl cease to conform to n.VariableDeclaration.
    decl.declarations.push(b.literal("bar"));

    assert.ok(n.Node.check(decl));
    assert.ok(n.Statement.check(decl));
    assert.ok(n.Declaration.check(decl));
    assert.ok(n.VariableDeclaration.check(decl));

    assert.ok(!n.Node.check(decl, true));
    assert.ok(!n.Statement.check(decl, true));
    assert.ok(!n.Declaration.check(decl, true));

    // As foretold above.
    assert.ok(!n.VariableDeclaration.check(decl, true));

    // Still not an Expression.
    assert.ok(!n.Expression.check(decl));

    var fs = b.forStatement(
        decl,
        b.binaryExpression("<", index, b.literal(48)),
        b.updateExpression("++", index, true),
        b.blockStatement([
            b.expressionStatement(
                b.callExpression(index, []))
        ]));

    assert.ok(n.Node.check(fs));
    assert.ok(n.Statement.check(fs));
    assert.ok(n.ForStatement.check(fs));

    // Not a true ForStatement because fs.init is not a true
    // VariableDeclaration.
    assert.ok(!n.Node.check(fs, true));
    assert.ok(!n.Statement.check(fs, true));
    assert.ok(!n.ForStatement.check(fs, true));

    t.finish();
};

function validateProgram(file) {
    var fullPath = path.join(__dirname, "..", file);

    exports["test " + file] = function(t, assert) {
        fs.readFile(fullPath, "utf8", function(err, code) {
            if (err) throw err;

            assert.ok(n.Program.check(parse(code), true));
            assert.ok(n.Program.check(parse(code, { loc: true }), true));

            t.finish();
        });
    };
}

validateProgram("main.js");
validateProgram("lib/shared.js");
validateProgram("def/core.js");
validateProgram("lib/types.js");
validateProgram("test/run.js");
validateProgram("test/data/backbone.js");
validateProgram("test/data/jquery-1.9.1.js");

exports.testEsprimaSyntaxBuildability = function(t, assert) {
    var def = types.Type.def;
    var todo = {
        ClassBody: true,
        ClassDeclaration: true,
        ClassExpression: true,
        ClassHeritage: true,
        ComprehensionBlock: true,
        ComprehensionExpression: true,
        ExportDeclaration: true,
        ExportSpecifier: true,
        ExportSpecifierSet: true,
        Glob: true,
        ImportDeclaration: true,
        ImportSpecifier: true,
        TaggedTemplateExpression: true,
        TemplateElement: true,
        TemplateLiteral: true
    };

    Object.keys(esprimaSyntax).forEach(function(name) {
        if (todo[name] === true) return;
        assert.ok(n.hasOwnProperty(name), name);
    });

    Object.keys(n).forEach(function(name) {
        if (name in esprimaSyntax)
            assert.ok(def(name).buildable, name);
    });

    t.finish();
};

exports.testGetFieldValue = function(t, assert) {
    assert.strictEqual(
        types.getFieldValue({
            type: "CatchClause"
        }, "guard"),
        null
    );

    assert.strictEqual(
        types.getFieldValue({
            type: "CatchClause"
        }, "asdf"),
        void 0
    );

    assert.strictEqual(
        types.getFieldValue({
            type: "CatchClause"
        }, "type"),
        "CatchClause"
    );

    assert.strictEqual(
        types.getFieldValue({
            type: "CatchClause",
            guard: b.identifier("test")
        }, "guard").name,
        "test"
    );

    assert.deepEqual(
        types.getFieldValue({
            type: "TryStatement",
        }, "handler"),
        null
    );

    assert.deepEqual(
        types.getFieldValue({
            type: "TryStatement",
        }, "handlers"),
        []
    );

    assert.deepEqual(
        types.getFieldValue({
            type: "TryStatement",
        }, "guardedHandlers"),
        []
    );

    assert.deepEqual(
        types.getFieldValue({
            type: "TryStatement",
            guardedHandlers: void 0
        }, "guardedHandlers"),
        []
    );

    t.finish();
};

exports.testEachField = function(t, assert) {
    var context = {};

    function check(node, names) {
        var seen = [];

        types.eachField(node, function(name, value) {
            assert.strictEqual(this, context);
            if (name === "type")
                assert.strictEqual(node.type, value);
            seen.push(name);
        }, context);

        assert.deepEqual(seen.sort(), names.sort());
    }

    check({ type: "Expression" }, [
        "type", "loc"
    ]);

    check({ type: "SourceLocation" }, [
        "type", "start", "end", "source"
    ]);

    check({ type: "TryStatement" }, [
        // Note that the "handlers" field is now hidden from eachField.
        "type", "block", "handler", "guardedHandlers", "finalizer", "loc"
    ]);

    check({ type: "CatchClause" }, [
        "type", "param", "guard", "body", "loc"
    ]);

    check({ type: "asdf" }, []);

    t.finish();
};

exports.testTraverse = function(t, assert) {
    var traverse = types.traverse;

    var call = b.expressionStatement(
        b.callExpression(
            b.memberExpression(
                b.identifier("foo"),
                b.identifier("bar"),
                false
            ),
            [b.literal("baz")]
        )
    );

    var ts = b.tryStatement(
        b.blockStatement([call, call]),
        b.catchClause(
            b.identifier("err"),
            null,
            b.blockStatement([])
        )
    );

    var literalCount = 0;

    traverse(ts, function(node) {
        if (n.Literal.check(node)) {
            literalCount += 1;
            assert.strictEqual(node.value, "baz");
            assert.strictEqual(this.parent.node, call.expression);
            assert.strictEqual(this.parent.parent.node, call);
            assert.strictEqual(this.parent.parent.parent.node, ts.block);
            assert.strictEqual(this.parent.parent.parent.parent.node, ts);
            assert.strictEqual(this.parent.parent.parent.parent.parent, null);
        }
    });

    assert.strictEqual(literalCount, 2);

    t.finish();
};
