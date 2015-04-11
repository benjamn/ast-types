declare module AstTypes {

  export interface TypeStatic {
    //TODO: It appears deep is supposed to be a function?
    new(check:(value:any, deep:any)=>boolean, name:string): TypeInstance
    //TODO: It appears deep is supposed to be a function?
    new(check:(value:any, deep:any)=>boolean, name:()=>string): TypeInstance
    or(...types:any[]): TypeInstance
    fromArray(arr:any[]): TypeInstance
    fromObject(obj): TypeInstance
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

  export interface TypesExports {
    Type: TypeInstance
    builtInTypes: BuiltInTypes
    getSupertypeNames(typeName:string): string[]
    computeSupertypeLookupTable(candidates:{[typeName:string]:any}):{[typeName:string]:string}
    builders: Builders
    defineMethod(name:string) // delete function
    defineMethod(name:string, func:(...args:any[])=>any)
  }

}