declare module AstTypes {
  export interface Type {
    check(x) : boolean
    assert(x) : boolean
  }

  export interface NamedTypes {
  }

  export interface Builders {
  }

  export interface BuiltInTypes {
    string: Type
    function: Type
    array: Type
    object: Type
    RegExp: Type
    Date: Type
    number: Type
    boolean: Type
    null: Type
    undefined: Type
  }

  export interface Base {
    namedTypes: NamedTypes
    builders: Builders
    builtInTypes: BuiltInTypes
  }
}
