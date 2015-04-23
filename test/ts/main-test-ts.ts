/// <reference path="../../ts/main.d.ts"/>

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
var PathVisitor:AstTypes.PathVisitorStatic = magic();
var path: AstTypes.NodePathInstance = magic();
var defaultFn:()=>any;

var types:AstTypes.Base = magic();

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

PathVisitor = types.PathVisitor;
path = types.visit({type:'foo'}, {});

