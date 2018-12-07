import { Fork, Omit } from "../types";
import { assertNever, shallowStringify } from "./utils";

var Op = Object.prototype;
var objToStr = Op.toString;
var hasOwn = Op.hasOwnProperty;

export type CheckFn<T> = (value: any, deep?: any) => value is T;
export type AnyCheckFn = (value: any, deep?: any) => boolean;

export type AssertFn<T> = (value: any, deep?: any) => value is T;
export type AnyAssertFn = (value: any, deep?: any) => boolean;

export type NameType = string | (() => string);

type Deep = boolean | ((type: Type<any>, value: any) => void);

export interface Type<T> {
  toString(): string;
  check(value: any, deep?: Deep): value is T;
  assert(value: any, deep?: Deep): value is T;

  readonly __type: PrivateType<T>;
}

// Force boolean return values for `check` and `assert` instead of type predicates
// to avoid `...: value is any` type guards.
export type AnyType = Omit<Type<any>, "check" | "assert" | "__type"> & {
  check: AnyCheckFn;
  assert: AnyAssertFn;
};

const __typeBrand = Symbol();

interface BaseType<T> {
  readonly [__typeBrand]: T;
  toString(): string;
}

interface IdentityType<T> extends BaseType<T> {
  readonly kind: "IdentityType";
  readonly value: T;
}

interface PredicateType<T> extends BaseType<T> {
  readonly kind: "PredicateType";
  readonly predicate: AnyCheckFn;
  readonly name: string;
}

interface OrType<T> extends BaseType<T> {
  readonly kind: "OrType";
  readonly types: Type<any>[];
}

interface ArrayType<T> extends BaseType<T[]> {
  readonly kind: "ArrayType";
  readonly elemType: Type<T>;
}

interface ObjectType<T> extends BaseType<T[]> {
  readonly kind: "ObjectType";
  readonly fields: Field<any>[];
}

type PrivateType<T> =
  | IdentityType<T>
  | PredicateType<T>
  | OrType<T>
  | ArrayType<T>
  | ObjectType<T>

export abstract class Def<T = any> {
  public baseNames: string[] = [];
  public ownFields: { [name: string]: Field<any> } = Object.create(null);

  // Includes own typeName. Populated during finalization.
  public allSupertypes: { [name: string]: Def<any> } = Object.create(null);

  // Linear inheritance hierarchy. Populated during finalization.
  public supertypeList: string[] = [];

  // Includes inherited fields.
  public allFields: { [name: string]: Field<any> } = Object.create(null);

  // Non-hidden keys of allFields.
  public fieldNames: string[] = [];

  // This property will be overridden as true by individual Def instances
  // when they are finalized.
  public finalized = false;

  // False by default until .build(...) is called on an instance.
  public buildable = false;
  public buildParams: string[] = [];

  constructor(
    public readonly type: Type<T>,
    public readonly typeName: string,
  ) {}

  isSupertypeOf(that: Def<any>): boolean {
    if (that instanceof Def) {
      if (this.finalized !== true ||
        that.finalized !== true) {
        throw new Error("");
      }
      return hasOwn.call(that.allSupertypes, this.typeName);
    } else {
      throw new Error(that + " is not a Def");
    }
  }

  checkAllFields(value: any, deep?: any): boolean {
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

    return value !== null &&
      typeof value === "object" &&
      Object.keys(allFields).every(checkFieldByName);
  }

  abstract check(value: any, deep?: any): boolean;

  bases(...supertypeNames: string[]): this {
    var bases = this.baseNames;

    if (this.finalized) {
      if (supertypeNames.length !== bases.length) {
        throw new Error("");
      }
      for (var i = 0; i < supertypeNames.length; i++) {
        if (supertypeNames[i] !== bases[i]) {
          throw new Error("");
        }
      }
      return this;
    }

    supertypeNames.forEach(baseName => {
      // This indexOf lookup may be O(n), but the typical number of base
      // names is very small, and indexOf is a native Array method.
      if (bases.indexOf(baseName) < 0) {
        bases.push(baseName);
      }
    });

    return this; // For chaining.
  }

  // Calling the .build method of a Def simultaneously marks the type as
  // buildable (by defining builders[getBuilderName(typeName)]) and
  // specifies the order of arguments that should be passed to the builder
  // function to create an instance of the type.
  abstract build(...buildParams: string[]): this;

  // The reason fields are specified using .field(...) instead of an object
  // literal syntax is somewhat subtle: the object literal syntax would
  // support only one key and one value, but with .field(...) we can pass
  // any number of arguments to specify the field.
  abstract field(
    name: string,
    type: any,
    defaultFn?: Function,
    hidden?: boolean,
  ): this;

  abstract finalize(): void;
}

export interface Field<T> {
  readonly name: string;
  readonly type: Type<T>;
  readonly defaultFn?: Function;
  readonly hidden: boolean;

  toString(): string;
  getValue(obj: { [key: string]: any }): any;
}

export interface ASTNode {
  type: string;
}

export interface Builder {
  (...args: any[]): ASTNode;
  from(obj: { [param: string]: any }): ASTNode;
}

export default function typesPlugin(_fork: Fork) {
  // A type is an object with a .check method that takes a value and returns
  // true or false according to whether the value matches the type.

  class TypeImpl<T> implements Type<T> {
    static or = orTypeFrom;
    static from = typeFrom;
    static def = defForTypeName;

    __type: PrivateType<T>

    constructor(__type: PrivateType<T>) {
      validatePrivateType(__type);
      this.__type = __type;
    }

    check(value: any, deep?: any): value is T {
      const type = this.__type;
      switch(type.kind) {
        case "ArrayType": {
          return Array.isArray(value) &&
            value.every(elem => type.elemType.check(elem, deep));
        }

        case "IdentityType": {
          const result = value === type.value;
          if (!result && typeof deep === "function") {
            deep(this, value);
          }
          return result;
        }

        case "ObjectType": {
          return isObject.check(value) &&
            type.fields.every(field => field.type.check(value[field.name], deep));
        }

        case "OrType": {
          return type.types.some(type => {
            return type.check(value, deep);
          });
        }

        case "PredicateType": {
          const result = type.predicate(value, deep);
          if (!result && typeof deep === "function") {
            deep(this, value);
          }
          return result;
        }

        default:
          return assertNever(type);
      }
    }

    assert(value: any, deep?: any): value is T {
      if (!this.check(value, deep)) {
        var str = shallowStringify(value);
        throw new Error(str + " does not match type " + this);
      }
      return true;
    }

    toString() {
      return this.__type.toString();
    }
  }

  // Enforce that private types are constructed within this plugin instance.
  const __typePluginBrand = Symbol();
  function validatePrivateType(type: any): type is PrivateType<any> {
    if (type == null || type[__typeBrand] !== __typePluginBrand) {
      throw new Error("");
    }
    return true;
  }

  type TypeKind = PrivateType<any>["kind"];
  type TypesByKind = { [K in TypeKind]: Extract<PrivateType<any>, { kind: K }> };
  type FromForType<T> = Omit<T, "kind" | "toString" | typeof __typeBrand>;
  type TypeBuilders = { [K in TypeKind]: <T>(from: FromForType<TypesByKind[K]>) => Type<T> }

  function typeBuilderForKind<K extends TypeKind>(kind: K) {
    return function <T>(from: FromForType<TypesByKind[K]>): Type<T> {
      const privateType: TypesByKind[K] = {
        [__typeBrand]: __typePluginBrand as any as T,
        kind,
        toString() {
          switch(this.kind) {
            case "ArrayType":
              return "[" + this.elemType + "]";
            case "IdentityType":
              return String(this.value);
            case "ObjectType":
              return "{ " + this.fields.join(", ") + " }";
            case "OrType":
              return this.types.join(" | ");
            case "PredicateType":
              return this.name;
            default:
              return assertNever(this);
          }
        },
        ...(from as any)
      };

      return new TypeImpl(privateType);
    }
  }

  const typeBuilders: TypeBuilders = {
    ArrayType: typeBuilderForKind("ArrayType"),
    IdentityType: typeBuilderForKind("IdentityType"),
    ObjectType: typeBuilderForKind("ObjectType"),
    OrType: typeBuilderForKind("OrType"),
    PredicateType: typeBuilderForKind("PredicateType"),
  };

  class FieldImpl<T> implements Field<T> {
    public hidden: boolean;

    constructor(
      public name: string,
      public type: Type<T>,
      public defaultFn?: Function,
      hidden?: boolean,
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

  function orTypeFrom(...types: any[]): Type<any> {
    return typeBuilders.OrType({
      types: types.map(type => typeFrom(type)),
    });
  }

  function typeFrom(value: any, name?: string): Type<any> {
    if (value instanceof TypeImpl) {
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
      return typeBuilders.ArrayType({
        elemType: typeFrom(value[0]),
      });
    }

    // Support { someField: FieldType, ... } syntax.
    if (isObject.check(value)) {
      return typeBuilders.ObjectType({
        fields: Object.keys(value).map(
          name => new FieldImpl(name, typeFrom(value[name], name))
        ),
      });
    }

    if (typeof value === "function") {
      var bicfIndex = builtInCtorFns.indexOf(value);
      if (bicfIndex >= 0) {
        return builtInCtorTypes[bicfIndex];
      }

      if (typeof name !== "string") {
        throw new Error("missing name");
      }

      return typeBuilders.PredicateType({ name, predicate: value, });
    }

    // As a last resort, toType returns a type that matches any value that
    // is === from. This is primarily useful for literal values like
    // toType(null), but it has the additional advantage of allowing
    // toType to be a total function.
    return typeBuilders.IdentityType({ value });
  }

  // Define a type whose name is registered in a namespace (the defCache) so
  // that future definitions will return the same type given the same name.
  // In particular, this system allows for circular and forward definitions.
  // The Def object d returned from Type.def may be used to configure the
  // type d.type by calling methods such as d.bases, d.build, and d.field.
  function defForTypeName(typeName: string): Def {
    return hasOwn.call(defCache, typeName)
      ? defCache[typeName]
      : defCache[typeName] = new DefImpl(typeName);
  }

  var builtInCtorFns: Function[] = [];
  var builtInCtorTypes: Type<any>[] = [];

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

  function defBuiltInType<T>(example: T, name: keyof BuiltInTypes): Type<T> {
    const objStr = objToStr.call(example);

    const type = typeBuilders.PredicateType<T>({
      name,
      predicate: value => objToStr.call(value) === objStr,
    });

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
  var defCache: { [typeName: string]: Def<any> } = Object.create(null);

  function defFromValue(value: any): Def<any> | null {
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
  }

  class DefImpl<T = any> extends Def<T> {
    constructor(typeName: string) {
      super(
        typeBuilders.PredicateType({
          name: typeName,
          predicate: (value, deep) => this.check(value, deep)
        }),
        typeName,
      );
    }

    check(value: any, deep?: any): boolean {
      if (this.finalized !== true) {
        throw new Error(
          "prematurely checking unfinalized type " + this.typeName
        );
      }

      // A Def type can only match an object value.
      if (value === null || typeof value !== "object") {
        return false;
      }

      var vDef = defFromValue(value);
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
      if (deep && vDef === this) {
        return this.checkAllFields(value, deep);
      }

      // In most cases we rely exclusively on isSupertypeOf to make O(1)
      // subtyping determinations. This suffices in most situations outside
      // of unit tests, since interface conformance is checked whenever new
      // instances are created using builder functions.
      if (!this.isSupertypeOf(vDef)) {
        return false;
      }

      // The exception is when deep is true; then, we recursively check all
      // fields.
      if (!deep) {
        return true;
      }

      // Use the more specific Def (vDef) to perform the deep check, but
      // shallow-check fields defined by the less specific Def (this).
      return vDef.checkAllFields(value, deep)
        && this.checkAllFields(value, false);
    }

    build(...buildParams: string[]): this {
      // Calling Def.prototype.build multiple times has the effect of merely
      // redefining this property.
      this.buildParams = buildParams;

      if (this.buildable) {
        // If this Def is already buildable, update self.buildParams and
        // continue using the old builder function.
        return this;
      }

      // Every buildable type will have its "type" field filled in
      // automatically. This includes types that are not subtypes of Node,
      // like SourceLocation, but that seems harmless (TODO?).
      this.field("type", String, () => this.typeName);

      // Override Dp.buildable for this Def instance.
      this.buildable = true;

      const addParam = (built: any, param: any, arg: any, isArgAvailable: boolean) => {
        if (hasOwn.call(built, param))
          return;

        var all = this.allFields;
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
            JSON.stringify(param) + " of " + this.typeName + "(" +
            this.buildParams.map(function (name) {
              return all[name];
            }).join(", ") + ")";
          throw new Error(message);
        }

        if (!type.check(value)) {
          throw new Error(
            shallowStringify(value) +
            " does not match field " + field +
            " of type " + this.typeName
          );
        }

        built[param] = value;
      }

      // Calling the builder function will construct an instance of the Def,
      // with positional arguments mapped to the fields original passed to .build.
      // If not enough arguments are provided, the default value for the remaining fields
      // will be used.
      const builder: Builder = (...args: any[]) => {
        var argc = args.length;

        if (!this.finalized) {
          throw new Error(
            "attempting to instantiate unfinalized type " +
            this.typeName
          );
        }

        var built: ASTNode = Object.create(nodePrototype);

        this.buildParams.forEach(function (param, i) {
          if (i < argc) {
            addParam(built, param, args[i], true)
          } else {
            addParam(built, param, null, false);
          }
        });

        Object.keys(this.allFields).forEach(function (param) {
          // Use the default value.
          addParam(built, param, null, false);
        });

        // Make sure that the "type" field was filled automatically.
        if (built.type !== this.typeName) {
          throw new Error("");
        }

        return built;
      }

      // Calling .from on the builder function will construct an instance of the Def,
      // using field values from the passed object. For fields missing from the passed object,
      // their default value will be used.
      builder.from = (obj: { [fieldName: string]: any }) => {
        if (!this.finalized) {
          throw new Error(
            "attempting to instantiate unfinalized type " +
            this.typeName
          );
        }

        var built: ASTNode = Object.create(nodePrototype);

        Object.keys(this.allFields).forEach(function (param) {
          if (hasOwn.call(obj, param)) {
            addParam(built, param, obj[param], true);
          } else {
            addParam(built, param, null, false);
          }
        });

        // Make sure that the "type" field was filled automatically.
        if (built.type !== this.typeName) {
          throw new Error("");
        }

        return built;
      }

      Object.defineProperty(builders, getBuilderName(this.typeName), {
        enumerable: true,
        value: builder
      });

      return this;
    }

    // The reason fields are specified using .field(...) instead of an object
    // literal syntax is somewhat subtle: the object literal syntax would
    // support only one key and one value, but with .field(...) we can pass
    // any number of arguments to specify the field.
    field(
      name: string,
      type: any,
      defaultFn?: Function,
      hidden?: boolean,
    ): this {
      if (this.finalized) {
        console.error("Ignoring attempt to redefine field " +
          JSON.stringify(name) + " of finalized type " +
          JSON.stringify(this.typeName));
        return this;
      }
      this.ownFields[name] = new FieldImpl(name, typeFrom(type), defaultFn, hidden);
      return this; // For chaining.
    }

    finalize() {
      // It's not an error to finalize a type more than once, but only the
      // first call to .finalize does anything.
      if (!this.finalized) {
        var allFields = this.allFields;
        var allSupertypes = this.allSupertypes;

        this.baseNames.forEach(name => {
          var def = defCache[name];
          if (def instanceof Def) {
            def.finalize();
            extend(allFields, def.allFields);
            extend(allSupertypes, def.allSupertypes);
          } else {
            var message = "unknown supertype name " +
              JSON.stringify(name) +
              " for subtype " +
              JSON.stringify(this.typeName);
            throw new Error(message);
          }
        });

        // TODO Warn if fields are overridden with incompatible types.
        extend(allFields, this.ownFields);
        allSupertypes[this.typeName] = this;

        this.fieldNames.length = 0;
        for (var fieldName in allFields) {
          if (hasOwn.call(allFields, fieldName) &&
            !allFields[fieldName].hidden) {
              this.fieldNames.push(fieldName);
          }
        }

        // Types are exported only once they have been finalized.
        Object.defineProperty(namedTypes, this.typeName, {
          enumerable: true,
          value: this.type
        });

        this.finalized = true;

        // A linearization of the inheritance hierarchy.
        populateSupertypeList(this.typeName, this.supertypeList);

        if (this.buildable &&
            this.supertypeList.lastIndexOf("Expression") >= 0) {
          wrapExpressionBuilderWithStatement(this.typeName);
        }
      }
    }
  }

  // Note that the list returned by this function is a copy of the internal
  // supertypeList, *without* the typeName itself as the first element.
  function getSupertypeNames(typeName: string): string[] {
    if (!hasOwn.call(defCache, typeName)) {
      throw new Error("");
    }
    var d = defCache[typeName];
    if (d.finalized !== true) {
      throw new Error("");
    }
    return d.supertypeList.slice(1);
  }

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
  }

  var builders: { [name: string]: Builder } = Object.create(null);

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
  }

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

  var namedTypes: { [name: string]: AnyType } = {};

  // Like Object.keys, but aware of what fields each AST type should have.
  function getFieldNames(object: any) {
    var d = defFromValue(object);
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
    var d = defFromValue(object);
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
  }

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
  }

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

    const builder: Builder = function (...args: Parameters<typeof wrapped>) {
      return builders.expressionStatement(wrapped.apply(builders, args));
    };
    builder.from = function (...args: Parameters<typeof wrapped.from>) {
      return builders.expressionStatement(wrapped.from.apply(builders, args));
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
  }

  function finalize() {
    Object.keys(defCache).forEach(function (name) {
      defCache[name].finalize();
    });
  }

  type Statics<T> = { [K in Exclude<keyof T, "prototype">]: T[K] };
  const TypeForExport = TypeImpl as { new <T>(): Type<T> } & Statics<typeof TypeImpl>;

  return {
    Type: TypeForExport,
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
