/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/translator/src/translator" />
import { ArrayType, AssertNotNull, BinaryOperatorExpr, BuiltinType, CastExpr, CommaExpr, ConditionalExpr, Expression, ExpressionType, ExpressionVisitor, ExternalExpr, FunctionExpr, InstantiateExpr, InvokeFunctionExpr, InvokeMethodExpr, LiteralArrayExpr, LiteralExpr, LiteralMapExpr, MapType, NotExpr, ReadKeyExpr, ReadPropExpr, ReadVarExpr, Statement, Type, TypeVisitor, TypeofExpr, WrappedNodeExpr, WriteKeyExpr, WritePropExpr, WriteVarExpr } from '@angular/compiler';
import * as ts from 'typescript';
import { DefaultImportRecorder, ImportRewriter } from '../../imports';
export declare class Context {
    readonly isStatement: boolean;
    constructor(isStatement: boolean);
    readonly withExpressionMode: Context;
    readonly withStatementMode: Context;
}
/**
 * Information about an import that has been added to a module.
 */
export interface Import {
    /** The name of the module that has been imported. */
    specifier: string;
    /** The alias of the imported module. */
    qualifier: string;
}
/**
 * The symbol name and import namespace of an imported symbol,
 * which has been registered through the ImportManager.
 */
export interface NamedImport {
    /** The import namespace containing this imported symbol. */
    moduleImport: string | null;
    /** The (possibly rewritten) name of the imported symbol. */
    symbol: string;
}
export declare class ImportManager {
    protected rewriter: ImportRewriter;
    private prefix;
    private specifierToIdentifier;
    private nextIndex;
    constructor(rewriter?: ImportRewriter, prefix?: string);
    generateNamedImport(moduleName: string, originalSymbol: string): NamedImport;
    getAllImports(contextPath: string): Import[];
}
export declare function translateExpression(expression: Expression, imports: ImportManager, defaultImportRecorder: DefaultImportRecorder): ts.Expression;
export declare function translateStatement(statement: Statement, imports: ImportManager, defaultImportRecorder: DefaultImportRecorder): ts.Statement;
export declare function translateType(type: Type, imports: ImportManager): ts.TypeNode;
export declare class TypeTranslatorVisitor implements ExpressionVisitor, TypeVisitor {
    private imports;
    constructor(imports: ImportManager);
    visitBuiltinType(type: BuiltinType, context: Context): ts.KeywordTypeNode;
    visitExpressionType(type: ExpressionType, context: Context): ts.TypeReferenceType;
    visitArrayType(type: ArrayType, context: Context): ts.ArrayTypeNode;
    visitMapType(type: MapType, context: Context): ts.TypeLiteralNode;
    visitReadVarExpr(ast: ReadVarExpr, context: Context): string;
    visitWriteVarExpr(expr: WriteVarExpr, context: Context): never;
    visitWriteKeyExpr(expr: WriteKeyExpr, context: Context): never;
    visitWritePropExpr(expr: WritePropExpr, context: Context): never;
    visitInvokeMethodExpr(ast: InvokeMethodExpr, context: Context): never;
    visitInvokeFunctionExpr(ast: InvokeFunctionExpr, context: Context): never;
    visitInstantiateExpr(ast: InstantiateExpr, context: Context): never;
    visitLiteralExpr(ast: LiteralExpr, context: Context): ts.LiteralExpression;
    visitExternalExpr(ast: ExternalExpr, context: Context): ts.TypeNode;
    visitConditionalExpr(ast: ConditionalExpr, context: Context): void;
    visitNotExpr(ast: NotExpr, context: Context): void;
    visitAssertNotNullExpr(ast: AssertNotNull, context: Context): void;
    visitCastExpr(ast: CastExpr, context: Context): void;
    visitFunctionExpr(ast: FunctionExpr, context: Context): void;
    visitBinaryOperatorExpr(ast: BinaryOperatorExpr, context: Context): void;
    visitReadPropExpr(ast: ReadPropExpr, context: Context): void;
    visitReadKeyExpr(ast: ReadKeyExpr, context: Context): void;
    visitLiteralArrayExpr(ast: LiteralArrayExpr, context: Context): ts.TupleTypeNode;
    visitLiteralMapExpr(ast: LiteralMapExpr, context: Context): ts.ObjectLiteralExpression;
    visitCommaExpr(ast: CommaExpr, context: Context): void;
    visitWrappedNodeExpr(ast: WrappedNodeExpr<any>, context: Context): ts.Identifier;
    visitTypeofExpr(ast: TypeofExpr, context: Context): ts.TypeQueryNode;
}
