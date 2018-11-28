import { Fork, Omit } from "../types";

var Ap = Array.prototype;
var slice = Ap.slice;
var Op = Object.prototype;
var objToStr = Op.toString;
var hasOwn = Op.hasOwnProperty;

declare const __typeBrand: unique symbol;

export type CheckFn<T> = (value: any, deep?: any) => value is T;
export type AnyCheckFn = (value: any, deep?: any) => boolean;

export type AssertFn<T> = (value: any, deep?: any) => value is T;
export type AnyAssertFn = (value: any, deep?: any) => boolean;

export type NameType = string | (() => string);

function shallowStringify(value: any): string {
  if (Array.isArray(value)) {
    return "[" + value.map(shallowStringify).join(", ") + "]";
  }

  if (value && typeof value === "object") {
    return "{ " + Object.keys(value).map(function (key) {
      return key + ": " + value[key];
    }).join(", ") + " }";
  }

  return JSON.stringify(value);
}

abstract class AbstractType<T> {
  abstract toString(): string;
  abstract check(value: any, deep?: any): value is T;

  assert(value: any, deep?: any): value is T {
    if (!this.check(value, deep)) {
      var str = shallowStringify(value);
      throw new Error(str + " does not match type " + this);
    }
    return true;
  }

  static or(..._types: any[]): AbstractType<any> {
    throw new Error("not implemented");
  }

  static from(_value: any, _name?: string): AbstractType<any> {
    throw new Error("not implemented");
  }

  static def(_typeName: string): Def {
    throw new Error("not implemented");
  }
}

export { AbstractType as Type }

export type AnyType = Omit<AbstractType<any>, "check" | "assert" | typeof __typeBrand> & {
  check: AnyCheckFn;
  assert: AnyAssertFn;
};

export interface Def {
  typeName: string;
  baseNames: any[];
  ownFields: any;
  allSupertypes: any;
  supertypeList: string[];
  allFields: { [fieldName: string]: Field<any>; };
  fieldNames: string[];
  type: AbstractType<any>;
  isSupertypeOf(that: any): any;
  checkAllFields(value: any, deep?: any): boolean;
  check(value: any, deep?: any): boolean;
  bases(...args: any[]): this;
  buildable: boolean;
  buildParams: string[];
  build(...args: any[]): this;
  field(name: string, type: any, defaultFn?: Function, hidden?: boolean): this;
  finalized: boolean;
  finalize(): void;
}

export interface DefConstructor {
  new(typeName: string): Def;
  fromValue(value: any): any;
}

export class Field<T = any> {
  constructor(
    public name: string,
    public type: AbstractType<T>,
    private defaultFn?: Function,
    public hidden?: boolean,
  ) {
    this.hidden = !!hidden;
  }

  toString() {
    return JSON.stringify(this.name) + ": " + this.type;
  }

  getValue(obj: { [key: string]: any }) {
    var value = obj[this.name];

    if (typeof value !== "undefined") {
      return value;
    }

    if (typeof this.defaultFn === "function") {
      value = this.defaultFn.call(obj);
    }

    return value;
  }
}

export interface ASTNode {
  type: string;
}

export interface Builder {
  (...args: any[]): ASTNode;
  from(obj: { [param: string]: any }): ASTNode;
}

export default function typesPlugin(_fork?: Fork) {
  // A type is an object with a .check method that takes a value and returns
  // true or false according to whether the value matches the type.

  abstract class Type<T> extends AbstractType<T> {
    static or(...types: any[]) {
      return new OrType<any>(types.map(type => Type.from(type)));
    }

    static from(value: any, name?: string): AbstractType<any> {
      if (value instanceof Type) {
        return value;
      }

      // The Def type is used as a helper for constructing compound
      // interface types for AST nodes.
      if (value instanceof Def) {
        return value.type;
      }

      // Support [ElemType] syntax.
      if (isArray.check(value)) {
        if (value.length !== 1) {
          throw new Error("only one element type is permitted for typed arrays");
        }
        return new ArrayType(Type.from(value[0]));
      }

      // Support { someField: FieldType, ... } syntax.
      if (isObject.check(value)) {
        return new ObjectType(Object.keys(value).map(
          name => new Field(name, Type.from(value[name], name))
        ));
      }

      if (typeof value === "function") {
        var bicfIndex = builtInCtorFns.indexOf(value);
        if (bicfIndex >= 0) {
          return builtInCtorTypes[bicfIndex];
        }

        if (typeof name !== "string") {
          throw new Error("missing name");
        }

        return new PredicateType(value, name);
      }

      // As a last resort, toType returns a type that matches any value that
      // is === from. This is primarily useful for literal values like
      // toType(null), but it has the additional advantage of allowing
      // toType to be a total function.
      return new IdentityType(value);
    }

    // Define a type whose name is registered in a namespace (the defCache) so
    // that future definitions will return the same type given the same name.
    // In particular, this system allows for circular and forward definitions.
    // The Def object d returned from Type.def may be used to configure the
    // type d.type by calling methods such as d.bases, d.build, and d.field.
    static def(typeName: string): Def {
      return hasOwn.call(defCache, typeName)
        ? defCache[typeName]
        : defCache[typeName] = new Def(typeName);
    }
  }

  class IdentityType<T> extends Type<T> {
    constructor(private value: T) {
      super();
    }

    check(value: any, deep?: any): value is T {
      const result = value === this.value;
      if (! result && typeof deep === "function") {
        deep(this, value);
      }
      return result;
    }

    toString() {
      return String(this.value);
    }
  }

  class PredicateType<T> extends Type<T> {
    constructor(
      private predicate: AnyCheckFn,
      private name: string,
    ) {
      super();
    }

    check(value: any, deep?: any): value is T {
      const result = this.predicate(value, deep);
      if (! result && typeof deep === "function") {
        deep(this, value);
      }
      return result;
    }

    toString() {
      return this.name;
    }
  }

  class OrType<T> extends Type<T> {
    constructor(private types: Type<any>[]) {
      super();
    }

    check(value: any, deep?: any): value is T {
      return this.types.some(type => {
        return type.check(value, deep);
      });
    }

    toString() {
      return this.types.join(" | ");
    }
  }

  class ArrayType<T> extends Type<T[]> {
    constructor(private elemType: Type<T>) {
      super();
    }

    check(value: any, deep?: any): value is T[] {
      return Array.isArray(value) &&
        value.every(elem => this.elemType.check(elem, deep));
    }

    toString() {
      return "[" + this.elemType + "]";
    }
  }

  class ObjectType<T> extends Type<T> {
    constructor(private fields: Field<any>[]) {
      super();
    }

    check(value: any, deep?: any): value is T {
      return isObject.check(value) &&
        this.fields.every(field => field.type.check(value[field.name], deep));
    }

    toString() {
      return "{ " + this.fields.join(", ") + " }";
    }
  }

  var builtInCtorFns: Function[] = [];
  var builtInCtorTypes: PredicateType<any>[] = [];

  type BuiltInTypes = {
    string: typeof isString;
    function: typeof isFunction;
    array: typeof isArray;
    object: typeof isObject;
    RegExp: typeof isRegExp;
    Date: typeof isDate;
    number: typeof isNumber;
    boolean: typeof isBoolean;
    null: typeof isNull;
    undefined: typeof isUndefined;
  };
  var builtInTypes = {} as BuiltInTypes;

  function defBuiltInType<T>(example: T, name: keyof BuiltInTypes): AbstractType<T> {
    const objStr = objToStr.call(example);

    const type = new PredicateType<T>(
      value => objToStr.call(value) === objStr,
      name,
    );

    builtInTypes[name] = type;

    if (example && typeof example.constructor === "function") {
      builtInCtorFns.push(example.constructor);
      builtInCtorTypes.push(type);
    }

    return type;
  }

  // These types check the underlying [[Class]] attribute of the given
  // value, rather than using the problematic typeof operator. Note however
  // that no subtyping is considered; so, for instance, isObject.check
  // returns false for [], /./, new Date, and null.
  var isString = defBuiltInType<string>("truthy", "string");
  var isFunction = defBuiltInType<Function>(function () {}, "function");
  var isArray = defBuiltInType<any[]>([], "array");
  var isObject = defBuiltInType<{ [key: string]: any }>({}, "object");
  var isRegExp = defBuiltInType<RegExp>(/./, "RegExp");
  var isDate = defBuiltInType<Date>(new Date, "Date");
  var isNumber = defBuiltInType<number>(3, "number");
  var isBoolean = defBuiltInType<boolean>(true, "boolean");
  var isNull = defBuiltInType<null>(null, "null");
  var isUndefined = defBuiltInType<undefined>(void 0, "undefined");

  // In order to return the same Def instance every time Type.def is called
  // with a particular name, those instances need to be stored in a cache.
  var defCache = Object.create(null);

  const Def = function Def(this: any, typeName: string) {
    var self: Def = this;

    if (!(self instanceof Def)) {
      throw new Error("Def constructor cannot be invoked without 'new'");
    }

    Object.defineProperties(self, {
      typeName: {value: typeName},
      baseNames: {value: []},
      ownFields: {value: Object.create(null)},

      // These two are populated during finalization.
      allSupertypes: {value: Object.create(null)}, // Includes own typeName.
      supertypeList: {value: []}, // Linear inheritance hierarchy.
      allFields: {value: Object.create(null)}, // Includes inherited fields.
      fieldNames: {value: []}, // Non-hidden keys of allFields.

      type: {
        value: new PredicateType(
          (value, deep) => self.check(value, deep),
          typeName,
        ),
      }
    });
  } as any as DefConstructor;

  Def.fromValue = function (value) {
    if (value && typeof value === "object") {
      var type = value.type;
      if (typeof type === "string" &&
        hasOwn.call(defCache, type)) {
        var d = defCache[type];
        if (d.finalized) {
          return d;
        }
      }
    }

    return null;
  };

  var Dp: Def = Def.prototype;

  Dp.isSupertypeOf = function (that) {
    if (that instanceof Def) {
      if (this.finalized !== true ||
        that.finalized !== true) {
        throw new Error("");
      }
      return hasOwn.call(that.allSupertypes, this.typeName);
    } else {
      throw new Error(that + " is not a Def");
    }
  };

  // Note that the list returned by this function is a copy of the internal
  // supertypeList, *without* the typeName itself as the first element.
  function getSupertypeNames(typeName: any) {
    if (!hasOwn.call(defCache, typeName)) {
      throw new Error("");
    }
    var d = defCache[typeName];
    if (d.finalized !== true) {
      throw new Error("");
    }
    return d.supertypeList.slice(1);
  };

  // Returns an object mapping from every known type in the defCache to the
  // most specific supertype whose name is an own property of the candidates
  // object.
  function computeSupertypeLookupTable(candidates: any) {
    var table: { [typeName: string ]: any } = {};
    var typeNames = Object.keys(defCache);
    var typeNameCount = typeNames.length;

    for (var i = 0; i < typeNameCount; ++i) {
      var typeName = typeNames[i];
      var d = defCache[typeName];
      if (d.finalized !== true) {
        throw new Error("" + typeName);
      }
      for (var j = 0; j < d.supertypeList.length; ++j) {
        var superTypeName = d.supertypeList[j];
        if (hasOwn.call(candidates, superTypeName)) {
          table[typeName] = superTypeName;
          break;
        }
      }
    }

    return table;
  };

  Dp.checkAllFields = function (value, deep) {
    var allFields = this.allFields;
    if (this.finalized !== true) {
      throw new Error("" + this.typeName);
    }

    function checkFieldByName(name: string | number) {
      var field = allFields[name];
      var type = field.type;
      var child = field.getValue(value);
      return type.check(child, deep);
    }

    return isObject.check(value)
      && Object.keys(allFields).every(checkFieldByName);
  };

  Dp.check = function (value, deep) {
    if (this.finalized !== true) {
      throw new Error(
        "prematurely checking unfinalized type " + this.typeName
      );
    }

    // A Def type can only match an object value.
    if (!isObject.check(value))
      return false;

    var vDef = Def.fromValue(value);
    if (!vDef) {
      // If we couldn't infer the Def associated with the given value,
      // and we expected it to be a SourceLocation or a Position, it was
      // probably just missing a "type" field (because Esprima does not
      // assign a type property to such nodes). Be optimistic and let
      // this.checkAllFields make the final decision.
      if (this.typeName === "SourceLocation" ||
        this.typeName === "Position") {
        return this.checkAllFields(value, deep);
      }

      // Calling this.checkAllFields for any other type of node is both
      // bad for performance and way too forgiving.
      return false;
    }

    // If checking deeply and vDef === this, then we only need to call
    // checkAllFields once. Calling checkAllFields is too strict when deep
    // is false, because then we only care about this.isSupertypeOf(vDef).
    if (deep && vDef === this)
      return this.checkAllFields(value, deep);

    // In most cases we rely exclusively on isSupertypeOf to make O(1)
    // subtyping determinations. This suffices in most situations outside
    // of unit tests, since interface conformance is checked whenever new
    // instances are created using builder functions.
    if (!this.isSupertypeOf(vDef))
      return false;

    // The exception is when deep is true; then, we recursively check all
    // fields.
    if (!deep)
      return true;

    // Use the more specific Def (vDef) to perform the deep check, but
    // shallow-check fields defined by the less specific Def (this).
    return vDef.checkAllFields(value, deep)
      && this.checkAllFields(value, false);
  };

  Dp.bases = function () {
    var args = slice.call(arguments);
    var bases = this.baseNames;

    if (this.finalized) {
      if (args.length !== bases.length) {
        throw new Error("");
      }
      for (var i = 0; i < args.length; i++) {
        if (args[i] !== bases[i]) {
          throw new Error("");
        }
      }
      return this;
    }

    args.forEach(function (baseName: any) {
      isString.assert(baseName);

      // This indexOf lookup may be O(n), but the typical number of base
      // names is very small, and indexOf is a native Array method.
      if (bases.indexOf(baseName) < 0)
        bases.push(baseName);
    });

    return this; // For chaining.
  };

  // False by default until .build(...) is called on an instance.
  Object.defineProperty(Dp, "buildable", {value: false});

  var builders: { [name: string]: Builder } = {};

  // This object is used as prototype for any node created by a builder.
  var nodePrototype: { [definedMethod: string]: Function } = {};

  // Call this function to define a new method to be shared by all AST
   // nodes. The replaced method (if any) is returned for easy wrapping.
  function defineMethod(name: any, func?: Function) {
    var old = nodePrototype[name];

    // Pass undefined as func to delete nodePrototype[name].
    if (isUndefined.check(func)) {
      delete nodePrototype[name];

    } else {
      isFunction.assert(func);

      Object.defineProperty(nodePrototype, name, {
        enumerable: true, // For discoverability.
        configurable: true, // For delete proto[name].
        value: func
      });
    }

    return old;
  };

  var isArrayOfString = new ArrayType(isString);

  // Calling the .build method of a Def simultaneously marks the type as
  // buildable (by defining builders[getBuilderName(typeName)]) and
  // specifies the order of arguments that should be passed to the builder
  // function to create an instance of the type.
  Dp.build = function (/* param1, param2, ... */) {
    var self = this;

    var newBuildParams = slice.call(arguments);
    isArrayOfString.assert(newBuildParams);

    // Calling Def.prototype.build multiple times has the effect of merely
    // redefining this property.
    Object.defineProperty(self, "buildParams", {
      value: newBuildParams,
      writable: false,
      enumerable: false,
      configurable: true
    });

    if (self.buildable) {
      // If this Def is already buildable, update self.buildParams and
      // continue using the old builder function.
      return self;
    }

    // Every buildable type will have its "type" field filled in
    // automatically. This includes types that are not subtypes of Node,
    // like SourceLocation, but that seems harmless (TODO?).
    self.field("type", String, function () { return self.typeName });

    // Override Dp.buildable for this Def instance.
    Object.defineProperty(self, "buildable", {value: true});

    function addParam(built: any, param: any, arg: any, isArgAvailable: boolean) {
      if (hasOwn.call(built, param))
        return;

      var all = self.allFields;
      if (!hasOwn.call(all, param)) {
        throw new Error("" + param);
      }

      var field = all[param];
      var type = field.type;
      var value;

      if (isArgAvailable) {
        value = arg;
      } else if (field.defaultFn) {
        // Expose the partially-built object to the default
        // function as its `this` object.
        value = field.defaultFn.call(built);
      } else {
        var message = "no value or default function given for field " +
          JSON.stringify(param) + " of " + self.typeName + "(" +
          self.buildParams.map(function (name) {
            return all[name];
          }).join(", ") + ")";
        throw new Error(message);
      }

      if (!type.check(value)) {
        throw new Error(
          shallowStringify(value) +
          " does not match field " + field +
          " of type " + self.typeName
        );
      }

      built[param] = value;
    }

    // Calling the builder function will construct an instance of the Def,
    // with positional arguments mapped to the fields original passed to .build.
    // If not enough arguments are provided, the default value for the remaining fields
    // will be used.
    const builder: Builder = function builder() {
      var args = arguments;
      var argc = args.length;

      if (!self.finalized) {
        throw new Error(
          "attempting to instantiate unfinalized type " +
          self.typeName
        );
      }

      var built: ASTNode = Object.create(nodePrototype);

      self.buildParams.forEach(function (param, i) {
        if (i < argc) {
          addParam(built, param, args[i], true)
        } else {
          addParam(built, param, null, false);
        }
      });

      Object.keys(self.allFields).forEach(function (param) {
        // Use the default value.
        addParam(built, param, null, false);
      });

      // Make sure that the "type" field was filled automatically.
      if (built.type !== self.typeName) {
        throw new Error("");
      }

      return built;
    }

    // Calling .from on the builder function will construct an instance of the Def,
    // using field values from the passed object. For fields missing from the passed object,
    // their default value will be used.
    builder.from = function (obj) {
      if (!self.finalized) {
        throw new Error(
          "attempting to instantiate unfinalized type " +
          self.typeName
        );
      }

      var built: ASTNode = Object.create(nodePrototype);

      Object.keys(self.allFields).forEach(function (param) {
        if (hasOwn.call(obj, param)) {
          addParam(built, param, obj[param], true);
        } else {
          addParam(built, param, null, false);
        }
      });

      // Make sure that the "type" field was filled automatically.
      if (built.type !== self.typeName) {
        throw new Error("");
      }

      return built;
    }

    Object.defineProperty(builders, getBuilderName(self.typeName), {
      enumerable: true,
      value: builder
    });

    return self; // For chaining.
  };

  function getBuilderName(typeName: any) {
    return typeName.replace(/^[A-Z]+/, function (upperCasePrefix: any) {
      var len = upperCasePrefix.length;
      switch (len) {
        case 0: return "";
        // If there's only one initial capital letter, just lower-case it.
        case 1: return upperCasePrefix.toLowerCase();
        default:
          // If there's more than one initial capital letter, lower-case
          // all but the last one, so that XMLDefaultDeclaration (for
          // example) becomes xmlDefaultDeclaration.
          return upperCasePrefix.slice(
            0, len - 1).toLowerCase() +
            upperCasePrefix.charAt(len - 1);
      }
    });
  }

  function getStatementBuilderName(typeName: any) {
    typeName = getBuilderName(typeName);
    return typeName.replace(/(Expression)?$/, "Statement");
  }

  // The reason fields are specified using .field(...) instead of an object
  // literal syntax is somewhat subtle: the object literal syntax would
  // support only one key and one value, but with .field(...) we can pass
  // any number of arguments to specify the field.
  Dp.field = function (name, type, defaultFn, hidden) {
    if (this.finalized) {
      console.error("Ignoring attempt to redefine field " +
        JSON.stringify(name) + " of finalized type " +
        JSON.stringify(this.typeName));
      return this;
    }
    this.ownFields[name] = new Field(name, Type.from(type), defaultFn, hidden);
    return this; // For chaining.
  };

  var namedTypes: { [name: string]: AnyType } = {};

  // Like Object.keys, but aware of what fields each AST type should have.
  function getFieldNames(object: any) {
    var d = Def.fromValue(object);
    if (d) {
      return d.fieldNames.slice(0);
    }

    if ("type" in object) {
      throw new Error(
        "did not recognize object of type " +
        JSON.stringify(object.type)
      );
    }

    return Object.keys(object);
  }

  // Get the value of an object property, taking object.type and default
  // functions into account.
  function getFieldValue(object: any, fieldName: any) {
    var d = Def.fromValue(object);
    if (d) {
      var field = d.allFields[fieldName];
      if (field) {
        return field.getValue(object);
      }
    }

    return object && object[fieldName];
  }

  // Iterate over all defined fields of an object, including those missing
  // or undefined, passing each field name and effective value (as returned
  // by getFieldValue) to the callback. If the object has no corresponding
  // Def, the callback will never be called.
  function eachField(
    object: any,
    callback: (name: any, value: any) => any,
    context?: any
  ) {
    getFieldNames(object).forEach(function (this: any, name: any) {
      callback.call(this, name, getFieldValue(object, name));
    }, context);
  };

  // Similar to eachField, except that iteration stops as soon as the
  // callback returns a truthy value. Like Array.prototype.some, the final
  // result is either true or false to indicates whether the callback
  // returned true for any element or not.
  function someField(
    object: any,
    callback: (name: any, value: any) => any,
    context?: any
  ) {
    return getFieldNames(object).some(function (this: any, name: any) {
      return callback.call(this, name, getFieldValue(object, name));
    }, context);
  };

  // This property will be overridden as true by individual Def instances
  // when they are finalized.
  Object.defineProperty(Dp, "finalized", {value: false});

  Dp.finalize = function () {
    var self = this;

    // It's not an error to finalize a type more than once, but only the
    // first call to .finalize does anything.
    if (!self.finalized) {
      var allFields = self.allFields;
      var allSupertypes = self.allSupertypes;

      self.baseNames.forEach(function (name: any) {
        var def = defCache[name];
        if (def instanceof Def) {
          def.finalize();
          extend(allFields, def.allFields);
          extend(allSupertypes, def.allSupertypes);
        } else {
          var message = "unknown supertype name " +
            JSON.stringify(name) +
            " for subtype " +
            JSON.stringify(self.typeName);
          throw new Error(message);
        }
      });

      // TODO Warn if fields are overridden with incompatible types.
      extend(allFields, self.ownFields);
      allSupertypes[self.typeName] = self;

      self.fieldNames.length = 0;
      for (var fieldName in allFields) {
        if (hasOwn.call(allFields, fieldName) &&
          !allFields[fieldName].hidden) {
            self.fieldNames.push(fieldName);
        }
      }

      // Types are exported only once they have been finalized.
      Object.defineProperty(namedTypes, self.typeName, {
        enumerable: true,
        value: self.type
      });

      Object.defineProperty(self, "finalized", {value: true});

      // A linearization of the inheritance hierarchy.
      populateSupertypeList(self.typeName, self.supertypeList);

      if (self.buildable && self.supertypeList.lastIndexOf("Expression") >= 0) {
        wrapExpressionBuilderWithStatement(self.typeName);
      }
    }
  };

  // Adds an additional builder for Expression subtypes
  // that wraps the built Expression in an ExpressionStatements.
  function wrapExpressionBuilderWithStatement(typeName: string) {
    var wrapperName = getStatementBuilderName(typeName);

    // skip if the builder already exists
    if (builders[wrapperName]) return;

    // the builder function to wrap with builders.ExpressionStatement
    var wrapped = builders[getBuilderName(typeName)];

    // skip if there is nothing to wrap
    if (!wrapped) return;

    const builder: Builder = function () {
      return builders.expressionStatement(wrapped.apply(builders, arguments));
    };
    builder.from = function () {
      return builders.expressionStatement(wrapped.from.apply(builders, arguments));
    }

    builders[wrapperName] = builder;
  }

  function populateSupertypeList(typeName: any, list: any) {
    list.length = 0;
    list.push(typeName);

    var lastSeen = Object.create(null);

    for (var pos = 0; pos < list.length; ++pos) {
      typeName = list[pos];
      var d = defCache[typeName];
      if (d.finalized !== true) {
        throw new Error("");
      }

      // If we saw typeName earlier in the breadth-first traversal,
      // delete the last-seen occurrence.
      if (hasOwn.call(lastSeen, typeName)) {
        delete list[lastSeen[typeName]];
      }

      // Record the new index of the last-seen occurrence of typeName.
      lastSeen[typeName] = pos;

      // Enqueue the base names of this type.
      list.push.apply(list, d.baseNames);
    }

    // Compaction loop to remove array holes.
    for (var to = 0, from = to, len = list.length; from < len; ++from) {
      if (hasOwn.call(list, from)) {
        list[to++] = list[from];
      }
    }

    list.length = to;
  }

  function extend(into: any, from: any) {
    Object.keys(from).forEach(function (name) {
      into[name] = from[name];
    });

    return into;
  };

  function finalize() {
    Object.keys(defCache).forEach(function (name) {
      defCache[name].finalize();
    });
  };

  const AbsType: typeof AbstractType = Type;

  return {
    Type: AbsType,
    builtInTypes,
    getSupertypeNames,
    computeSupertypeLookupTable,
    builders,
    defineMethod,
    getBuilderName,
    getStatementBuilderName,
    namedTypes,
    getFieldNames,
    getFieldValue,
    eachField,
    someField,
    finalize,
  };
};
