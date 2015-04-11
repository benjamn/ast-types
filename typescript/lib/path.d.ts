/// <reference path="../lib/types.d.ts"/>
declare module AstTypes {

  //constructors and static methods of Path class
  export interface PathStatic {
    new(value: any): PathInstance
    new(value: any, parentPath:PathInstance, name:string): PathInstance
  }

  //instance methods of Path class
  export interface PathInstance {
    getValueProperty(name: string): any
    get(...name: string[]): PathInstance
    each(callback:(path:PathInstance)=>any, context:any)
    map<T>(callback:(path:PathInstance)=>T, context:any):T[]
    filter(callback:(path:PathInstance)=>boolean, context:any):PathInstance[]
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