/// <reference path="../lib/types.d.ts"/>
/// <reference path="../lib/node-path.d.ts"/>

declare module AstTypes {

 export interface PrintableType{
  "loc"?: SourceLocationType
}

 export interface SourceLocationType{
  "type": string
  "start": PositionType
  "end": PositionType
  "source"?: string
}

 export interface NodeType extends PrintableType {
  "type": string
  "comments"?: CommentType[]
}

 export interface CommentType extends PrintableType {
  "value": string
  "leading": boolean
  "trailing": boolean
}

 export interface PositionType{
  "type": string
  "line": number
  "column": number
}

 export interface ProgramType extends NodeType {
  "type": string
  "body": StatementType[]
}

 export interface StatementType extends NodeType {
  
}

 export interface FunctionType extends NodeType {
  "id"?: IdentifierType
  "params": PatternType[]
  "body": BlockStatementType | ExpressionType
  "generator": boolean
  "expression": boolean
  "defaults": ExpressionType[]
  "rest"?: IdentifierType
  "async": boolean
  "returnType"?: TypeAnnotationType
  "typeParameters"?: TypeParameterDeclarationType
}

 export interface PatternType extends NodeType {
  
}

 export interface ExpressionType extends NodeType, PatternType {
  
}

 export interface IdentifierType extends NodeType, ExpressionType, PatternType {
  "type": string
  "name": string
  "typeAnnotation"?: TypeAnnotationType
}

 export interface BlockStatementType extends StatementType {
  "type": string
  "body": StatementType[]
}

 export interface EmptyStatementType extends StatementType {
  "type": string
}

 export interface ExpressionStatementType extends StatementType {
  "type": string
  "expression": ExpressionType
}

 export interface IfStatementType extends StatementType {
  "type": string
  "test": ExpressionType
  "consequent": StatementType
  "alternate"?: StatementType
}

 export interface LabeledStatementType extends StatementType {
  "type": string
  "label": IdentifierType
  "body": StatementType
}

 export interface BreakStatementType extends StatementType {
  "type": string
  "label"?: IdentifierType
}

 export interface ContinueStatementType extends StatementType {
  "type": string
  "label"?: IdentifierType
}

 export interface WithStatementType extends StatementType {
  "type": string
  "object": ExpressionType
  "body": StatementType
}

 export interface SwitchStatementType extends StatementType {
  "type": string
  "discriminant": ExpressionType
  "cases": SwitchCaseType[]
  "lexical": boolean
}

 export interface SwitchCaseType extends NodeType {
  "type": string
  "test"?: ExpressionType
  "consequent": StatementType[]
}

 export interface ReturnStatementType extends StatementType {
  "type": string
  "argument"?: ExpressionType
}

 export interface ThrowStatementType extends StatementType {
  "type": string
  "argument": ExpressionType
}

 export interface TryStatementType extends StatementType {
  "type": string
  "block": BlockStatementType
  "handler"?: CatchClauseType
  "handlers": CatchClauseType[]
  "guardedHandlers": CatchClauseType[]
  "finalizer"?: BlockStatementType
}

 export interface CatchClauseType extends NodeType {
  "type": string
  "param": PatternType
  "guard"?: ExpressionType
  "body": BlockStatementType
}

 export interface WhileStatementType extends StatementType {
  "type": string
  "test": ExpressionType
  "body": StatementType
}

 export interface DoWhileStatementType extends StatementType {
  "type": string
  "body": StatementType
  "test": ExpressionType
}

 export interface ForStatementType extends StatementType {
  "type": string
  "init"?: VariableDeclarationType | ExpressionType
  "test"?: ExpressionType
  "update"?: ExpressionType
  "body": StatementType
}

 export interface DeclarationType extends StatementType {
  
}

 export interface VariableDeclarationType extends DeclarationType {
  "type": string
  "kind": string
  "declarations": (VariableDeclaratorType | IdentifierType)[]
}

 export interface ForInStatementType extends StatementType {
  "type": string
  "left": VariableDeclarationType | ExpressionType
  "right": ExpressionType
  "body": StatementType
  "each": boolean
}

 export interface DebuggerStatementType extends StatementType {
  "type": string
}

 export interface FunctionDeclarationType extends FunctionType, DeclarationType {
  "type": string
  "id": IdentifierType
}

 export interface FunctionExpressionType extends FunctionType, ExpressionType {
  "type": string
}

 export interface VariableDeclaratorType extends NodeType {
  "type": string
  "id": PatternType
  "init"?: ExpressionType
}

 export interface ThisExpressionType extends ExpressionType {
  "type": string
}

 export interface ArrayExpressionType extends ExpressionType {
  "type": string
  "elements": (ExpressionType | SpreadElementType)[]
}

 export interface ObjectExpressionType extends ExpressionType {
  "type": string
  "properties": (PropertyType | SpreadPropertyType)[]
}

 export interface PropertyType extends NodeType {
  "type": string
  "kind": string
  "key": LiteralType | IdentifierType | ExpressionType
  "value": ExpressionType | PatternType
  "method": boolean
  "shorthand": boolean
  "computed": boolean
}

 export interface LiteralType extends NodeType, ExpressionType {
  "type": string
  "value"?: string | boolean | number | RegExp
  "regex"?: {
  "pattern": string
   "flags": string
}
}

 export interface SequenceExpressionType extends ExpressionType {
  "type": string
  "expressions": ExpressionType[]
}

 export interface UnaryExpressionType extends ExpressionType {
  "type": string
  "operator": string
  "argument": ExpressionType
  "prefix": boolean
}

 export interface BinaryExpressionType extends ExpressionType {
  "type": string
  "operator": string
  "left": ExpressionType
  "right": ExpressionType
}

 export interface AssignmentExpressionType extends ExpressionType {
  "type": string
  "operator": string
  "left": PatternType
  "right": ExpressionType
}

 export interface UpdateExpressionType extends ExpressionType {
  "type": string
  "operator": string
  "argument": ExpressionType
  "prefix": boolean
}

 export interface LogicalExpressionType extends ExpressionType {
  "type": string
  "operator": string
  "left": ExpressionType
  "right": ExpressionType
}

 export interface ConditionalExpressionType extends ExpressionType {
  "type": string
  "test": ExpressionType
  "consequent": ExpressionType
  "alternate": ExpressionType
}

 export interface NewExpressionType extends ExpressionType {
  "type": string
  "callee": ExpressionType
  "arguments": (ExpressionType | SpreadElementType)[]
}

 export interface CallExpressionType extends ExpressionType {
  "type": string
  "callee": ExpressionType
  "arguments": (ExpressionType | SpreadElementType)[]
}

 export interface MemberExpressionType extends ExpressionType {
  "type": string
  "object": ExpressionType
  "property": IdentifierType | ExpressionType
  "computed": boolean
}

 export interface ObjectPatternType extends PatternType {
  "type": string
  "properties": (PropertyPatternType | SpreadPropertyPatternType | PropertyType | SpreadPropertyType)[]
}

 export interface PropertyPatternType extends PatternType {
  "type": string
  "key": LiteralType | IdentifierType | ExpressionType
  "pattern": PatternType
  "computed": boolean
}

 export interface ArrayPatternType extends PatternType {
  "type": string
  "elements": (PatternType | SpreadElementType)[]
}

 export interface BlockType extends CommentType {
  "type": string
}

 export interface LineType extends CommentType {
  "type": string
}

 export interface ArrowFunctionExpressionType extends FunctionType, ExpressionType {
  "type": string
  "body": BlockStatementType | ExpressionType
  "generator": boolean
}

 export interface YieldExpressionType extends ExpressionType {
  "type": string
  "argument"?: ExpressionType
  "delegate": boolean
}

 export interface GeneratorExpressionType extends ExpressionType {
  "type": string
  "body": ExpressionType
  "blocks": ComprehensionBlockType[]
  "filter"?: ExpressionType
}

 export interface ComprehensionBlockType extends NodeType {
  "type": string
  "left": PatternType
  "right": ExpressionType
  "each": boolean
}

 export interface ComprehensionExpressionType extends ExpressionType {
  "type": string
  "body": ExpressionType
  "blocks": ComprehensionBlockType[]
  "filter"?: ExpressionType
}

 export interface ModuleSpecifierType extends LiteralType {
  "type": string
  "value": string
}

 export interface MethodDefinitionType extends DeclarationType {
  "type": string
  "kind": string
  "key": LiteralType | IdentifierType | ExpressionType
  "value": FunctionType
  "computed": boolean
  "static": boolean
}

 export interface SpreadElementType extends NodeType {
  "type": string
  "argument": ExpressionType
}

 export interface SpreadElementPatternType extends PatternType {
  "type": string
  "argument": PatternType
}

 export interface ClassPropertyDefinitionType extends DeclarationType {
  "type": string
  "definition": MethodDefinitionType | VariableDeclaratorType | ClassPropertyDefinitionType | ClassPropertyType
}

 export interface ClassPropertyType extends DeclarationType {
  "type": string
  "key": LiteralType | IdentifierType | ExpressionType
  "computed": boolean
  "typeAnnotation": TypeAnnotationType
  "static": boolean
}

 export interface ClassBodyType extends DeclarationType {
  "type": string
  "body": (MethodDefinitionType | VariableDeclaratorType | ClassPropertyDefinitionType | ClassPropertyType)[]
}

 export interface ClassDeclarationType extends DeclarationType {
  "type": string
  "id"?: IdentifierType
  "body": ClassBodyType
  "superClass"?: ExpressionType
}

 export interface ClassExpressionType extends ExpressionType {
  "type": string
  "id"?: IdentifierType
  "body": ClassBodyType
  "superClass"?: ExpressionType
  "implements": ClassImplementsType[]
}

 export interface ClassImplementsType extends NodeType {
  "type": string
  "id": IdentifierType
  "superClass"?: ExpressionType
  "typeParameters"?: TypeParameterInstantiationType
}

 export interface SpecifierType extends NodeType {
  
}

 export interface NamedSpecifierType extends SpecifierType {
  "id": IdentifierType
  "name"?: IdentifierType
}

 export interface ExportSpecifierType extends NamedSpecifierType {
  "type": string
}

 export interface ExportBatchSpecifierType extends SpecifierType {
  "type": string
}

 export interface ImportSpecifierType extends NamedSpecifierType {
  "type": string
}

 export interface ImportNamespaceSpecifierType extends SpecifierType {
  "type": string
  "id": IdentifierType
}

 export interface ImportDefaultSpecifierType extends SpecifierType {
  "type": string
  "id": IdentifierType
}

 export interface ExportDeclarationType extends DeclarationType {
  "type": string
  "default": boolean
  "declaration"?: DeclarationType | ExpressionType
  "specifiers": (ExportSpecifierType | ExportBatchSpecifierType)[]
  "source"?: LiteralType | ModuleSpecifierType
}

 export interface ImportDeclarationType extends DeclarationType {
  "type": string
  "specifiers": (ImportSpecifierType | ImportNamespaceSpecifierType | ImportDefaultSpecifierType)[]
  "source": LiteralType | ModuleSpecifierType
}

 export interface TaggedTemplateExpressionType extends ExpressionType {
  "tag": ExpressionType
  "quasi": TemplateLiteralType
}

 export interface TemplateLiteralType extends ExpressionType {
  "type": string
  "quasis": TemplateElementType[]
  "expressions": ExpressionType[]
}

 export interface TemplateElementType extends NodeType {
  "type": string
  "value": {
  "cooked": string
   "raw": string
}
  "tail": boolean
}

 export interface SpreadPropertyType extends NodeType {
  "type": string
  "argument": ExpressionType
}

 export interface SpreadPropertyPatternType extends PatternType {
  "type": string
  "argument": PatternType
}

 export interface AwaitExpressionType extends ExpressionType {
  "type": string
  "argument"?: ExpressionType
  "all": boolean
}

 export interface ForOfStatementType extends StatementType {
  "type": string
  "left": VariableDeclarationType | ExpressionType
  "right": ExpressionType
  "body": StatementType
}

 export interface LetStatementType extends StatementType {
  "type": string
  "head": VariableDeclaratorType[]
  "body": StatementType
}

 export interface LetExpressionType extends ExpressionType {
  "type": string
  "head": VariableDeclaratorType[]
  "body": ExpressionType
}

 export interface GraphExpressionType extends ExpressionType {
  "type": string
  "index": number
  "expression": LiteralType
}

 export interface GraphIndexExpressionType extends ExpressionType {
  "type": string
  "index": number
}

 export interface XMLDefaultDeclarationType extends DeclarationType {
  "namespace": ExpressionType
}

 export interface XMLAnyNameType extends ExpressionType {
  
}

 export interface XMLQualifiedIdentifierType extends ExpressionType {
  "left": IdentifierType | XMLAnyNameType
  "right": IdentifierType | ExpressionType
  "computed": boolean
}

 export interface XMLFunctionQualifiedIdentifierType extends ExpressionType {
  "right": IdentifierType | ExpressionType
  "computed": boolean
}

 export interface XMLAttributeSelectorType extends ExpressionType {
  "attribute": ExpressionType
}

 export interface XMLFilterExpressionType extends ExpressionType {
  "left": ExpressionType
  "right": ExpressionType
}

 export interface XMLType extends NodeType {
  
}

 export interface XMLElementType extends XMLType, ExpressionType {
  "contents": XMLType[]
}

 export interface XMLListType extends XMLType, ExpressionType {
  "contents": XMLType[]
}

 export interface XMLEscapeType extends XMLType {
  "expression": ExpressionType
}

 export interface XMLTextType extends XMLType {
  "text": string
}

 export interface XMLStartTagType extends XMLType {
  "contents": XMLType[]
}

 export interface XMLEndTagType extends XMLType {
  "contents": XMLType[]
}

 export interface XMLPointTagType extends XMLType {
  "contents": XMLType[]
}

 export interface XMLNameType extends XMLType {
  "contents": string | XMLType[]
}

 export interface XMLAttributeType extends XMLType {
  "value": string
}

 export interface XMLCdataType extends XMLType {
  "contents": string
}

 export interface XMLCommentType extends XMLType {
  "contents": string
}

 export interface XMLProcessingInstructionType extends XMLType {
  "target": string
  "contents"?: string
}

 export interface JSXAttributeType extends NodeType {
  "type": string
  "name": JSXIdentifierType | JSXNamespacedNameType
  "value"?: LiteralType | JSXExpressionContainerType
}

 export interface JSXIdentifierType extends IdentifierType {
  "type": string
  "name": string
}

 export interface JSXNamespacedNameType extends NodeType {
  "type": string
  "namespace": JSXIdentifierType
  "name": JSXIdentifierType
}

 export interface JSXExpressionContainerType extends ExpressionType {
  "type": string
  "expression": ExpressionType
}

 export interface JSXMemberExpressionType extends MemberExpressionType {
  "type": string
  "object": JSXIdentifierType | JSXMemberExpressionType
  "property": JSXIdentifierType
  "computed": boolean
}

 export interface JSXSpreadAttributeType extends NodeType {
  "type": string
  "argument": ExpressionType
}

 export interface JSXElementType extends ExpressionType {
  "type": string
  "openingElement": JSXOpeningElementType
  "closingElement"?: JSXClosingElementType
  "children": (JSXElementType | JSXExpressionContainerType | JSXTextType | LiteralType)[]
  "name": JSXIdentifierType | JSXNamespacedNameType | JSXMemberExpressionType
  "selfClosing": boolean
  "attributes": (JSXAttributeType | JSXSpreadAttributeType)[]
}

 export interface JSXOpeningElementType extends NodeType {
  "type": string
  "name": JSXIdentifierType | JSXNamespacedNameType | JSXMemberExpressionType
  "attributes": (JSXAttributeType | JSXSpreadAttributeType)[]
  "selfClosing": boolean
}

 export interface JSXClosingElementType extends NodeType {
  "type": string
  "name": JSXIdentifierType | JSXNamespacedNameType | JSXMemberExpressionType
}

 export interface JSXTextType extends LiteralType {
  "type": string
  "value": string
}

 export interface JSXEmptyExpressionType extends ExpressionType {
  "type": string
}

 export interface TypeType extends NodeType {
  
}

 export interface AnyTypeAnnotationType extends TypeType {
  
}

 export interface VoidTypeAnnotationType extends TypeType {
  
}

 export interface NumberTypeAnnotationType extends TypeType {
  
}

 export interface StringTypeAnnotationType extends TypeType {
  
}

 export interface StringLiteralTypeAnnotationType extends TypeType {
  "type": string
  "value": string
  "raw": string
}

 export interface BooleanTypeAnnotationType extends TypeType {
  
}

 export interface TypeAnnotationType extends NodeType {
  "type": string
  "typeAnnotation": TypeType
}

 export interface NullableTypeAnnotationType extends TypeType {
  "type": string
  "typeAnnotation": TypeType
}

 export interface FunctionTypeAnnotationType extends TypeType {
  "type": string
  "params": FunctionTypeParamType[]
  "returnType": TypeType
  "rest"?: FunctionTypeParamType
  "typeParameters"?: TypeParameterDeclarationType
}

 export interface FunctionTypeParamType extends NodeType {
  "type": string
  "name": IdentifierType
  "typeAnnotation": TypeType
  "optional": boolean
}

 export interface TypeParameterDeclarationType extends NodeType {
  "type": string
  "params": IdentifierType[]
}

 export interface ArrayTypeAnnotationType extends TypeType {
  "type": string
  "elementType": TypeType
}

 export interface ObjectTypeAnnotationType extends TypeType {
  "type": string
  "properties": ObjectTypePropertyType[]
  "indexers": ObjectTypeIndexerType[]
  "callProperties": ObjectTypeCallPropertyType[]
}

 export interface ObjectTypePropertyType extends NodeType {
  "type": string
  "key": LiteralType | IdentifierType
  "value": TypeType
  "optional": boolean
}

 export interface ObjectTypeIndexerType extends NodeType {
  "type": string
  "id": IdentifierType
  "key": TypeType
  "value": TypeType
}

 export interface ObjectTypeCallPropertyType extends NodeType {
  "type": string
  "value": FunctionTypeAnnotationType
  "static": boolean
}

 export interface QualifiedTypeIdentifierType extends NodeType {
  "type": string
  "qualification": IdentifierType | QualifiedTypeIdentifierType
  "id": IdentifierType
}

 export interface GenericTypeAnnotationType extends TypeType {
  "type": string
  "id": IdentifierType | QualifiedTypeIdentifierType
  "typeParameters"?: TypeParameterInstantiationType
}

 export interface TypeParameterInstantiationType extends NodeType {
  "type": string
  "params": TypeType[]
}

 export interface MemberTypeAnnotationType extends TypeType {
  "type": string
  "object": IdentifierType
  "property": MemberTypeAnnotationType | GenericTypeAnnotationType
}

 export interface UnionTypeAnnotationType extends TypeType {
  "type": string
  "types": TypeType[]
}

 export interface IntersectionTypeAnnotationType extends TypeType {
  "type": string
  "types": TypeType[]
}

 export interface TypeofTypeAnnotationType extends TypeType {
  "type": string
  "argument": TypeType
}

 export interface InterfaceDeclarationType extends StatementType {
  "type": string
  "id": IdentifierType
  "typeParameters"?: TypeParameterDeclarationType
  "body": ObjectTypeAnnotationType
  "extends": InterfaceExtendsType[]
}

 export interface InterfaceExtendsType extends NodeType {
  "type": string
  "id": IdentifierType
  "typeParameters"?: TypeParameterInstantiationType
}

 export interface TypeAliasType extends StatementType {
  "type": string
  "id": IdentifierType
  "typeParameters"?: TypeParameterDeclarationType
  "right": TypeType
}

 export interface TypeCastExpressionType extends ExpressionType {
  "type": string
  "expression": ExpressionType
  "typeAnnotation": TypeAnnotationType
}

 export interface TupleTypeAnnotationType extends TypeType {
  "type": string
  "types": TypeType[]
}

 export interface DeclareVariableType extends StatementType {
  "type": string
  "id": IdentifierType
}

 export interface DeclareFunctionType extends StatementType {
  "type": string
  "id": IdentifierType
}

 export interface DeclareClassType extends InterfaceDeclarationType {
  "type": string
}

 export interface DeclareModuleType extends StatementType {
  "type": string
  "id": IdentifierType | LiteralType
  "body": BlockStatementType
}

 export interface Builders {
  sourceLocation(start:PositionType, end:PositionType, source?:string):SourceLocationType
  position(line:number, column:number):PositionType
  program(body:StatementType[]):ProgramType
  identifier(name:string):IdentifierType
  blockStatement(body:StatementType[]):BlockStatementType
  emptyStatement():EmptyStatementType
  expressionStatement(expression:ExpressionType):ExpressionStatementType
  ifStatement(test:ExpressionType, consequent:StatementType, alternate?:StatementType):IfStatementType
  labeledStatement(label:IdentifierType, body:StatementType):LabeledStatementType
  breakStatement(label?:IdentifierType):BreakStatementType
  continueStatement(label?:IdentifierType):ContinueStatementType
  withStatement(object:ExpressionType, body:StatementType):WithStatementType
  switchStatement(discriminant:ExpressionType, cases:SwitchCaseType[], lexical?:boolean):SwitchStatementType
  switchCase(test:ExpressionType, consequent:StatementType[]):SwitchCaseType
  returnStatement(argument:ExpressionType):ReturnStatementType
  throwStatement(argument:ExpressionType):ThrowStatementType
  tryStatement(block:BlockStatementType, handler?:CatchClauseType, finalizer?:BlockStatementType):TryStatementType
  catchClause(param:PatternType, guard:ExpressionType, body:BlockStatementType):CatchClauseType
  whileStatement(test:ExpressionType, body:StatementType):WhileStatementType
  doWhileStatement(body:StatementType, test:ExpressionType):DoWhileStatementType
  forStatement(init:VariableDeclarationType | ExpressionType, test:ExpressionType, update:ExpressionType, body:StatementType):ForStatementType
  variableDeclaration(kind:string, declarations:(VariableDeclaratorType | IdentifierType)[]):VariableDeclarationType
  forInStatement(left:VariableDeclarationType | ExpressionType, right:ExpressionType, body:StatementType, each:boolean):ForInStatementType
  debuggerStatement():DebuggerStatementType
  functionDeclaration(id:IdentifierType, params:PatternType[], body:BlockStatementType | ExpressionType, generator?:boolean, expression?:boolean):FunctionDeclarationType
  functionExpression(id:IdentifierType, params:PatternType[], body:BlockStatementType | ExpressionType, generator?:boolean, expression?:boolean):FunctionExpressionType
  variableDeclarator(id:PatternType, init:ExpressionType):VariableDeclaratorType
  thisExpression():ThisExpressionType
  arrayExpression(elements:(ExpressionType | SpreadElementType)[]):ArrayExpressionType
  objectExpression(properties:(PropertyType | SpreadPropertyType)[]):ObjectExpressionType
  property(kind:string, key:LiteralType | IdentifierType | ExpressionType, value:ExpressionType | PatternType):PropertyType
  literal(value:string | boolean | number | RegExp):LiteralType
  sequenceExpression(expressions:ExpressionType[]):SequenceExpressionType
  unaryExpression(operator:string, argument:ExpressionType, prefix?:boolean):UnaryExpressionType
  binaryExpression(operator:string, left:ExpressionType, right:ExpressionType):BinaryExpressionType
  assignmentExpression(operator:string, left:PatternType, right:ExpressionType):AssignmentExpressionType
  updateExpression(operator:string, argument:ExpressionType, prefix:boolean):UpdateExpressionType
  logicalExpression(operator:string, left:ExpressionType, right:ExpressionType):LogicalExpressionType
  conditionalExpression(test:ExpressionType, consequent:ExpressionType, alternate:ExpressionType):ConditionalExpressionType
  newExpression(callee:ExpressionType, arguments:(ExpressionType | SpreadElementType)[]):NewExpressionType
  callExpression(callee:ExpressionType, arguments:(ExpressionType | SpreadElementType)[]):CallExpressionType
  memberExpression(object:ExpressionType, property:IdentifierType | ExpressionType, computed?:boolean):MemberExpressionType
  objectPattern(properties:(PropertyPatternType | SpreadPropertyPatternType | PropertyType | SpreadPropertyType)[]):ObjectPatternType
  propertyPattern(key:LiteralType | IdentifierType | ExpressionType, pattern:PatternType):PropertyPatternType
  arrayPattern(elements:(PatternType | SpreadElementType)[]):ArrayPatternType
  block(value:string, leading?:boolean, trailing?:boolean):BlockType
  line(value:string, leading?:boolean, trailing?:boolean):LineType
  arrowFunctionExpression(params:PatternType[], body:BlockStatementType | ExpressionType, expression?:boolean):ArrowFunctionExpressionType
  yieldExpression(argument:ExpressionType, delegate?:boolean):YieldExpressionType
  generatorExpression(body:ExpressionType, blocks:ComprehensionBlockType[], filter:ExpressionType):GeneratorExpressionType
  comprehensionBlock(left:PatternType, right:ExpressionType, each:boolean):ComprehensionBlockType
  comprehensionExpression(body:ExpressionType, blocks:ComprehensionBlockType[], filter:ExpressionType):ComprehensionExpressionType
  moduleSpecifier(value:string):ModuleSpecifierType
  methodDefinition(kind:string, key:LiteralType | IdentifierType | ExpressionType, value:FunctionType, static?:boolean):MethodDefinitionType
  spreadElement(argument:ExpressionType):SpreadElementType
  spreadElementPattern(argument:PatternType):SpreadElementPatternType
  classPropertyDefinition(definition:MethodDefinitionType | VariableDeclaratorType | ClassPropertyDefinitionType | ClassPropertyType):ClassPropertyDefinitionType
  classProperty(key:LiteralType | IdentifierType | ExpressionType, typeAnnotation:TypeAnnotationType):ClassPropertyType
  classBody(body:(MethodDefinitionType | VariableDeclaratorType | ClassPropertyDefinitionType | ClassPropertyType)[]):ClassBodyType
  classDeclaration(id:IdentifierType, body:ClassBodyType, superClass?:ExpressionType):ClassDeclarationType
  classExpression(id:IdentifierType, body:ClassBodyType, superClass?:ExpressionType):ClassExpressionType
  classImplements(id:IdentifierType):ClassImplementsType
  exportSpecifier(id:IdentifierType, name?:IdentifierType):ExportSpecifierType
  exportBatchSpecifier():ExportBatchSpecifierType
  importSpecifier(id:IdentifierType, name?:IdentifierType):ImportSpecifierType
  importNamespaceSpecifier(id:IdentifierType):ImportNamespaceSpecifierType
  importDefaultSpecifier(id:IdentifierType):ImportDefaultSpecifierType
  exportDeclaration(_default:boolean, declaration:DeclarationType | ExpressionType, specifiers?:(ExportSpecifierType | ExportBatchSpecifierType)[], source?:LiteralType | ModuleSpecifierType):ExportDeclarationType
  importDeclaration(specifiers:(ImportSpecifierType | ImportNamespaceSpecifierType | ImportDefaultSpecifierType)[], source:LiteralType | ModuleSpecifierType):ImportDeclarationType
  templateLiteral(quasis:TemplateElementType[], expressions:ExpressionType[]):TemplateLiteralType
  templateElement(value:{
  "cooked": string
   "raw": string
}, tail:boolean):TemplateElementType
  spreadProperty(argument:ExpressionType):SpreadPropertyType
  spreadPropertyPattern(argument:PatternType):SpreadPropertyPatternType
  awaitExpression(argument:ExpressionType, all?:boolean):AwaitExpressionType
  forOfStatement(left:VariableDeclarationType | ExpressionType, right:ExpressionType, body:StatementType):ForOfStatementType
  letStatement(head:VariableDeclaratorType[], body:StatementType):LetStatementType
  letExpression(head:VariableDeclaratorType[], body:ExpressionType):LetExpressionType
  graphExpression(index:number, expression:LiteralType):GraphExpressionType
  graphIndexExpression(index:number):GraphIndexExpressionType
  jsxAttribute(name:JSXIdentifierType | JSXNamespacedNameType, value?:LiteralType | JSXExpressionContainerType):JSXAttributeType
  jsxIdentifier(name:string):JSXIdentifierType
  jsxNamespacedName(namespace:JSXIdentifierType, name:JSXIdentifierType):JSXNamespacedNameType
  jsxExpressionContainer(expression:ExpressionType):JSXExpressionContainerType
  jsxMemberExpression(object:JSXIdentifierType | JSXMemberExpressionType, property:JSXIdentifierType):JSXMemberExpressionType
  jsxSpreadAttribute(argument:ExpressionType):JSXSpreadAttributeType
  jsxElement(openingElement:JSXOpeningElementType, closingElement?:JSXClosingElementType, children?:(JSXElementType | JSXExpressionContainerType | JSXTextType | LiteralType)[]):JSXElementType
  jsxOpeningElement(name:JSXIdentifierType | JSXNamespacedNameType | JSXMemberExpressionType, attributes?:(JSXAttributeType | JSXSpreadAttributeType)[], selfClosing?:boolean):JSXOpeningElementType
  jsxClosingElement(name:JSXIdentifierType | JSXNamespacedNameType | JSXMemberExpressionType):JSXClosingElementType
  jsxText(value:string):JSXTextType
  jsxEmptyExpression():JSXEmptyExpressionType
  stringLiteralTypeAnnotation(value:string, raw:string):StringLiteralTypeAnnotationType
  typeAnnotation(typeAnnotation:TypeType):TypeAnnotationType
  nullableTypeAnnotation(typeAnnotation:TypeType):NullableTypeAnnotationType
  functionTypeAnnotation(params:FunctionTypeParamType[], returnType:TypeType, rest:FunctionTypeParamType, typeParameters:TypeParameterDeclarationType):FunctionTypeAnnotationType
  functionTypeParam(name:IdentifierType, typeAnnotation:TypeType, optional:boolean):FunctionTypeParamType
  typeParameterDeclaration(params:IdentifierType[]):TypeParameterDeclarationType
  arrayTypeAnnotation(elementType:TypeType):ArrayTypeAnnotationType
  objectTypeAnnotation(properties:ObjectTypePropertyType[]):ObjectTypeAnnotationType
  objectTypeProperty(key:LiteralType | IdentifierType, value:TypeType, optional:boolean):ObjectTypePropertyType
  objectTypeIndexer(id:IdentifierType, key:TypeType, value:TypeType):ObjectTypeIndexerType
  objectTypeCallProperty(value:FunctionTypeAnnotationType):ObjectTypeCallPropertyType
  qualifiedTypeIdentifier(qualification:IdentifierType | QualifiedTypeIdentifierType, id:IdentifierType):QualifiedTypeIdentifierType
  genericTypeAnnotation(id:IdentifierType | QualifiedTypeIdentifierType, typeParameters:TypeParameterInstantiationType):GenericTypeAnnotationType
  typeParameterInstantiation(params:TypeType[]):TypeParameterInstantiationType
  memberTypeAnnotation(object:IdentifierType, property:MemberTypeAnnotationType | GenericTypeAnnotationType):MemberTypeAnnotationType
  unionTypeAnnotation(types:TypeType[]):UnionTypeAnnotationType
  intersectionTypeAnnotation(types:TypeType[]):IntersectionTypeAnnotationType
  typeofTypeAnnotation(argument:TypeType):TypeofTypeAnnotationType
  interfaceDeclaration(id:IdentifierType, body:ObjectTypeAnnotationType, _extends:InterfaceExtendsType[]):InterfaceDeclarationType
  interfaceExtends(id:IdentifierType):InterfaceExtendsType
  typeAlias(id:IdentifierType, typeParameters:TypeParameterDeclarationType, right:TypeType):TypeAliasType
  typeCastExpression(expression:ExpressionType, typeAnnotation:TypeAnnotationType):TypeCastExpressionType
  tupleTypeAnnotation(types:TypeType[]):TupleTypeAnnotationType
  declareVariable(id:IdentifierType):DeclareVariableType
  declareFunction(id:IdentifierType):DeclareFunctionType
  declareClass(id:IdentifierType):DeclareClassType
  declareModule(id:IdentifierType | LiteralType, body:BlockStatementType):DeclareModuleType
 }

 export interface NamedTypes {
  Printable: TypeInstance
  SourceLocation: TypeInstance
  Node: TypeInstance
  Comment: TypeInstance
  Position: TypeInstance
  Program: TypeInstance
  Statement: TypeInstance
  Function: TypeInstance
  Pattern: TypeInstance
  Expression: TypeInstance
  Identifier: TypeInstance
  BlockStatement: TypeInstance
  EmptyStatement: TypeInstance
  ExpressionStatement: TypeInstance
  IfStatement: TypeInstance
  LabeledStatement: TypeInstance
  BreakStatement: TypeInstance
  ContinueStatement: TypeInstance
  WithStatement: TypeInstance
  SwitchStatement: TypeInstance
  SwitchCase: TypeInstance
  ReturnStatement: TypeInstance
  ThrowStatement: TypeInstance
  TryStatement: TypeInstance
  CatchClause: TypeInstance
  WhileStatement: TypeInstance
  DoWhileStatement: TypeInstance
  ForStatement: TypeInstance
  Declaration: TypeInstance
  VariableDeclaration: TypeInstance
  ForInStatement: TypeInstance
  DebuggerStatement: TypeInstance
  FunctionDeclaration: TypeInstance
  FunctionExpression: TypeInstance
  VariableDeclarator: TypeInstance
  ThisExpression: TypeInstance
  ArrayExpression: TypeInstance
  ObjectExpression: TypeInstance
  Property: TypeInstance
  Literal: TypeInstance
  SequenceExpression: TypeInstance
  UnaryExpression: TypeInstance
  BinaryExpression: TypeInstance
  AssignmentExpression: TypeInstance
  UpdateExpression: TypeInstance
  LogicalExpression: TypeInstance
  ConditionalExpression: TypeInstance
  NewExpression: TypeInstance
  CallExpression: TypeInstance
  MemberExpression: TypeInstance
  ObjectPattern: TypeInstance
  PropertyPattern: TypeInstance
  ArrayPattern: TypeInstance
  Block: TypeInstance
  Line: TypeInstance
  ArrowFunctionExpression: TypeInstance
  YieldExpression: TypeInstance
  GeneratorExpression: TypeInstance
  ComprehensionBlock: TypeInstance
  ComprehensionExpression: TypeInstance
  ModuleSpecifier: TypeInstance
  MethodDefinition: TypeInstance
  SpreadElement: TypeInstance
  SpreadElementPattern: TypeInstance
  ClassPropertyDefinition: TypeInstance
  ClassProperty: TypeInstance
  ClassBody: TypeInstance
  ClassDeclaration: TypeInstance
  ClassExpression: TypeInstance
  ClassImplements: TypeInstance
  Specifier: TypeInstance
  NamedSpecifier: TypeInstance
  ExportSpecifier: TypeInstance
  ExportBatchSpecifier: TypeInstance
  ImportSpecifier: TypeInstance
  ImportNamespaceSpecifier: TypeInstance
  ImportDefaultSpecifier: TypeInstance
  ExportDeclaration: TypeInstance
  ImportDeclaration: TypeInstance
  TaggedTemplateExpression: TypeInstance
  TemplateLiteral: TypeInstance
  TemplateElement: TypeInstance
  SpreadProperty: TypeInstance
  SpreadPropertyPattern: TypeInstance
  AwaitExpression: TypeInstance
  ForOfStatement: TypeInstance
  LetStatement: TypeInstance
  LetExpression: TypeInstance
  GraphExpression: TypeInstance
  GraphIndexExpression: TypeInstance
  XMLDefaultDeclaration: TypeInstance
  XMLAnyName: TypeInstance
  XMLQualifiedIdentifier: TypeInstance
  XMLFunctionQualifiedIdentifier: TypeInstance
  XMLAttributeSelector: TypeInstance
  XMLFilterExpression: TypeInstance
  XML: TypeInstance
  XMLElement: TypeInstance
  XMLList: TypeInstance
  XMLEscape: TypeInstance
  XMLText: TypeInstance
  XMLStartTag: TypeInstance
  XMLEndTag: TypeInstance
  XMLPointTag: TypeInstance
  XMLName: TypeInstance
  XMLAttribute: TypeInstance
  XMLCdata: TypeInstance
  XMLComment: TypeInstance
  XMLProcessingInstruction: TypeInstance
  JSXAttribute: TypeInstance
  JSXIdentifier: TypeInstance
  JSXNamespacedName: TypeInstance
  JSXExpressionContainer: TypeInstance
  JSXMemberExpression: TypeInstance
  JSXSpreadAttribute: TypeInstance
  JSXElement: TypeInstance
  JSXOpeningElement: TypeInstance
  JSXClosingElement: TypeInstance
  JSXText: TypeInstance
  JSXEmptyExpression: TypeInstance
  Type: TypeInstance
  AnyTypeAnnotation: TypeInstance
  VoidTypeAnnotation: TypeInstance
  NumberTypeAnnotation: TypeInstance
  StringTypeAnnotation: TypeInstance
  StringLiteralTypeAnnotation: TypeInstance
  BooleanTypeAnnotation: TypeInstance
  TypeAnnotation: TypeInstance
  NullableTypeAnnotation: TypeInstance
  FunctionTypeAnnotation: TypeInstance
  FunctionTypeParam: TypeInstance
  TypeParameterDeclaration: TypeInstance
  ArrayTypeAnnotation: TypeInstance
  ObjectTypeAnnotation: TypeInstance
  ObjectTypeProperty: TypeInstance
  ObjectTypeIndexer: TypeInstance
  ObjectTypeCallProperty: TypeInstance
  QualifiedTypeIdentifier: TypeInstance
  GenericTypeAnnotation: TypeInstance
  TypeParameterInstantiation: TypeInstance
  MemberTypeAnnotation: TypeInstance
  UnionTypeAnnotation: TypeInstance
  IntersectionTypeAnnotation: TypeInstance
  TypeofTypeAnnotation: TypeInstance
  InterfaceDeclaration: TypeInstance
  InterfaceExtends: TypeInstance
  TypeAlias: TypeInstance
  TypeCastExpression: TypeInstance
  TupleTypeAnnotation: TypeInstance
  DeclareVariable: TypeInstance
  DeclareFunction: TypeInstance
  DeclareClass: TypeInstance
  DeclareModule: TypeInstance
 }

 export interface PathVisitorMethods {
  visitPrintable?(path:NodePathInstance, ...additionalArgs)
  visitSourceLocation?(path:NodePathInstance, ...additionalArgs)
  visitNode?(path:NodePathInstance, ...additionalArgs)
  visitComment?(path:NodePathInstance, ...additionalArgs)
  visitPosition?(path:NodePathInstance, ...additionalArgs)
  visitProgram?(path:NodePathInstance, ...additionalArgs)
  visitStatement?(path:NodePathInstance, ...additionalArgs)
  visitFunction?(path:NodePathInstance, ...additionalArgs)
  visitPattern?(path:NodePathInstance, ...additionalArgs)
  visitExpression?(path:NodePathInstance, ...additionalArgs)
  visitIdentifier?(path:NodePathInstance, ...additionalArgs)
  visitBlockStatement?(path:NodePathInstance, ...additionalArgs)
  visitEmptyStatement?(path:NodePathInstance, ...additionalArgs)
  visitExpressionStatement?(path:NodePathInstance, ...additionalArgs)
  visitIfStatement?(path:NodePathInstance, ...additionalArgs)
  visitLabeledStatement?(path:NodePathInstance, ...additionalArgs)
  visitBreakStatement?(path:NodePathInstance, ...additionalArgs)
  visitContinueStatement?(path:NodePathInstance, ...additionalArgs)
  visitWithStatement?(path:NodePathInstance, ...additionalArgs)
  visitSwitchStatement?(path:NodePathInstance, ...additionalArgs)
  visitSwitchCase?(path:NodePathInstance, ...additionalArgs)
  visitReturnStatement?(path:NodePathInstance, ...additionalArgs)
  visitThrowStatement?(path:NodePathInstance, ...additionalArgs)
  visitTryStatement?(path:NodePathInstance, ...additionalArgs)
  visitCatchClause?(path:NodePathInstance, ...additionalArgs)
  visitWhileStatement?(path:NodePathInstance, ...additionalArgs)
  visitDoWhileStatement?(path:NodePathInstance, ...additionalArgs)
  visitForStatement?(path:NodePathInstance, ...additionalArgs)
  visitDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitVariableDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitForInStatement?(path:NodePathInstance, ...additionalArgs)
  visitDebuggerStatement?(path:NodePathInstance, ...additionalArgs)
  visitFunctionDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitFunctionExpression?(path:NodePathInstance, ...additionalArgs)
  visitVariableDeclarator?(path:NodePathInstance, ...additionalArgs)
  visitThisExpression?(path:NodePathInstance, ...additionalArgs)
  visitArrayExpression?(path:NodePathInstance, ...additionalArgs)
  visitObjectExpression?(path:NodePathInstance, ...additionalArgs)
  visitProperty?(path:NodePathInstance, ...additionalArgs)
  visitLiteral?(path:NodePathInstance, ...additionalArgs)
  visitSequenceExpression?(path:NodePathInstance, ...additionalArgs)
  visitUnaryExpression?(path:NodePathInstance, ...additionalArgs)
  visitBinaryExpression?(path:NodePathInstance, ...additionalArgs)
  visitAssignmentExpression?(path:NodePathInstance, ...additionalArgs)
  visitUpdateExpression?(path:NodePathInstance, ...additionalArgs)
  visitLogicalExpression?(path:NodePathInstance, ...additionalArgs)
  visitConditionalExpression?(path:NodePathInstance, ...additionalArgs)
  visitNewExpression?(path:NodePathInstance, ...additionalArgs)
  visitCallExpression?(path:NodePathInstance, ...additionalArgs)
  visitMemberExpression?(path:NodePathInstance, ...additionalArgs)
  visitObjectPattern?(path:NodePathInstance, ...additionalArgs)
  visitPropertyPattern?(path:NodePathInstance, ...additionalArgs)
  visitArrayPattern?(path:NodePathInstance, ...additionalArgs)
  visitBlock?(path:NodePathInstance, ...additionalArgs)
  visitLine?(path:NodePathInstance, ...additionalArgs)
  visitArrowFunctionExpression?(path:NodePathInstance, ...additionalArgs)
  visitYieldExpression?(path:NodePathInstance, ...additionalArgs)
  visitGeneratorExpression?(path:NodePathInstance, ...additionalArgs)
  visitComprehensionBlock?(path:NodePathInstance, ...additionalArgs)
  visitComprehensionExpression?(path:NodePathInstance, ...additionalArgs)
  visitModuleSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitMethodDefinition?(path:NodePathInstance, ...additionalArgs)
  visitSpreadElement?(path:NodePathInstance, ...additionalArgs)
  visitSpreadElementPattern?(path:NodePathInstance, ...additionalArgs)
  visitClassPropertyDefinition?(path:NodePathInstance, ...additionalArgs)
  visitClassProperty?(path:NodePathInstance, ...additionalArgs)
  visitClassBody?(path:NodePathInstance, ...additionalArgs)
  visitClassDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitClassExpression?(path:NodePathInstance, ...additionalArgs)
  visitClassImplements?(path:NodePathInstance, ...additionalArgs)
  visitSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitNamedSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitExportSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitExportBatchSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitImportSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitImportNamespaceSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitImportDefaultSpecifier?(path:NodePathInstance, ...additionalArgs)
  visitExportDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitImportDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitTaggedTemplateExpression?(path:NodePathInstance, ...additionalArgs)
  visitTemplateLiteral?(path:NodePathInstance, ...additionalArgs)
  visitTemplateElement?(path:NodePathInstance, ...additionalArgs)
  visitSpreadProperty?(path:NodePathInstance, ...additionalArgs)
  visitSpreadPropertyPattern?(path:NodePathInstance, ...additionalArgs)
  visitAwaitExpression?(path:NodePathInstance, ...additionalArgs)
  visitForOfStatement?(path:NodePathInstance, ...additionalArgs)
  visitLetStatement?(path:NodePathInstance, ...additionalArgs)
  visitLetExpression?(path:NodePathInstance, ...additionalArgs)
  visitGraphExpression?(path:NodePathInstance, ...additionalArgs)
  visitGraphIndexExpression?(path:NodePathInstance, ...additionalArgs)
  visitXMLDefaultDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitXMLAnyName?(path:NodePathInstance, ...additionalArgs)
  visitXMLQualifiedIdentifier?(path:NodePathInstance, ...additionalArgs)
  visitXMLFunctionQualifiedIdentifier?(path:NodePathInstance, ...additionalArgs)
  visitXMLAttributeSelector?(path:NodePathInstance, ...additionalArgs)
  visitXMLFilterExpression?(path:NodePathInstance, ...additionalArgs)
  visitXML?(path:NodePathInstance, ...additionalArgs)
  visitXMLElement?(path:NodePathInstance, ...additionalArgs)
  visitXMLList?(path:NodePathInstance, ...additionalArgs)
  visitXMLEscape?(path:NodePathInstance, ...additionalArgs)
  visitXMLText?(path:NodePathInstance, ...additionalArgs)
  visitXMLStartTag?(path:NodePathInstance, ...additionalArgs)
  visitXMLEndTag?(path:NodePathInstance, ...additionalArgs)
  visitXMLPointTag?(path:NodePathInstance, ...additionalArgs)
  visitXMLName?(path:NodePathInstance, ...additionalArgs)
  visitXMLAttribute?(path:NodePathInstance, ...additionalArgs)
  visitXMLCdata?(path:NodePathInstance, ...additionalArgs)
  visitXMLComment?(path:NodePathInstance, ...additionalArgs)
  visitXMLProcessingInstruction?(path:NodePathInstance, ...additionalArgs)
  visitJSXAttribute?(path:NodePathInstance, ...additionalArgs)
  visitJSXIdentifier?(path:NodePathInstance, ...additionalArgs)
  visitJSXNamespacedName?(path:NodePathInstance, ...additionalArgs)
  visitJSXExpressionContainer?(path:NodePathInstance, ...additionalArgs)
  visitJSXMemberExpression?(path:NodePathInstance, ...additionalArgs)
  visitJSXSpreadAttribute?(path:NodePathInstance, ...additionalArgs)
  visitJSXElement?(path:NodePathInstance, ...additionalArgs)
  visitJSXOpeningElement?(path:NodePathInstance, ...additionalArgs)
  visitJSXClosingElement?(path:NodePathInstance, ...additionalArgs)
  visitJSXText?(path:NodePathInstance, ...additionalArgs)
  visitJSXEmptyExpression?(path:NodePathInstance, ...additionalArgs)
  visitType?(path:NodePathInstance, ...additionalArgs)
  visitAnyTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitVoidTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitNumberTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitStringTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitStringLiteralTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitBooleanTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitNullableTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitFunctionTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitFunctionTypeParam?(path:NodePathInstance, ...additionalArgs)
  visitTypeParameterDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitArrayTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitObjectTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitObjectTypeProperty?(path:NodePathInstance, ...additionalArgs)
  visitObjectTypeIndexer?(path:NodePathInstance, ...additionalArgs)
  visitObjectTypeCallProperty?(path:NodePathInstance, ...additionalArgs)
  visitQualifiedTypeIdentifier?(path:NodePathInstance, ...additionalArgs)
  visitGenericTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitTypeParameterInstantiation?(path:NodePathInstance, ...additionalArgs)
  visitMemberTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitUnionTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitIntersectionTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitTypeofTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitInterfaceDeclaration?(path:NodePathInstance, ...additionalArgs)
  visitInterfaceExtends?(path:NodePathInstance, ...additionalArgs)
  visitTypeAlias?(path:NodePathInstance, ...additionalArgs)
  visitTypeCastExpression?(path:NodePathInstance, ...additionalArgs)
  visitTupleTypeAnnotation?(path:NodePathInstance, ...additionalArgs)
  visitDeclareVariable?(path:NodePathInstance, ...additionalArgs)
  visitDeclareFunction?(path:NodePathInstance, ...additionalArgs)
  visitDeclareClass?(path:NodePathInstance, ...additionalArgs)
  visitDeclareModule?(path:NodePathInstance, ...additionalArgs)
 }
}
