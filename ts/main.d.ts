/// <reference path="lib/types.d.ts"/>
/// <reference path="lib/path.d.ts"/>
/// <reference path="lib/node-path.d.ts"/>
/// <reference path="lib/path-visitor.d.ts"/>
/// <reference path="lib/scope.d.ts"/>
/// <reference path="def/generated.d.ts"/>

declare module AstTypes {
  export interface Base extends TypesExportsMain {
    PathVisitor : PathVisitorStatic
    visit: (node: any, methods: PathVisitorMethods) => NodePathInstance
  }
}
