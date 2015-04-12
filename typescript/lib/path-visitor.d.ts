/// <reference path="node-path.d.ts"/>
declare module AstTypes {

  type PathVisitor_visit = (node: any, methods: PathVisitorInstance) => NodePathInstance

  export interface PathVisitorStatic {
    new (): PathVisitorInstance
    fromMethodsObject(methods: PathVisitorInstance): PathVisitorInstance
    visit: PathVisitor_visit
  }

  export interface PathVisitorInstance {
    // reset?(path: Path): Instance
    // invokeVisitorMethod?(methodName: string): NodeType
    traverse?(path: NodePathInstance): NodePathInstance
    visit?(path: any, newVisitor: PathVisitorInstance): NodePathInstance
    // reportChanged?()
    abort?()
  }
}