"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const jest_worker_1 = require("jest-worker");
const os = require("os");
const path = require("path");
const action_cache_1 = require("./action-cache");
let workerFile = require.resolve('../utils/process-bundle');
workerFile =
    path.extname(workerFile) === '.ts'
        ? require.resolve('../utils/process-bundle-bootstrap')
        : workerFile;
class BundleActionExecutor {
    constructor(workerOptions, integrityAlgorithm, sizeThreshold = 32 * 1024) {
        this.workerOptions = workerOptions;
        this.sizeThreshold = sizeThreshold;
        this.cache = new action_cache_1.BundleActionCache(integrityAlgorithm);
    }
    static executeMethod(worker, method, input) {
        return worker[method](input);
    }
    ensureLarge() {
        if (this.largeWorker) {
            return this.largeWorker;
        }
        // larger files are processed in a separate process to limit memory usage in the main process
        return (this.largeWorker = new jest_worker_1.default(workerFile, {
            exposedMethods: ['process'],
            setupArgs: [this.workerOptions],
        }));
    }
    ensureSmall() {
        if (this.smallWorker) {
            return this.smallWorker;
        }
        // small files are processed in a limited number of threads to improve speed
        // The limited number also prevents a large increase in memory usage for an otherwise short operation
        return (this.smallWorker = new jest_worker_1.default(workerFile, {
            exposedMethods: ['process'],
            setupArgs: [this.workerOptions],
            numWorkers: os.cpus().length < 2 ? 1 : 2,
            // Will automatically fallback to processes if not supported
            enableWorkerThreads: true,
        }));
    }
    executeAction(method, action) {
        // code.length is not an exact byte count but close enough for this
        if (action.code.length > this.sizeThreshold) {
            return BundleActionExecutor.executeMethod(this.ensureLarge(), method, action);
        }
        else {
            return BundleActionExecutor.executeMethod(this.ensureSmall(), method, action);
        }
    }
    async process(action) {
        const cacheKeys = this.cache.generateCacheKeys(action);
        action.cacheKeys = cacheKeys;
        // Try to get cached data, if it fails fallback to processing
        try {
            const cachedResult = await this.cache.getCachedBundleResult(action);
            if (cachedResult) {
                return cachedResult;
            }
        }
        catch (_a) { }
        return this.executeAction('process', action);
    }
    async *processAll(actions) {
        const executions = new Map();
        for (const action of actions) {
            const execution = this.process(action);
            executions.set(execution, execution.then(result => {
                executions.delete(execution);
                return result;
            }));
        }
        while (executions.size > 0) {
            yield Promise.race(executions.values());
        }
    }
    stop() {
        if (this.largeWorker) {
            this.largeWorker.end();
        }
        if (this.smallWorker) {
            this.smallWorker.end();
        }
    }
}
exports.BundleActionExecutor = BundleActionExecutor;
