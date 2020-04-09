/// <reference types="node" />
import * as fs from 'fs';
import { ProcessBundleOptions, ProcessBundleResult } from '../utils/process-bundle';
export interface CacheEntry {
    path: string;
    size: number;
    integrity?: string;
}
export declare class BundleActionCache {
    private readonly integrityAlgorithm?;
    constructor(integrityAlgorithm?: string | undefined);
    static copyEntryContent(entry: CacheEntry | string, dest: fs.PathLike): void;
    generateBaseCacheKey(content: string): string;
    generateCacheKeys(action: ProcessBundleOptions): string[];
    getCacheEntries(cacheKeys: (string | undefined)[]): Promise<(CacheEntry | null)[] | false>;
    getCachedBundleResult(action: ProcessBundleOptions): Promise<ProcessBundleResult | null>;
}
