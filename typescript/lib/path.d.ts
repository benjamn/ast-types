/// <reference path="types.d.ts"/>

declare module AstTypes {

  //constructors and static methods of Path class
  export interface PathStatic {
    new(value: any): PathInstance
    new(value: any, parentPath:PathInstance, name:string): PathInstance
  }

  type StringOrNumberParam = string|number

  //instance methods of Path class
  export interface PathInstance {
    value: any
    parentPath?: PathInstance
    name?: any
    getValueProperty(name: string|number): any
    get(...name: StringOrNumberParam[]): PathInstance
    each(callback:(path:PathInstance)=>any, context?:any)
    map<X>(callback:(path:PathInstance)=>X, context?:any):X[]
    filter(callback:(path:PathInstance)=>boolean, context?:any):PathInstance[]
    shift(): any
    unshift(...nodes: any[]): number
    push(...nodes: any[]): number
    pop(): any
    insertAt(index:number, ...nodes:any[]):PathInstance
    insertBefore(...nodes:any[]):PathInstance
    insertAfter(...nodes:any[]):PathInstance
    replace(...nodes:any[]):any[]
  }
}
