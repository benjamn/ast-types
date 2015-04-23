/// <reference path="../../ts/lib/types.d.ts"/>

// call this and cast to the desired type
function magic():any{}

// validate member properties and function return types by assigning to these variables
var boolean: boolean;
var string: string;
var number: number;
var stringArray: string[];

// dummy parameter values

// test subjects
var Type: AstTypes.TypeStatic = magic();
var type: AstTypes.TypeInstance = magic();
var def: AstTypes.DefInstance = magic();
var field: AstTypes.FieldInstance = magic();
var n: AstTypes.NamedTypes = magic();
var b: AstTypes.Builders = magic();
var bi: AstTypes.BuiltInTypes = magic();
var types: AstTypes.TypesExports = magic();
var defaultFn:()=>any;

// Begin Tests

// Type constructor and static methods
type = new Type(()=>true, 'myType');
type = Type.or(type, ()=> true, def, [type], [()=>true], [def], {
  "a": type,
  "b": () => true,
  "c": def,
  "d": [type],
  "e": [() => true],
  "f": [def]
});

type = Type.fromObject({
  "a": type,
  "b": () => true,
  "c": def,
  "d": [type],
  "e": [() => true],
  "f": [def],
  "g": {
    "a": type
  },
  "h": [{
    "a": type
  }]
});

type = Type.fromArray([type]);
type = Type.fromArray([def]);
type = Type.fromArray([()=>true]);

// Type instance members

type.check({type:'foo'});
type.check({type:'foo'}, true); // TODO: what is the deep parameter and how does it work?
type.assert({type:'foo'});
type.assert({type:'foo'}, true); // TODO: deep?
type = type.arrayOf();

string = def.typeName;
stringArray = def.baseNames;
field = def.ownFields['foo'];
type = def.allSuperTypes['foo'];
field = def.allFields['foo'];
stringArray = def.fieldNames;
type = def.type;
boolean = def.isSupertypeOf(def);
boolean = def.checkAllFields({});
boolean = def.check({type:'foo'});
boolean = def.check({type:'foo'}, true); // TODO: deep?
def = def.bases('foo');
def = def.bases('foo','bar');
boolean = def.buildable;
def = def.build('foo', 'bar');
def = def.field('foo', def);
def = def.field('foo', def, defaultFn);
def = def.field('foo', def, defaultFn, true);
def.finalize();

// Field
string = field.name;
type = field.type;
boolean = field.hidden;
defaultFn = field.defaultFn;
string = field.getValue({});
boolean = field.getValue({});
number = field.getValue({});

// BuiltInTypes
type = bi.string;
type = bi.function;
type = bi.array;
type = bi.object;
type = bi.RegExp;
type = bi.Date;
type = bi.number;
type = bi.boolean;
type = bi.null;
type = bi.undefined;

// TypesExports
Type = types.Type;
bi = types.builtInTypes;
n = types.namedTypes;
b = types.builders;

types.defineMethod('foo');
types.defineMethod('foo', ()=>'bar');
types.defineMethod('foo', ()=>3);
stringArray = types.getFieldNames({});
string = types.getFieldValue({}, 'foo');
number = types.getFieldValue({}, 'foo');
boolean = types.getFieldValue({}, 'foo');

types.eachField({}, (fieldName:string, value:any)=>null);
types.eachField({}, (fieldName:string, value:any)=>null, {});
boolean = types.someField({}, (fieldName:string, value:any)=>false, {});
stringArray = types.getSupertypeNames('foo');
types.finalize();

string = types.computeSupertypeLookupTable({})['foo'];
string = types.getBuilderName('foo');
