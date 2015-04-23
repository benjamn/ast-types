/// <reference path="../../ts/lib/path-visitor.d.ts"/>

// call this and cast to the desired type
function magic(...params:any[]):any{}

// validate member properties and function return types by assigning to these variables
var boolean: boolean;
var string: string;
var number: number;
var path: AstTypes.NodePathInstance;
var ctx: AstTypes.PathVisitorContext;
var methods: AstTypes.PathVisitorMethods;

// test subjects
var PathVisitor: AstTypes.PathVisitorStatic = magic();
var pathVisitor: AstTypes.PathVisitorInstance = magic();

// Static methods and constructor
pathVisitor = new PathVisitor();
pathVisitor = PathVisitor.fromMethodsObject({});
pathVisitor = PathVisitor.fromMethodsObject(pathVisitor);

path = PathVisitor.visit({}, {
  visitReturnStatement: (path:AstTypes.NodePathInstance) => {
    path = this.traverse(path, pathVisitor);
  }
});

ctx.abort();
path = ctx.visit(path);
path = ctx.visit(path, {});
path = ctx.traverse(path);
path = ctx.traverse(path, {});
path = ctx.traverse(path, pathVisitor);
string = ctx.invokeVisitorMethod('hello');
boolean = ctx.invokeVisitorMethod('hello');
ctx = ctx.reset(path);

pathVisitor.visit(path);
pathVisitor.visit(path, 'arg1', 3);

var abortRequest = new pathVisitor.AbortRequest();
abortRequest.cancel();

pathVisitor.abort();

pathVisitor.reset(path, 'arg1', 2, 'arg3');
pathVisitor.visitWithoutRest(path);
ctx = pathVisitor.acquireContext(path);
pathVisitor.releaseContext(ctx);
pathVisitor.reportChanged();
boolean = pathVisitor.wasChangeReported();
