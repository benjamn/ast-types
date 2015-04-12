/// <reference path="types.d.ts"/>
/// <reference path="path.d.ts"/>
declare module AstTypes {
  export interface NodePathStatic extends PathStatic {
    new(value: any): NodePathInstance
    new(value: any, parentPath:PathInstance, name:string): NodePathInstance
  }

  export interface NodePathInstance extends PathInstance, IPathInstance<NodePathInstance> {

  }
}