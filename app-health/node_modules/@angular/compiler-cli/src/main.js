#!/usr/bin/env node
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
        define("@angular/compiler-cli/src/main", ["require", "exports", "tslib", "reflect-metadata", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/util", "@angular/compiler-cli/src/perform_compile", "@angular/compiler-cli/src/perform_watch", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    // Must be imported first, because Angular decorators throw on load.
    require("reflect-metadata");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    var perform_compile_1 = require("@angular/compiler-cli/src/perform_compile");
    var perform_watch_1 = require("@angular/compiler-cli/src/perform_watch");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    function main(args, consoleError, config, customTransformers, programReuse, modifiedResourceFiles) {
        if (consoleError === void 0) { consoleError = console.error; }
        var _a = config || readNgcCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, watch = _a.watch, emitFlags = _a.emitFlags;
        if (configErrors.length) {
            return reportErrorsAndExit(configErrors, /*options*/ undefined, consoleError);
        }
        if (watch) {
            var result = watchMode(project, options, consoleError);
            return reportErrorsAndExit(result.firstCompileResult, options, consoleError);
        }
        var oldProgram;
        if (programReuse !== undefined) {
            oldProgram = programReuse.program;
        }
        var _b = perform_compile_1.performCompilation({
            rootNames: rootNames,
            options: options,
            emitFlags: emitFlags,
            oldProgram: oldProgram,
            emitCallback: createEmitCallback(options), customTransformers: customTransformers, modifiedResourceFiles: modifiedResourceFiles
        }), compileDiags = _b.diagnostics, program = _b.program;
        if (programReuse !== undefined) {
            programReuse.program = program;
        }
        return reportErrorsAndExit(compileDiags, options, consoleError);
    }
    exports.main = main;
    function mainDiagnosticsForTest(args, config) {
        var _a = config || readNgcCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, watch = _a.watch, emitFlags = _a.emitFlags;
        if (configErrors.length) {
            return configErrors;
        }
        var compileDiags = perform_compile_1.performCompilation({ rootNames: rootNames, options: options, emitFlags: emitFlags, emitCallback: createEmitCallback(options) }).diagnostics;
        return compileDiags;
    }
    exports.mainDiagnosticsForTest = mainDiagnosticsForTest;
    function createEmitCallback(options) {
        var transformDecorators = !options.enableIvy && options.annotationsAs !== 'decorators';
        var transformTypesToClosure = options.annotateForClosureCompiler;
        if (!transformDecorators && !transformTypesToClosure) {
            return undefined;
        }
        if (transformDecorators) {
            // This is needed as a workaround for https://github.com/angular/tsickle/issues/635
            // Otherwise tsickle might emit references to non imported values
            // as TypeScript elided the import.
            options.emitDecoratorMetadata = true;
        }
        var tsickleHost = {
            shouldSkipTsickleProcessing: function (fileName) {
                return /\.d\.ts$/.test(fileName) || util_1.GENERATED_FILES.test(fileName);
            },
            pathToModuleName: function (context, importPath) { return ''; },
            shouldIgnoreWarningsForPath: function (filePath) { return false; },
            fileNameToModuleId: function (fileName) { return fileName; },
            googmodule: false,
            untyped: true,
            convertIndexImportShorthand: false, transformDecorators: transformDecorators, transformTypesToClosure: transformTypesToClosure,
        };
        if (options.annotateForClosureCompiler || options.annotationsAs === 'static fields') {
            return function (_a) {
                var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, _b = _a.customTransformers, customTransformers = _b === void 0 ? {} : _b, host = _a.host, options = _a.options;
                // tslint:disable-next-line:no-require-imports only depend on tsickle if requested
                return require('tsickle').emitWithTsickle(program, tslib_1.__assign({}, tsickleHost, { options: options, host: host, moduleResolutionHost: host }), host, options, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, {
                    beforeTs: customTransformers.before,
                    afterTs: customTransformers.after,
                });
            };
        }
        else {
            return function (_a) {
                var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, _b = _a.customTransformers, customTransformers = _b === void 0 ? {} : _b;
                return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, { after: customTransformers.after, before: customTransformers.before });
            };
        }
    }
    function readNgcCommandLineAndConfiguration(args) {
        var options = {};
        var parsedArgs = require('minimist')(args);
        if (parsedArgs.i18nFile)
            options.i18nInFile = parsedArgs.i18nFile;
        if (parsedArgs.i18nFormat)
            options.i18nInFormat = parsedArgs.i18nFormat;
        if (parsedArgs.locale)
            options.i18nInLocale = parsedArgs.locale;
        var mt = parsedArgs.missingTranslation;
        if (mt === 'error' || mt === 'warning' || mt === 'ignore') {
            options.i18nInMissingTranslations = mt;
        }
        var config = readCommandLineAndConfiguration(args, options, ['i18nFile', 'i18nFormat', 'locale', 'missingTranslation', 'watch']);
        var watch = parsedArgs.w || parsedArgs.watch;
        return tslib_1.__assign({}, config, { watch: watch });
    }
    exports.readNgcCommandLineAndConfiguration = readNgcCommandLineAndConfiguration;
    function readCommandLineAndConfiguration(args, existingOptions, ngCmdLineOptions) {
        if (existingOptions === void 0) { existingOptions = {}; }
        if (ngCmdLineOptions === void 0) { ngCmdLineOptions = []; }
        var cmdConfig = ts.parseCommandLine(args);
        var project = cmdConfig.options.project || '.';
        var cmdErrors = cmdConfig.errors.filter(function (e) {
            if (typeof e.messageText === 'string') {
                var msg_1 = e.messageText;
                return !ngCmdLineOptions.some(function (o) { return msg_1.indexOf(o) >= 0; });
            }
            return true;
        });
        if (cmdErrors.length) {
            return {
                project: project,
                rootNames: [],
                options: cmdConfig.options,
                errors: cmdErrors,
                emitFlags: api.EmitFlags.Default
            };
        }
        var allDiagnostics = [];
        var config = perform_compile_1.readConfiguration(project, cmdConfig.options);
        var options = tslib_1.__assign({}, config.options, existingOptions);
        if (options.locale) {
            options.i18nInLocale = options.locale;
        }
        return {
            project: project,
            rootNames: config.rootNames, options: options,
            errors: config.errors,
            emitFlags: config.emitFlags
        };
    }
    exports.readCommandLineAndConfiguration = readCommandLineAndConfiguration;
    function getFormatDiagnosticsHost(options) {
        var basePath = options ? options.basePath : undefined;
        return {
            getCurrentDirectory: function () { return basePath || ts.sys.getCurrentDirectory(); },
            // We need to normalize the path separators here because by default, TypeScript
            // compiler hosts use posix canonical paths. In order to print consistent diagnostics,
            // we also normalize the paths.
            getCanonicalFileName: function (fileName) { return fileName.replace(/\\/g, '/'); },
            getNewLine: function () {
                // Manually determine the proper new line string based on the passed compiler
                // options. There is no public TypeScript function that returns the corresponding
                // new line string. see: https://github.com/Microsoft/TypeScript/issues/29581
                if (options && options.newLine !== undefined) {
                    return options.newLine === ts.NewLineKind.LineFeed ? '\n' : '\r\n';
                }
                return ts.sys.newLine;
            },
        };
    }
    function reportErrorsAndExit(allDiagnostics, options, consoleError) {
        if (consoleError === void 0) { consoleError = console.error; }
        var errorsAndWarnings = perform_compile_1.filterErrorsAndWarnings(allDiagnostics);
        if (errorsAndWarnings.length) {
            var formatHost = getFormatDiagnosticsHost(options);
            if (options && options.enableIvy === true) {
                var ngDiagnostics = errorsAndWarnings.filter(api.isNgDiagnostic);
                var tsDiagnostics = errorsAndWarnings.filter(api.isTsDiagnostic);
                consoleError(diagnostics_1.replaceTsWithNgInErrors(ts.formatDiagnosticsWithColorAndContext(tsDiagnostics, formatHost)));
                consoleError(perform_compile_1.formatDiagnostics(ngDiagnostics, formatHost));
            }
            else {
                consoleError(perform_compile_1.formatDiagnostics(errorsAndWarnings, formatHost));
            }
        }
        return perform_compile_1.exitCodeFromResult(allDiagnostics);
    }
    function watchMode(project, options, consoleError) {
        return perform_watch_1.performWatchCompilation(perform_watch_1.createPerformWatchHost(project, function (diagnostics) {
            consoleError(perform_compile_1.formatDiagnostics(diagnostics, getFormatDiagnosticsHost(options)));
        }, options, function (options) { return createEmitCallback(options); }));
    }
    exports.watchMode = watchMode;
    // CLI entry point
    if (require.main === module) {
        var args = process.argv.slice(2);
        // We are running the real compiler so run against the real file-system
        file_system_1.setFileSystem(new file_system_1.NodeJSFileSystem());
        process.exitCode = main(args);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsb0VBQW9FO0lBQ3BFLDRCQUEwQjtJQUUxQiwrQkFBaUM7SUFHakMsMkVBQTREO0lBQzVELGdFQUEwQztJQUMxQyxvRUFBb0Q7SUFFcEQsNkVBQTBLO0lBQzFLLHlFQUFnRjtJQUNoRiwyRUFBb0U7SUFFcEUsU0FBZ0IsSUFBSSxDQUNoQixJQUFjLEVBQUUsWUFBaUQsRUFDakUsTUFBK0IsRUFBRSxrQkFBMkMsRUFBRSxZQUU3RSxFQUNELHFCQUF5QztRQUp6Qiw2QkFBQSxFQUFBLGVBQW9DLE9BQU8sQ0FBQyxLQUFLO1FBSy9ELElBQUEsdURBQ2tELEVBRGpELG9CQUFPLEVBQUUsd0JBQVMsRUFBRSxvQkFBTyxFQUFFLHdCQUFvQixFQUFFLGdCQUFLLEVBQUUsd0JBQ1QsQ0FBQztRQUN2RCxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDdkIsT0FBTyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUMvRTtRQUNELElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDekQsT0FBTyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzlFO1FBRUQsSUFBSSxVQUFpQyxDQUFDO1FBQ3RDLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtZQUM5QixVQUFVLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQztTQUNuQztRQUVLLElBQUE7Ozs7OztVQU1KLEVBTkssNkJBQXlCLEVBQUUsb0JBTWhDLENB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O0lBTEQsOEJBS0M7SUFFRCxrQkFBa0I7SUFDbEIsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyx1RUFBdUU7UUFDdkUsMkJBQWEsQ0FBQyxJQUFJLDhCQUFnQixFQUFFLENBQUMsQ0FBQztRQUN0QyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQiIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gTXVzdCBiZSBpbXBvcnRlZCBmaXJzdCwgYmVjYXVzZSBBbmd1bGFyIGRlY29yYXRvcnMgdGhyb3cgb24gbG9hZC5cbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgdHNpY2tsZSBmcm9tICd0c2lja2xlJztcblxuaW1wb3J0IHtyZXBsYWNlVHNXaXRoTmdJbkVycm9yc30gZnJvbSAnLi9uZ3RzYy9kaWFnbm9zdGljcyc7XG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi90cmFuc2Zvcm1lcnMvYXBpJztcbmltcG9ydCB7R0VORVJBVEVEX0ZJTEVTfSBmcm9tICcuL3RyYW5zZm9ybWVycy91dGlsJztcblxuaW1wb3J0IHtleGl0Q29kZUZyb21SZXN1bHQsIHBlcmZvcm1Db21waWxhdGlvbiwgcmVhZENvbmZpZ3VyYXRpb24sIGZvcm1hdERpYWdub3N0aWNzLCBEaWFnbm9zdGljcywgUGFyc2VkQ29uZmlndXJhdGlvbiwgZmlsdGVyRXJyb3JzQW5kV2FybmluZ3N9IGZyb20gJy4vcGVyZm9ybV9jb21waWxlJztcbmltcG9ydCB7cGVyZm9ybVdhdGNoQ29tcGlsYXRpb24swqBjcmVhdGVQZXJmb3JtV2F0Y2hIb3N0fSBmcm9tICcuL3BlcmZvcm1fd2F0Y2gnO1xuaW1wb3J0IHtOb2RlSlNGaWxlU3lzdGVtLCBzZXRGaWxlU3lzdGVtfSBmcm9tICcuL25ndHNjL2ZpbGVfc3lzdGVtJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oXG4gICAgYXJnczogc3RyaW5nW10sIGNvbnNvbGVFcnJvcjogKHM6IHN0cmluZykgPT4gdm9pZCA9IGNvbnNvbGUuZXJyb3IsXG4gICAgY29uZmlnPzogTmdjUGFyc2VkQ29uZmlndXJhdGlvbiwgY3VzdG9tVHJhbnNmb3JtZXJzPzogYXBpLkN1c3RvbVRyYW5zZm9ybWVycywgcHJvZ3JhbVJldXNlPzoge1xuICAgICAgcHJvZ3JhbTogYXBpLlByb2dyYW0gfCB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBtb2RpZmllZFJlc291cmNlRmlsZXM/OiBTZXQ8c3RyaW5nPnwgbnVsbCk6IG51bWJlciB7XG4gIGxldCB7cHJvamVjdCwgcm9vdE5hbWVzLCBvcHRpb25zLCBlcnJvcnM6IGNvbmZpZ0Vycm9ycywgd2F0Y2gsIGVtaXRGbGFnc30gPVxuICAgICAgY29uZmlnIHx8IHJlYWROZ2NDb21tYW5kTGluZUFuZENvbmZpZ3VyYXRpb24oYXJncyk7XG4gIGlmIChjb25maWdFcnJvcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlcG9ydEVycm9yc0FuZEV4aXQoY29uZmlnRXJyb3JzLCAvKm9wdGlvbnMqLyB1bmRlZmluZWQsIGNvbnNvbGVFcnJvcik7XG4gIH1cbiAgaWYgKHdhdGNoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gd2F0Y2hNb2RlKHByb2plY3QsIG9wdGlvbnMsIGNvbnNvbGVFcnJvcik7XG4gICAgcmV0dXJuIHJlcG9ydEVycm9yc0FuZEV4aXQocmVzdWx0LmZpcnN0Q29tcGlsZVJlc3VsdCwgb3B0aW9ucywgY29uc29sZUVycm9yKTtcbiAgfVxuXG4gIGxldCBvbGRQcm9ncmFtOiBhcGkuUHJvZ3JhbXx1bmRlZmluZWQ7XG4gIGlmIChwcm9ncmFtUmV1c2UgIT09IHVuZGVmaW5lZCkge1xuICAgIG9sZFByb2dyYW0gPSBwcm9ncmFtUmV1c2UucHJvZ3JhbTtcbiAgfVxuXG4gIGNvbnN0IHtkaWFnbm9zdGljczogY29tcGlsZURpYWdzLCBwcm9ncmFtfSA9IHBlcmZvcm1Db21waWxhdGlvbih7XG4gICAgcm9vdE5hbWVzLFxuICAgIG9wdGlvbnMsXG4gICAgZW1pdEZsYWdzLFxuICAgIG9sZFByb2dyYW0sXG4gICAgZW1pdENhbGxiYWNrOiBjcmVhdGVFbWl0Q2FsbGJhY2sob3B0aW9ucyksIGN1c3RvbVRyYW5zZm9ybWVycywgbW9kaWZpZWRSZXNvdXJjZUZpbGVzXG4gIH0pO1xuICBpZiAocHJvZ3JhbVJldXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICBwcm9ncmFtUmV1c2UucHJvZ3JhbSA9IHByb2dyYW07XG4gIH1cbiAgcmV0dXJuIHJlcG9ydEVycm9yc0FuZEV4aXQoY29tcGlsZURpYWdzLCBvcHRpb25zLCBjb25zb2xlRXJyb3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFpbkRpYWdub3N0aWNzRm9yVGVzdChcbiAgICBhcmdzOiBzdHJpbmdbXSwgY29uZmlnPzogTmdjUGFyc2VkQ29uZmlndXJhdGlvbik6IFJlYWRvbmx5QXJyYXk8dHMuRGlhZ25vc3RpY3xhcGkuRGlhZ25vc3RpYz4ge1xuICBsZXQge3Byb2plY3QsIHJvb3ROYW1lcywgb3B0aW9ucywgZXJyb3JzOiBjb25maWdFcnJvcnMsIHdhdGNoLCBlbWl0RmxhZ3N9ID1cbiAgICAgIGNvbmZpZyB8fCByZWFkTmdjQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKGFyZ3MpO1xuICBpZiAoY29uZmlnRXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiBjb25maWdFcnJvcnM7XG4gIH1cbiAgY29uc3Qge2RpYWdub3N0aWNzOiBjb21waWxlRGlhZ3N9ID0gcGVyZm9ybUNvbXBpbGF0aW9uKFxuICAgICAge3Jvb3ROYW1lcywgb3B0aW9ucywgZW1pdEZsYWdzLCBlbWl0Q2FsbGJhY2s6IGNyZWF0ZUVtaXRDYWxsYmFjayhvcHRpb25zKX0pO1xuICByZXR1cm4gY29tcGlsZURpYWdzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbWl0Q2FsbGJhY2sob3B0aW9uczogYXBpLkNvbXBpbGVyT3B0aW9ucyk6IGFwaS5Uc0VtaXRDYWxsYmFja3x1bmRlZmluZWQge1xuICBjb25zdCB0cmFuc2Zvcm1EZWNvcmF0b3JzID0gIW9wdGlvbnMuZW5hYmxlSXZ5ICYmIG9wdGlvbnMuYW5ub3RhdGlvbnNBcyAhPT0gJ2RlY29yYXRvcnMnO1xuICBjb25zdCB0cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSA9IG9wdGlvbnMuYW5ub3RhdGVGb3JDbG9zdXJlQ29tcGlsZXI7XG4gIGlmICghdHJhbnNmb3JtRGVjb3JhdG9ycyAmJiAhdHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh0cmFuc2Zvcm1EZWNvcmF0b3JzKSB7XG4gICAgLy8gVGhpcyBpcyBuZWVkZWQgYXMgYSB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci90c2lja2xlL2lzc3Vlcy82MzVcbiAgICAvLyBPdGhlcndpc2UgdHNpY2tsZSBtaWdodCBlbWl0IHJlZmVyZW5jZXMgdG8gbm9uIGltcG9ydGVkIHZhbHVlc1xuICAgIC8vIGFzIFR5cGVTY3JpcHQgZWxpZGVkIHRoZSBpbXBvcnQuXG4gICAgb3B0aW9ucy5lbWl0RGVjb3JhdG9yTWV0YWRhdGEgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHRzaWNrbGVIb3N0OiBQaWNrPFxuICAgICAgdHNpY2tsZS5Uc2lja2xlSG9zdCwgJ3Nob3VsZFNraXBUc2lja2xlUHJvY2Vzc2luZyd8J3BhdGhUb01vZHVsZU5hbWUnfFxuICAgICAgJ3Nob3VsZElnbm9yZVdhcm5pbmdzRm9yUGF0aCd8J2ZpbGVOYW1lVG9Nb2R1bGVJZCd8J2dvb2dtb2R1bGUnfCd1bnR5cGVkJ3xcbiAgICAgICdjb252ZXJ0SW5kZXhJbXBvcnRTaG9ydGhhbmQnfCd0cmFuc2Zvcm1EZWNvcmF0b3JzJ3wndHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUnPiA9IHtcbiAgICBzaG91bGRTa2lwVHNpY2tsZVByb2Nlc3Npbmc6IChmaWxlTmFtZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXFwuZFxcLnRzJC8udGVzdChmaWxlTmFtZSkgfHwgR0VORVJBVEVEX0ZJTEVTLnRlc3QoZmlsZU5hbWUpLFxuICAgIHBhdGhUb01vZHVsZU5hbWU6IChjb250ZXh0LCBpbXBvcnRQYXRoKSA9PiAnJyxcbiAgICBzaG91bGRJZ25vcmVXYXJuaW5nc0ZvclBhdGg6IChmaWxlUGF0aCkgPT4gZmFsc2UsXG4gICAgZmlsZU5hbWVUb01vZHVsZUlkOiAoZmlsZU5hbWUpID0+IGZpbGVOYW1lLFxuICAgIGdvb2dtb2R1bGU6IGZhbHNlLFxuICAgIHVudHlwZWQ6IHRydWUsXG4gICAgY29udmVydEluZGV4SW1wb3J0U2hvcnRoYW5kOiBmYWxzZSwgdHJhbnNmb3JtRGVjb3JhdG9ycywgdHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUsXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuYW5ub3RhdGVGb3JDbG9zdXJlQ29tcGlsZXIgfHwgb3B0aW9ucy5hbm5vdGF0aW9uc0FzID09PSAnc3RhdGljIGZpZWxkcycpIHtcbiAgICByZXR1cm4gKHtcbiAgICAgICAgICAgICBwcm9ncmFtLFxuICAgICAgICAgICAgIHRhcmdldFNvdXJjZUZpbGUsXG4gICAgICAgICAgICAgd3JpdGVGaWxlLFxuICAgICAgICAgICAgIGNhbmNlbGxhdGlvblRva2VuLFxuICAgICAgICAgICAgIGVtaXRPbmx5RHRzRmlsZXMsXG4gICAgICAgICAgICAgY3VzdG9tVHJhbnNmb3JtZXJzID0ge30sXG4gICAgICAgICAgICAgaG9zdCxcbiAgICAgICAgICAgICBvcHRpb25zXG4gICAgICAgICAgIH0pID0+XG4gICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcmVxdWlyZS1pbXBvcnRzIG9ubHkgZGVwZW5kIG9uIHRzaWNrbGUgaWYgcmVxdWVzdGVkXG4gICAgICAgIHJlcXVpcmUoJ3RzaWNrbGUnKS5lbWl0V2l0aFRzaWNrbGUoXG4gICAgICAgICAgICBwcm9ncmFtLCB7Li4udHNpY2tsZUhvc3QsIG9wdGlvbnMsIGhvc3QsIG1vZHVsZVJlc29sdXRpb25Ib3N0OiBob3N0fSwgaG9zdCwgb3B0aW9ucyxcbiAgICAgICAgICAgIHRhcmdldFNvdXJjZUZpbGUsIHdyaXRlRmlsZSwgY2FuY2VsbGF0aW9uVG9rZW4sIGVtaXRPbmx5RHRzRmlsZXMsIHtcbiAgICAgICAgICAgICAgYmVmb3JlVHM6IGN1c3RvbVRyYW5zZm9ybWVycy5iZWZvcmUsXG4gICAgICAgICAgICAgIGFmdGVyVHM6IGN1c3RvbVRyYW5zZm9ybWVycy5hZnRlcixcbiAgICAgICAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAoe1xuICAgICAgICAgICAgIHByb2dyYW0sXG4gICAgICAgICAgICAgdGFyZ2V0U291cmNlRmlsZSxcbiAgICAgICAgICAgICB3cml0ZUZpbGUsXG4gICAgICAgICAgICAgY2FuY2VsbGF0aW9uVG9rZW4sXG4gICAgICAgICAgICAgZW1pdE9ubHlEdHNGaWxlcyxcbiAgICAgICAgICAgICBjdXN0b21UcmFuc2Zvcm1lcnMgPSB7fSxcbiAgICAgICAgICAgfSkgPT5cbiAgICAgICAgICAgICAgIHByb2dyYW0uZW1pdChcbiAgICAgICAgICAgICAgICAgICB0YXJnZXRTb3VyY2VGaWxlLCB3cml0ZUZpbGUsIGNhbmNlbGxhdGlvblRva2VuLCBlbWl0T25seUR0c0ZpbGVzLFxuICAgICAgICAgICAgICAgICAgIHthZnRlcjogY3VzdG9tVHJhbnNmb3JtZXJzLmFmdGVyLCBiZWZvcmU6IGN1c3RvbVRyYW5zZm9ybWVycy5iZWZvcmV9KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5nY1BhcnNlZENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBQYXJzZWRDb25maWd1cmF0aW9uIHsgd2F0Y2g/OiBib29sZWFuOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkTmdjQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKGFyZ3M6IHN0cmluZ1tdKTogTmdjUGFyc2VkQ29uZmlndXJhdGlvbiB7XG4gIGNvbnN0IG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMgPSB7fTtcbiAgY29uc3QgcGFyc2VkQXJncyA9IHJlcXVpcmUoJ21pbmltaXN0JykoYXJncyk7XG4gIGlmIChwYXJzZWRBcmdzLmkxOG5GaWxlKSBvcHRpb25zLmkxOG5JbkZpbGUgPSBwYXJzZWRBcmdzLmkxOG5GaWxlO1xuICBpZiAocGFyc2VkQXJncy5pMThuRm9ybWF0KSBvcHRpb25zLmkxOG5JbkZvcm1hdCA9IHBhcnNlZEFyZ3MuaTE4bkZvcm1hdDtcbiAgaWYgKHBhcnNlZEFyZ3MubG9jYWxlKSBvcHRpb25zLmkxOG5JbkxvY2FsZSA9IHBhcnNlZEFyZ3MubG9jYWxlO1xuICBjb25zdCBtdCA9IHBhcnNlZEFyZ3MubWlzc2luZ1RyYW5zbGF0aW9uO1xuICBpZiAobXQgPT09ICdlcnJvcicgfHwgbXQgPT09ICd3YXJuaW5nJyB8fCBtdCA9PT0gJ2lnbm9yZScpIHtcbiAgICBvcHRpb25zLmkxOG5Jbk1pc3NpbmdUcmFuc2xhdGlvbnMgPSBtdDtcbiAgfVxuICBjb25zdCBjb25maWcgPSByZWFkQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKFxuICAgICAgYXJncywgb3B0aW9ucywgWydpMThuRmlsZScsICdpMThuRm9ybWF0JywgJ2xvY2FsZScsICdtaXNzaW5nVHJhbnNsYXRpb24nLCAnd2F0Y2gnXSk7XG4gIGNvbnN0IHdhdGNoID0gcGFyc2VkQXJncy53IHx8IHBhcnNlZEFyZ3Mud2F0Y2g7XG4gIHJldHVybiB7Li4uY29uZmlnLCB3YXRjaH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKFxuICAgIGFyZ3M6IHN0cmluZ1tdLCBleGlzdGluZ09wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMgPSB7fSxcbiAgICBuZ0NtZExpbmVPcHRpb25zOiBzdHJpbmdbXSA9IFtdKTogUGFyc2VkQ29uZmlndXJhdGlvbiB7XG4gIGxldCBjbWRDb25maWcgPSB0cy5wYXJzZUNvbW1hbmRMaW5lKGFyZ3MpO1xuICBjb25zdCBwcm9qZWN0ID0gY21kQ29uZmlnLm9wdGlvbnMucHJvamVjdCB8fCAnLic7XG4gIGNvbnN0IGNtZEVycm9ycyA9IGNtZENvbmZpZy5lcnJvcnMuZmlsdGVyKGUgPT4ge1xuICAgIGlmICh0eXBlb2YgZS5tZXNzYWdlVGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGUubWVzc2FnZVRleHQ7XG4gICAgICByZXR1cm4gIW5nQ21kTGluZU9wdGlvbnMuc29tZShvID0+IG1zZy5pbmRleE9mKG8pID49IDApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIGlmIChjbWRFcnJvcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2plY3QsXG4gICAgICByb290TmFtZXM6IFtdLFxuICAgICAgb3B0aW9uczogY21kQ29uZmlnLm9wdGlvbnMsXG4gICAgICBlcnJvcnM6IGNtZEVycm9ycyxcbiAgICAgIGVtaXRGbGFnczogYXBpLkVtaXRGbGFncy5EZWZhdWx0XG4gICAgfTtcbiAgfVxuICBjb25zdCBhbGxEaWFnbm9zdGljczogRGlhZ25vc3RpY3MgPSBbXTtcbiAgY29uc3QgY29uZmlnID0gcmVhZENvbmZpZ3VyYXRpb24ocHJvamVjdCwgY21kQ29uZmlnLm9wdGlvbnMpO1xuICBjb25zdCBvcHRpb25zID0gey4uLmNvbmZpZy5vcHRpb25zLCAuLi5leGlzdGluZ09wdGlvbnN9O1xuICBpZiAob3B0aW9ucy5sb2NhbGUpIHtcbiAgICBvcHRpb25zLmkxOG5JbkxvY2FsZSA9IG9wdGlvbnMubG9jYWxlO1xuICB9XG4gIHJldHVybiB7XG4gICAgcHJvamVjdCxcbiAgICByb290TmFtZXM6IGNvbmZpZy5yb290TmFtZXMsIG9wdGlvbnMsXG4gICAgZXJyb3JzOiBjb25maWcuZXJyb3JzLFxuICAgIGVtaXRGbGFnczogY29uZmlnLmVtaXRGbGFnc1xuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtYXREaWFnbm9zdGljc0hvc3Qob3B0aW9ucz86IGFwaS5Db21waWxlck9wdGlvbnMpOiB0cy5Gb3JtYXREaWFnbm9zdGljc0hvc3Qge1xuICBjb25zdCBiYXNlUGF0aCA9IG9wdGlvbnMgPyBvcHRpb25zLmJhc2VQYXRoIDogdW5kZWZpbmVkO1xuICByZXR1cm4ge1xuICAgIGdldEN1cnJlbnREaXJlY3Rvcnk6ICgpID0+IGJhc2VQYXRoIHx8IHRzLnN5cy5nZXRDdXJyZW50RGlyZWN0b3J5KCksXG4gICAgLy8gV2UgbmVlZCB0byBub3JtYWxpemUgdGhlIHBhdGggc2VwYXJhdG9ycyBoZXJlIGJlY2F1c2UgYnkgZGVmYXVsdCwgVHlwZVNjcmlwdFxuICAgIC8vIGNvbXBpbGVyIGhvc3RzIHVzZSBwb3NpeCBjYW5vbmljYWwgcGF0aHMuIEluIG9yZGVyIHRvIHByaW50IGNvbnNpc3RlbnQgZGlhZ25vc3RpY3MsXG4gICAgLy8gd2UgYWxzbyBub3JtYWxpemUgdGhlIHBhdGhzLlxuICAgIGdldENhbm9uaWNhbEZpbGVOYW1lOiBmaWxlTmFtZSA9PiBmaWxlTmFtZS5yZXBsYWNlKC9cXFxcL2csICcvJyksXG4gICAgZ2V0TmV3TGluZTogKCkgPT4ge1xuICAgICAgLy8gTWFudWFsbHkgZGV0ZXJtaW5lIHRoZSBwcm9wZXIgbmV3IGxpbmUgc3RyaW5nIGJhc2VkIG9uIHRoZSBwYXNzZWQgY29tcGlsZXJcbiAgICAgIC8vIG9wdGlvbnMuIFRoZXJlIGlzIG5vIHB1YmxpYyBUeXBlU2NyaXB0IGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgLy8gbmV3IGxpbmUgc3RyaW5nLiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjk1ODFcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubmV3TGluZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLm5ld0xpbmUgPT09IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkID8gJ1xcbicgOiAnXFxyXFxuJztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cy5zeXMubmV3TGluZTtcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXBvcnRFcnJvcnNBbmRFeGl0KFxuICAgIGFsbERpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgb3B0aW9ucz86IGFwaS5Db21waWxlck9wdGlvbnMsXG4gICAgY29uc29sZUVycm9yOiAoczogc3RyaW5nKSA9PiB2b2lkID0gY29uc29sZS5lcnJvcik6IG51bWJlciB7XG4gIGNvbnN0IGVycm9yc0FuZFdhcm5pbmdzID0gZmlsdGVyRXJyb3JzQW5kV2FybmluZ3MoYWxsRGlhZ25vc3RpY3MpO1xuICBpZiAoZXJyb3JzQW5kV2FybmluZ3MubGVuZ3RoKSB7XG4gICAgY29uc3QgZm9ybWF0SG9zdCA9IGdldEZvcm1hdERpYWdub3N0aWNzSG9zdChvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVuYWJsZUl2eSA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgbmdEaWFnbm9zdGljcyA9IGVycm9yc0FuZFdhcm5pbmdzLmZpbHRlcihhcGkuaXNOZ0RpYWdub3N0aWMpO1xuICAgICAgY29uc3QgdHNEaWFnbm9zdGljcyA9IGVycm9yc0FuZFdhcm5pbmdzLmZpbHRlcihhcGkuaXNUc0RpYWdub3N0aWMpO1xuICAgICAgY29uc29sZUVycm9yKHJlcGxhY2VUc1dpdGhOZ0luRXJyb3JzKFxuICAgICAgICAgIHRzLmZvcm1hdERpYWdub3N0aWNzV2l0aENvbG9yQW5kQ29udGV4dCh0c0RpYWdub3N0aWNzLCBmb3JtYXRIb3N0KSkpO1xuICAgICAgY29uc29sZUVycm9yKGZvcm1hdERpYWdub3N0aWNzKG5nRGlhZ25vc3RpY3MsIGZvcm1hdEhvc3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZUVycm9yKGZvcm1hdERpYWdub3N0aWNzKGVycm9yc0FuZFdhcm5pbmdzLCBmb3JtYXRIb3N0KSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBleGl0Q29kZUZyb21SZXN1bHQoYWxsRGlhZ25vc3RpY3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2hNb2RlKFxuICAgIHByb2plY3Q6IHN0cmluZywgb3B0aW9uczogYXBpLkNvbXBpbGVyT3B0aW9ucywgY29uc29sZUVycm9yOiAoczogc3RyaW5nKSA9PiB2b2lkKSB7XG4gIHJldHVybiBwZXJmb3JtV2F0Y2hDb21waWxhdGlvbihjcmVhdGVQZXJmb3JtV2F0Y2hIb3N0KHByb2plY3QsIGRpYWdub3N0aWNzID0+IHtcbiAgICBjb25zb2xlRXJyb3IoZm9ybWF0RGlhZ25vc3RpY3MoZGlhZ25vc3RpY3MsIGdldEZvcm1hdERpYWdub3N0aWNzSG9zdChvcHRpb25zKSkpO1xuICB9LCBvcHRpb25zLCBvcHRpb25zID0+IGNyZWF0ZUVtaXRDYWxsYmFjayhvcHRpb25zKSkpO1xufVxuXG4vLyBDTEkgZW50cnkgcG9pbnRcbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICAvLyBXZSBhcmUgcnVubmluZyB0aGUgcmVhbCBjb21waWxlciBzbyBydW4gYWdhaW5zdCB0aGUgcmVhbCBmaWxlLXN5c3RlbVxuICBzZXRGaWxlU3lzdGVtKG5ldyBOb2RlSlNGaWxlU3lzdGVtKCkpO1xuICBwcm9jZXNzLmV4aXRDb2RlID0gbWFpbihhcmdzKTtcbn1cbiJdfQ==