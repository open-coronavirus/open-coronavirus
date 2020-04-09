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
        define("@angular/compiler-cli/src/perform_compile", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/transformers/api", "@angular/compiler-cli/src/transformers/entry_points", "@angular/compiler-cli/src/transformers/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var api = require("@angular/compiler-cli/src/transformers/api");
    var ng = require("@angular/compiler-cli/src/transformers/entry_points");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    function filterErrorsAndWarnings(diagnostics) {
        return diagnostics.filter(function (d) { return d.category !== ts.DiagnosticCategory.Message; });
    }
    exports.filterErrorsAndWarnings = filterErrorsAndWarnings;
    var defaultFormatHost = {
        getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
        getCanonicalFileName: function (fileName) { return fileName; },
        getNewLine: function () { return ts.sys.newLine; }
    };
    function displayFileName(fileName, host) {
        return file_system_1.relative(file_system_1.resolve(host.getCurrentDirectory()), file_system_1.resolve(host.getCanonicalFileName(fileName)));
    }
    function formatDiagnosticPosition(position, host) {
        if (host === void 0) { host = defaultFormatHost; }
        return displayFileName(position.fileName, host) + "(" + (position.line + 1) + "," + (position.column + 1) + ")";
    }
    exports.formatDiagnosticPosition = formatDiagnosticPosition;
    function flattenDiagnosticMessageChain(chain, host) {
        if (host === void 0) { host = defaultFormatHost; }
        var result = chain.messageText;
        var indent = 1;
        var current = chain.next;
        var newLine = host.getNewLine();
        while (current) {
            result += newLine;
            for (var i = 0; i < indent; i++) {
                result += '  ';
            }
            result += current.messageText;
            var position = current.position;
            if (position) {
                result += " at " + formatDiagnosticPosition(position, host);
            }
            current = current.next;
            indent++;
        }
        return result;
    }
    exports.flattenDiagnosticMessageChain = flattenDiagnosticMessageChain;
    function formatDiagnostic(diagnostic, host) {
        if (host === void 0) { host = defaultFormatHost; }
        var result = '';
        var newLine = host.getNewLine();
        var span = diagnostic.span;
        if (span) {
            result += formatDiagnosticPosition({
                fileName: span.start.file.url,
                line: span.start.line,
                column: span.start.col
            }, host) + ": ";
        }
        else if (diagnostic.position) {
            result += formatDiagnosticPosition(diagnostic.position, host) + ": ";
        }
        if (diagnostic.span && diagnostic.span.details) {
            result += diagnostic.span.details + ", " + diagnostic.messageText + newLine;
        }
        else if (diagnostic.chain) {
            result += flattenDiagnosticMessageChain(diagnostic.chain, host) + "." + newLine;
        }
        else {
            result += "" + diagnostic.messageText + newLine;
        }
        return result;
    }
    exports.formatDiagnostic = formatDiagnostic;
    function formatDiagnostics(diags, host) {
        if (host === void 0) { host = defaultFormatHost; }
        if (diags && diags.length) {
            return diags
                .map(function (diagnostic) {
                if (api.isTsDiagnostic(diagnostic)) {
                    return ts.formatDiagnostics([diagnostic], host);
                }
                else {
                    return formatDiagnostic(diagnostic, host);
                }
            })
                .join('');
        }
        else {
            return '';
        }
    }
    exports.formatDiagnostics = formatDiagnostics;
    function calcProjectFileAndBasePath(project) {
        var fs = file_system_1.getFileSystem();
        var absProject = fs.resolve(project);
        var projectIsDir = fs.lstat(absProject).isDirectory();
        var projectFile = projectIsDir ? fs.join(absProject, 'tsconfig.json') : absProject;
        var projectDir = projectIsDir ? absProject : fs.dirname(absProject);
        var basePath = fs.resolve(projectDir);
        return { projectFile: projectFile, basePath: basePath };
    }
    exports.calcProjectFileAndBasePath = calcProjectFileAndBasePath;
    function createNgCompilerOptions(basePath, config, tsOptions) {
        // enableIvy `ngtsc` is an alias for `true`.
        if (config.angularCompilerOptions && config.angularCompilerOptions.enableIvy === 'ngtsc') {
            config.angularCompilerOptions.enableIvy = true;
        }
        return tslib_1.__assign({}, tsOptions, config.angularCompilerOptions, { genDir: basePath, basePath: basePath });
    }
    exports.createNgCompilerOptions = createNgCompilerOptions;
    function readConfiguration(project, existingOptions) {
        try {
            var fs_1 = file_system_1.getFileSystem();
            var _a = calcProjectFileAndBasePath(project), projectFile = _a.projectFile, basePath = _a.basePath;
            var readExtendedConfigFile_1 = function (configFile, existingConfig) {
                var _a = ts.readConfigFile(configFile, ts.sys.readFile), config = _a.config, error = _a.error;
                if (error) {
                    return { error: error };
                }
                // we are only interested into merging 'angularCompilerOptions' as
                // other options like 'compilerOptions' are merged by TS
                var baseConfig = existingConfig || config;
                if (existingConfig) {
                    baseConfig.angularCompilerOptions = tslib_1.__assign({}, config.angularCompilerOptions, baseConfig.angularCompilerOptions);
                }
                if (config.extends) {
                    var extendedConfigPath = fs_1.resolve(fs_1.dirname(configFile), config.extends);
                    extendedConfigPath = fs_1.extname(extendedConfigPath) ?
                        extendedConfigPath :
                        file_system_1.absoluteFrom(extendedConfigPath + ".json");
                    if (fs_1.exists(extendedConfigPath)) {
                        // Call read config recursively as TypeScript only merges CompilerOptions
                        return readExtendedConfigFile_1(extendedConfigPath, baseConfig);
                    }
                }
                return { config: baseConfig };
            };
            var _b = readExtendedConfigFile_1(projectFile), config = _b.config, error = _b.error;
            if (error) {
                return {
                    project: project,
                    errors: [error],
                    rootNames: [],
                    options: {},
                    emitFlags: api.EmitFlags.Default
                };
            }
            var parseConfigHost = {
                useCaseSensitiveFileNames: true,
                fileExists: fs_1.exists.bind(fs_1),
                readDirectory: ts.sys.readDirectory,
                readFile: ts.sys.readFile
            };
            var configFileName = fs_1.resolve(fs_1.pwd(), projectFile);
            var parsed = ts.parseJsonConfigFileContent(config, parseConfigHost, basePath, existingOptions, configFileName);
            var rootNames = parsed.fileNames;
            var options = createNgCompilerOptions(basePath, config, parsed.options);
            var emitFlags = api.EmitFlags.Default;
            if (!(options.skipMetadataEmit || options.flatModuleOutFile)) {
                emitFlags |= api.EmitFlags.Metadata;
            }
            if (options.skipTemplateCodegen) {
                emitFlags = emitFlags & ~api.EmitFlags.Codegen;
            }
            return { project: projectFile, rootNames: rootNames, options: options, errors: parsed.errors, emitFlags: emitFlags };
        }
        catch (e) {
            var errors = [{
                    category: ts.DiagnosticCategory.Error,
                    messageText: e.stack,
                    source: api.SOURCE,
                    code: api.UNKNOWN_ERROR_CODE
                }];
            return { project: '', errors: errors, rootNames: [], options: {}, emitFlags: api.EmitFlags.Default };
        }
    }
    exports.readConfiguration = readConfiguration;
    function exitCodeFromResult(diags) {
        if (!diags || filterErrorsAndWarnings(diags).length === 0) {
            // If we have a result and didn't get any errors, we succeeded.
            return 0;
        }
        // Return 2 if any of the errors were unknown.
        return diags.some(function (d) { return d.source === 'angular' && d.code === api.UNKNOWN_ERROR_CODE; }) ? 2 : 1;
    }
    exports.exitCodeFromResult = exitCodeFromResult;
    function performCompilation(_a) {
        var rootNames = _a.rootNames, options = _a.options, host = _a.host, oldProgram = _a.oldProgram, emitCallback = _a.emitCallback, mergeEmitResultsCallback = _a.mergeEmitResultsCallback, _b = _a.gatherDiagnostics, gatherDiagnostics = _b === void 0 ? defaultGatherDiagnostics : _b, customTransformers = _a.customTransformers, _c = _a.emitFlags, emitFlags = _c === void 0 ? api.EmitFlags.Default : _c, _d = _a.modifiedResourceFiles, modifiedResourceFiles = _d === void 0 ? null : _d;
        var program;
        var emitResult;
        var allDiagnostics = [];
        try {
            if (!host) {
                host = ng.createCompilerHost({ options: options });
            }
            if (modifiedResourceFiles) {
                host.getModifiedResourceFiles = function () { return modifiedResourceFiles; };
            }
            program = ng.createProgram({ rootNames: rootNames, host: host, options: options, oldProgram: oldProgram });
            var beforeDiags = Date.now();
            allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(gatherDiagnostics(program)));
            if (options.diagnostics) {
                var afterDiags = Date.now();
                allDiagnostics.push(util_1.createMessageDiagnostic("Time for diagnostics: " + (afterDiags - beforeDiags) + "ms."));
            }
            if (!hasErrors(allDiagnostics)) {
                emitResult =
                    program.emit({ emitCallback: emitCallback, mergeEmitResultsCallback: mergeEmitResultsCallback, customTransformers: customTransformers, emitFlags: emitFlags });
                allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(emitResult.diagnostics));
                return { diagnostics: allDiagnostics, program: program, emitResult: emitResult };
            }
            return { diagnostics: allDiagnostics, program: program };
        }
        catch (e) {
            var errMsg = void 0;
            var code = void 0;
            if (compiler_1.isSyntaxError(e)) {
                // don't report the stack for syntax errors as they are well known errors.
                errMsg = e.message;
                code = api.DEFAULT_ERROR_CODE;
            }
            else {
                errMsg = e.stack;
                // It is not a syntax error we might have a program with unknown state, discard it.
                program = undefined;
                code = api.UNKNOWN_ERROR_CODE;
            }
            allDiagnostics.push({ category: ts.DiagnosticCategory.Error, messageText: errMsg, code: code, source: api.SOURCE });
            return { diagnostics: allDiagnostics, program: program };
        }
    }
    exports.performCompilation = performCompilation;
    function defaultGatherDiagnostics(program) {
        var allDiagnostics = [];
        function checkDiagnostics(diags) {
            if (diags) {
                allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(diags));
                return !hasErrors(diags);
            }
            return true;
        }
        var checkOtherDiagnostics = true;
        // Check parameter diagnostics
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(tslib_1.__spread(program.getTsOptionDiagnostics(), program.getNgOptionDiagnostics()));
        // Check syntactic diagnostics
        checkOtherDiagnostics =
            checkOtherDiagnostics && checkDiagnostics(program.getTsSyntacticDiagnostics());
        // Check TypeScript semantic and Angular structure diagnostics
        checkOtherDiagnostics =
            checkOtherDiagnostics &&
                checkDiagnostics(tslib_1.__spread(program.getTsSemanticDiagnostics(), program.getNgStructuralDiagnostics()));
        // Check Angular semantic diagnostics
        checkOtherDiagnostics =
            checkOtherDiagnostics && checkDiagnostics(program.getNgSemanticDiagnostics());
        return allDiagnostics;
    }
    function hasErrors(diags) {
        return diags.some(function (d) { return d.category === ts.DiagnosticCategory.Error; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV9jb21waWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9wZXJmb3JtX2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQTBEO0lBQzFELCtCQUFpQztJQUNqQywyRUFBd0c7SUFDeEcsZ0VBQTBDO0lBQzFDLHdFQUFrRDtJQUNsRCxvRUFBNEQ7SUFJNUQsU0FBZ0IsdUJBQXVCLENBQUMsV0FBd0I7UUFDOUQsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsS0FBSyxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUE1QyxDQUE0QyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUZELDBEQUVDO0lBRUQsSUFBTSxpQkFBaUIsR0FBNkI7UUFDbEQsbUJBQW1CLEVBQUUsY0FBTSxPQUFBLEVBQUUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsRUFBNUIsQ0FBNEI7UUFDdkQsb0JBQW9CLEVBQUUsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLEVBQVIsQ0FBUTtRQUMxQyxVQUFVLEVBQUUsY0FBTSxPQUFBLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFkLENBQWM7S0FDakMsQ0FBQztJQUVGLFNBQVMsZUFBZSxDQUFDLFFBQWdCLEVBQUUsSUFBOEI7UUFDdkUsT0FBTyxzQkFBUSxDQUNYLHFCQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRSxxQkFBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVELFNBQWdCLHdCQUF3QixDQUNwQyxRQUFrQixFQUFFLElBQWtEO1FBQWxELHFCQUFBLEVBQUEsd0JBQWtEO1FBQ3hFLE9BQVUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQUksUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLFdBQUksUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLE9BQUcsQ0FBQztJQUNsRyxDQUFDO0lBSEQsNERBR0M7SUFFRCxTQUFnQiw2QkFBNkIsQ0FDekMsS0FBaUMsRUFBRSxJQUFrRDtRQUFsRCxxQkFBQSxFQUFBLHdCQUFrRDtRQUN2RixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLE9BQU8sT0FBTyxFQUFFO1lBQ2QsTUFBTSxJQUFJLE9BQU8sQ0FBQztZQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMvQixNQUFNLElBQUksSUFBSSxDQUFDO2FBQ2hCO1lBQ0QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDOUIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNsQyxJQUFJLFFBQVEsRUFBRTtnQkFDWixNQUFNLElBQUksU0FBTyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFHLENBQUM7YUFDN0Q7WUFDRCxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN2QixNQUFNLEVBQUUsQ0FBQztTQUNWO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQXBCRCxzRUFvQkM7SUFFRCxTQUFnQixnQkFBZ0IsQ0FDNUIsVUFBMEIsRUFBRSxJQUFrRDtRQUFsRCxxQkFBQSxFQUFBLHdCQUFrRDtRQUNoRixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDN0IsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLElBQU8sd0JBQXdCLENBQUM7Z0JBQ3BDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHO2dCQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO2dCQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO2FBQ3ZCLEVBQUUsSUFBSSxDQUFDLE9BQUksQ0FBQztTQUNkO2FBQU0sSUFBSSxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQzlCLE1BQU0sSUFBTyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFJLENBQUM7U0FDdEU7UUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDOUMsTUFBTSxJQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxVQUFLLFVBQVUsQ0FBQyxXQUFXLEdBQUcsT0FBUyxDQUFDO1NBQzdFO2FBQU0sSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQzNCLE1BQU0sSUFBTyw2QkFBNkIsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFJLE9BQVMsQ0FBQztTQUNqRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUcsVUFBVSxDQUFDLFdBQVcsR0FBRyxPQUFTLENBQUM7U0FDakQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBdEJELDRDQXNCQztJQUVELFNBQWdCLGlCQUFpQixDQUM3QixLQUFrQixFQUFFLElBQWtEO1FBQWxELHFCQUFBLEVBQUEsd0JBQWtEO1FBQ3hFLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDekIsT0FBTyxLQUFLO2lCQUNQLEdBQUcsQ0FBQyxVQUFBLFVBQVU7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNsQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNqRDtxQkFBTTtvQkFDTCxPQUFPLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0M7WUFDSCxDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2Y7YUFBTTtZQUNMLE9BQU8sRUFBRSxDQUFDO1NBQ1g7SUFDSCxDQUFDO0lBZkQsOENBZUM7SUFVRCxTQUFnQiwwQkFBMEIsQ0FBQyxPQUFlO1FBRXhELElBQU0sRUFBRSxHQUFHLDJCQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEQsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ3JGLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RFLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEMsT0FBTyxFQUFDLFdBQVcsYUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFDLENBQUM7SUFDakMsQ0FBQztJQVRELGdFQVNDO0lBRUQsU0FBZ0IsdUJBQXVCLENBQ25DLFFBQWdCLEVBQUUsTUFBVyxFQUFFLFNBQTZCO1FBQzlELDRDQUE0QztRQUM1QyxJQUFJLE1BQU0sQ0FBQyxzQkFBc0IsSUFBSSxNQUFNLENBQUMsc0JBQXNCLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtZQUN4RixNQUFNLENBQUMsc0JBQXNCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUNoRDtRQUNELDRCQUFXLFNBQVMsRUFBSyxNQUFNLENBQUMsc0JBQXNCLElBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLFVBQUEsSUFBRTtJQUN0RixDQUFDO0lBUEQsMERBT0M7SUFFRCxTQUFnQixpQkFBaUIsQ0FDN0IsT0FBZSxFQUFFLGVBQW9DO1FBQ3ZELElBQUk7WUFDRixJQUFNLElBQUUsR0FBRywyQkFBYSxFQUFFLENBQUM7WUFDckIsSUFBQSx3Q0FBNkQsRUFBNUQsNEJBQVcsRUFBRSxzQkFBK0MsQ0FBQztZQUVwRSxJQUFNLHdCQUFzQixHQUN4QixVQUFDLFVBQWtCLEVBQUUsY0FBb0I7Z0JBQ2pDLElBQUEsbURBQWdFLEVBQS9ELGtCQUFNLEVBQUUsZ0JBQXVELENBQUM7Z0JBRXZFLElBQUksS0FBSyxFQUFFO29CQUNULE9BQU8sRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDO2lCQUNoQjtnQkFFRCxrRUFBa0U7Z0JBQ2xFLHdEQUF3RDtnQkFDeEQsSUFBTSxVQUFVLEdBQUcsY0FBYyxJQUFJLE1BQU0sQ0FBQztnQkFDNUMsSUFBSSxjQUFjLEVBQUU7b0JBQ2xCLFVBQVUsQ0FBQyxzQkFBc0Isd0JBQU8sTUFBTSxDQUFDLHNCQUFzQixFQUM3QixVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztpQkFDNUU7Z0JBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO29CQUNsQixJQUFJLGtCQUFrQixHQUFHLElBQUUsQ0FBQyxPQUFPLENBQUMsSUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVFLGtCQUFrQixHQUFHLElBQUUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3dCQUNqRCxrQkFBa0IsQ0FBQyxDQUFDO3dCQUNwQiwwQkFBWSxDQUFJLGtCQUFrQixVQUFPLENBQUMsQ0FBQztvQkFFL0MsSUFBSSxJQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7d0JBQ2pDLHlFQUF5RTt3QkFDekUsT0FBTyx3QkFBc0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztxQkFDL0Q7aUJBQ0Y7Z0JBRUQsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7WUFFQSxJQUFBLDBDQUFxRCxFQUFwRCxrQkFBTSxFQUFFLGdCQUE0QyxDQUFDO1lBRTVELElBQUksS0FBSyxFQUFFO2dCQUNULE9BQU87b0JBQ0wsT0FBTyxTQUFBO29CQUNQLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDZixTQUFTLEVBQUUsRUFBRTtvQkFDYixPQUFPLEVBQUUsRUFBRTtvQkFDWCxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPO2lCQUNqQyxDQUFDO2FBQ0g7WUFDRCxJQUFNLGVBQWUsR0FBRztnQkFDdEIseUJBQXlCLEVBQUUsSUFBSTtnQkFDL0IsVUFBVSxFQUFFLElBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUUsQ0FBQztnQkFDOUIsYUFBYSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYTtnQkFDbkMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUTthQUMxQixDQUFDO1lBQ0YsSUFBTSxjQUFjLEdBQUcsSUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDekQsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUN4QyxNQUFNLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDeEUsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUVuQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRSxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUN0QyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQzVELFNBQVMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzthQUNyQztZQUNELElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO2dCQUMvQixTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7YUFDaEQ7WUFDRCxPQUFPLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLFdBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLFdBQUEsRUFBQyxDQUFDO1NBQ3JGO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixJQUFNLE1BQU0sR0FBZ0IsQ0FBQztvQkFDM0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO29CQUNyQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtvQkFDbEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0I7aUJBQzdCLENBQUMsQ0FBQztZQUNILE9BQU8sRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUMsQ0FBQztTQUM1RjtJQUNILENBQUM7SUE3RUQsOENBNkVDO0lBUUQsU0FBZ0Isa0JBQWtCLENBQUMsS0FBOEI7UUFDL0QsSUFBSSxDQUFDLEtBQUssSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pELCtEQUErRDtZQUMvRCxPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsOENBQThDO1FBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLGtCQUFrQixFQUEzRCxDQUEyRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFSRCxnREFRQztJQUVELFNBQWdCLGtCQUFrQixDQUM5QixFQWFDO1lBYkEsd0JBQVMsRUFBRSxvQkFBTyxFQUFFLGNBQUksRUFBRSwwQkFBVSxFQUFFLDhCQUFZLEVBQUUsc0RBQXdCLEVBQzVFLHlCQUE0QyxFQUE1QyxpRUFBNEMsRUFBRSwwQ0FBa0IsRUFDaEUsaUJBQWlDLEVBQWpDLHNEQUFpQyxFQUFFLDZCQUE0QixFQUE1QixpREFBNEI7UUFZbEUsSUFBSSxPQUE4QixDQUFDO1FBQ25DLElBQUksVUFBbUMsQ0FBQztRQUN4QyxJQUFJLGNBQWMsR0FBd0MsRUFBRSxDQUFDO1FBQzdELElBQUk7WUFDRixJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULElBQUksR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBQyxPQUFPLFNBQUEsRUFBQyxDQUFDLENBQUM7YUFDekM7WUFDRCxJQUFJLHFCQUFxQixFQUFFO2dCQUN6QixJQUFJLENBQUMsd0JBQXdCLEdBQUcsY0FBTSxPQUFBLHFCQUFxQixFQUFyQixDQUFxQixDQUFDO2FBQzdEO1lBRUQsT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxVQUFVLFlBQUEsRUFBQyxDQUFDLENBQUM7WUFFbkUsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQy9CLGNBQWMsQ0FBQyxJQUFJLE9BQW5CLGNBQWMsbUJBQVMsaUJBQWlCLENBQUMsT0FBUyxDQUFDLEdBQUU7WUFDckQsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO2dCQUN2QixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzlCLGNBQWMsQ0FBQyxJQUFJLENBQ2YsOEJBQXVCLENBQUMsNEJBQXlCLFVBQVUsR0FBRyxXQUFXLFNBQUssQ0FBQyxDQUFDLENBQUM7YUFDdEY7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUM5QixVQUFVO29CQUNOLE9BQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxZQUFZLGNBQUEsRUFBRSx3QkFBd0IsMEJBQUEsRUFBRSxrQkFBa0Isb0JBQUEsRUFBRSxTQUFTLFdBQUEsRUFBQyxDQUFDLENBQUM7Z0JBQzVGLGNBQWMsQ0FBQyxJQUFJLE9BQW5CLGNBQWMsbUJBQVMsVUFBVSxDQUFDLFdBQVcsR0FBRTtnQkFDL0MsT0FBTyxFQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsT0FBTyxTQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUMsQ0FBQzthQUMzRDtZQUNELE9BQU8sRUFBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUM7U0FDL0M7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksTUFBTSxTQUFRLENBQUM7WUFDbkIsSUFBSSxJQUFJLFNBQVEsQ0FBQztZQUNqQixJQUFJLHdCQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BCLDBFQUEwRTtnQkFDMUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ25CLElBQUksR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUM7YUFDL0I7aUJBQU07Z0JBQ0wsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLG1GQUFtRjtnQkFDbkYsT0FBTyxHQUFHLFNBQVMsQ0FBQztnQkFDcEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQzthQUMvQjtZQUNELGNBQWMsQ0FBQyxJQUFJLENBQ2YsRUFBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksTUFBQSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUM1RixPQUFPLEVBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQTVERCxnREE0REM7SUFDRCxTQUFTLHdCQUF3QixDQUFDLE9BQW9CO1FBQ3BELElBQU0sY0FBYyxHQUF3QyxFQUFFLENBQUM7UUFFL0QsU0FBUyxnQkFBZ0IsQ0FBQyxLQUE4QjtZQUN0RCxJQUFJLEtBQUssRUFBRTtnQkFDVCxjQUFjLENBQUMsSUFBSSxPQUFuQixjQUFjLG1CQUFTLEtBQUssR0FBRTtnQkFDOUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLDhCQUE4QjtRQUM5QixxQkFBcUIsR0FBRyxxQkFBcUI7WUFDekMsZ0JBQWdCLGtCQUFLLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxFQUFLLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUM7UUFFakcsOEJBQThCO1FBQzlCLHFCQUFxQjtZQUNqQixxQkFBcUIsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQWlCLENBQUMsQ0FBQztRQUVsRyw4REFBOEQ7UUFDOUQscUJBQXFCO1lBQ2pCLHFCQUFxQjtnQkFDckIsZ0JBQWdCLGtCQUNSLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxFQUFLLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxFQUFFLENBQUM7UUFFMUYscUNBQXFDO1FBQ3JDLHFCQUFxQjtZQUNqQixxQkFBcUIsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQWlCLENBQUMsQ0FBQztRQUVqRyxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsS0FBa0I7UUFDbkMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsS0FBSyxFQUFFLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUExQyxDQUEwQyxDQUFDLENBQUM7SUFDckUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQb3NpdGlvbiwgaXNTeW50YXhFcnJvcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBhYnNvbHV0ZUZyb20sIGdldEZpbGVTeXN0ZW0sIHJlbGF0aXZlLCByZXNvbHZlfSBmcm9tICcuLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuaW1wb3J0ICogYXMgYXBpIGZyb20gJy4vdHJhbnNmb3JtZXJzL2FwaSc7XG5pbXBvcnQgKiBhcyBuZyBmcm9tICcuL3RyYW5zZm9ybWVycy9lbnRyeV9wb2ludHMnO1xuaW1wb3J0IHtjcmVhdGVNZXNzYWdlRGlhZ25vc3RpY30gZnJvbSAnLi90cmFuc2Zvcm1lcnMvdXRpbCc7XG5cbmV4cG9ydCB0eXBlIERpYWdub3N0aWNzID0gUmVhZG9ubHlBcnJheTx0cy5EaWFnbm9zdGljfGFwaS5EaWFnbm9zdGljPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckVycm9yc0FuZFdhcm5pbmdzKGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcyk6IERpYWdub3N0aWNzIHtcbiAgcmV0dXJuIGRpYWdub3N0aWNzLmZpbHRlcihkID0+IGQuY2F0ZWdvcnkgIT09IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5NZXNzYWdlKTtcbn1cblxuY29uc3QgZGVmYXVsdEZvcm1hdEhvc3Q6IHRzLkZvcm1hdERpYWdub3N0aWNzSG9zdCA9IHtcbiAgZ2V0Q3VycmVudERpcmVjdG9yeTogKCkgPT4gdHMuc3lzLmdldEN1cnJlbnREaXJlY3RvcnkoKSxcbiAgZ2V0Q2Fub25pY2FsRmlsZU5hbWU6IGZpbGVOYW1lID0+IGZpbGVOYW1lLFxuICBnZXROZXdMaW5lOiAoKSA9PiB0cy5zeXMubmV3TGluZVxufTtcblxuZnVuY3Rpb24gZGlzcGxheUZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcsIGhvc3Q6IHRzLkZvcm1hdERpYWdub3N0aWNzSG9zdCk6IHN0cmluZyB7XG4gIHJldHVybiByZWxhdGl2ZShcbiAgICAgIHJlc29sdmUoaG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5KCkpLCByZXNvbHZlKGhvc3QuZ2V0Q2Fub25pY2FsRmlsZU5hbWUoZmlsZU5hbWUpKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREaWFnbm9zdGljUG9zaXRpb24oXG4gICAgcG9zaXRpb246IFBvc2l0aW9uLCBob3N0OiB0cy5Gb3JtYXREaWFnbm9zdGljc0hvc3QgPSBkZWZhdWx0Rm9ybWF0SG9zdCk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtkaXNwbGF5RmlsZU5hbWUocG9zaXRpb24uZmlsZU5hbWUsIGhvc3QpfSgke3Bvc2l0aW9uLmxpbmUgKyAxfSwke3Bvc2l0aW9uLmNvbHVtbisxfSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkRpYWdub3N0aWNNZXNzYWdlQ2hhaW4oXG4gICAgY2hhaW46IGFwaS5EaWFnbm9zdGljTWVzc2FnZUNoYWluLCBob3N0OiB0cy5Gb3JtYXREaWFnbm9zdGljc0hvc3QgPSBkZWZhdWx0Rm9ybWF0SG9zdCk6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSBjaGFpbi5tZXNzYWdlVGV4dDtcbiAgbGV0IGluZGVudCA9IDE7XG4gIGxldCBjdXJyZW50ID0gY2hhaW4ubmV4dDtcbiAgY29uc3QgbmV3TGluZSA9IGhvc3QuZ2V0TmV3TGluZSgpO1xuICB3aGlsZSAoY3VycmVudCkge1xuICAgIHJlc3VsdCArPSBuZXdMaW5lO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZW50OyBpKyspIHtcbiAgICAgIHJlc3VsdCArPSAnICAnO1xuICAgIH1cbiAgICByZXN1bHQgKz0gY3VycmVudC5tZXNzYWdlVGV4dDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnJlbnQucG9zaXRpb247XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICByZXN1bHQgKz0gYCBhdCAke2Zvcm1hdERpYWdub3N0aWNQb3NpdGlvbihwb3NpdGlvbiwgaG9zdCl9YDtcbiAgICB9XG4gICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICBpbmRlbnQrKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGlhZ25vc3RpYyhcbiAgICBkaWFnbm9zdGljOiBhcGkuRGlhZ25vc3RpYywgaG9zdDogdHMuRm9ybWF0RGlhZ25vc3RpY3NIb3N0ID0gZGVmYXVsdEZvcm1hdEhvc3QpIHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBjb25zdCBuZXdMaW5lID0gaG9zdC5nZXROZXdMaW5lKCk7XG4gIGNvbnN0IHNwYW4gPSBkaWFnbm9zdGljLnNwYW47XG4gIGlmIChzcGFuKSB7XG4gICAgcmVzdWx0ICs9IGAke2Zvcm1hdERpYWdub3N0aWNQb3NpdGlvbih7XG4gICAgICBmaWxlTmFtZTogc3Bhbi5zdGFydC5maWxlLnVybCxcbiAgICAgIGxpbmU6IHNwYW4uc3RhcnQubGluZSxcbiAgICAgIGNvbHVtbjogc3Bhbi5zdGFydC5jb2xcbiAgICB9LCBob3N0KX06IGA7XG4gIH0gZWxzZSBpZiAoZGlhZ25vc3RpYy5wb3NpdGlvbikge1xuICAgIHJlc3VsdCArPSBgJHtmb3JtYXREaWFnbm9zdGljUG9zaXRpb24oZGlhZ25vc3RpYy5wb3NpdGlvbiwgaG9zdCl9OiBgO1xuICB9XG4gIGlmIChkaWFnbm9zdGljLnNwYW4gJiYgZGlhZ25vc3RpYy5zcGFuLmRldGFpbHMpIHtcbiAgICByZXN1bHQgKz0gYCR7ZGlhZ25vc3RpYy5zcGFuLmRldGFpbHN9LCAke2RpYWdub3N0aWMubWVzc2FnZVRleHR9JHtuZXdMaW5lfWA7XG4gIH0gZWxzZSBpZiAoZGlhZ25vc3RpYy5jaGFpbikge1xuICAgIHJlc3VsdCArPSBgJHtmbGF0dGVuRGlhZ25vc3RpY01lc3NhZ2VDaGFpbihkaWFnbm9zdGljLmNoYWluLCBob3N0KX0uJHtuZXdMaW5lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ICs9IGAke2RpYWdub3N0aWMubWVzc2FnZVRleHR9JHtuZXdMaW5lfWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERpYWdub3N0aWNzKFxuICAgIGRpYWdzOiBEaWFnbm9zdGljcywgaG9zdDogdHMuRm9ybWF0RGlhZ25vc3RpY3NIb3N0ID0gZGVmYXVsdEZvcm1hdEhvc3QpOiBzdHJpbmcge1xuICBpZiAoZGlhZ3MgJiYgZGlhZ3MubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGRpYWdzXG4gICAgICAgIC5tYXAoZGlhZ25vc3RpYyA9PiB7XG4gICAgICAgICAgaWYgKGFwaS5pc1RzRGlhZ25vc3RpYyhkaWFnbm9zdGljKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRzLmZvcm1hdERpYWdub3N0aWNzKFtkaWFnbm9zdGljXSwgaG9zdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXREaWFnbm9zdGljKGRpYWdub3N0aWMsIGhvc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlZENvbmZpZ3VyYXRpb24ge1xuICBwcm9qZWN0OiBzdHJpbmc7XG4gIG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnM7XG4gIHJvb3ROYW1lczogc3RyaW5nW107XG4gIGVtaXRGbGFnczogYXBpLkVtaXRGbGFncztcbiAgZXJyb3JzOiBEaWFnbm9zdGljcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNQcm9qZWN0RmlsZUFuZEJhc2VQYXRoKHByb2plY3Q6IHN0cmluZyk6XG4gICAge3Byb2plY3RGaWxlOiBBYnNvbHV0ZUZzUGF0aCwgYmFzZVBhdGg6IEFic29sdXRlRnNQYXRofSB7XG4gIGNvbnN0IGZzID0gZ2V0RmlsZVN5c3RlbSgpO1xuICBjb25zdCBhYnNQcm9qZWN0ID0gZnMucmVzb2x2ZShwcm9qZWN0KTtcbiAgY29uc3QgcHJvamVjdElzRGlyID0gZnMubHN0YXQoYWJzUHJvamVjdCkuaXNEaXJlY3RvcnkoKTtcbiAgY29uc3QgcHJvamVjdEZpbGUgPSBwcm9qZWN0SXNEaXIgPyBmcy5qb2luKGFic1Byb2plY3QsICd0c2NvbmZpZy5qc29uJykgOiBhYnNQcm9qZWN0O1xuICBjb25zdCBwcm9qZWN0RGlyID0gcHJvamVjdElzRGlyID8gYWJzUHJvamVjdCA6IGZzLmRpcm5hbWUoYWJzUHJvamVjdCk7XG4gIGNvbnN0IGJhc2VQYXRoID0gZnMucmVzb2x2ZShwcm9qZWN0RGlyKTtcbiAgcmV0dXJuIHtwcm9qZWN0RmlsZSwgYmFzZVBhdGh9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmdDb21waWxlck9wdGlvbnMoXG4gICAgYmFzZVBhdGg6IHN0cmluZywgY29uZmlnOiBhbnksIHRzT3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zKTogYXBpLkNvbXBpbGVyT3B0aW9ucyB7XG4gIC8vIGVuYWJsZUl2eSBgbmd0c2NgIGlzIGFuIGFsaWFzIGZvciBgdHJ1ZWAuXG4gIGlmIChjb25maWcuYW5ndWxhckNvbXBpbGVyT3B0aW9ucyAmJiBjb25maWcuYW5ndWxhckNvbXBpbGVyT3B0aW9ucy5lbmFibGVJdnkgPT09ICduZ3RzYycpIHtcbiAgICBjb25maWcuYW5ndWxhckNvbXBpbGVyT3B0aW9ucy5lbmFibGVJdnkgPSB0cnVlO1xuICB9XG4gIHJldHVybiB7Li4udHNPcHRpb25zLCAuLi5jb25maWcuYW5ndWxhckNvbXBpbGVyT3B0aW9ucywgZ2VuRGlyOiBiYXNlUGF0aCwgYmFzZVBhdGh9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZENvbmZpZ3VyYXRpb24oXG4gICAgcHJvamVjdDogc3RyaW5nLCBleGlzdGluZ09wdGlvbnM/OiB0cy5Db21waWxlck9wdGlvbnMpOiBQYXJzZWRDb25maWd1cmF0aW9uIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmcyA9IGdldEZpbGVTeXN0ZW0oKTtcbiAgICBjb25zdCB7cHJvamVjdEZpbGUsIGJhc2VQYXRofSA9IGNhbGNQcm9qZWN0RmlsZUFuZEJhc2VQYXRoKHByb2plY3QpO1xuXG4gICAgY29uc3QgcmVhZEV4dGVuZGVkQ29uZmlnRmlsZSA9XG4gICAgICAgIChjb25maWdGaWxlOiBzdHJpbmcsIGV4aXN0aW5nQ29uZmlnPzogYW55KToge2NvbmZpZz86IGFueSwgZXJyb3I/OiB0cy5EaWFnbm9zdGljfSA9PiB7XG4gICAgICAgICAgY29uc3Qge2NvbmZpZywgZXJyb3J9ID0gdHMucmVhZENvbmZpZ0ZpbGUoY29uZmlnRmlsZSwgdHMuc3lzLnJlYWRGaWxlKTtcblxuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtlcnJvcn07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gd2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpbnRvIG1lcmdpbmcgJ2FuZ3VsYXJDb21waWxlck9wdGlvbnMnIGFzXG4gICAgICAgICAgLy8gb3RoZXIgb3B0aW9ucyBsaWtlICdjb21waWxlck9wdGlvbnMnIGFyZSBtZXJnZWQgYnkgVFNcbiAgICAgICAgICBjb25zdCBiYXNlQ29uZmlnID0gZXhpc3RpbmdDb25maWcgfHwgY29uZmlnO1xuICAgICAgICAgIGlmIChleGlzdGluZ0NvbmZpZykge1xuICAgICAgICAgICAgYmFzZUNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zID0gey4uLmNvbmZpZy5hbmd1bGFyQ29tcGlsZXJPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmJhc2VDb25maWcuYW5ndWxhckNvbXBpbGVyT3B0aW9uc307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbmZpZy5leHRlbmRzKSB7XG4gICAgICAgICAgICBsZXQgZXh0ZW5kZWRDb25maWdQYXRoID0gZnMucmVzb2x2ZShmcy5kaXJuYW1lKGNvbmZpZ0ZpbGUpLCBjb25maWcuZXh0ZW5kcyk7XG4gICAgICAgICAgICBleHRlbmRlZENvbmZpZ1BhdGggPSBmcy5leHRuYW1lKGV4dGVuZGVkQ29uZmlnUGF0aCkgP1xuICAgICAgICAgICAgICAgIGV4dGVuZGVkQ29uZmlnUGF0aCA6XG4gICAgICAgICAgICAgICAgYWJzb2x1dGVGcm9tKGAke2V4dGVuZGVkQ29uZmlnUGF0aH0uanNvbmApO1xuXG4gICAgICAgICAgICBpZiAoZnMuZXhpc3RzKGV4dGVuZGVkQ29uZmlnUGF0aCkpIHtcbiAgICAgICAgICAgICAgLy8gQ2FsbCByZWFkIGNvbmZpZyByZWN1cnNpdmVseSBhcyBUeXBlU2NyaXB0IG9ubHkgbWVyZ2VzIENvbXBpbGVyT3B0aW9uc1xuICAgICAgICAgICAgICByZXR1cm4gcmVhZEV4dGVuZGVkQ29uZmlnRmlsZShleHRlbmRlZENvbmZpZ1BhdGgsIGJhc2VDb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7Y29uZmlnOiBiYXNlQ29uZmlnfTtcbiAgICAgICAgfTtcblxuICAgIGNvbnN0IHtjb25maWcsIGVycm9yfSA9IHJlYWRFeHRlbmRlZENvbmZpZ0ZpbGUocHJvamVjdEZpbGUpO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9qZWN0LFxuICAgICAgICBlcnJvcnM6IFtlcnJvcl0sXG4gICAgICAgIHJvb3ROYW1lczogW10sXG4gICAgICAgIG9wdGlvbnM6IHt9LFxuICAgICAgICBlbWl0RmxhZ3M6IGFwaS5FbWl0RmxhZ3MuRGVmYXVsdFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VDb25maWdIb3N0ID0ge1xuICAgICAgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lczogdHJ1ZSxcbiAgICAgIGZpbGVFeGlzdHM6IGZzLmV4aXN0cy5iaW5kKGZzKSxcbiAgICAgIHJlYWREaXJlY3Rvcnk6IHRzLnN5cy5yZWFkRGlyZWN0b3J5LFxuICAgICAgcmVhZEZpbGU6IHRzLnN5cy5yZWFkRmlsZVxuICAgIH07XG4gICAgY29uc3QgY29uZmlnRmlsZU5hbWUgPSBmcy5yZXNvbHZlKGZzLnB3ZCgpLCBwcm9qZWN0RmlsZSk7XG4gICAgY29uc3QgcGFyc2VkID0gdHMucGFyc2VKc29uQ29uZmlnRmlsZUNvbnRlbnQoXG4gICAgICAgIGNvbmZpZywgcGFyc2VDb25maWdIb3N0LCBiYXNlUGF0aCwgZXhpc3RpbmdPcHRpb25zLCBjb25maWdGaWxlTmFtZSk7XG4gICAgY29uc3Qgcm9vdE5hbWVzID0gcGFyc2VkLmZpbGVOYW1lcztcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBjcmVhdGVOZ0NvbXBpbGVyT3B0aW9ucyhiYXNlUGF0aCwgY29uZmlnLCBwYXJzZWQub3B0aW9ucyk7XG4gICAgbGV0IGVtaXRGbGFncyA9IGFwaS5FbWl0RmxhZ3MuRGVmYXVsdDtcbiAgICBpZiAoIShvcHRpb25zLnNraXBNZXRhZGF0YUVtaXQgfHwgb3B0aW9ucy5mbGF0TW9kdWxlT3V0RmlsZSkpIHtcbiAgICAgIGVtaXRGbGFncyB8PSBhcGkuRW1pdEZsYWdzLk1ldGFkYXRhO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5za2lwVGVtcGxhdGVDb2RlZ2VuKSB7XG4gICAgICBlbWl0RmxhZ3MgPSBlbWl0RmxhZ3MgJiB+YXBpLkVtaXRGbGFncy5Db2RlZ2VuO1xuICAgIH1cbiAgICByZXR1cm4ge3Byb2plY3Q6IHByb2plY3RGaWxlLCByb290TmFtZXMsIG9wdGlvbnMsIGVycm9yczogcGFyc2VkLmVycm9ycywgZW1pdEZsYWdzfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IGVycm9yczogRGlhZ25vc3RpY3MgPSBbe1xuICAgICAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcixcbiAgICAgIG1lc3NhZ2VUZXh0OiBlLnN0YWNrLFxuICAgICAgc291cmNlOiBhcGkuU09VUkNFLFxuICAgICAgY29kZTogYXBpLlVOS05PV05fRVJST1JfQ09ERVxuICAgIH1dO1xuICAgIHJldHVybiB7cHJvamVjdDogJycsIGVycm9ycywgcm9vdE5hbWVzOiBbXSwgb3B0aW9uczoge30sIGVtaXRGbGFnczogYXBpLkVtaXRGbGFncy5EZWZhdWx0fTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBlcmZvcm1Db21waWxhdGlvblJlc3VsdCB7XG4gIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcztcbiAgcHJvZ3JhbT86IGFwaS5Qcm9ncmFtO1xuICBlbWl0UmVzdWx0PzogdHMuRW1pdFJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4aXRDb2RlRnJvbVJlc3VsdChkaWFnczogRGlhZ25vc3RpY3MgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICBpZiAoIWRpYWdzIHx8IGZpbHRlckVycm9yc0FuZFdhcm5pbmdzKGRpYWdzKS5sZW5ndGggPT09IDApIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGEgcmVzdWx0IGFuZCBkaWRuJ3QgZ2V0IGFueSBlcnJvcnMsIHdlIHN1Y2NlZWRlZC5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFJldHVybiAyIGlmIGFueSBvZiB0aGUgZXJyb3JzIHdlcmUgdW5rbm93bi5cbiAgcmV0dXJuIGRpYWdzLnNvbWUoZCA9PiBkLnNvdXJjZSA9PT0gJ2FuZ3VsYXInICYmIGQuY29kZSA9PT0gYXBpLlVOS05PV05fRVJST1JfQ09ERSkgPyAyIDogMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcmZvcm1Db21waWxhdGlvbihcbiAgICB7cm9vdE5hbWVzLCBvcHRpb25zLCBob3N0LCBvbGRQcm9ncmFtLCBlbWl0Q2FsbGJhY2ssIG1lcmdlRW1pdFJlc3VsdHNDYWxsYmFjayxcbiAgICAgZ2F0aGVyRGlhZ25vc3RpY3MgPSBkZWZhdWx0R2F0aGVyRGlhZ25vc3RpY3MsIGN1c3RvbVRyYW5zZm9ybWVycyxcbiAgICAgZW1pdEZsYWdzID0gYXBpLkVtaXRGbGFncy5EZWZhdWx0LCBtb2RpZmllZFJlc291cmNlRmlsZXMgPSBudWxsfToge1xuICAgICAgcm9vdE5hbWVzOiBzdHJpbmdbXSxcbiAgICAgIG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMsXG4gICAgICBob3N0PzogYXBpLkNvbXBpbGVySG9zdCxcbiAgICAgIG9sZFByb2dyYW0/OiBhcGkuUHJvZ3JhbSxcbiAgICAgIGVtaXRDYWxsYmFjaz86IGFwaS5Uc0VtaXRDYWxsYmFjayxcbiAgICAgIG1lcmdlRW1pdFJlc3VsdHNDYWxsYmFjaz86IGFwaS5Uc01lcmdlRW1pdFJlc3VsdHNDYWxsYmFjayxcbiAgICAgIGdhdGhlckRpYWdub3N0aWNzPzogKHByb2dyYW06IGFwaS5Qcm9ncmFtKSA9PiBEaWFnbm9zdGljcyxcbiAgICAgIGN1c3RvbVRyYW5zZm9ybWVycz86IGFwaS5DdXN0b21UcmFuc2Zvcm1lcnMsXG4gICAgICBlbWl0RmxhZ3M/OiBhcGkuRW1pdEZsYWdzLFxuICAgICAgbW9kaWZpZWRSZXNvdXJjZUZpbGVzPzogU2V0PHN0cmluZz58IG51bGwsXG4gICAgfSk6IFBlcmZvcm1Db21waWxhdGlvblJlc3VsdCB7XG4gIGxldCBwcm9ncmFtOiBhcGkuUHJvZ3JhbXx1bmRlZmluZWQ7XG4gIGxldCBlbWl0UmVzdWx0OiB0cy5FbWl0UmVzdWx0fHVuZGVmaW5lZDtcbiAgbGV0IGFsbERpYWdub3N0aWNzOiBBcnJheTx0cy5EaWFnbm9zdGljfGFwaS5EaWFnbm9zdGljPiA9IFtdO1xuICB0cnkge1xuICAgIGlmICghaG9zdCkge1xuICAgICAgaG9zdCA9IG5nLmNyZWF0ZUNvbXBpbGVySG9zdCh7b3B0aW9uc30pO1xuICAgIH1cbiAgICBpZiAobW9kaWZpZWRSZXNvdXJjZUZpbGVzKSB7XG4gICAgICBob3N0LmdldE1vZGlmaWVkUmVzb3VyY2VGaWxlcyA9ICgpID0+IG1vZGlmaWVkUmVzb3VyY2VGaWxlcztcbiAgICB9XG5cbiAgICBwcm9ncmFtID0gbmcuY3JlYXRlUHJvZ3JhbSh7cm9vdE5hbWVzLCBob3N0LCBvcHRpb25zLCBvbGRQcm9ncmFtfSk7XG5cbiAgICBjb25zdCBiZWZvcmVEaWFncyA9IERhdGUubm93KCk7XG4gICAgYWxsRGlhZ25vc3RpY3MucHVzaCguLi5nYXRoZXJEaWFnbm9zdGljcyhwcm9ncmFtICEpKTtcbiAgICBpZiAob3B0aW9ucy5kaWFnbm9zdGljcykge1xuICAgICAgY29uc3QgYWZ0ZXJEaWFncyA9IERhdGUubm93KCk7XG4gICAgICBhbGxEaWFnbm9zdGljcy5wdXNoKFxuICAgICAgICAgIGNyZWF0ZU1lc3NhZ2VEaWFnbm9zdGljKGBUaW1lIGZvciBkaWFnbm9zdGljczogJHthZnRlckRpYWdzIC0gYmVmb3JlRGlhZ3N9bXMuYCkpO1xuICAgIH1cblxuICAgIGlmICghaGFzRXJyb3JzKGFsbERpYWdub3N0aWNzKSkge1xuICAgICAgZW1pdFJlc3VsdCA9XG4gICAgICAgICAgcHJvZ3JhbSAhLmVtaXQoe2VtaXRDYWxsYmFjaywgbWVyZ2VFbWl0UmVzdWx0c0NhbGxiYWNrLCBjdXN0b21UcmFuc2Zvcm1lcnMsIGVtaXRGbGFnc30pO1xuICAgICAgYWxsRGlhZ25vc3RpY3MucHVzaCguLi5lbWl0UmVzdWx0LmRpYWdub3N0aWNzKTtcbiAgICAgIHJldHVybiB7ZGlhZ25vc3RpY3M6IGFsbERpYWdub3N0aWNzLCBwcm9ncmFtLCBlbWl0UmVzdWx0fTtcbiAgICB9XG4gICAgcmV0dXJuIHtkaWFnbm9zdGljczogYWxsRGlhZ25vc3RpY3MsIHByb2dyYW19O1xuICB9IGNhdGNoIChlKSB7XG4gICAgbGV0IGVyck1zZzogc3RyaW5nO1xuICAgIGxldCBjb2RlOiBudW1iZXI7XG4gICAgaWYgKGlzU3ludGF4RXJyb3IoZSkpIHtcbiAgICAgIC8vIGRvbid0IHJlcG9ydCB0aGUgc3RhY2sgZm9yIHN5bnRheCBlcnJvcnMgYXMgdGhleSBhcmUgd2VsbCBrbm93biBlcnJvcnMuXG4gICAgICBlcnJNc2cgPSBlLm1lc3NhZ2U7XG4gICAgICBjb2RlID0gYXBpLkRFRkFVTFRfRVJST1JfQ09ERTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyTXNnID0gZS5zdGFjaztcbiAgICAgIC8vIEl0IGlzIG5vdCBhIHN5bnRheCBlcnJvciB3ZSBtaWdodCBoYXZlIGEgcHJvZ3JhbSB3aXRoIHVua25vd24gc3RhdGUsIGRpc2NhcmQgaXQuXG4gICAgICBwcm9ncmFtID0gdW5kZWZpbmVkO1xuICAgICAgY29kZSA9IGFwaS5VTktOT1dOX0VSUk9SX0NPREU7XG4gICAgfVxuICAgIGFsbERpYWdub3N0aWNzLnB1c2goXG4gICAgICAgIHtjYXRlZ29yeTogdHMuRGlhZ25vc3RpY0NhdGVnb3J5LkVycm9yLCBtZXNzYWdlVGV4dDogZXJyTXNnLCBjb2RlLCBzb3VyY2U6IGFwaS5TT1VSQ0V9KTtcbiAgICByZXR1cm4ge2RpYWdub3N0aWNzOiBhbGxEaWFnbm9zdGljcywgcHJvZ3JhbX07XG4gIH1cbn1cbmZ1bmN0aW9uIGRlZmF1bHRHYXRoZXJEaWFnbm9zdGljcyhwcm9ncmFtOiBhcGkuUHJvZ3JhbSk6IERpYWdub3N0aWNzIHtcbiAgY29uc3QgYWxsRGlhZ25vc3RpY3M6IEFycmF5PHRzLkRpYWdub3N0aWN8YXBpLkRpYWdub3N0aWM+ID0gW107XG5cbiAgZnVuY3Rpb24gY2hlY2tEaWFnbm9zdGljcyhkaWFnczogRGlhZ25vc3RpY3MgfCB1bmRlZmluZWQpIHtcbiAgICBpZiAoZGlhZ3MpIHtcbiAgICAgIGFsbERpYWdub3N0aWNzLnB1c2goLi4uZGlhZ3MpO1xuICAgICAgcmV0dXJuICFoYXNFcnJvcnMoZGlhZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGxldCBjaGVja090aGVyRGlhZ25vc3RpY3MgPSB0cnVlO1xuICAvLyBDaGVjayBwYXJhbWV0ZXIgZGlhZ25vc3RpY3NcbiAgY2hlY2tPdGhlckRpYWdub3N0aWNzID0gY2hlY2tPdGhlckRpYWdub3N0aWNzICYmXG4gICAgICBjaGVja0RpYWdub3N0aWNzKFsuLi5wcm9ncmFtLmdldFRzT3B0aW9uRGlhZ25vc3RpY3MoKSwgLi4ucHJvZ3JhbS5nZXROZ09wdGlvbkRpYWdub3N0aWNzKCldKTtcblxuICAvLyBDaGVjayBzeW50YWN0aWMgZGlhZ25vc3RpY3NcbiAgY2hlY2tPdGhlckRpYWdub3N0aWNzID1cbiAgICAgIGNoZWNrT3RoZXJEaWFnbm9zdGljcyAmJiBjaGVja0RpYWdub3N0aWNzKHByb2dyYW0uZ2V0VHNTeW50YWN0aWNEaWFnbm9zdGljcygpIGFzIERpYWdub3N0aWNzKTtcblxuICAvLyBDaGVjayBUeXBlU2NyaXB0IHNlbWFudGljIGFuZCBBbmd1bGFyIHN0cnVjdHVyZSBkaWFnbm9zdGljc1xuICBjaGVja090aGVyRGlhZ25vc3RpY3MgPVxuICAgICAgY2hlY2tPdGhlckRpYWdub3N0aWNzICYmXG4gICAgICBjaGVja0RpYWdub3N0aWNzKFxuICAgICAgICAgIFsuLi5wcm9ncmFtLmdldFRzU2VtYW50aWNEaWFnbm9zdGljcygpLCAuLi5wcm9ncmFtLmdldE5nU3RydWN0dXJhbERpYWdub3N0aWNzKCldKTtcblxuICAvLyBDaGVjayBBbmd1bGFyIHNlbWFudGljIGRpYWdub3N0aWNzXG4gIGNoZWNrT3RoZXJEaWFnbm9zdGljcyA9XG4gICAgICBjaGVja090aGVyRGlhZ25vc3RpY3MgJiYgY2hlY2tEaWFnbm9zdGljcyhwcm9ncmFtLmdldE5nU2VtYW50aWNEaWFnbm9zdGljcygpIGFzIERpYWdub3N0aWNzKTtcblxuICByZXR1cm4gYWxsRGlhZ25vc3RpY3M7XG59XG5cbmZ1bmN0aW9uIGhhc0Vycm9ycyhkaWFnczogRGlhZ25vc3RpY3MpIHtcbiAgcmV0dXJuIGRpYWdzLnNvbWUoZCA9PiBkLmNhdGVnb3J5ID09PSB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IpO1xufVxuIl19