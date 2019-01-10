/* !!! THIS FILE WAS AUTO-GENERATED BY `npm run gen` !!! */
import * as N from "./nodes";
export type PrintableKind = N.File | N.Program | N.Identifier | N.BlockStatement | N.EmptyStatement | N.ExpressionStatement | N.IfStatement | N.LabeledStatement | N.BreakStatement | N.ContinueStatement | N.WithStatement | N.SwitchStatement | N.SwitchCase | N.ReturnStatement | N.ThrowStatement | N.TryStatement | N.CatchClause | N.WhileStatement | N.DoWhileStatement | N.ForStatement | N.VariableDeclaration | N.ForInStatement | N.DebuggerStatement | N.FunctionDeclaration | N.FunctionExpression | N.VariableDeclarator | N.ThisExpression | N.ArrayExpression | N.ObjectExpression | N.Property | N.Literal | N.SequenceExpression | N.UnaryExpression | N.BinaryExpression | N.AssignmentExpression | N.UpdateExpression | N.LogicalExpression | N.ConditionalExpression | N.NewExpression | N.CallExpression | N.MemberExpression | N.RestElement | N.TypeAnnotation | N.TSTypeAnnotation | N.SpreadElementPattern | N.ArrowFunctionExpression | N.ForOfStatement | N.YieldExpression | N.GeneratorExpression | N.ComprehensionBlock | N.ComprehensionExpression | N.ObjectProperty | N.PropertyPattern | N.ObjectPattern | N.ArrayPattern | N.MethodDefinition | N.SpreadElement | N.AssignmentPattern | N.ClassPropertyDefinition | N.ClassProperty | N.ClassBody | N.ClassDeclaration | N.ClassExpression | N.ImportSpecifier | N.ImportNamespaceSpecifier | N.ImportDefaultSpecifier | N.ImportDeclaration | N.TaggedTemplateExpression | N.TemplateLiteral | N.TemplateElement | N.SpreadProperty | N.SpreadPropertyPattern | N.AwaitExpression | N.JSXAttribute | N.JSXIdentifier | N.JSXNamespacedName | N.JSXExpressionContainer | N.JSXMemberExpression | N.JSXSpreadAttribute | N.JSXElement | N.JSXOpeningElement | N.JSXClosingElement | N.JSXFragment | N.JSXText | N.JSXOpeningFragment | N.JSXClosingFragment | N.JSXEmptyExpression | N.JSXSpreadChild | N.TypeParameterDeclaration | N.TSTypeParameterDeclaration | N.TypeParameterInstantiation | N.TSTypeParameterInstantiation | N.ClassImplements | N.TSExpressionWithTypeArguments | N.AnyTypeAnnotation | N.EmptyTypeAnnotation | N.MixedTypeAnnotation | N.VoidTypeAnnotation | N.NumberTypeAnnotation | N.NumberLiteralTypeAnnotation | N.NumericLiteralTypeAnnotation | N.StringTypeAnnotation | N.StringLiteralTypeAnnotation | N.BooleanTypeAnnotation | N.BooleanLiteralTypeAnnotation | N.NullableTypeAnnotation | N.NullLiteralTypeAnnotation | N.NullTypeAnnotation | N.ThisTypeAnnotation | N.ExistsTypeAnnotation | N.ExistentialTypeParam | N.FunctionTypeAnnotation | N.FunctionTypeParam | N.ArrayTypeAnnotation | N.ObjectTypeAnnotation | N.ObjectTypeProperty | N.ObjectTypeSpreadProperty | N.ObjectTypeIndexer | N.ObjectTypeCallProperty | N.ObjectTypeInternalSlot | N.Variance | N.QualifiedTypeIdentifier | N.GenericTypeAnnotation | N.MemberTypeAnnotation | N.UnionTypeAnnotation | N.IntersectionTypeAnnotation | N.TypeofTypeAnnotation | N.TypeParameter | N.InterfaceTypeAnnotation | N.InterfaceExtends | N.InterfaceDeclaration | N.DeclareInterface | N.TypeAlias | N.OpaqueType | N.DeclareTypeAlias | N.DeclareOpaqueType | N.TypeCastExpression | N.TupleTypeAnnotation | N.DeclareVariable | N.DeclareFunction | N.DeclareClass | N.DeclareModule | N.DeclareModuleExports | N.DeclareExportDeclaration | N.ExportSpecifier | N.ExportBatchSpecifier | N.DeclareExportAllDeclaration | N.InferredPredicate | N.DeclaredPredicate | N.ExportDeclaration | N.Block | N.Line | N.Noop | N.DoExpression | N.Super | N.BindExpression | N.Decorator | N.MetaProperty | N.ParenthesizedExpression | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExportNamespaceSpecifier | N.ExportDefaultSpecifier | N.ExportAllDeclaration | N.CommentBlock | N.CommentLine | N.Directive | N.DirectiveLiteral | N.InterpreterDirective | N.StringLiteral | N.NumericLiteral | N.BigIntLiteral | N.NullLiteral | N.BooleanLiteral | N.RegExpLiteral | N.ObjectMethod | N.ClassPrivateProperty | N.ClassMethod | N.ClassPrivateMethod | N.PrivateName | N.RestProperty | N.ForAwaitStatement | N.Import | N.TSQualifiedName | N.TSTypeReference | N.TSAsExpression | N.TSNonNullExpression | N.TSAnyKeyword | N.TSBooleanKeyword | N.TSNeverKeyword | N.TSNullKeyword | N.TSNumberKeyword | N.TSObjectKeyword | N.TSStringKeyword | N.TSSymbolKeyword | N.TSUndefinedKeyword | N.TSUnknownKeyword | N.TSVoidKeyword | N.TSThisType | N.TSArrayType | N.TSLiteralType | N.TSUnionType | N.TSIntersectionType | N.TSConditionalType | N.TSInferType | N.TSTypeParameter | N.TSParenthesizedType | N.TSFunctionType | N.TSConstructorType | N.TSDeclareFunction | N.TSDeclareMethod | N.TSMappedType | N.TSTupleType | N.TSRestType | N.TSOptionalType | N.TSIndexedAccessType | N.TSTypeOperator | N.TSIndexSignature | N.TSPropertySignature | N.TSMethodSignature | N.TSTypePredicate | N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration | N.TSEnumMember | N.TSTypeQuery | N.TSTypeLiteral | N.TSTypeAssertion | N.TSEnumDeclaration | N.TSTypeAliasDeclaration | N.TSModuleBlock | N.TSModuleDeclaration | N.TSImportEqualsDeclaration | N.TSExternalModuleReference | N.TSExportAssignment | N.TSNamespaceExportDeclaration | N.TSInterfaceBody | N.TSInterfaceDeclaration | N.TSParameterProperty | N.OptionalMemberExpression | N.OptionalCallExpression;
export type SourceLocationKind = N.SourceLocation;
export type NodeKind = N.File | N.Program | N.Identifier | N.BlockStatement | N.EmptyStatement | N.ExpressionStatement | N.IfStatement | N.LabeledStatement | N.BreakStatement | N.ContinueStatement | N.WithStatement | N.SwitchStatement | N.SwitchCase | N.ReturnStatement | N.ThrowStatement | N.TryStatement | N.CatchClause | N.WhileStatement | N.DoWhileStatement | N.ForStatement | N.VariableDeclaration | N.ForInStatement | N.DebuggerStatement | N.FunctionDeclaration | N.FunctionExpression | N.VariableDeclarator | N.ThisExpression | N.ArrayExpression | N.ObjectExpression | N.Property | N.Literal | N.SequenceExpression | N.UnaryExpression | N.BinaryExpression | N.AssignmentExpression | N.UpdateExpression | N.LogicalExpression | N.ConditionalExpression | N.NewExpression | N.CallExpression | N.MemberExpression | N.RestElement | N.TypeAnnotation | N.TSTypeAnnotation | N.SpreadElementPattern | N.ArrowFunctionExpression | N.ForOfStatement | N.YieldExpression | N.GeneratorExpression | N.ComprehensionBlock | N.ComprehensionExpression | N.ObjectProperty | N.PropertyPattern | N.ObjectPattern | N.ArrayPattern | N.MethodDefinition | N.SpreadElement | N.AssignmentPattern | N.ClassPropertyDefinition | N.ClassProperty | N.ClassBody | N.ClassDeclaration | N.ClassExpression | N.ImportSpecifier | N.ImportNamespaceSpecifier | N.ImportDefaultSpecifier | N.ImportDeclaration | N.TaggedTemplateExpression | N.TemplateLiteral | N.TemplateElement | N.SpreadProperty | N.SpreadPropertyPattern | N.AwaitExpression | N.JSXAttribute | N.JSXIdentifier | N.JSXNamespacedName | N.JSXExpressionContainer | N.JSXMemberExpression | N.JSXSpreadAttribute | N.JSXElement | N.JSXOpeningElement | N.JSXClosingElement | N.JSXFragment | N.JSXText | N.JSXOpeningFragment | N.JSXClosingFragment | N.JSXEmptyExpression | N.JSXSpreadChild | N.TypeParameterDeclaration | N.TSTypeParameterDeclaration | N.TypeParameterInstantiation | N.TSTypeParameterInstantiation | N.ClassImplements | N.TSExpressionWithTypeArguments | N.AnyTypeAnnotation | N.EmptyTypeAnnotation | N.MixedTypeAnnotation | N.VoidTypeAnnotation | N.NumberTypeAnnotation | N.NumberLiteralTypeAnnotation | N.NumericLiteralTypeAnnotation | N.StringTypeAnnotation | N.StringLiteralTypeAnnotation | N.BooleanTypeAnnotation | N.BooleanLiteralTypeAnnotation | N.NullableTypeAnnotation | N.NullLiteralTypeAnnotation | N.NullTypeAnnotation | N.ThisTypeAnnotation | N.ExistsTypeAnnotation | N.ExistentialTypeParam | N.FunctionTypeAnnotation | N.FunctionTypeParam | N.ArrayTypeAnnotation | N.ObjectTypeAnnotation | N.ObjectTypeProperty | N.ObjectTypeSpreadProperty | N.ObjectTypeIndexer | N.ObjectTypeCallProperty | N.ObjectTypeInternalSlot | N.Variance | N.QualifiedTypeIdentifier | N.GenericTypeAnnotation | N.MemberTypeAnnotation | N.UnionTypeAnnotation | N.IntersectionTypeAnnotation | N.TypeofTypeAnnotation | N.TypeParameter | N.InterfaceTypeAnnotation | N.InterfaceExtends | N.InterfaceDeclaration | N.DeclareInterface | N.TypeAlias | N.OpaqueType | N.DeclareTypeAlias | N.DeclareOpaqueType | N.TypeCastExpression | N.TupleTypeAnnotation | N.DeclareVariable | N.DeclareFunction | N.DeclareClass | N.DeclareModule | N.DeclareModuleExports | N.DeclareExportDeclaration | N.ExportSpecifier | N.ExportBatchSpecifier | N.DeclareExportAllDeclaration | N.InferredPredicate | N.DeclaredPredicate | N.ExportDeclaration | N.Noop | N.DoExpression | N.Super | N.BindExpression | N.Decorator | N.MetaProperty | N.ParenthesizedExpression | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExportNamespaceSpecifier | N.ExportDefaultSpecifier | N.ExportAllDeclaration | N.Directive | N.DirectiveLiteral | N.InterpreterDirective | N.StringLiteral | N.NumericLiteral | N.BigIntLiteral | N.NullLiteral | N.BooleanLiteral | N.RegExpLiteral | N.ObjectMethod | N.ClassPrivateProperty | N.ClassMethod | N.ClassPrivateMethod | N.PrivateName | N.RestProperty | N.ForAwaitStatement | N.Import | N.TSQualifiedName | N.TSTypeReference | N.TSAsExpression | N.TSNonNullExpression | N.TSAnyKeyword | N.TSBooleanKeyword | N.TSNeverKeyword | N.TSNullKeyword | N.TSNumberKeyword | N.TSObjectKeyword | N.TSStringKeyword | N.TSSymbolKeyword | N.TSUndefinedKeyword | N.TSUnknownKeyword | N.TSVoidKeyword | N.TSThisType | N.TSArrayType | N.TSLiteralType | N.TSUnionType | N.TSIntersectionType | N.TSConditionalType | N.TSInferType | N.TSTypeParameter | N.TSParenthesizedType | N.TSFunctionType | N.TSConstructorType | N.TSDeclareFunction | N.TSDeclareMethod | N.TSMappedType | N.TSTupleType | N.TSRestType | N.TSOptionalType | N.TSIndexedAccessType | N.TSTypeOperator | N.TSIndexSignature | N.TSPropertySignature | N.TSMethodSignature | N.TSTypePredicate | N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration | N.TSEnumMember | N.TSTypeQuery | N.TSTypeLiteral | N.TSTypeAssertion | N.TSEnumDeclaration | N.TSTypeAliasDeclaration | N.TSModuleBlock | N.TSModuleDeclaration | N.TSImportEqualsDeclaration | N.TSExternalModuleReference | N.TSExportAssignment | N.TSNamespaceExportDeclaration | N.TSInterfaceBody | N.TSInterfaceDeclaration | N.TSParameterProperty | N.OptionalMemberExpression | N.OptionalCallExpression;
export type CommentKind = N.Block | N.Line | N.CommentBlock | N.CommentLine;
export type PositionKind = N.Position;
export type FileKind = N.File;
export type ProgramKind = N.Program;
export type StatementKind = N.BlockStatement | N.EmptyStatement | N.ExpressionStatement | N.IfStatement | N.LabeledStatement | N.BreakStatement | N.ContinueStatement | N.WithStatement | N.SwitchStatement | N.ReturnStatement | N.ThrowStatement | N.TryStatement | N.WhileStatement | N.DoWhileStatement | N.ForStatement | N.VariableDeclaration | N.ForInStatement | N.DebuggerStatement | N.FunctionDeclaration | N.ForOfStatement | N.MethodDefinition | N.ClassPropertyDefinition | N.ClassProperty | N.ClassBody | N.ClassDeclaration | N.ImportDeclaration | N.TSTypeParameterDeclaration | N.InterfaceDeclaration | N.DeclareInterface | N.TypeAlias | N.OpaqueType | N.DeclareTypeAlias | N.DeclareOpaqueType | N.DeclareVariable | N.DeclareFunction | N.DeclareClass | N.DeclareModule | N.DeclareModuleExports | N.DeclareExportDeclaration | N.DeclareExportAllDeclaration | N.ExportDeclaration | N.Noop | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration | N.ClassPrivateProperty | N.ClassMethod | N.ClassPrivateMethod | N.ForAwaitStatement | N.TSDeclareFunction | N.TSDeclareMethod | N.TSIndexSignature | N.TSPropertySignature | N.TSMethodSignature | N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration | N.TSEnumDeclaration | N.TSTypeAliasDeclaration | N.TSModuleDeclaration | N.TSImportEqualsDeclaration | N.TSExternalModuleReference | N.TSExportAssignment | N.TSNamespaceExportDeclaration | N.TSInterfaceDeclaration;
export type FunctionKind = N.FunctionDeclaration | N.FunctionExpression | N.ArrowFunctionExpression | N.ObjectMethod | N.ClassMethod | N.ClassPrivateMethod;
export type PatternKind = N.Identifier | N.FunctionExpression | N.ThisExpression | N.ArrayExpression | N.ObjectExpression | N.Literal | N.SequenceExpression | N.UnaryExpression | N.BinaryExpression | N.AssignmentExpression | N.UpdateExpression | N.LogicalExpression | N.ConditionalExpression | N.NewExpression | N.CallExpression | N.MemberExpression | N.RestElement | N.SpreadElementPattern | N.ArrowFunctionExpression | N.YieldExpression | N.GeneratorExpression | N.ComprehensionExpression | N.PropertyPattern | N.ObjectPattern | N.ArrayPattern | N.AssignmentPattern | N.ClassExpression | N.TaggedTemplateExpression | N.TemplateLiteral | N.SpreadPropertyPattern | N.AwaitExpression | N.JSXIdentifier | N.JSXExpressionContainer | N.JSXMemberExpression | N.JSXElement | N.JSXFragment | N.JSXText | N.JSXEmptyExpression | N.JSXSpreadChild | N.TypeCastExpression | N.DoExpression | N.Super | N.BindExpression | N.MetaProperty | N.ParenthesizedExpression | N.DirectiveLiteral | N.StringLiteral | N.NumericLiteral | N.BigIntLiteral | N.NullLiteral | N.BooleanLiteral | N.RegExpLiteral | N.PrivateName | N.Import | N.TSAsExpression | N.TSNonNullExpression | N.TSTypeParameter | N.TSTypeAssertion | N.TSParameterProperty | N.OptionalMemberExpression | N.OptionalCallExpression;
export type ExpressionKind = N.Identifier | N.FunctionExpression | N.ThisExpression | N.ArrayExpression | N.ObjectExpression | N.Literal | N.SequenceExpression | N.UnaryExpression | N.BinaryExpression | N.AssignmentExpression | N.UpdateExpression | N.LogicalExpression | N.ConditionalExpression | N.NewExpression | N.CallExpression | N.MemberExpression | N.ArrowFunctionExpression | N.YieldExpression | N.GeneratorExpression | N.ComprehensionExpression | N.ClassExpression | N.TaggedTemplateExpression | N.TemplateLiteral | N.AwaitExpression | N.JSXIdentifier | N.JSXExpressionContainer | N.JSXMemberExpression | N.JSXElement | N.JSXFragment | N.JSXText | N.JSXEmptyExpression | N.JSXSpreadChild | N.TypeCastExpression | N.DoExpression | N.Super | N.BindExpression | N.MetaProperty | N.ParenthesizedExpression | N.DirectiveLiteral | N.StringLiteral | N.NumericLiteral | N.BigIntLiteral | N.NullLiteral | N.BooleanLiteral | N.RegExpLiteral | N.PrivateName | N.Import | N.TSAsExpression | N.TSNonNullExpression | N.TSTypeParameter | N.TSTypeAssertion | N.OptionalMemberExpression | N.OptionalCallExpression;
export type IdentifierKind = N.Identifier | N.JSXIdentifier | N.TSTypeParameter;
export type BlockStatementKind = N.BlockStatement;
export type EmptyStatementKind = N.EmptyStatement;
export type ExpressionStatementKind = N.ExpressionStatement;
export type IfStatementKind = N.IfStatement;
export type LabeledStatementKind = N.LabeledStatement;
export type BreakStatementKind = N.BreakStatement;
export type ContinueStatementKind = N.ContinueStatement;
export type WithStatementKind = N.WithStatement;
export type SwitchStatementKind = N.SwitchStatement;
export type SwitchCaseKind = N.SwitchCase;
export type ReturnStatementKind = N.ReturnStatement;
export type ThrowStatementKind = N.ThrowStatement;
export type TryStatementKind = N.TryStatement;
export type CatchClauseKind = N.CatchClause;
export type WhileStatementKind = N.WhileStatement;
export type DoWhileStatementKind = N.DoWhileStatement;
export type ForStatementKind = N.ForStatement;
export type DeclarationKind = N.VariableDeclaration | N.FunctionDeclaration | N.MethodDefinition | N.ClassPropertyDefinition | N.ClassProperty | N.ClassBody | N.ClassDeclaration | N.ImportDeclaration | N.TSTypeParameterDeclaration | N.InterfaceDeclaration | N.DeclareInterface | N.TypeAlias | N.OpaqueType | N.DeclareTypeAlias | N.DeclareOpaqueType | N.DeclareClass | N.DeclareExportDeclaration | N.DeclareExportAllDeclaration | N.ExportDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration | N.ClassPrivateProperty | N.ClassMethod | N.ClassPrivateMethod | N.TSDeclareFunction | N.TSDeclareMethod | N.TSIndexSignature | N.TSPropertySignature | N.TSMethodSignature | N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration | N.TSEnumDeclaration | N.TSTypeAliasDeclaration | N.TSModuleDeclaration | N.TSImportEqualsDeclaration | N.TSExternalModuleReference | N.TSNamespaceExportDeclaration | N.TSInterfaceDeclaration;
export type VariableDeclarationKind = N.VariableDeclaration;
export type ForInStatementKind = N.ForInStatement;
export type DebuggerStatementKind = N.DebuggerStatement;
export type FunctionDeclarationKind = N.FunctionDeclaration;
export type FunctionExpressionKind = N.FunctionExpression;
export type VariableDeclaratorKind = N.VariableDeclarator;
export type ThisExpressionKind = N.ThisExpression;
export type ArrayExpressionKind = N.ArrayExpression;
export type ObjectExpressionKind = N.ObjectExpression;
export type PropertyKind = N.Property;
export type LiteralKind = N.Literal | N.JSXText | N.StringLiteral | N.NumericLiteral | N.BigIntLiteral | N.NullLiteral | N.BooleanLiteral | N.RegExpLiteral;
export type SequenceExpressionKind = N.SequenceExpression;
export type UnaryExpressionKind = N.UnaryExpression;
export type BinaryExpressionKind = N.BinaryExpression;
export type AssignmentExpressionKind = N.AssignmentExpression;
export type UpdateExpressionKind = N.UpdateExpression;
export type LogicalExpressionKind = N.LogicalExpression;
export type ConditionalExpressionKind = N.ConditionalExpression;
export type NewExpressionKind = N.NewExpression;
export type CallExpressionKind = N.CallExpression | N.OptionalCallExpression;
export type MemberExpressionKind = N.MemberExpression | N.JSXMemberExpression | N.OptionalMemberExpression;
export type RestElementKind = N.RestElement;
export type TypeAnnotationKind = N.TypeAnnotation;
export type TSTypeAnnotationKind = N.TSTypeAnnotation | N.TSTypePredicate;
export type SpreadElementPatternKind = N.SpreadElementPattern;
export type ArrowFunctionExpressionKind = N.ArrowFunctionExpression;
export type ForOfStatementKind = N.ForOfStatement;
export type YieldExpressionKind = N.YieldExpression;
export type GeneratorExpressionKind = N.GeneratorExpression;
export type ComprehensionBlockKind = N.ComprehensionBlock;
export type ComprehensionExpressionKind = N.ComprehensionExpression;
export type ObjectPropertyKind = N.ObjectProperty;
export type PropertyPatternKind = N.PropertyPattern;
export type ObjectPatternKind = N.ObjectPattern;
export type ArrayPatternKind = N.ArrayPattern;
export type MethodDefinitionKind = N.MethodDefinition;
export type SpreadElementKind = N.SpreadElement;
export type AssignmentPatternKind = N.AssignmentPattern;
export type ClassPropertyDefinitionKind = N.ClassPropertyDefinition;
export type ClassPropertyKind = N.ClassProperty | N.ClassPrivateProperty;
export type ClassBodyKind = N.ClassBody;
export type ClassDeclarationKind = N.ClassDeclaration;
export type ClassExpressionKind = N.ClassExpression;
export type SpecifierKind = N.ImportSpecifier | N.ImportNamespaceSpecifier | N.ImportDefaultSpecifier | N.ExportSpecifier | N.ExportBatchSpecifier | N.ExportNamespaceSpecifier | N.ExportDefaultSpecifier;
export type ModuleSpecifierKind = N.ImportSpecifier | N.ImportNamespaceSpecifier | N.ImportDefaultSpecifier | N.ExportSpecifier;
export type ImportSpecifierKind = N.ImportSpecifier;
export type ImportNamespaceSpecifierKind = N.ImportNamespaceSpecifier;
export type ImportDefaultSpecifierKind = N.ImportDefaultSpecifier;
export type ImportDeclarationKind = N.ImportDeclaration;
export type TaggedTemplateExpressionKind = N.TaggedTemplateExpression;
export type TemplateLiteralKind = N.TemplateLiteral;
export type TemplateElementKind = N.TemplateElement;
export type SpreadPropertyKind = N.SpreadProperty;
export type SpreadPropertyPatternKind = N.SpreadPropertyPattern;
export type AwaitExpressionKind = N.AwaitExpression;
export type JSXAttributeKind = N.JSXAttribute;
export type JSXIdentifierKind = N.JSXIdentifier;
export type JSXNamespacedNameKind = N.JSXNamespacedName;
export type JSXExpressionContainerKind = N.JSXExpressionContainer;
export type JSXMemberExpressionKind = N.JSXMemberExpression;
export type JSXSpreadAttributeKind = N.JSXSpreadAttribute;
export type JSXElementKind = N.JSXElement;
export type JSXOpeningElementKind = N.JSXOpeningElement;
export type JSXClosingElementKind = N.JSXClosingElement;
export type JSXFragmentKind = N.JSXFragment;
export type JSXTextKind = N.JSXText;
export type JSXOpeningFragmentKind = N.JSXOpeningFragment;
export type JSXClosingFragmentKind = N.JSXClosingFragment;
export type JSXEmptyExpressionKind = N.JSXEmptyExpression;
export type JSXSpreadChildKind = N.JSXSpreadChild;
export type TypeParameterDeclarationKind = N.TypeParameterDeclaration;
export type TSTypeParameterDeclarationKind = N.TSTypeParameterDeclaration;
export type TypeParameterInstantiationKind = N.TypeParameterInstantiation;
export type TSTypeParameterInstantiationKind = N.TSTypeParameterInstantiation;
export type ClassImplementsKind = N.ClassImplements;
export type TSTypeKind = N.TSExpressionWithTypeArguments | N.TSTypeReference | N.TSAnyKeyword | N.TSBooleanKeyword | N.TSNeverKeyword | N.TSNullKeyword | N.TSNumberKeyword | N.TSObjectKeyword | N.TSStringKeyword | N.TSSymbolKeyword | N.TSUndefinedKeyword | N.TSUnknownKeyword | N.TSVoidKeyword | N.TSThisType | N.TSArrayType | N.TSLiteralType | N.TSUnionType | N.TSIntersectionType | N.TSConditionalType | N.TSInferType | N.TSParenthesizedType | N.TSFunctionType | N.TSConstructorType | N.TSMappedType | N.TSTupleType | N.TSRestType | N.TSOptionalType | N.TSIndexedAccessType | N.TSTypeOperator | N.TSTypeQuery | N.TSTypeLiteral;
export type TSExpressionWithTypeArgumentsKind = N.TSExpressionWithTypeArguments;
export type FlowKind = N.AnyTypeAnnotation | N.EmptyTypeAnnotation | N.MixedTypeAnnotation | N.VoidTypeAnnotation | N.NumberTypeAnnotation | N.NumberLiteralTypeAnnotation | N.NumericLiteralTypeAnnotation | N.StringTypeAnnotation | N.StringLiteralTypeAnnotation | N.BooleanTypeAnnotation | N.BooleanLiteralTypeAnnotation | N.NullableTypeAnnotation | N.NullLiteralTypeAnnotation | N.NullTypeAnnotation | N.ThisTypeAnnotation | N.ExistsTypeAnnotation | N.ExistentialTypeParam | N.FunctionTypeAnnotation | N.ArrayTypeAnnotation | N.ObjectTypeAnnotation | N.GenericTypeAnnotation | N.MemberTypeAnnotation | N.UnionTypeAnnotation | N.IntersectionTypeAnnotation | N.TypeofTypeAnnotation | N.TypeParameter | N.InterfaceTypeAnnotation | N.TupleTypeAnnotation | N.InferredPredicate | N.DeclaredPredicate;
export type FlowTypeKind = N.AnyTypeAnnotation | N.EmptyTypeAnnotation | N.MixedTypeAnnotation | N.VoidTypeAnnotation | N.NumberTypeAnnotation | N.NumberLiteralTypeAnnotation | N.NumericLiteralTypeAnnotation | N.StringTypeAnnotation | N.StringLiteralTypeAnnotation | N.BooleanTypeAnnotation | N.BooleanLiteralTypeAnnotation | N.NullableTypeAnnotation | N.NullLiteralTypeAnnotation | N.NullTypeAnnotation | N.ThisTypeAnnotation | N.ExistsTypeAnnotation | N.ExistentialTypeParam | N.FunctionTypeAnnotation | N.ArrayTypeAnnotation | N.ObjectTypeAnnotation | N.GenericTypeAnnotation | N.MemberTypeAnnotation | N.UnionTypeAnnotation | N.IntersectionTypeAnnotation | N.TypeofTypeAnnotation | N.TypeParameter | N.InterfaceTypeAnnotation | N.TupleTypeAnnotation;
export type AnyTypeAnnotationKind = N.AnyTypeAnnotation;
export type EmptyTypeAnnotationKind = N.EmptyTypeAnnotation;
export type MixedTypeAnnotationKind = N.MixedTypeAnnotation;
export type VoidTypeAnnotationKind = N.VoidTypeAnnotation;
export type NumberTypeAnnotationKind = N.NumberTypeAnnotation;
export type NumberLiteralTypeAnnotationKind = N.NumberLiteralTypeAnnotation;
export type NumericLiteralTypeAnnotationKind = N.NumericLiteralTypeAnnotation;
export type StringTypeAnnotationKind = N.StringTypeAnnotation;
export type StringLiteralTypeAnnotationKind = N.StringLiteralTypeAnnotation;
export type BooleanTypeAnnotationKind = N.BooleanTypeAnnotation;
export type BooleanLiteralTypeAnnotationKind = N.BooleanLiteralTypeAnnotation;
export type NullableTypeAnnotationKind = N.NullableTypeAnnotation;
export type NullLiteralTypeAnnotationKind = N.NullLiteralTypeAnnotation;
export type NullTypeAnnotationKind = N.NullTypeAnnotation;
export type ThisTypeAnnotationKind = N.ThisTypeAnnotation;
export type ExistsTypeAnnotationKind = N.ExistsTypeAnnotation;
export type ExistentialTypeParamKind = N.ExistentialTypeParam;
export type FunctionTypeAnnotationKind = N.FunctionTypeAnnotation;
export type FunctionTypeParamKind = N.FunctionTypeParam;
export type ArrayTypeAnnotationKind = N.ArrayTypeAnnotation;
export type ObjectTypeAnnotationKind = N.ObjectTypeAnnotation;
export type ObjectTypePropertyKind = N.ObjectTypeProperty;
export type ObjectTypeSpreadPropertyKind = N.ObjectTypeSpreadProperty;
export type ObjectTypeIndexerKind = N.ObjectTypeIndexer;
export type ObjectTypeCallPropertyKind = N.ObjectTypeCallProperty;
export type ObjectTypeInternalSlotKind = N.ObjectTypeInternalSlot;
export type VarianceKind = N.Variance;
export type QualifiedTypeIdentifierKind = N.QualifiedTypeIdentifier;
export type GenericTypeAnnotationKind = N.GenericTypeAnnotation;
export type MemberTypeAnnotationKind = N.MemberTypeAnnotation;
export type UnionTypeAnnotationKind = N.UnionTypeAnnotation;
export type IntersectionTypeAnnotationKind = N.IntersectionTypeAnnotation;
export type TypeofTypeAnnotationKind = N.TypeofTypeAnnotation;
export type TypeParameterKind = N.TypeParameter;
export type InterfaceTypeAnnotationKind = N.InterfaceTypeAnnotation;
export type InterfaceExtendsKind = N.InterfaceExtends;
export type InterfaceDeclarationKind = N.InterfaceDeclaration | N.DeclareInterface | N.DeclareClass;
export type DeclareInterfaceKind = N.DeclareInterface;
export type TypeAliasKind = N.TypeAlias | N.DeclareTypeAlias | N.DeclareOpaqueType;
export type OpaqueTypeKind = N.OpaqueType;
export type DeclareTypeAliasKind = N.DeclareTypeAlias;
export type DeclareOpaqueTypeKind = N.DeclareOpaqueType;
export type TypeCastExpressionKind = N.TypeCastExpression;
export type TupleTypeAnnotationKind = N.TupleTypeAnnotation;
export type DeclareVariableKind = N.DeclareVariable;
export type DeclareFunctionKind = N.DeclareFunction;
export type DeclareClassKind = N.DeclareClass;
export type DeclareModuleKind = N.DeclareModule;
export type DeclareModuleExportsKind = N.DeclareModuleExports;
export type DeclareExportDeclarationKind = N.DeclareExportDeclaration;
export type ExportSpecifierKind = N.ExportSpecifier;
export type ExportBatchSpecifierKind = N.ExportBatchSpecifier;
export type DeclareExportAllDeclarationKind = N.DeclareExportAllDeclaration;
export type FlowPredicateKind = N.InferredPredicate | N.DeclaredPredicate;
export type InferredPredicateKind = N.InferredPredicate;
export type DeclaredPredicateKind = N.DeclaredPredicate;
export type ExportDeclarationKind = N.ExportDeclaration;
export type BlockKind = N.Block;
export type LineKind = N.Line;
export type NoopKind = N.Noop;
export type DoExpressionKind = N.DoExpression;
export type SuperKind = N.Super;
export type BindExpressionKind = N.BindExpression;
export type DecoratorKind = N.Decorator;
export type MetaPropertyKind = N.MetaProperty;
export type ParenthesizedExpressionKind = N.ParenthesizedExpression;
export type ExportDefaultDeclarationKind = N.ExportDefaultDeclaration;
export type ExportNamedDeclarationKind = N.ExportNamedDeclaration;
export type ExportNamespaceSpecifierKind = N.ExportNamespaceSpecifier;
export type ExportDefaultSpecifierKind = N.ExportDefaultSpecifier;
export type ExportAllDeclarationKind = N.ExportAllDeclaration;
export type CommentBlockKind = N.CommentBlock;
export type CommentLineKind = N.CommentLine;
export type DirectiveKind = N.Directive;
export type DirectiveLiteralKind = N.DirectiveLiteral;
export type InterpreterDirectiveKind = N.InterpreterDirective;
export type StringLiteralKind = N.StringLiteral;
export type NumericLiteralKind = N.NumericLiteral;
export type BigIntLiteralKind = N.BigIntLiteral;
export type NullLiteralKind = N.NullLiteral;
export type BooleanLiteralKind = N.BooleanLiteral;
export type RegExpLiteralKind = N.RegExpLiteral;
export type ObjectMethodKind = N.ObjectMethod;
export type ClassPrivatePropertyKind = N.ClassPrivateProperty;
export type ClassMethodKind = N.ClassMethod;
export type ClassPrivateMethodKind = N.ClassPrivateMethod;
export type PrivateNameKind = N.PrivateName;
export type RestPropertyKind = N.RestProperty;
export type ForAwaitStatementKind = N.ForAwaitStatement;
export type ImportKind = N.Import;
export type TSQualifiedNameKind = N.TSQualifiedName;
export type TSTypeReferenceKind = N.TSTypeReference;
export type TSHasOptionalTypeParametersKind = N.TSFunctionType | N.TSConstructorType | N.TSDeclareFunction | N.TSDeclareMethod | N.TSMethodSignature | N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration | N.TSTypeAliasDeclaration | N.TSInterfaceDeclaration;
export type TSHasOptionalTypeAnnotationKind = N.TSFunctionType | N.TSConstructorType | N.TSIndexSignature | N.TSPropertySignature | N.TSMethodSignature | N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration;
export type TSAsExpressionKind = N.TSAsExpression;
export type TSNonNullExpressionKind = N.TSNonNullExpression;
export type TSAnyKeywordKind = N.TSAnyKeyword;
export type TSBooleanKeywordKind = N.TSBooleanKeyword;
export type TSNeverKeywordKind = N.TSNeverKeyword;
export type TSNullKeywordKind = N.TSNullKeyword;
export type TSNumberKeywordKind = N.TSNumberKeyword;
export type TSObjectKeywordKind = N.TSObjectKeyword;
export type TSStringKeywordKind = N.TSStringKeyword;
export type TSSymbolKeywordKind = N.TSSymbolKeyword;
export type TSUndefinedKeywordKind = N.TSUndefinedKeyword;
export type TSUnknownKeywordKind = N.TSUnknownKeyword;
export type TSVoidKeywordKind = N.TSVoidKeyword;
export type TSThisTypeKind = N.TSThisType;
export type TSArrayTypeKind = N.TSArrayType;
export type TSLiteralTypeKind = N.TSLiteralType;
export type TSUnionTypeKind = N.TSUnionType;
export type TSIntersectionTypeKind = N.TSIntersectionType;
export type TSConditionalTypeKind = N.TSConditionalType;
export type TSInferTypeKind = N.TSInferType;
export type TSTypeParameterKind = N.TSTypeParameter;
export type TSParenthesizedTypeKind = N.TSParenthesizedType;
export type TSFunctionTypeKind = N.TSFunctionType;
export type TSConstructorTypeKind = N.TSConstructorType;
export type TSDeclareFunctionKind = N.TSDeclareFunction;
export type TSDeclareMethodKind = N.TSDeclareMethod;
export type TSMappedTypeKind = N.TSMappedType;
export type TSTupleTypeKind = N.TSTupleType;
export type TSRestTypeKind = N.TSRestType;
export type TSOptionalTypeKind = N.TSOptionalType;
export type TSIndexedAccessTypeKind = N.TSIndexedAccessType;
export type TSTypeOperatorKind = N.TSTypeOperator;
export type TSIndexSignatureKind = N.TSIndexSignature;
export type TSPropertySignatureKind = N.TSPropertySignature;
export type TSMethodSignatureKind = N.TSMethodSignature;
export type TSTypePredicateKind = N.TSTypePredicate;
export type TSCallSignatureDeclarationKind = N.TSCallSignatureDeclaration;
export type TSConstructSignatureDeclarationKind = N.TSConstructSignatureDeclaration;
export type TSEnumMemberKind = N.TSEnumMember;
export type TSTypeQueryKind = N.TSTypeQuery;
export type TSTypeLiteralKind = N.TSTypeLiteral;
export type TSTypeAssertionKind = N.TSTypeAssertion;
export type TSEnumDeclarationKind = N.TSEnumDeclaration;
export type TSTypeAliasDeclarationKind = N.TSTypeAliasDeclaration;
export type TSModuleBlockKind = N.TSModuleBlock;
export type TSModuleDeclarationKind = N.TSModuleDeclaration;
export type TSImportEqualsDeclarationKind = N.TSImportEqualsDeclaration;
export type TSExternalModuleReferenceKind = N.TSExternalModuleReference;
export type TSExportAssignmentKind = N.TSExportAssignment;
export type TSNamespaceExportDeclarationKind = N.TSNamespaceExportDeclaration;
export type TSInterfaceBodyKind = N.TSInterfaceBody;
export type TSInterfaceDeclarationKind = N.TSInterfaceDeclaration;
export type TSParameterPropertyKind = N.TSParameterProperty;
export type OptionalMemberExpressionKind = N.OptionalMemberExpression;
export type OptionalCallExpressionKind = N.OptionalCallExpression;