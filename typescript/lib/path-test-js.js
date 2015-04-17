/*
 Visual test for `path.d.ts` in javascript.

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
/** @type boolean[] **/ var booleanArray;
/** @type string[] **/ var stringArray;
/** @type number[] **/ var numberArray;

// callback params

/**
 * @param {AstTypes.PathInstance}path
 * @returns {string}
 */
function mapPathToString(path){return 'a';}

/**
 * @param {AstTypes.PathInstance}path
 * @returns {number}
 */
function mapPathToNumber(path){return 2;}

/**
 * @param {AstTypes.PathInstance}path
 * @returns {boolean}
 */
function mapPathToBoolean(path){return true;}

/**
 * @param {number}num
 * @returns {string}
 */
function mapNumberToString(num){return 'a';}

// test subjects;
/** @type AstTypes.PathStatic **/ var Path = magic();
/** @type AstTypes.PathInstance **/ var path = magic();

// Begin Tests

// Scope constructor and static methods
path = new Path({type:'Comment'});                          //https://youtrack.jetbrains.com/issue/WEB-15899
path = new Path({type:'Comment'}, path, 'comments');

// Instance properties
string = path.value;
number = path.value;
path = path.parentPath;
string = path.parentPath; //bad
string = path.name;
number = path.name;

// Instance methods
string = path.getValueProperty('value');
boolean = path.getValueProperty(3);
string = path.getValueProperty(true); // bad

path = path.get('left');
path = path.get(3);
path = path.get('left', 1);
path = path.get('left', 'comments', 3, 'value');
path = path.get(true); // bad
path = path.get('left', false); // bad
path = path.get(); //TODO: This doesn't make sense

path.each(mapPathToBoolean);
path.each(mapPathToString);
path.each(mapNumberToString); // bad  -- TODO: FAILS in WS - report bug

numberArray = path.map(mapPathToString); // bad -- TODO: FAILS in WS - report bug

path.insertAt(3, {type:'Comment'});
path.insertAt('3', {type:'Comment'});  // bad

// TODO: shift, unshift, push, pop
// high degree of confidence these work, and there parameters/return values are `any` so there's not much to test

// TODO: insertBefore, insertAfter, replace, map filter, shift, unshift, push, pop
// WS does not type checking on callback parameter/return values
// most of these are not going to produce worthwhile results
