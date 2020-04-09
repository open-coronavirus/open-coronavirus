import { Compiler } from 'webpack';
export interface CleanCssWebpackPluginOptions {
    sourceMap: boolean;
    test: (file: string) => boolean;
}
export declare class CleanCssWebpackPlugin {
    private readonly _options;
    constructor(options: Partial<CleanCssWebpackPluginOptions>);
    apply(compiler: Compiler): void;
}
