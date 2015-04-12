/// <reference path="../lib/types.d.ts"/>
declare module AstTypes {

  //constructors and static methods of Path class
  export interface PathStatic {
    new(value: any): PathInstance
    new(value: any, parentPath:PathInstance, name:string): PathInstance
  }

  //instance methods of Path class
  export interface IPathInstance<T> {
    getValueProperty(name: string): any
    get(...name: string[]): T
    each(callback:(path:PathInstance)=>any, context:any)
    map<T>(callback:(path:PathInstance)=>T, context:any):T[]
    filter(callback:(path:PathInstance)=>boolean, context:any):T[]
    shift(): any
    unshift(...nodes: any[]): number
    push(...nodes: any[]): number
    pop(): any
    insertAt(index:number, ...nodes:any[]):T
    insertBefore(...nodes:any[]):T
    insertAfter(...nodes:any[]):T
    replace(...nodes:any[]):any[]
  }

  export interface PathInstance extends IPathInstance<PathInstance> {}
}