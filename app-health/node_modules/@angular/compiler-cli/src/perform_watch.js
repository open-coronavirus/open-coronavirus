/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/perform_watch", ["require", "exports", "chokidar", "path", "typescript", "@angular/compiler-cli/src/perform_compile", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/entry_points", "@angular/compiler-cli/src/transformers/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var chokidar = require("chokidar");
    var path = require("path");
    var ts = require("typescript");
    var perform_compile_1 = require("@angular/compiler-cli/src/perform_compile");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var entry_points_1 = require("@angular/compiler-cli/src/transformers/entry_points");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    function totalCompilationTimeDiagnostic(timeInMillis) {
        var duration;
        if (timeInMillis > 1000) {
            duration = (timeInMillis / 1000).toPrecision(2) + "s";
        }
        else {
            duration = timeInMillis + "ms";
        }
        return {
            category: ts.DiagnosticCategory.Message,
            messageText: "Total time: " + duration,
            code: api.DEFAULT_ERROR_CODE,
            source: api.SOURCE,
        };
    }
    var FileChangeEvent;
    (function (FileChangeEvent) {
        FileChangeEvent[FileChangeEvent["Change"] = 0] = "Change";
        FileChangeEvent[FileChangeEvent["CreateDelete"] = 1] = "CreateDelete";
        FileChangeEvent[FileChangeEvent["CreateDeleteDir"] = 2] = "CreateDeleteDir";
    })(FileChangeEvent = exports.FileChangeEvent || (exports.FileChangeEvent = {}));
    function createPerformWatchHost(configFileName, reportDiagnostics, existingOptions, createEmitCallback) {
        return {
            reportDiagnostics: reportDiagnostics,
            createCompilerHost: function (options) { return entry_points_1.createCompilerHost({ options: options }); },
            readConfiguration: function () { return perform_compile_1.readConfiguration(configFileName, existingOptions); },
            createEmitCallback: function (options) { return createEmitCallback ? createEmitCallback(options) : undefined; },
            onFileChange: function (options, listener, ready) {
                if (!options.basePath) {
                    reportDiagnostics([{
                            category: ts.DiagnosticCategory.Error,
                            messageText: 'Invalid configuration option. baseDir not specified',
                            source: api.SOURCE,
                            code: api.DEFAULT_ERROR_CODE
                        }]);
                    return { close: function () { } };
                }
                var watcher = chokidar.watch(options.basePath, {
                    // ignore .dotfiles, .js and .map files.
                    // can't ignore other files as we e.g. want to recompile if an `.html` file changes as well.
                    ignored: /((^[\/\\])\..)|(\.js$)|(\.map$)|(\.metadata\.json|node_modules)/,
                    ignoreInitial: true,
                    persistent: true,
                });
                watcher.on('all', function (event, path) {
                    switch (event) {
                        case 'change':
                            listener(FileChangeEvent.Change, path);
                            break;
                        case 'unlink':
                        case 'add':
                            listener(FileChangeEvent.CreateDelete, path);
                            break;
                        case 'unlinkDir':
                        case 'addDir':
                            listener(FileChangeEvent.CreateDeleteDir, path);
                            break;
                    }
                });
                watcher.on('ready', ready);
                return { close: function () { return watcher.close(); }, ready: ready };
            },
            setTimeout: (ts.sys.clearTimeout && ts.sys.setTimeout) || setTimeout,
            clearTimeout: (ts.sys.setTimeout && ts.sys.clearTimeout) || clearTimeout,
        };
    }
    exports.createPerformWatchHost = createPerformWatchHost;
    /**
     * The logic in this function is adapted from `tsc.ts` from TypeScript.
     */
    function performWatchCompilation(host) {
        var cachedProgram; // Program cached from last compilation
        var cachedCompilerHost; // CompilerHost cached from last compilation
        var cachedOptions; // CompilerOptions cached from last compilation
        var timerHandleForRecompilation; // Handle for 0.25s wait timer to trigger recompilation
        var ignoreFilesForWatch = new Set();
        var fileCache = new Map();
        var firstCompileResult = doCompilation();
        // Watch basePath, ignoring .dotfiles
        var resolveReadyPromise;
        var readyPromise = new Promise(function (resolve) { return resolveReadyPromise = resolve; });
        // Note: ! is ok as options are filled after the first compilation
        // Note: ! is ok as resolvedReadyPromise is filled by the previous call
        var fileWatcher = host.onFileChange(cachedOptions.options, watchedFileChanged, resolveReadyPromise);
        return { close: close, ready: function (cb) { return readyPromise.then(cb); }, firstCompileResult: firstCompileResult };
        function cacheEntry(fileName) {
            fileName = path.normalize(fileName);
            var entry = fileCache.get(fileName);
            if (!entry) {
                entry = {};
                fileCache.set(fileName, entry);
            }
            return entry;
        }
        function close() {
            fileWatcher.close();
            if (timerHandleForRecompilation) {
                host.clearTimeout(timerHandleForRecompilation.timerHandle);
                timerHandleForRecompilation = undefined;
            }
        }
        // Invoked to perform initial compilation or re-compilation in watch mode
        function doCompilation(modifiedResourceFiles) {
            if (!cachedOptions) {
                cachedOptions = host.readConfiguration();
            }
            if (cachedOptions.errors && cachedOptions.errors.length) {
                host.reportDiagnostics(cachedOptions.errors);
                return cachedOptions.errors;
            }
            var startTime = Date.now();
            if (!cachedCompilerHost) {
                cachedCompilerHost = host.createCompilerHost(cachedOptions.options);
                var originalWriteFileCallback_1 = cachedCompilerHost.writeFile;
                cachedCompilerHost.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                    if (sourceFiles === void 0) { sourceFiles = []; }
                    ignoreFilesForWatch.add(path.normalize(fileName));
                    return originalWriteFileCallback_1(fileName, data, writeByteOrderMark, onError, sourceFiles);
                };
                var originalFileExists_1 = cachedCompilerHost.fileExists;
                cachedCompilerHost.fileExists = function (fileName) {
                    var ce = cacheEntry(fileName);
                    if (ce.exists == null) {
                        ce.exists = originalFileExists_1.call(this, fileName);
                    }
                    return ce.exists;
                };
                var originalGetSourceFile_1 = cachedCompilerHost.getSourceFile;
                cachedCompilerHost.getSourceFile = function (fileName, languageVersion) {
                    var ce = cacheEntry(fileName);
                    if (!ce.sf) {
                        ce.sf = originalGetSourceFile_1.call(this, fileName, languageVersion);
                    }
                    return ce.sf;
                };
                var originalReadFile_1 = cachedCompilerHost.readFile;
                cachedCompilerHost.readFile = function (fileName) {
                    var ce = cacheEntry(fileName);
                    if (ce.content == null) {
                        ce.content = originalReadFile_1.call(this, fileName);
                    }
                    return ce.content;
                };
                // Provide access to the file paths that triggered this rebuild
                cachedCompilerHost.getModifiedResourceFiles =
                    modifiedResourceFiles !== undefined ? function () { return modifiedResourceFiles; } : undefined;
            }
            ignoreFilesForWatch.clear();
            var oldProgram = cachedProgram;
            // We clear out the `cachedProgram` here as a
            // program can only be used as `oldProgram` 1x
            cachedProgram = undefined;
            var compileResult = perform_compile_1.performCompilation({
                rootNames: cachedOptions.rootNames,
                options: cachedOptions.options,
                host: cachedCompilerHost,
                oldProgram: oldProgram,
                emitCallback: host.createEmitCallback(cachedOptions.options)
            });
            if (compileResult.diagnostics.length) {
                host.reportDiagnostics(compileResult.diagnostics);
            }
            var endTime = Date.now();
            if (cachedOptions.options.diagnostics) {
                var totalTime = (endTime - startTime) / 1000;
                host.reportDiagnostics([totalCompilationTimeDiagnostic(endTime - startTime)]);
            }
            var exitCode = perform_compile_1.exitCodeFromResult(compileResult.diagnostics);
            if (exitCode == 0) {
                cachedProgram = compileResult.program;
                host.reportDiagnostics([util_1.createMessageDiagnostic('Compilation complete. Watching for file changes.')]);
            }
            else {
                host.reportDiagnostics([util_1.createMessageDiagnostic('Compilation failed. Watching for file changes.')]);
            }
            return compileResult.diagnostics;
        }
        function resetOptions() {
            cachedProgram = undefined;
            cachedCompilerHost = undefined;
            cachedOptions = undefined;
        }
        function watchedFileChanged(event, fileName) {
            if (cachedOptions && event === FileChangeEvent.Change &&
                // TODO(chuckj): validate that this is sufficient to skip files that were written.
                // This assumes that the file path we write is the same file path we will receive in the
                // change notification.
                path.normalize(fileName) === path.normalize(cachedOptions.project)) {
                // If the configuration file changes, forget everything and start the recompilation timer
                resetOptions();
            }
            else if (event === FileChangeEvent.CreateDelete || event === FileChangeEvent.CreateDeleteDir) {
                // If a file was added or removed, reread the configuration
                // to determine the new list of root files.
                cachedOptions = undefined;
            }
            if (event === FileChangeEvent.CreateDeleteDir) {
                fileCache.clear();
            }
            else {
                fileCache.delete(path.normalize(fileName));
            }
            if (!ignoreFilesForWatch.has(path.normalize(fileName))) {
                // Ignore the file if the file is one that was written by the compiler.
                startTimerForRecompilation(fileName);
            }
        }
        // Upon detecting a file change, wait for 250ms and then perform a recompilation. This gives batch
        // operations (such as saving all modified files in an editor) a chance to complete before we kick
        // off a new compilation.
        function startTimerForRecompilation(changedPath) {
            if (timerHandleForRecompilation) {
                host.clearTimeout(timerHandleForRecompilation.timerHandle);
            }
            else {
                timerHandleForRecompilation = {
                    modifiedResourceFiles: new Set(),
                    timerHandle: undefined
                };
            }
            timerHandleForRecompilation.timerHandle = host.setTimeout(recompile, 250);
            timerHandleForRecompilation.modifiedResourceFiles.add(changedPath);
        }
        function recompile() {
            host.reportDiagnostics([util_1.createMessageDiagnostic('File change detected. Starting incremental compilation.')]);
            doCompilation(timerHandleForRecompilation.modifiedResourceFiles);
            timerHandleForRecompilation = undefined;
        }
    }
    exports.performWatchCompilation = performWatchCompilation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV93YXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvcGVyZm9ybV93YXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILG1DQUFxQztJQUNyQywyQkFBNkI7SUFDN0IsK0JBQWlDO0lBRWpDLDZFQUF3SjtJQUN4SixnRUFBMEM7SUFDMUMsb0ZBQStEO0lBQy9ELG9FQUE0RDtJQUU1RCxTQUFTLDhCQUE4QixDQUFDLFlBQW9CO1FBQzFELElBQUksUUFBZ0IsQ0FBQztRQUNyQixJQUFJLFlBQVksR0FBRyxJQUFJLEVBQUU7WUFDdkIsUUFBUSxHQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBRyxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxRQUFRLEdBQU0sWUFBWSxPQUFJLENBQUM7U0FDaEM7UUFDRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPO1lBQ3ZDLFdBQVcsRUFBRSxpQkFBZSxRQUFVO1lBQ3RDLElBQUksRUFBRSxHQUFHLENBQUMsa0JBQWtCO1lBQzVCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtTQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVELElBQVksZUFJWDtJQUpELFdBQVksZUFBZTtRQUN6Qix5REFBTSxDQUFBO1FBQ04scUVBQVksQ0FBQTtRQUNaLDJFQUFlLENBQUE7SUFDakIsQ0FBQyxFQUpXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSTFCO0lBY0QsU0FBZ0Isc0JBQXNCLENBQ2xDLGNBQXNCLEVBQUUsaUJBQXFELEVBQzdFLGVBQW9DLEVBQUUsa0JBQ2tDO1FBQzFFLE9BQU87WUFDTCxpQkFBaUIsRUFBRSxpQkFBaUI7WUFDcEMsa0JBQWtCLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxpQ0FBa0IsQ0FBQyxFQUFDLE9BQU8sU0FBQSxFQUFDLENBQUMsRUFBN0IsQ0FBNkI7WUFDNUQsaUJBQWlCLEVBQUUsY0FBTSxPQUFBLG1DQUFpQixDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsRUFBbEQsQ0FBa0Q7WUFDM0Usa0JBQWtCLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBNUQsQ0FBNEQ7WUFDM0YsWUFBWSxFQUFFLFVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFpQjtnQkFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7b0JBQ3JCLGlCQUFpQixDQUFDLENBQUM7NEJBQ2pCLFFBQVEsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSzs0QkFDckMsV0FBVyxFQUFFLHFEQUFxRDs0QkFDbEUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNOzRCQUNsQixJQUFJLEVBQUUsR0FBRyxDQUFDLGtCQUFrQjt5QkFDN0IsQ0FBQyxDQUFDLENBQUM7b0JBQ0osT0FBTyxFQUFDLEtBQUssRUFBRSxjQUFPLENBQUMsRUFBQyxDQUFDO2lCQUMxQjtnQkFDRCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7b0JBQy9DLHdDQUF3QztvQkFDeEMsNEZBQTRGO29CQUM1RixPQUFPLEVBQUUsaUVBQWlFO29CQUMxRSxhQUFhLEVBQUUsSUFBSTtvQkFDbkIsVUFBVSxFQUFFLElBQUk7aUJBQ2pCLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQWEsRUFBRSxJQUFZO29CQUM1QyxRQUFRLEtBQUssRUFBRTt3QkFDYixLQUFLLFFBQVE7NEJBQ1gsUUFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQ3ZDLE1BQU07d0JBQ1IsS0FBSyxRQUFRLENBQUM7d0JBQ2QsS0FBSyxLQUFLOzRCQUNSLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUM3QyxNQUFNO3dCQUNSLEtBQUssV0FBVyxDQUFDO3dCQUNqQixLQUFLLFFBQVE7NEJBQ1gsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQ2hELE1BQU07cUJBQ1Q7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLE9BQU8sRUFBQyxLQUFLLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBZixDQUFlLEVBQUUsS0FBSyxPQUFBLEVBQUMsQ0FBQztZQUMvQyxDQUFDO1lBQ0QsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVO1lBQ3BFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksWUFBWTtTQUN6RSxDQUFDO0lBQ0osQ0FBQztJQS9DRCx3REErQ0M7SUFhRDs7T0FFRztJQUNILFNBQWdCLHVCQUF1QixDQUFDLElBQXNCO1FBRTVELElBQUksYUFBb0MsQ0FBQyxDQUFZLHVDQUF1QztRQUM1RixJQUFJLGtCQUE4QyxDQUFDLENBQUUsNENBQTRDO1FBQ2pHLElBQUksYUFBNEMsQ0FBQyxDQUFFLCtDQUErQztRQUNsRyxJQUFJLDJCQUNTLENBQUMsQ0FBRSx1REFBdUQ7UUFFdkUsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQzlDLElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1FBRWhELElBQU0sa0JBQWtCLEdBQUcsYUFBYSxFQUFFLENBQUM7UUFFM0MscUNBQXFDO1FBQ3JDLElBQUksbUJBQStCLENBQUM7UUFDcEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxtQkFBbUIsR0FBRyxPQUFPLEVBQTdCLENBQTZCLENBQUMsQ0FBQztRQUMzRSxrRUFBa0U7UUFDbEUsdUVBQXVFO1FBQ3ZFLElBQU0sV0FBVyxHQUNiLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBZSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxtQkFBcUIsQ0FBQyxDQUFDO1FBRTFGLE9BQU8sRUFBQyxLQUFLLE9BQUEsRUFBRSxLQUFLLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFyQixDQUFxQixFQUFFLGtCQUFrQixvQkFBQSxFQUFDLENBQUM7UUFFdkUsU0FBUyxVQUFVLENBQUMsUUFBZ0I7WUFDbEMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ1gsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxTQUFTLEtBQUs7WUFDWixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsSUFBSSwyQkFBMkIsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0QsMkJBQTJCLEdBQUcsU0FBUyxDQUFDO2FBQ3pDO1FBQ0gsQ0FBQztRQUVELHlFQUF5RTtRQUN6RSxTQUFTLGFBQWEsQ0FBQyxxQkFBbUM7WUFDeEQsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDbEIsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUN2RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUM7YUFDN0I7WUFDRCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUN2QixrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwRSxJQUFNLDJCQUF5QixHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztnQkFDL0Qsa0JBQWtCLENBQUMsU0FBUyxHQUFHLFVBQzNCLFFBQWdCLEVBQUUsSUFBWSxFQUFFLGtCQUEyQixFQUMzRCxPQUFtQyxFQUFFLFdBQThDO29CQUE5Qyw0QkFBQSxFQUFBLGdCQUE4QztvQkFDckYsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsT0FBTywyQkFBeUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDN0YsQ0FBQyxDQUFDO2dCQUNGLElBQU0sb0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDO2dCQUN6RCxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsVUFBUyxRQUFnQjtvQkFDdkQsSUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO3dCQUNyQixFQUFFLENBQUMsTUFBTSxHQUFHLG9CQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ3JEO29CQUNELE9BQU8sRUFBRSxDQUFDLE1BQVEsQ0FBQztnQkFDckIsQ0FBQyxDQUFDO2dCQUNGLElBQU0sdUJBQXFCLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDO2dCQUMvRCxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsVUFDL0IsUUFBZ0IsRUFBRSxlQUFnQztvQkFDcEQsSUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDVixFQUFFLENBQUMsRUFBRSxHQUFHLHVCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO3FCQUNyRTtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxFQUFJLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQztnQkFDRixJQUFNLGtCQUFnQixHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztnQkFDckQsa0JBQWtCLENBQUMsUUFBUSxHQUFHLFVBQVMsUUFBZ0I7b0JBQ3JELElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxFQUFFLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTt3QkFDdEIsRUFBRSxDQUFDLE9BQU8sR0FBRyxrQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNwRDtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxPQUFTLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQztnQkFDRiwrREFBK0Q7Z0JBQy9ELGtCQUFrQixDQUFDLHdCQUF3QjtvQkFDdkMscUJBQXFCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFNLE9BQUEscUJBQXFCLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzthQUNuRjtZQUNELG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzVCLElBQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQztZQUNqQyw2Q0FBNkM7WUFDN0MsOENBQThDO1lBQzlDLGFBQWEsR0FBRyxTQUFTLENBQUM7WUFDMUIsSUFBTSxhQUFhLEdBQUcsb0NBQWtCLENBQUM7Z0JBQ3ZDLFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztnQkFDbEMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxPQUFPO2dCQUM5QixJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsWUFBWSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO2FBQzdELENBQUMsQ0FBQztZQUVILElBQUksYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDbkQ7WUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDM0IsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtnQkFDckMsSUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUMvQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9FO1lBQ0QsSUFBTSxRQUFRLEdBQUcsb0NBQWtCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9ELElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTtnQkFDakIsYUFBYSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FDbEIsQ0FBQyw4QkFBdUIsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsaUJBQWlCLENBQ2xCLENBQUMsOEJBQXVCLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEY7WUFFRCxPQUFPLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFDbkMsQ0FBQztRQUVELFNBQVMsWUFBWTtZQUNuQixhQUFhLEdBQUcsU0FBUyxDQUFDO1lBQzFCLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztZQUMvQixhQUFhLEdBQUcsU0FBUyxDQUFDO1FBQzVCLENBQUM7UUFFRCxTQUFTLGtCQUFrQixDQUFDLEtBQXNCLEVBQUUsUUFBZ0I7WUFDbEUsSUFBSSxhQUFhLElBQUksS0FBSyxLQUFLLGVBQWUsQ0FBQyxNQUFNO2dCQUNqRCxrRkFBa0Y7Z0JBQ2xGLHdGQUF3RjtnQkFDeEYsdUJBQXVCO2dCQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN0RSx5RkFBeUY7Z0JBQ3pGLFlBQVksRUFBRSxDQUFDO2FBQ2hCO2lCQUFNLElBQ0gsS0FBSyxLQUFLLGVBQWUsQ0FBQyxZQUFZLElBQUksS0FBSyxLQUFLLGVBQWUsQ0FBQyxlQUFlLEVBQUU7Z0JBQ3ZGLDJEQUEyRDtnQkFDM0QsMkNBQTJDO2dCQUMzQyxhQUFhLEdBQUcsU0FBUyxDQUFDO2FBQzNCO1lBRUQsSUFBSSxLQUFLLEtBQUssZUFBZSxDQUFDLGVBQWUsRUFBRTtnQkFDN0MsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ25CO2lCQUFNO2dCQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1lBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RELHVFQUF1RTtnQkFDdkUsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDO1FBRUQsa0dBQWtHO1FBQ2xHLGtHQUFrRztRQUNsRyx5QkFBeUI7UUFDekIsU0FBUywwQkFBMEIsQ0FBQyxXQUFtQjtZQUNyRCxJQUFJLDJCQUEyQixFQUFFO2dCQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLDJCQUEyQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzVEO2lCQUFNO2dCQUNMLDJCQUEyQixHQUFHO29CQUM1QixxQkFBcUIsRUFBRSxJQUFJLEdBQUcsRUFBVTtvQkFDeEMsV0FBVyxFQUFFLFNBQVM7aUJBQ3ZCLENBQUM7YUFDSDtZQUNELDJCQUEyQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMxRSwyQkFBMkIsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckUsQ0FBQztRQUVELFNBQVMsU0FBUztZQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQ2xCLENBQUMsOEJBQXVCLENBQUMseURBQXlELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsYUFBYSxDQUFDLDJCQUE2QixDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbkUsMkJBQTJCLEdBQUcsU0FBUyxDQUFDO1FBQzFDLENBQUM7SUFDSCxDQUFDO0lBbkxELDBEQW1MQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgY2hva2lkYXIgZnJvbSAnY2hva2lkYXInO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzLCBQYXJzZWRDb25maWd1cmF0aW9uLCBQZXJmb3JtQ29tcGlsYXRpb25SZXN1bHQsIGV4aXRDb2RlRnJvbVJlc3VsdCwgcGVyZm9ybUNvbXBpbGF0aW9uLCByZWFkQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9wZXJmb3JtX2NvbXBpbGUnO1xuaW1wb3J0ICogYXMgYXBpIGZyb20gJy4vdHJhbnNmb3JtZXJzL2FwaSc7XG5pbXBvcnQge2NyZWF0ZUNvbXBpbGVySG9zdH0gZnJvbSAnLi90cmFuc2Zvcm1lcnMvZW50cnlfcG9pbnRzJztcbmltcG9ydCB7Y3JlYXRlTWVzc2FnZURpYWdub3N0aWN9IGZyb20gJy4vdHJhbnNmb3JtZXJzL3V0aWwnO1xuXG5mdW5jdGlvbiB0b3RhbENvbXBpbGF0aW9uVGltZURpYWdub3N0aWModGltZUluTWlsbGlzOiBudW1iZXIpOiBhcGkuRGlhZ25vc3RpYyB7XG4gIGxldCBkdXJhdGlvbjogc3RyaW5nO1xuICBpZiAodGltZUluTWlsbGlzID4gMTAwMCkge1xuICAgIGR1cmF0aW9uID0gYCR7KHRpbWVJbk1pbGxpcyAvIDEwMDApLnRvUHJlY2lzaW9uKDIpfXNgO1xuICB9IGVsc2Uge1xuICAgIGR1cmF0aW9uID0gYCR7dGltZUluTWlsbGlzfW1zYDtcbiAgfVxuICByZXR1cm4ge1xuICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuTWVzc2FnZSxcbiAgICBtZXNzYWdlVGV4dDogYFRvdGFsIHRpbWU6ICR7ZHVyYXRpb259YCxcbiAgICBjb2RlOiBhcGkuREVGQVVMVF9FUlJPUl9DT0RFLFxuICAgIHNvdXJjZTogYXBpLlNPVVJDRSxcbiAgfTtcbn1cblxuZXhwb3J0IGVudW0gRmlsZUNoYW5nZUV2ZW50IHtcbiAgQ2hhbmdlLFxuICBDcmVhdGVEZWxldGUsXG4gIENyZWF0ZURlbGV0ZURpcixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQZXJmb3JtV2F0Y2hIb3N0IHtcbiAgcmVwb3J0RGlhZ25vc3RpY3MoZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzKTogdm9pZDtcbiAgcmVhZENvbmZpZ3VyYXRpb24oKTogUGFyc2VkQ29uZmlndXJhdGlvbjtcbiAgY3JlYXRlQ29tcGlsZXJIb3N0KG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMpOiBhcGkuQ29tcGlsZXJIb3N0O1xuICBjcmVhdGVFbWl0Q2FsbGJhY2sob3B0aW9uczogYXBpLkNvbXBpbGVyT3B0aW9ucyk6IGFwaS5Uc0VtaXRDYWxsYmFja3x1bmRlZmluZWQ7XG4gIG9uRmlsZUNoYW5nZShcbiAgICAgIG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMsIGxpc3RlbmVyOiAoZXZlbnQ6IEZpbGVDaGFuZ2VFdmVudCwgZmlsZU5hbWU6IHN0cmluZykgPT4gdm9pZCxcbiAgICAgIHJlYWR5OiAoKSA9PiB2b2lkKToge2Nsb3NlOiAoKSA9PiB2b2lkfTtcbiAgc2V0VGltZW91dChjYWxsYmFjazogKCkgPT4gdm9pZCwgbXM6IG51bWJlcik6IGFueTtcbiAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZDogYW55KTogdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBlcmZvcm1XYXRjaEhvc3QoXG4gICAgY29uZmlnRmlsZU5hbWU6IHN0cmluZywgcmVwb3J0RGlhZ25vc3RpY3M6IChkaWFnbm9zdGljczogRGlhZ25vc3RpY3MpID0+IHZvaWQsXG4gICAgZXhpc3RpbmdPcHRpb25zPzogdHMuQ29tcGlsZXJPcHRpb25zLCBjcmVhdGVFbWl0Q2FsbGJhY2s/OiAob3B0aW9uczogYXBpLkNvbXBpbGVyT3B0aW9ucykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuVHNFbWl0Q2FsbGJhY2sgfCB1bmRlZmluZWQpOiBQZXJmb3JtV2F0Y2hIb3N0IHtcbiAgcmV0dXJuIHtcbiAgICByZXBvcnREaWFnbm9zdGljczogcmVwb3J0RGlhZ25vc3RpY3MsXG4gICAgY3JlYXRlQ29tcGlsZXJIb3N0OiBvcHRpb25zID0+IGNyZWF0ZUNvbXBpbGVySG9zdCh7b3B0aW9uc30pLFxuICAgIHJlYWRDb25maWd1cmF0aW9uOiAoKSA9PiByZWFkQ29uZmlndXJhdGlvbihjb25maWdGaWxlTmFtZSwgZXhpc3RpbmdPcHRpb25zKSxcbiAgICBjcmVhdGVFbWl0Q2FsbGJhY2s6IG9wdGlvbnMgPT4gY3JlYXRlRW1pdENhbGxiYWNrID8gY3JlYXRlRW1pdENhbGxiYWNrKG9wdGlvbnMpIDogdW5kZWZpbmVkLFxuICAgIG9uRmlsZUNoYW5nZTogKG9wdGlvbnMsIGxpc3RlbmVyLCByZWFkeTogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgaWYgKCFvcHRpb25zLmJhc2VQYXRoKSB7XG4gICAgICAgIHJlcG9ydERpYWdub3N0aWNzKFt7XG4gICAgICAgICAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcixcbiAgICAgICAgICBtZXNzYWdlVGV4dDogJ0ludmFsaWQgY29uZmlndXJhdGlvbiBvcHRpb24uIGJhc2VEaXIgbm90IHNwZWNpZmllZCcsXG4gICAgICAgICAgc291cmNlOiBhcGkuU09VUkNFLFxuICAgICAgICAgIGNvZGU6IGFwaS5ERUZBVUxUX0VSUk9SX0NPREVcbiAgICAgICAgfV0pO1xuICAgICAgICByZXR1cm4ge2Nsb3NlOiAoKSA9PiB7fX07XG4gICAgICB9XG4gICAgICBjb25zdCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2gob3B0aW9ucy5iYXNlUGF0aCwge1xuICAgICAgICAvLyBpZ25vcmUgLmRvdGZpbGVzLCAuanMgYW5kIC5tYXAgZmlsZXMuXG4gICAgICAgIC8vIGNhbid0IGlnbm9yZSBvdGhlciBmaWxlcyBhcyB3ZSBlLmcuIHdhbnQgdG8gcmVjb21waWxlIGlmIGFuIGAuaHRtbGAgZmlsZSBjaGFuZ2VzIGFzIHdlbGwuXG4gICAgICAgIGlnbm9yZWQ6IC8oKF5bXFwvXFxcXF0pXFwuLil8KFxcLmpzJCl8KFxcLm1hcCQpfChcXC5tZXRhZGF0YVxcLmpzb258bm9kZV9tb2R1bGVzKS8sXG4gICAgICAgIGlnbm9yZUluaXRpYWw6IHRydWUsXG4gICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHdhdGNoZXIub24oJ2FsbCcsIChldmVudDogc3RyaW5nLCBwYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgc3dpdGNoIChldmVudCkge1xuICAgICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgICBsaXN0ZW5lcihGaWxlQ2hhbmdlRXZlbnQuQ2hhbmdlLCBwYXRoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3VubGluayc6XG4gICAgICAgICAgY2FzZSAnYWRkJzpcbiAgICAgICAgICAgIGxpc3RlbmVyKEZpbGVDaGFuZ2VFdmVudC5DcmVhdGVEZWxldGUsIHBhdGgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndW5saW5rRGlyJzpcbiAgICAgICAgICBjYXNlICdhZGREaXInOlxuICAgICAgICAgICAgbGlzdGVuZXIoRmlsZUNoYW5nZUV2ZW50LkNyZWF0ZURlbGV0ZURpciwgcGF0aCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB3YXRjaGVyLm9uKCdyZWFkeScsIHJlYWR5KTtcbiAgICAgIHJldHVybiB7Y2xvc2U6ICgpID0+IHdhdGNoZXIuY2xvc2UoKSwgcmVhZHl9O1xuICAgIH0sXG4gICAgc2V0VGltZW91dDogKHRzLnN5cy5jbGVhclRpbWVvdXQgJiYgdHMuc3lzLnNldFRpbWVvdXQpIHx8IHNldFRpbWVvdXQsXG4gICAgY2xlYXJUaW1lb3V0OiAodHMuc3lzLnNldFRpbWVvdXQgJiYgdHMuc3lzLmNsZWFyVGltZW91dCkgfHwgY2xlYXJUaW1lb3V0LFxuICB9O1xufVxuXG5pbnRlcmZhY2UgQ2FjaGVFbnRyeSB7XG4gIGV4aXN0cz86IGJvb2xlYW47XG4gIHNmPzogdHMuU291cmNlRmlsZTtcbiAgY29udGVudD86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFF1ZXVlZENvbXBpbGF0aW9uSW5mbyB7XG4gIHRpbWVySGFuZGxlOiBhbnk7XG4gIG1vZGlmaWVkUmVzb3VyY2VGaWxlczogU2V0PHN0cmluZz47XG59XG5cbi8qKlxuICogVGhlIGxvZ2ljIGluIHRoaXMgZnVuY3Rpb24gaXMgYWRhcHRlZCBmcm9tIGB0c2MudHNgIGZyb20gVHlwZVNjcmlwdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBlcmZvcm1XYXRjaENvbXBpbGF0aW9uKGhvc3Q6IFBlcmZvcm1XYXRjaEhvc3QpOlxuICAgIHtjbG9zZTogKCkgPT4gdm9pZCwgcmVhZHk6IChjYjogKCkgPT4gdm9pZCkgPT4gdm9pZCwgZmlyc3RDb21waWxlUmVzdWx0OiBEaWFnbm9zdGljc30ge1xuICBsZXQgY2FjaGVkUHJvZ3JhbTogYXBpLlByb2dyYW18dW5kZWZpbmVkOyAgICAgICAgICAgIC8vIFByb2dyYW0gY2FjaGVkIGZyb20gbGFzdCBjb21waWxhdGlvblxuICBsZXQgY2FjaGVkQ29tcGlsZXJIb3N0OiBhcGkuQ29tcGlsZXJIb3N0fHVuZGVmaW5lZDsgIC8vIENvbXBpbGVySG9zdCBjYWNoZWQgZnJvbSBsYXN0IGNvbXBpbGF0aW9uXG4gIGxldCBjYWNoZWRPcHRpb25zOiBQYXJzZWRDb25maWd1cmF0aW9ufHVuZGVmaW5lZDsgIC8vIENvbXBpbGVyT3B0aW9ucyBjYWNoZWQgZnJvbSBsYXN0IGNvbXBpbGF0aW9uXG4gIGxldCB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb246IFF1ZXVlZENvbXBpbGF0aW9uSW5mb3xcbiAgICAgIHVuZGVmaW5lZDsgIC8vIEhhbmRsZSBmb3IgMC4yNXMgd2FpdCB0aW1lciB0byB0cmlnZ2VyIHJlY29tcGlsYXRpb25cblxuICBjb25zdCBpZ25vcmVGaWxlc0ZvcldhdGNoID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IGZpbGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBDYWNoZUVudHJ5PigpO1xuXG4gIGNvbnN0IGZpcnN0Q29tcGlsZVJlc3VsdCA9IGRvQ29tcGlsYXRpb24oKTtcblxuICAvLyBXYXRjaCBiYXNlUGF0aCwgaWdub3JpbmcgLmRvdGZpbGVzXG4gIGxldCByZXNvbHZlUmVhZHlQcm9taXNlOiAoKSA9PiB2b2lkO1xuICBjb25zdCByZWFkeVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmVSZWFkeVByb21pc2UgPSByZXNvbHZlKTtcbiAgLy8gTm90ZTogISBpcyBvayBhcyBvcHRpb25zIGFyZSBmaWxsZWQgYWZ0ZXIgdGhlIGZpcnN0IGNvbXBpbGF0aW9uXG4gIC8vIE5vdGU6ICEgaXMgb2sgYXMgcmVzb2x2ZWRSZWFkeVByb21pc2UgaXMgZmlsbGVkIGJ5IHRoZSBwcmV2aW91cyBjYWxsXG4gIGNvbnN0IGZpbGVXYXRjaGVyID1cbiAgICAgIGhvc3Qub25GaWxlQ2hhbmdlKGNhY2hlZE9wdGlvbnMgIS5vcHRpb25zLCB3YXRjaGVkRmlsZUNoYW5nZWQsIHJlc29sdmVSZWFkeVByb21pc2UgISk7XG5cbiAgcmV0dXJuIHtjbG9zZSwgcmVhZHk6IGNiID0+IHJlYWR5UHJvbWlzZS50aGVuKGNiKSwgZmlyc3RDb21waWxlUmVzdWx0fTtcblxuICBmdW5jdGlvbiBjYWNoZUVudHJ5KGZpbGVOYW1lOiBzdHJpbmcpOiBDYWNoZUVudHJ5IHtcbiAgICBmaWxlTmFtZSA9IHBhdGgubm9ybWFsaXplKGZpbGVOYW1lKTtcbiAgICBsZXQgZW50cnkgPSBmaWxlQ2FjaGUuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICBlbnRyeSA9IHt9O1xuICAgICAgZmlsZUNhY2hlLnNldChmaWxlTmFtZSwgZW50cnkpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBmaWxlV2F0Y2hlci5jbG9zZSgpO1xuICAgIGlmICh0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24pIHtcbiAgICAgIGhvc3QuY2xlYXJUaW1lb3V0KHRpbWVySGFuZGxlRm9yUmVjb21waWxhdGlvbi50aW1lckhhbmRsZSk7XG4gICAgICB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gSW52b2tlZCB0byBwZXJmb3JtIGluaXRpYWwgY29tcGlsYXRpb24gb3IgcmUtY29tcGlsYXRpb24gaW4gd2F0Y2ggbW9kZVxuICBmdW5jdGlvbiBkb0NvbXBpbGF0aW9uKG1vZGlmaWVkUmVzb3VyY2VGaWxlcz86IFNldDxzdHJpbmc+KTogRGlhZ25vc3RpY3Mge1xuICAgIGlmICghY2FjaGVkT3B0aW9ucykge1xuICAgICAgY2FjaGVkT3B0aW9ucyA9IGhvc3QucmVhZENvbmZpZ3VyYXRpb24oKTtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE9wdGlvbnMuZXJyb3JzICYmIGNhY2hlZE9wdGlvbnMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhjYWNoZWRPcHRpb25zLmVycm9ycyk7XG4gICAgICByZXR1cm4gY2FjaGVkT3B0aW9ucy5lcnJvcnM7XG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgaWYgKCFjYWNoZWRDb21waWxlckhvc3QpIHtcbiAgICAgIGNhY2hlZENvbXBpbGVySG9zdCA9IGhvc3QuY3JlYXRlQ29tcGlsZXJIb3N0KGNhY2hlZE9wdGlvbnMub3B0aW9ucyk7XG4gICAgICBjb25zdCBvcmlnaW5hbFdyaXRlRmlsZUNhbGxiYWNrID0gY2FjaGVkQ29tcGlsZXJIb3N0LndyaXRlRmlsZTtcbiAgICAgIGNhY2hlZENvbXBpbGVySG9zdC53cml0ZUZpbGUgPSBmdW5jdGlvbihcbiAgICAgICAgICBmaWxlTmFtZTogc3RyaW5nLCBkYXRhOiBzdHJpbmcsIHdyaXRlQnl0ZU9yZGVyTWFyazogYm9vbGVhbixcbiAgICAgICAgICBvbkVycm9yPzogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCwgc291cmNlRmlsZXM6IFJlYWRvbmx5QXJyYXk8dHMuU291cmNlRmlsZT4gPSBbXSkge1xuICAgICAgICBpZ25vcmVGaWxlc0ZvcldhdGNoLmFkZChwYXRoLm5vcm1hbGl6ZShmaWxlTmFtZSkpO1xuICAgICAgICByZXR1cm4gb3JpZ2luYWxXcml0ZUZpbGVDYWxsYmFjayhmaWxlTmFtZSwgZGF0YSwgd3JpdGVCeXRlT3JkZXJNYXJrLCBvbkVycm9yLCBzb3VyY2VGaWxlcyk7XG4gICAgICB9O1xuICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXhpc3RzID0gY2FjaGVkQ29tcGlsZXJIb3N0LmZpbGVFeGlzdHM7XG4gICAgICBjYWNoZWRDb21waWxlckhvc3QuZmlsZUV4aXN0cyA9IGZ1bmN0aW9uKGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2UgPSBjYWNoZUVudHJ5KGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKGNlLmV4aXN0cyA9PSBudWxsKSB7XG4gICAgICAgICAgY2UuZXhpc3RzID0gb3JpZ2luYWxGaWxlRXhpc3RzLmNhbGwodGhpcywgZmlsZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjZS5leGlzdHMgITtcbiAgICAgIH07XG4gICAgICBjb25zdCBvcmlnaW5hbEdldFNvdXJjZUZpbGUgPSBjYWNoZWRDb21waWxlckhvc3QuZ2V0U291cmNlRmlsZTtcbiAgICAgIGNhY2hlZENvbXBpbGVySG9zdC5nZXRTb3VyY2VGaWxlID0gZnVuY3Rpb24oXG4gICAgICAgICAgZmlsZU5hbWU6IHN0cmluZywgbGFuZ3VhZ2VWZXJzaW9uOiB0cy5TY3JpcHRUYXJnZXQpIHtcbiAgICAgICAgY29uc3QgY2UgPSBjYWNoZUVudHJ5KGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKCFjZS5zZikge1xuICAgICAgICAgIGNlLnNmID0gb3JpZ2luYWxHZXRTb3VyY2VGaWxlLmNhbGwodGhpcywgZmlsZU5hbWUsIGxhbmd1YWdlVmVyc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNlLnNmICE7XG4gICAgICB9O1xuICAgICAgY29uc3Qgb3JpZ2luYWxSZWFkRmlsZSA9IGNhY2hlZENvbXBpbGVySG9zdC5yZWFkRmlsZTtcbiAgICAgIGNhY2hlZENvbXBpbGVySG9zdC5yZWFkRmlsZSA9IGZ1bmN0aW9uKGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2UgPSBjYWNoZUVudHJ5KGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKGNlLmNvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgIGNlLmNvbnRlbnQgPSBvcmlnaW5hbFJlYWRGaWxlLmNhbGwodGhpcywgZmlsZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjZS5jb250ZW50ICE7XG4gICAgICB9O1xuICAgICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gdGhlIGZpbGUgcGF0aHMgdGhhdCB0cmlnZ2VyZWQgdGhpcyByZWJ1aWxkXG4gICAgICBjYWNoZWRDb21waWxlckhvc3QuZ2V0TW9kaWZpZWRSZXNvdXJjZUZpbGVzID1cbiAgICAgICAgICBtb2RpZmllZFJlc291cmNlRmlsZXMgIT09IHVuZGVmaW5lZCA/ICgpID0+IG1vZGlmaWVkUmVzb3VyY2VGaWxlcyA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWdub3JlRmlsZXNGb3JXYXRjaC5jbGVhcigpO1xuICAgIGNvbnN0IG9sZFByb2dyYW0gPSBjYWNoZWRQcm9ncmFtO1xuICAgIC8vIFdlIGNsZWFyIG91dCB0aGUgYGNhY2hlZFByb2dyYW1gIGhlcmUgYXMgYVxuICAgIC8vIHByb2dyYW0gY2FuIG9ubHkgYmUgdXNlZCBhcyBgb2xkUHJvZ3JhbWAgMXhcbiAgICBjYWNoZWRQcm9ncmFtID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbXBpbGVSZXN1bHQgPSBwZXJmb3JtQ29tcGlsYXRpb24oe1xuICAgICAgcm9vdE5hbWVzOiBjYWNoZWRPcHRpb25zLnJvb3ROYW1lcyxcbiAgICAgIG9wdGlvbnM6IGNhY2hlZE9wdGlvbnMub3B0aW9ucyxcbiAgICAgIGhvc3Q6IGNhY2hlZENvbXBpbGVySG9zdCxcbiAgICAgIG9sZFByb2dyYW06IG9sZFByb2dyYW0sXG4gICAgICBlbWl0Q2FsbGJhY2s6IGhvc3QuY3JlYXRlRW1pdENhbGxiYWNrKGNhY2hlZE9wdGlvbnMub3B0aW9ucylcbiAgICB9KTtcblxuICAgIGlmIChjb21waWxlUmVzdWx0LmRpYWdub3N0aWNzLmxlbmd0aCkge1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhjb21waWxlUmVzdWx0LmRpYWdub3N0aWNzKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbmRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAoY2FjaGVkT3B0aW9ucy5vcHRpb25zLmRpYWdub3N0aWNzKSB7XG4gICAgICBjb25zdCB0b3RhbFRpbWUgPSAoZW5kVGltZSAtIHN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhbdG90YWxDb21waWxhdGlvblRpbWVEaWFnbm9zdGljKGVuZFRpbWUgLSBzdGFydFRpbWUpXSk7XG4gICAgfVxuICAgIGNvbnN0IGV4aXRDb2RlID0gZXhpdENvZGVGcm9tUmVzdWx0KGNvbXBpbGVSZXN1bHQuZGlhZ25vc3RpY3MpO1xuICAgIGlmIChleGl0Q29kZSA9PSAwKSB7XG4gICAgICBjYWNoZWRQcm9ncmFtID0gY29tcGlsZVJlc3VsdC5wcm9ncmFtO1xuICAgICAgaG9zdC5yZXBvcnREaWFnbm9zdGljcyhcbiAgICAgICAgICBbY3JlYXRlTWVzc2FnZURpYWdub3N0aWMoJ0NvbXBpbGF0aW9uIGNvbXBsZXRlLiBXYXRjaGluZyBmb3IgZmlsZSBjaGFuZ2VzLicpXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3QucmVwb3J0RGlhZ25vc3RpY3MoXG4gICAgICAgICAgW2NyZWF0ZU1lc3NhZ2VEaWFnbm9zdGljKCdDb21waWxhdGlvbiBmYWlsZWQuIFdhdGNoaW5nIGZvciBmaWxlIGNoYW5nZXMuJyldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcGlsZVJlc3VsdC5kaWFnbm9zdGljcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0T3B0aW9ucygpIHtcbiAgICBjYWNoZWRQcm9ncmFtID0gdW5kZWZpbmVkO1xuICAgIGNhY2hlZENvbXBpbGVySG9zdCA9IHVuZGVmaW5lZDtcbiAgICBjYWNoZWRPcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gd2F0Y2hlZEZpbGVDaGFuZ2VkKGV2ZW50OiBGaWxlQ2hhbmdlRXZlbnQsIGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAoY2FjaGVkT3B0aW9ucyAmJiBldmVudCA9PT0gRmlsZUNoYW5nZUV2ZW50LkNoYW5nZSAmJlxuICAgICAgICAvLyBUT0RPKGNodWNraik6IHZhbGlkYXRlIHRoYXQgdGhpcyBpcyBzdWZmaWNpZW50IHRvIHNraXAgZmlsZXMgdGhhdCB3ZXJlIHdyaXR0ZW4uXG4gICAgICAgIC8vIFRoaXMgYXNzdW1lcyB0aGF0IHRoZSBmaWxlIHBhdGggd2Ugd3JpdGUgaXMgdGhlIHNhbWUgZmlsZSBwYXRoIHdlIHdpbGwgcmVjZWl2ZSBpbiB0aGVcbiAgICAgICAgLy8gY2hhbmdlIG5vdGlmaWNhdGlvbi5cbiAgICAgICAgcGF0aC5ub3JtYWxpemUoZmlsZU5hbWUpID09PSBwYXRoLm5vcm1hbGl6ZShjYWNoZWRPcHRpb25zLnByb2plY3QpKSB7XG4gICAgICAvLyBJZiB0aGUgY29uZmlndXJhdGlvbiBmaWxlIGNoYW5nZXMsIGZvcmdldCBldmVyeXRoaW5nIGFuZCBzdGFydCB0aGUgcmVjb21waWxhdGlvbiB0aW1lclxuICAgICAgcmVzZXRPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgZXZlbnQgPT09IEZpbGVDaGFuZ2VFdmVudC5DcmVhdGVEZWxldGUgfHwgZXZlbnQgPT09IEZpbGVDaGFuZ2VFdmVudC5DcmVhdGVEZWxldGVEaXIpIHtcbiAgICAgIC8vIElmIGEgZmlsZSB3YXMgYWRkZWQgb3IgcmVtb3ZlZCwgcmVyZWFkIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICAvLyB0byBkZXRlcm1pbmUgdGhlIG5ldyBsaXN0IG9mIHJvb3QgZmlsZXMuXG4gICAgICBjYWNoZWRPcHRpb25zID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChldmVudCA9PT0gRmlsZUNoYW5nZUV2ZW50LkNyZWF0ZURlbGV0ZURpcikge1xuICAgICAgZmlsZUNhY2hlLmNsZWFyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVDYWNoZS5kZWxldGUocGF0aC5ub3JtYWxpemUoZmlsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBpZiAoIWlnbm9yZUZpbGVzRm9yV2F0Y2guaGFzKHBhdGgubm9ybWFsaXplKGZpbGVOYW1lKSkpIHtcbiAgICAgIC8vIElnbm9yZSB0aGUgZmlsZSBpZiB0aGUgZmlsZSBpcyBvbmUgdGhhdCB3YXMgd3JpdHRlbiBieSB0aGUgY29tcGlsZXIuXG4gICAgICBzdGFydFRpbWVyRm9yUmVjb21waWxhdGlvbihmaWxlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVXBvbiBkZXRlY3RpbmcgYSBmaWxlIGNoYW5nZSwgd2FpdCBmb3IgMjUwbXMgYW5kIHRoZW4gcGVyZm9ybSBhIHJlY29tcGlsYXRpb24uIFRoaXMgZ2l2ZXMgYmF0Y2hcbiAgLy8gb3BlcmF0aW9ucyAoc3VjaCBhcyBzYXZpbmcgYWxsIG1vZGlmaWVkIGZpbGVzIGluIGFuIGVkaXRvcikgYSBjaGFuY2UgdG8gY29tcGxldGUgYmVmb3JlIHdlIGtpY2tcbiAgLy8gb2ZmIGEgbmV3IGNvbXBpbGF0aW9uLlxuICBmdW5jdGlvbiBzdGFydFRpbWVyRm9yUmVjb21waWxhdGlvbihjaGFuZ2VkUGF0aDogc3RyaW5nKSB7XG4gICAgaWYgKHRpbWVySGFuZGxlRm9yUmVjb21waWxhdGlvbikge1xuICAgICAgaG9zdC5jbGVhclRpbWVvdXQodGltZXJIYW5kbGVGb3JSZWNvbXBpbGF0aW9uLnRpbWVySGFuZGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZXJIYW5kbGVGb3JSZWNvbXBpbGF0aW9uID0ge1xuICAgICAgICBtb2RpZmllZFJlc291cmNlRmlsZXM6IG5ldyBTZXQ8c3RyaW5nPigpLFxuICAgICAgICB0aW1lckhhbmRsZTogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH1cbiAgICB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24udGltZXJIYW5kbGUgPSBob3N0LnNldFRpbWVvdXQocmVjb21waWxlLCAyNTApO1xuICAgIHRpbWVySGFuZGxlRm9yUmVjb21waWxhdGlvbi5tb2RpZmllZFJlc291cmNlRmlsZXMuYWRkKGNoYW5nZWRQYXRoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY29tcGlsZSgpIHtcbiAgICBob3N0LnJlcG9ydERpYWdub3N0aWNzKFxuICAgICAgICBbY3JlYXRlTWVzc2FnZURpYWdub3N0aWMoJ0ZpbGUgY2hhbmdlIGRldGVjdGVkLiBTdGFydGluZyBpbmNyZW1lbnRhbCBjb21waWxhdGlvbi4nKV0pO1xuICAgIGRvQ29tcGlsYXRpb24odGltZXJIYW5kbGVGb3JSZWNvbXBpbGF0aW9uICEubW9kaWZpZWRSZXNvdXJjZUZpbGVzKTtcbiAgICB0aW1lckhhbmRsZUZvclJlY29tcGlsYXRpb24gPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==