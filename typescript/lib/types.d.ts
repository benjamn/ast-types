declare module AstTypes {

  // the `toType` method accepts a number of types for it's `from` parameter
  // `toTypeFromParam` defines a reusable alias for the allowed types
  type typeCheckCb = () => boolean;
  type toTypeFromBase= TypeInstance|DefInstance|typeCheckCb;
  type toTypeFromParam=toTypeFromBase|toTypeFromBase[]|{[fieldName:string]:toTypeFromBase}

  export interface TypeStatic {
    //TODO: It appears deep is supposed to be a function?
    new(check:(value:any, deep:any)=>boolean, name:string): TypeInstance
    //TODO: It appears deep is supposed to be a function?
    new(check:(value:any, deep:any)=>boolean, name:()=>string): TypeInstance
    or(...types:toTypeFromParam[]): TypeInstance
    fromArray(arr:toTypeFromParam[]): TypeInstance
    fromObject(obj:{[fieldName:string]:toTypeFromParam}): TypeInstance
    def(typeName:string): DefInstance
  }

  export interface TypeInstance {
    check(value:any): boolean
    check(value:any, deep:any): boolean
    assert(value:any): boolean
    assert(value:any, deep:any): boolean
    arrayOf(): TypeInstance
  }

  export interface DefInstance {
    typeName: string
    baseNames: string[]
    ownFields: {[fieldName:string]:FieldInstance}
    allSuperTypes: {[typeName:string]:TypeInstance}
    superTypeList: string[]
    allFields: {[fieldName:string]:FieldInstance}
    fieldNames: string[]
    type: TypeInstance
    isSupertypeOf(that:DefInstance): boolean
    checkAllFields(value:any): boolean
    //TODO: deep is a function?
    checkAllFields(value:any, deep:any): boolean
    //TODO: deep is a function?
    check(value:any, deep:any): boolean
    bases(...superTypeNames:string[]):DefInstance
    buildable: boolean
    build(...params:string[]):DefInstance
    field(name:string, type:toTypeFromParam):DefInstance
    field(name:string, type:toTypeFromParam, defaultFn:(obj:any)=>any):DefInstance
    field(name:string, type:toTypeFromParam, defaultFn:(obj:any)=>any, hidden:boolean):DefInstance
    finalize()
  }

  export interface FieldInstance {
    name: string
    type: TypeInstance
    hidden: boolean
    defaultFn: ()=>any
    getValue(node): any
  }

  // will be populated by generated code in def/*
  export interface NamedTypes {
  }

  // will be populated by generated code in def/*
  export interface Builders {
  }

  export interface BuiltInTypes {
    string: TypeInstance
    "function": TypeInstance
    array: TypeInstance
    object: TypeInstance
    RegExp: TypeInstance
    Date: TypeInstance
    number: TypeInstance
    boolean: TypeInstance
    "null": TypeInstance
    undefined: TypeInstance
  }

  type eachFieldCb = (fieldName:string, value:any)=>any

  export interface TypesExports {
    Type: TypeInstance
    builtInTypes: BuiltInTypes
    getSupertypeNames(typeName:string): string[]
    computeSupertypeLookupTable(candidates:{[typeName:string]:any}): {[typeName:string]:string}
    builders: Builders
    defineMethod(name:string) // delete function
    defineMethod(name:string, func:(...args:any[])=>any)
    getBuilderName(typeName:string): string
    namedTypes: NamedTypes
    getFieldNames(object:any): string[]
    getFieldValue(object:any, fieldName:string): any
    eachField(object:any, callback:eachFieldCb): void
    eachField(object:any, callback:eachFieldCb, context:any): void
    someField(object:any, callback:eachFieldCb): boolean
    someField(object:any, callback:eachFieldCb, context:any): boolean
    finalize(): void
  }
}