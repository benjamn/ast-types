/// <reference path="types.d.ts"/>
/// <reference path="path.d.ts"/>
/// <reference path="scope.d.ts"/>
declare module AstTypes {
  export interface NodePathStatic extends PathStatic {
    new(value: any): NodePathInstance
    new(value: any, parentPath:PathInstance, name:string): NodePathInstance
  }

  export interface NodePathInstance extends PathInstance {
    node?: any
    parent?: NodePathInstance
    scope?: ScopeInstance // TODO: is scope really nullable?
    needsParens(assumeExpressionContext?:boolean): boolean
    canBeFirstInStatement(): boolean
    firstInStatement(): boolean
    prune(): NodePathInstance
    // override
    parentPath?: NodePathInstance
    get(...name: (string|number)[]): NodePathInstance
    each(callback:(path:PathInstance)=>any, context?:any)
    map<X>(callback:(path:PathInstance)=>X, context?:any): X[]
    filter(callback:(path:PathInstance)=>boolean, context?:any): NodePathInstance[]
    insertAt(index:number, ...nodes:any[]): NodePathInstance
    insertBefore(...nodes:any[]): NodePathInstance
    insertAfter(...nodes:any[]): NodePathInstance
  }
}