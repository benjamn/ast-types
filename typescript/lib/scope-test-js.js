/*
  Visual test for `scope.d.ts` in javascript.

  Basically we are validating that our typescript definitions provide value for
  javascript developers. We include nonsensical usages, both for assignments and
  and method parameters and ensure WebStorm complains about them. This differs
  from our typescript validation tests (which do not contain incorrect uses).
  We are trying to validate that we have supplied enough information for WebStorm
  to figure out the type (and that it hasn't silently given up).

  With the correct inspections turned on, WebStorm SHOULD complain about:
    * any line followed with a `// bad` comment
    * all lines following a `// bad` comment until a blank line occurs
 */


//dummy function to eliminate WebStorm complaining about uninitialized variables
function magic(){return function(){}}

// validate member properties and function return types by assigning to these variables
/** @type boolean **/ var boolean;
/** @type string **/ var string;
/** @type number **/ var number;

// dummy parameter values
/** @type AstTypes.NodePathInstance **/ var nodePath = magic();
/** @type AstTypes.IdentifierType **/ var identifier = magic();
/** @type AstTypes.ExpressionType **/ var expression = magic();

// test subjects;
/** @type AstTypes.ScopeStatic **/ var Scope = magic();
/** @type AstTypes.ScopeInstance **/ var scope = magic();

// Scope constructor and static methods
//scope = new Scope(nodePath);            // Webstorm complains about this.
//scope = new Scope(nodePath, scope);     // https://youtrack.jetbrains.com/issue/WEB-15899
boolean = Scope.isEstablishedBy({});
string = Scope.isEstablishedBy({});  //bad

// Scope instance methods
boolean = scope.declares("foo");
string = scope.declares("foo"); //bad

identifier = scope.declareTemporary();
identifier = scope.declareTemporary("bar");
identifier = scope.declareTemporary(3); //bad - method argument
number = scope.declareTemporary("bar"); //bad - return type

identifier = scope.injectTemporary();
identifier = scope.injectTemporary(identifier);
identifier = scope.injectTemporary(identifier, expression);
identifier = scope.injectTemporary("3"); //bad - argument
number = scope.injectTemporary(); //bad - return type

scope.scan();
scope.scan(true);

nodePath = scope.getBindings()["foo"];
number = scope.getBindings()["foo"]; //bad - return type

scope = scope.lookup("bar");
nodePath = scope.lookup("bar"); //bad - return type

scope = scope.getGlobalScope();

// Scope instance properties
nodePath = scope.path;
var node = scope.node; //currently node is type "any"
boolean = scope.isGlobal;
number = scope.depth;
scope = scope.parent;
bindings = scope.bindings;

