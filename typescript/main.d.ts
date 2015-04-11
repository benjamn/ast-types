/// <reference path="lib/types.d.ts"/>
/// <reference path="lib/path.d.ts"/>
/// <reference path="lib/node-path.d.ts"/>
/// <reference path="lib/path-visitor.d.ts"/>
/// <reference path="def/manually-generated.d.ts"/>

declare module AstTypes {

  export interface Base {
    Type: TypeStatic
    namedTypes: NamedTypes
    builtInTypes: BuiltInTypes
    builders: Builders
    PathVisitor : PathVisitorStatic
  }

}
