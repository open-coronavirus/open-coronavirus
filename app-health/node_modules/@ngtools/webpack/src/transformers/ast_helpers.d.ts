import * as ts from 'typescript';
import { WebpackCompilerHost } from '../compiler_host';
export declare function collectDeepNodes<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind | ts.SyntaxKind[]): T[];
export declare function getFirstNode(sourceFile: ts.SourceFile): ts.Node;
export declare function getLastNode(sourceFile: ts.SourceFile): ts.Node | null;
export declare function createTypescriptContext(content: string, additionalFiles?: Record<string, string>, useLibs?: boolean, importHelpers?: boolean): {
    compilerHost: WebpackCompilerHost;
    program: ts.Program;
};
export declare function transformTypescript(content: string | undefined, transformers: ts.TransformerFactory<ts.SourceFile>[], program?: ts.Program, compilerHost?: WebpackCompilerHost): string | undefined;
