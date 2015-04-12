/// <reference path="types.d.ts"/>
/// <reference path="node-path.d.ts"/>
/// <reference path="../def/manually-generated.d.ts"/>
declare module AstTypes {

  export interface ScopeStatic {
    new (path:NodePathInstance, parentScope?: ScopeInstance): ScopeInstance
    isEstablishedBy(node: any): boolean
  }

  export interface ScopeInstance {
    path: NodePathInstance
    node: any //TODO: ?
    isGlobal: boolean
    depth: number
    parent: ScopeInstance
    bindings: {[bindingName: string] : NodePathInstance}
    declares(name: string): boolean
    declareTemporary(prefix?: string): IdentifierType
    injectTemporary(identifier?: IdentifierType, init?:ExpressionType): IdentifierType
    scan(force?: boolean): void
    getBindings() : {[bindingName: string] : NodePathInstance}
    lookup(name: string) : ScopeInstance
    getGlobalScope(): ScopeInstance
  }
}