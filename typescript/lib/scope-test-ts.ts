/// <reference path="scope.d.ts"/>

// call this and cast to the desired type
function magic():any{}

// validate member properties and function return types by assigning to these variables
var boolean: boolean;
var string: string;
var number: number;
var bindings: {[name:string]: AstTypes.NodePathInstance};

// dummy parameter values
var nodePath: AstTypes.NodePathInstance = magic();
var identifier: AstTypes.IdentifierType = magic();
var expression: AstTypes.ExpressionType = magic();

// test subjects
var Scope: AstTypes.ScopeStatic = magic();
var scope: AstTypes.ScopeInstance = magic();

// Begin Tests

// Scope constructor and static methods
scope = new Scope(nodePath);
scope = new Scope(nodePath, scope);

boolean = Scope.isEstablishedBy({});

// Scope instance methods
boolean = scope.declares("foo");

identifier = scope.declareTemporary();
identifier = scope.declareTemporary("bar");

identifier = scope.injectTemporary();
identifier = scope.injectTemporary(identifier);
identifier = scope.injectTemporary(identifier, expression);

scope.scan();
scope.scan(true);

bindings = scope.getBindings();
nodePath = bindings["foo"];

scope = scope.lookup("bar");

scope = scope.getGlobalScope();

// Scope instance properties
nodePath = scope.path;
var node = scope.node; //currently node is type "any"
boolean = scope.isGlobal;
number = scope.depth;
scope = scope.parent;
bindings = scope.bindings;
