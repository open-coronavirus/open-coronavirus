/// <amd-module name="@angular/compiler-cli/ngcc/src/analysis/migration_host" />
import { MetadataReader } from '../../../src/ngtsc/metadata';
import { PartialEvaluator } from '../../../src/ngtsc/partial_evaluator';
import { ClassDeclaration, Decorator } from '../../../src/ngtsc/reflection';
import { DecoratorHandler } from '../../../src/ngtsc/transform';
import { NgccReflectionHost } from '../host/ngcc_host';
import { MigrationHost } from '../migrations/migration';
import { AnalyzedFile } from './types';
/**
 * The standard implementation of `MigrationHost`, which is created by the
 * `DecorationAnalyzer`.
 */
export declare class DefaultMigrationHost implements MigrationHost {
    readonly reflectionHost: NgccReflectionHost;
    readonly metadata: MetadataReader;
    readonly evaluator: PartialEvaluator;
    private handlers;
    private analyzedFiles;
    constructor(reflectionHost: NgccReflectionHost, metadata: MetadataReader, evaluator: PartialEvaluator, handlers: DecoratorHandler<any, any>[], analyzedFiles: AnalyzedFile[]);
    injectSyntheticDecorator(clazz: ClassDeclaration, decorator: Decorator): void;
}
