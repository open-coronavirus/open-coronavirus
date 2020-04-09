export interface ProcessBundleOptions {
    filename: string;
    code: string;
    map?: string;
    name: string;
    sourceMaps?: boolean;
    hiddenSourceMaps?: boolean;
    vendorSourceMaps?: boolean;
    runtime?: boolean;
    optimize?: boolean;
    optimizeOnly?: boolean;
    ignoreOriginal?: boolean;
    cacheKeys?: (string | undefined)[];
    integrityAlgorithm?: 'sha256' | 'sha384' | 'sha512';
    runtimeData?: ProcessBundleResult[];
    supportedBrowsers?: string[] | Record<string, string>;
}
export interface ProcessBundleResult {
    name: string;
    integrity?: string;
    original?: ProcessBundleFile;
    downlevel?: ProcessBundleFile;
}
export interface ProcessBundleFile {
    filename: string;
    size: number;
    integrity?: string;
    map?: {
        filename: string;
        size: number;
    };
}
export declare const enum CacheKey {
    OriginalCode = 0,
    OriginalMap = 1,
    DownlevelCode = 2,
    DownlevelMap = 3
}
export declare function setup(options: {
    cachePath: string;
}): void;
export declare function process(options: ProcessBundleOptions): Promise<ProcessBundleResult>;
