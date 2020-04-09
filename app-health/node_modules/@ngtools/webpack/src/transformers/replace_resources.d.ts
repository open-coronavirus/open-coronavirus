import * as ts from 'typescript';
export declare function replaceResources(shouldTransform: (fileName: string) => boolean, getTypeChecker: () => ts.TypeChecker, directTemplateLoading?: boolean): ts.TransformerFactory<ts.SourceFile>;
export declare function getResourceUrl(node: ts.Expression, loader?: string): string | null;
