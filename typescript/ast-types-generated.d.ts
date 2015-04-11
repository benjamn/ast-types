/// <reference path="ast-types-api.d.ts"/>
declare module AstTypes {

  export interface SourceLocationType {
    type: string
    start: PositionType
    end: PositionType
    source?: string
  }

  export interface PositionType {
    type: string
    line: number
    column: number
  }

  export interface PrintableType {
    loc: SourceLocationType
  }

  export interface CommentType extends PrintableType {
    value: string
    leading: boolean
    trailing: boolean
  }

  export interface NodeType extends PrintableType {
    type: string
    comments?: CommentType[]
  }

  export interface PatternType extends NodeType {}

  export interface ExpressionType extends NodeType, PatternType {}

  export interface AssignmentExpressionType extends ExpressionType {
    operator: string
    left: PatternType
    right: ExpressionType
  }

  export interface TypeType extends NodeType {}

  export interface TypeAnnotationType extends NodeType {
    typeAnnotation: TypeType
  }

  export interface IdentifierType extends NodeType, ExpressionType, PatternType {
    name: string
    typeAnnotation?: TypeAnnotationType
  }

  export interface StatementType extends Node {}

  export interface ReturnStatementType extends StatementType {
    argument?: ExpressionType
  }

  // Extend The Existing Builders Interface
  export interface Builders {
    identifier(name: string): IdentifierType
    assignmentExpression(operator: string, left: PatternType, right: ExpressionType): AssignmentExpressionType
    returnStatement(argument?: ExpressionType): ReturnStatementType
  }

  // Extend The Existing NamedTypes Interface
  export interface NamedTypes {
    Expression: Type
  }
}