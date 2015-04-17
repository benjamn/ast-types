/// <reference path="node-path.d.ts"/>

// call this and cast to the desired type
function magic(...params:any[]):any{}

// validate member properties and function return types by assigning to these variables
var boolean: boolean;
var string: string;
var number: number;
var booleanArray: boolean[];
var stringArray: string[];
var numberArray: number[];
var pathArray: AstTypes.PathInstance[];
var node: {type:string};
var scope: AstTypes.ScopeInstance;

// test subjects
var Path: AstTypes.NodePathStatic = magic();
var path: AstTypes.NodePathInstance = magic();

// Begin Tests Unique To NodePath
node = path.node;
path = path.parent;
scope = path.scope;
boolean = path.needsParens();
boolean = path.needsParens(true);
boolean = path.canBeFirstInStatement();
boolean = path.firstInStatement();
path = path.prune();


// NOTE: ---- EVERYTHING BELOW COPIED FROM PATH TESTS ---
// don't edit this stuff copy and paste from path-test-ts.js
// TODO: automate?

// Scope constructor and static methods
path = new Path({type:'Comment'});
path = new Path({type:'Comment'}, path, 'comments');


// Instance properties
string = path.value;
number = path.value;
path = path.parentPath;
string = path.name;
number = path.name;


// Instance methods
string = path.getValueProperty('value');
boolean = path.getValueProperty(0);

path = path.get('left');
path = path.get(0);
path = path.get('left', 1);
path = path.get('left', 'comments', 3, 'value');
// currently allowed in javascript - but it doesn't make sens
path = path.get();  //TODO: disallow (in TypeScript? in JS?)

path.each((p:AstTypes.PathInstance):number => 3);
path.each((p:AstTypes.PathInstance):string => 'a');
path.each((p:AstTypes.PathInstance):void => {magic(p);});
path.each((p:AstTypes.PathInstance):void => {magic(p);}, {});

numberArray = path.map((p:AstTypes.PathInstance):number => 3);
stringArray = path.map((p:AstTypes.PathInstance):string => 'a');
booleanArray = path.map((p:AstTypes.PathInstance):boolean => true);
booleanArray = path.map((p:AstTypes.PathInstance):boolean => true, {});

pathArray = path.filter((p:AstTypes.PathInstance):boolean => true);
pathArray = path.filter((p:AstTypes.PathInstance):boolean => true, {});

string = path.shift();
boolean = path.shift();
number = path.shift();
string = path.pop();
boolean = path.pop();
number = path.pop();

number = path.unshift(3);
number = path.unshift('a');
number = path.unshift({type:'Line'});
number = path.unshift(3,'a', {type:'Block'});

number = path.push(3);
number = path.push('a');
number = path.push({type:'Line'});
number = path.push(3,'a', {type:'Block'});

path = path.insertAt(3, {type:'Block'});
path = path.insertAt(3, {type:'Block'}, {type:'Line'});

path = path.insertBefore({type:'Block'});
path = path.insertBefore({type:'Block'}, {type:'Line'});
path = path.insertAfter({type:'Block'});
path = path.insertAfter({type:'Block'}, {type:'Line'});

pathArray = path.replace({type:'Block'});
pathArray = path.replace({type:'Block'}, {type:'Line'});
