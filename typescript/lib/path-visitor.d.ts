/// <reference path="node-path.d.ts"/>
declare module AstTypes {

  export interface PathVisitorStatic {
    new (): PathVisitorInstance
    fromMethodsObject(methods: PathVisitorMethods|PathVisitorInstance): PathVisitorInstance
    visit: (node: any, methods: PathVisitorMethods) => NodePathInstance
  }

  export interface PathVisitorMethods {
    // you never actually provide these methods, they are here so `this.traverse()` (etc)
    // do not cause compilation errors in your visitor methods
    abort?()
    visit?(path: NodePathInstance, newVisitor?: PathVisitorMethods): NodePathInstance
    traverse?(path: NodePathInstance, newVisitor?: PathVisitorInstance|PathVisitorMethods)
    invokeVisitorMethod?(methodName: string):any
    reset?(path: NodePathInstance):PathVisitorContext
  }

  export interface PathVisitorContext {
    abort():void
    visit(path: NodePathInstance, newVisitor?: PathVisitorMethods): NodePathInstance
    traverse(path: NodePathInstance, newVisitor?: PathVisitorInstance|PathVisitorMethods)
    invokeVisitorMethod(methodName: string):any
    reset(path: NodePathInstance):PathVisitorContext
  }

  export interface PathVisitorInstance {
    visit(path: any, ...additionalArgs:any[]): any
    AbortRequest:AbortRequestStatic
    abort()
    reset(path: NodePathInstance, ...additionalArgs:any[]): any
    visitWithoutRest(path: NodePathInstance): any
    acquireContext(path: NodePathInstance): PathVisitorContext
    releaseContext(context: PathVisitorContext)
    reportChanged()
    wasChangeReported():boolean
  }

  export interface AbortRequestStatic {
    new (): AbortRequestInstance
  }

  export interface AbortRequestInstance {
    cancel()
  }
}