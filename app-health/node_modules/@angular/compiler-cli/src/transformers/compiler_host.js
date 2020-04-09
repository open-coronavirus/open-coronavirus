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
        define("@angular/compiler-cli/src/transformers/compiler_host", ["require", "exports", "tslib", "@angular/compiler", "path", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/transformers/metadata_reader", "@angular/compiler-cli/src/transformers/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var path = require("path");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var metadata_reader_1 = require("@angular/compiler-cli/src/transformers/metadata_reader");
    var util_1 = require("@angular/compiler-cli/src/transformers/util");
    var NODE_MODULES_PACKAGE_NAME = /node_modules\/((\w|-|\.)+|(@(\w|-|\.)+\/(\w|-|\.)+))/;
    var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
    var CSS_PREPROCESSOR_EXT = /(\.scss|\.less|\.styl)$/;
    var wrapHostForTest = null;
    function setWrapHostForTest(wrapFn) {
        wrapHostForTest = wrapFn;
    }
    exports.setWrapHostForTest = setWrapHostForTest;
    function createCompilerHost(_a) {
        var options = _a.options, _b = _a.tsHost, tsHost = _b === void 0 ? ts.createCompilerHost(options, true) : _b;
        if (wrapHostForTest !== null) {
            tsHost = wrapHostForTest(tsHost);
        }
        return tsHost;
    }
    exports.createCompilerHost = createCompilerHost;
    function assert(condition) {
        if (!condition) {
            // TODO(chuckjaz): do the right thing
        }
        return condition;
    }
    /**
     * Implements the following hosts based on an api.CompilerHost:
     * - ts.CompilerHost to be consumed by a ts.Program
     * - AotCompilerHost for @angular/compiler
     * - TypeCheckHost for mapping ts errors to ng errors (via translateDiagnostics)
     */
    var TsCompilerAotCompilerTypeCheckHostAdapter = /** @class */ (function () {
        function TsCompilerAotCompilerTypeCheckHostAdapter(rootFiles, options, context, metadataProvider, codeGenerator, librarySummaries) {
            var _this = this;
            if (librarySummaries === void 0) { librarySummaries = new Map(); }
            this.rootFiles = rootFiles;
            this.options = options;
            this.context = context;
            this.metadataProvider = metadataProvider;
            this.codeGenerator = codeGenerator;
            this.librarySummaries = librarySummaries;
            this.metadataReaderCache = metadata_reader_1.createMetadataReaderCache();
            this.fileNameToModuleNameCache = new Map();
            this.flatModuleIndexCache = new Map();
            this.flatModuleIndexNames = new Set();
            this.flatModuleIndexRedirectNames = new Set();
            this.originalSourceFiles = new Map();
            this.originalFileExistsCache = new Map();
            this.generatedSourceFiles = new Map();
            this.generatedCodeFor = new Map();
            this.emitter = new compiler_1.TypeScriptEmitter();
            this.getDefaultLibFileName = function (options) {
                return _this.context.getDefaultLibFileName(options);
            };
            this.getCurrentDirectory = function () { return _this.context.getCurrentDirectory(); };
            this.getCanonicalFileName = function (fileName) { return _this.context.getCanonicalFileName(fileName); };
            this.useCaseSensitiveFileNames = function () { return _this.context.useCaseSensitiveFileNames(); };
            this.getNewLine = function () { return _this.context.getNewLine(); };
            // Make sure we do not `host.realpath()` from TS as we do not want to resolve symlinks.
            // https://github.com/Microsoft/TypeScript/issues/9552
            this.realpath = function (p) { return p; };
            this.writeFile = this.context.writeFile.bind(this.context);
            this.moduleResolutionCache = ts.createModuleResolutionCache(this.context.getCurrentDirectory(), this.context.getCanonicalFileName.bind(this.context));
            var basePath = this.options.basePath;
            this.rootDirs =
                (this.options.rootDirs || [this.options.basePath]).map(function (p) { return path.resolve(basePath, p); });
            if (context.getDirectories) {
                this.getDirectories = function (path) { return context.getDirectories(path); };
            }
            if (context.directoryExists) {
                this.directoryExists = function (directoryName) { return context.directoryExists(directoryName); };
            }
            if (context.getCancellationToken) {
                this.getCancellationToken = function () { return context.getCancellationToken(); };
            }
            if (context.getDefaultLibLocation) {
                this.getDefaultLibLocation = function () { return context.getDefaultLibLocation(); };
            }
            if (context.resolveTypeReferenceDirectives) {
                this.resolveTypeReferenceDirectives = function (names, containingFile) {
                    return context.resolveTypeReferenceDirectives(names, containingFile);
                };
            }
            if (context.trace) {
                this.trace = function (s) { return context.trace(s); };
            }
            if (context.fileNameToModuleName) {
                this.fileNameToModuleName = context.fileNameToModuleName.bind(context);
            }
            // Note: don't copy over context.moduleNameToFileName as we first
            // normalize undefined containingFile to a filled containingFile.
            if (context.resourceNameToFileName) {
                this.resourceNameToFileName = context.resourceNameToFileName.bind(context);
            }
            if (context.toSummaryFileName) {
                this.toSummaryFileName = context.toSummaryFileName.bind(context);
            }
            if (context.fromSummaryFileName) {
                this.fromSummaryFileName = context.fromSummaryFileName.bind(context);
            }
            this.metadataReaderHost = {
                cacheMetadata: function () { return true; },
                getSourceFileMetadata: function (filePath) {
                    var sf = _this.getOriginalSourceFile(filePath);
                    return sf ? _this.metadataProvider.getMetadata(sf) : undefined;
                },
                fileExists: function (filePath) { return _this.originalFileExists(filePath); },
                readFile: function (filePath) { return assert(_this.context.readFile(filePath)); },
            };
        }
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.resolveModuleName = function (moduleName, containingFile) {
            var rm = ts.resolveModuleName(moduleName, containingFile.replace(/\\/g, '/'), this.options, this, this.moduleResolutionCache)
                .resolvedModule;
            if (rm && this.isSourceFile(rm.resolvedFileName) && util_1.DTS.test(rm.resolvedFileName)) {
                // Case: generateCodeForLibraries = true and moduleName is
                // a .d.ts file in a node_modules folder.
                // Need to set isExternalLibraryImport to false so that generated files for that file
                // are emitted.
                rm.isExternalLibraryImport = false;
            }
            return rm;
        };
        // Note: We implement this method so that TypeScript and Angular share the same
        // ts.ModuleResolutionCache
        // and that we can tell ts.Program about our different opinion about
        // ResolvedModule.isExternalLibraryImport
        // (see our isSourceFile method).
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.resolveModuleNames = function (moduleNames, containingFile) {
            var _this = this;
            // TODO(tbosch): this seems to be a typing error in TypeScript,
            // as it contains assertions that the result contains the same number of entries
            // as the given module names.
            return moduleNames.map(function (moduleName) { return _this.resolveModuleName(moduleName, containingFile); });
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.moduleNameToFileName = function (m, containingFile) {
            if (!containingFile) {
                if (m.indexOf('.') === 0) {
                    throw new Error('Resolution of relative paths requires a containing file.');
                }
                // Any containing file gives the same result for absolute imports
                containingFile = this.rootFiles[0];
            }
            if (this.context.moduleNameToFileName) {
                return this.context.moduleNameToFileName(m, containingFile);
            }
            var resolved = this.resolveModuleName(m, containingFile);
            return resolved ? resolved.resolvedFileName : null;
        };
        /**
         * We want a moduleId that will appear in import statements in the generated code
         * which will be written to `containingFile`.
         *
         * Note that we also generate files for files in node_modules, as libraries
         * only ship .metadata.json files but not the generated code.
         *
         * Logic:
         * 1. if the importedFile and the containingFile are from the project sources
         *    or from the same node_modules package, use a relative path
         * 2. if the importedFile is in a node_modules package,
         *    use a path that starts with the package name.
         * 3. Error if the containingFile is in the node_modules package
         *    and the importedFile is in the project soures,
         *    as that is a violation of the principle that node_modules packages cannot
         *    import project sources.
         */
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.fileNameToModuleName = function (importedFile, containingFile) {
            var cacheKey = importedFile + ":" + containingFile;
            var moduleName = this.fileNameToModuleNameCache.get(cacheKey);
            if (moduleName != null) {
                return moduleName;
            }
            var originalImportedFile = importedFile;
            if (this.options.traceResolution) {
                console.error('fileNameToModuleName from containingFile', containingFile, 'to importedFile', importedFile);
            }
            // drop extension
            importedFile = importedFile.replace(EXT, '');
            var importedFilePackageName = getPackageName(importedFile);
            var containingFilePackageName = getPackageName(containingFile);
            if (importedFilePackageName === containingFilePackageName ||
                util_1.GENERATED_FILES.test(originalImportedFile)) {
                var rootedContainingFile = util_1.relativeToRootDirs(containingFile, this.rootDirs);
                var rootedImportedFile = util_1.relativeToRootDirs(importedFile, this.rootDirs);
                if (rootedContainingFile !== containingFile && rootedImportedFile !== importedFile) {
                    // if both files are contained in the `rootDirs`, then strip the rootDirs
                    containingFile = rootedContainingFile;
                    importedFile = rootedImportedFile;
                }
                moduleName = dotRelative(path.dirname(containingFile), importedFile);
            }
            else if (importedFilePackageName) {
                moduleName = stripNodeModulesPrefix(importedFile);
                if (originalImportedFile.endsWith('.d.ts')) {
                    // the moduleName for these typings could be shortented to the npm package name
                    // if the npm package typings matches the importedFile
                    try {
                        var modulePath = importedFile.substring(0, importedFile.length - moduleName.length) +
                            importedFilePackageName;
                        var packageJson = require(modulePath + '/package.json');
                        var packageTypings = file_system_1.join(modulePath, packageJson.typings);
                        if (packageTypings === originalImportedFile) {
                            moduleName = importedFilePackageName;
                        }
                    }
                    catch (_a) {
                        // the above require() will throw if there is no package.json file
                        // and this is safe to ignore and correct to keep the longer
                        // moduleName in this case
                    }
                }
            }
            else {
                throw new Error("Trying to import a source file from a node_modules package: import " + originalImportedFile + " from " + containingFile);
            }
            this.fileNameToModuleNameCache.set(cacheKey, moduleName);
            return moduleName;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.resourceNameToFileName = function (resourceName, containingFile) {
            // Note: we convert package paths into relative paths to be compatible with the the
            // previous implementation of UrlResolver.
            var firstChar = resourceName[0];
            if (firstChar === '/') {
                resourceName = resourceName.slice(1);
            }
            else if (firstChar !== '.') {
                resourceName = "./" + resourceName;
            }
            var filePathWithNgResource = this.moduleNameToFileName(addNgResourceSuffix(resourceName), containingFile);
            // If the user specified styleUrl pointing to *.scss, but the Sass compiler was run before
            // Angular, then the resource may have been generated as *.css. Simply try the resolution again.
            if (!filePathWithNgResource && CSS_PREPROCESSOR_EXT.test(resourceName)) {
                var fallbackResourceName = resourceName.replace(CSS_PREPROCESSOR_EXT, '.css');
                filePathWithNgResource =
                    this.moduleNameToFileName(addNgResourceSuffix(fallbackResourceName), containingFile);
            }
            var result = filePathWithNgResource ? stripNgResourceSuffix(filePathWithNgResource) : null;
            // Used under Bazel to report more specific error with remediation advice
            if (!result && this.context.reportMissingResource) {
                this.context.reportMissingResource(resourceName);
            }
            return result;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.toSummaryFileName = function (fileName, referringSrcFileName) {
            return this.fileNameToModuleName(fileName, referringSrcFileName);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.fromSummaryFileName = function (fileName, referringLibFileName) {
            var resolved = this.moduleNameToFileName(fileName, referringLibFileName);
            if (!resolved) {
                throw new Error("Could not resolve " + fileName + " from " + referringLibFileName);
            }
            return resolved;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.parseSourceSpanOf = function (fileName, line, character) {
            var data = this.generatedSourceFiles.get(fileName);
            if (data && data.emitCtx) {
                return data.emitCtx.spanOf(line, character);
            }
            return null;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getOriginalSourceFile = function (filePath, languageVersion, onError) {
            // Note: we need the explicit check via `has` as we also cache results
            // that were null / undefined.
            if (this.originalSourceFiles.has(filePath)) {
                return this.originalSourceFiles.get(filePath);
            }
            if (!languageVersion) {
                languageVersion = this.options.target || ts.ScriptTarget.Latest;
            }
            // Note: This can also return undefined,
            // as the TS typings are not correct!
            var sf = this.context.getSourceFile(filePath, languageVersion, onError) || null;
            this.originalSourceFiles.set(filePath, sf);
            return sf;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.updateGeneratedFile = function (genFile) {
            if (!genFile.stmts) {
                throw new Error("Invalid Argument: Expected a GenerateFile with statements. " + genFile.genFileUrl);
            }
            var oldGenFile = this.generatedSourceFiles.get(genFile.genFileUrl);
            if (!oldGenFile) {
                throw new Error("Illegal State: previous GeneratedFile not found for " + genFile.genFileUrl + ".");
            }
            var newRefs = genFileExternalReferences(genFile);
            var oldRefs = oldGenFile.externalReferences;
            var refsAreEqual = oldRefs.size === newRefs.size;
            if (refsAreEqual) {
                newRefs.forEach(function (r) { return refsAreEqual = refsAreEqual && oldRefs.has(r); });
            }
            if (!refsAreEqual) {
                throw new Error("Illegal State: external references changed in " + genFile.genFileUrl + ".\nOld: " + Array.from(oldRefs) + ".\nNew: " + Array.from(newRefs));
            }
            return this.addGeneratedFile(genFile, newRefs);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.addGeneratedFile = function (genFile, externalReferences) {
            if (!genFile.stmts) {
                throw new Error("Invalid Argument: Expected a GenerateFile with statements. " + genFile.genFileUrl);
            }
            var _a = this.emitter.emitStatementsAndContext(genFile.genFileUrl, genFile.stmts, /* preamble */ '', 
            /* emitSourceMaps */ false), sourceText = _a.sourceText, context = _a.context;
            var sf = ts.createSourceFile(genFile.genFileUrl, sourceText, this.options.target || ts.ScriptTarget.Latest);
            if (this.options.module === ts.ModuleKind.AMD || this.options.module === ts.ModuleKind.UMD) {
                if (this.context.amdModuleName) {
                    var moduleName = this.context.amdModuleName(sf);
                    if (moduleName)
                        sf.moduleName = moduleName;
                }
                else if (/node_modules/.test(genFile.genFileUrl)) {
                    // If we are generating an ngModule file under node_modules, we know the right module name
                    // We don't need the host to supply a function in this case.
                    sf.moduleName = stripNodeModulesPrefix(genFile.genFileUrl.replace(EXT, ''));
                }
            }
            this.generatedSourceFiles.set(genFile.genFileUrl, {
                sourceFile: sf,
                emitCtx: context, externalReferences: externalReferences,
            });
            return sf;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.shouldGenerateFile = function (fileName) {
            var _this = this;
            // TODO(tbosch): allow generating files that are not in the rootDir
            // See https://github.com/angular/angular/issues/19337
            if (!util_1.isInRootDir(fileName, this.options)) {
                return { generate: false };
            }
            var genMatch = util_1.GENERATED_FILES.exec(fileName);
            if (!genMatch) {
                return { generate: false };
            }
            var _a = tslib_1.__read(genMatch, 4), base = _a[1], genSuffix = _a[2], suffix = _a[3];
            if (suffix !== 'ts' && suffix !== 'tsx') {
                return { generate: false };
            }
            var baseFileName;
            if (genSuffix.indexOf('ngstyle') >= 0) {
                // Note: ngstyle files have names like `afile.css.ngstyle.ts`
                if (!this.originalFileExists(base)) {
                    return { generate: false };
                }
            }
            else {
                // Note: on-the-fly generated files always have a `.ts` suffix,
                // but the file from which we generated it can be a `.ts`/ `.tsx`/ `.d.ts`
                // (see options.generateCodeForLibraries).
                baseFileName = [base + ".ts", base + ".tsx", base + ".d.ts"].find(function (baseFileName) { return _this.isSourceFile(baseFileName) && _this.originalFileExists(baseFileName); });
                if (!baseFileName) {
                    return { generate: false };
                }
            }
            return { generate: true, baseFileName: baseFileName };
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.shouldGenerateFilesFor = function (fileName) {
            // TODO(tbosch): allow generating files that are not in the rootDir
            // See https://github.com/angular/angular/issues/19337
            return !util_1.GENERATED_FILES.test(fileName) && this.isSourceFile(fileName) &&
                util_1.isInRootDir(fileName, this.options);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getSourceFile = function (fileName, languageVersion, onError) {
            var _this = this;
            // Note: Don't exit early in this method to make sure
            // we always have up to date references on the file!
            var genFileNames = [];
            var sf = this.getGeneratedFile(fileName);
            if (!sf) {
                var summary = this.librarySummaries.get(fileName);
                if (summary) {
                    if (!summary.sourceFile) {
                        summary.sourceFile = ts.createSourceFile(fileName, summary.text, this.options.target || ts.ScriptTarget.Latest);
                    }
                    sf = summary.sourceFile;
                    // TypeScript doesn't allow returning redirect source files. To avoid unforseen errors we
                    // return the original source file instead of the redirect target.
                    var redirectInfo = sf.redirectInfo;
                    if (redirectInfo !== undefined) {
                        sf = redirectInfo.unredirected;
                    }
                    genFileNames = [];
                }
            }
            if (!sf) {
                sf = this.getOriginalSourceFile(fileName);
                var cachedGenFiles = this.generatedCodeFor.get(fileName);
                if (cachedGenFiles) {
                    genFileNames = cachedGenFiles;
                }
                else {
                    if (!this.options.noResolve && this.shouldGenerateFilesFor(fileName)) {
                        genFileNames = this.codeGenerator.findGeneratedFileNames(fileName).filter(function (fileName) { return _this.shouldGenerateFile(fileName).generate; });
                    }
                    this.generatedCodeFor.set(fileName, genFileNames);
                }
            }
            if (sf) {
                addReferencesToSourceFile(sf, genFileNames);
            }
            // TODO(tbosch): TypeScript's typings for getSourceFile are incorrect,
            // as it can very well return undefined.
            return sf;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getGeneratedFile = function (fileName) {
            var genSrcFile = this.generatedSourceFiles.get(fileName);
            if (genSrcFile) {
                return genSrcFile.sourceFile;
            }
            var _a = this.shouldGenerateFile(fileName), generate = _a.generate, baseFileName = _a.baseFileName;
            if (generate) {
                var genFile = this.codeGenerator.generateFile(fileName, baseFileName);
                return this.addGeneratedFile(genFile, genFileExternalReferences(genFile));
            }
            return null;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.originalFileExists = function (fileName) {
            var fileExists = this.originalFileExistsCache.get(fileName);
            if (fileExists == null) {
                fileExists = this.context.fileExists(fileName);
                this.originalFileExistsCache.set(fileName, fileExists);
            }
            return fileExists;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.fileExists = function (fileName) {
            fileName = stripNgResourceSuffix(fileName);
            if (this.librarySummaries.has(fileName) || this.generatedSourceFiles.has(fileName)) {
                return true;
            }
            if (this.shouldGenerateFile(fileName).generate) {
                return true;
            }
            return this.originalFileExists(fileName);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.loadSummary = function (filePath) {
            var summary = this.librarySummaries.get(filePath);
            if (summary) {
                return summary.text;
            }
            if (this.originalFileExists(filePath)) {
                return assert(this.context.readFile(filePath));
            }
            return null;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.isSourceFile = function (filePath) {
            // Don't generate any files nor typecheck them
            // if skipTemplateCodegen is set and fullTemplateTypeCheck is not yet set,
            // for backwards compatibility.
            if (this.options.skipTemplateCodegen && !this.options.fullTemplateTypeCheck) {
                return false;
            }
            // If we have a summary from a previous compilation,
            // treat the file never as a source file.
            if (this.librarySummaries.has(filePath)) {
                return false;
            }
            if (util_1.GENERATED_FILES.test(filePath)) {
                return false;
            }
            if (this.options.generateCodeForLibraries === false && util_1.DTS.test(filePath)) {
                return false;
            }
            if (util_1.DTS.test(filePath)) {
                // Check for a bundle index.
                if (this.hasBundleIndex(filePath)) {
                    var normalFilePath = path.normalize(filePath);
                    return this.flatModuleIndexNames.has(normalFilePath) ||
                        this.flatModuleIndexRedirectNames.has(normalFilePath);
                }
            }
            return true;
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.readFile = function (fileName) {
            var summary = this.librarySummaries.get(fileName);
            if (summary) {
                return summary.text;
            }
            return this.context.readFile(fileName);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getMetadataFor = function (filePath) {
            return metadata_reader_1.readMetadata(filePath, this.metadataReaderHost, this.metadataReaderCache);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.loadResource = function (filePath) {
            if (this.context.readResource)
                return this.context.readResource(filePath);
            if (!this.originalFileExists(filePath)) {
                throw compiler_1.syntaxError("Error: Resource file not found: " + filePath);
            }
            return assert(this.context.readFile(filePath));
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getOutputName = function (filePath) {
            return path.relative(this.getCurrentDirectory(), filePath);
        };
        TsCompilerAotCompilerTypeCheckHostAdapter.prototype.hasBundleIndex = function (filePath) {
            var _this = this;
            var checkBundleIndex = function (directory) {
                var result = _this.flatModuleIndexCache.get(directory);
                if (result == null) {
                    if (path.basename(directory) == 'node_module') {
                        // Don't look outside the node_modules this package is installed in.
                        result = false;
                    }
                    else {
                        // A bundle index exists if the typings .d.ts file has a metadata.json that has an
                        // importAs.
                        try {
                            var packageFile = path.join(directory, 'package.json');
                            if (_this.originalFileExists(packageFile)) {
                                // Once we see a package.json file, assume false until it we find the bundle index.
                                result = false;
                                var packageContent = JSON.parse(assert(_this.context.readFile(packageFile)));
                                if (packageContent.typings) {
                                    var typings = path.normalize(path.join(directory, packageContent.typings));
                                    if (util_1.DTS.test(typings)) {
                                        var metadataFile = typings.replace(util_1.DTS, '.metadata.json');
                                        if (_this.originalFileExists(metadataFile)) {
                                            var metadata = JSON.parse(assert(_this.context.readFile(metadataFile)));
                                            if (metadata.flatModuleIndexRedirect) {
                                                _this.flatModuleIndexRedirectNames.add(typings);
                                                // Note: don't set result = true,
                                                // as this would mark this folder
                                                // as having a bundleIndex too early without
                                                // filling the bundleIndexNames.
                                            }
                                            else if (metadata.importAs) {
                                                _this.flatModuleIndexNames.add(typings);
                                                result = true;
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                var parent = path.dirname(directory);
                                if (parent != directory) {
                                    // Try the parent directory.
                                    result = checkBundleIndex(parent);
                                }
                                else {
                                    result = false;
                                }
                            }
                        }
                        catch (_a) {
                            // If we encounter any errors assume we this isn't a bundle index.
                            result = false;
                        }
                    }
                    _this.flatModuleIndexCache.set(directory, result);
                }
                return result;
            };
            return checkBundleIndex(path.dirname(filePath));
        };
        return TsCompilerAotCompilerTypeCheckHostAdapter;
    }());
    exports.TsCompilerAotCompilerTypeCheckHostAdapter = TsCompilerAotCompilerTypeCheckHostAdapter;
    function genFileExternalReferences(genFile) {
        return new Set(compiler_1.collectExternalReferences(genFile.stmts).map(function (er) { return er.moduleName; }));
    }
    function addReferencesToSourceFile(sf, genFileNames) {
        // Note: as we modify ts.SourceFiles we need to keep the original
        // value for `referencedFiles` around in cache the original host is caching ts.SourceFiles.
        // Note: cloning the ts.SourceFile is expensive as the nodes in have parent pointers,
        // i.e. we would also need to clone and adjust all nodes.
        var originalReferencedFiles = sf.originalReferencedFiles;
        if (!originalReferencedFiles) {
            originalReferencedFiles = sf.referencedFiles;
            sf.originalReferencedFiles = originalReferencedFiles;
        }
        var newReferencedFiles = tslib_1.__spread(originalReferencedFiles);
        genFileNames.forEach(function (gf) { return newReferencedFiles.push({ fileName: gf, pos: 0, end: 0 }); });
        sf.referencedFiles = newReferencedFiles;
    }
    function getOriginalReferences(sourceFile) {
        return sourceFile && sourceFile.originalReferencedFiles;
    }
    exports.getOriginalReferences = getOriginalReferences;
    function dotRelative(from, to) {
        var rPath = path.relative(from, to).replace(/\\/g, '/');
        return rPath.startsWith('.') ? rPath : './' + rPath;
    }
    /**
     * Moves the path into `genDir` folder while preserving the `node_modules` directory.
     */
    function getPackageName(filePath) {
        var match = NODE_MODULES_PACKAGE_NAME.exec(filePath);
        return match ? match[1] : null;
    }
    function stripNodeModulesPrefix(filePath) {
        return filePath.replace(/.*node_modules\//, '');
    }
    function getNodeModulesPrefix(filePath) {
        var match = /.*node_modules\//.exec(filePath);
        return match ? match[1] : null;
    }
    function stripNgResourceSuffix(fileName) {
        return fileName.replace(/\.\$ngresource\$.*/, '');
    }
    function addNgResourceSuffix(fileName) {
        return fileName + ".$ngresource$";
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL2NvbXBpbGVyX2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQW9LO0lBQ3BLLDJCQUE2QjtJQUM3QiwrQkFBaUM7SUFJakMsMkVBQTBDO0lBRzFDLDBGQUE4RjtJQUM5RixvRUFBNkU7SUFFN0UsSUFBTSx5QkFBeUIsR0FBRyxzREFBc0QsQ0FBQztJQUN6RixJQUFNLEdBQUcsR0FBRyxrQ0FBa0MsQ0FBQztJQUMvQyxJQUFNLG9CQUFvQixHQUFHLHlCQUF5QixDQUFDO0lBRXZELElBQUksZUFBZSxHQUFzRCxJQUFJLENBQUM7SUFFOUUsU0FBZ0Isa0JBQWtCLENBQUMsTUFBMkQ7UUFFNUYsZUFBZSxHQUFHLE1BQU0sQ0FBQztJQUMzQixDQUFDO0lBSEQsZ0RBR0M7SUFFRCxTQUFnQixrQkFBa0IsQ0FDOUIsRUFDd0Q7WUFEdkQsb0JBQU8sRUFBRSxjQUE2QyxFQUE3QyxrRUFBNkM7UUFFekQsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO1lBQzVCLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBUEQsZ0RBT0M7SUFpQkQsU0FBUyxNQUFNLENBQUksU0FBK0I7UUFDaEQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLHFDQUFxQztTQUN0QztRQUNELE9BQU8sU0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNIO1FBNEJFLG1EQUNZLFNBQWdDLEVBQVUsT0FBd0IsRUFDbEUsT0FBcUIsRUFBVSxnQkFBa0MsRUFDakUsYUFBNEIsRUFDNUIsZ0JBQW9EO1lBSmhFLGlCQTBEQztZQXREVyxpQ0FBQSxFQUFB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RSxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FBQyxRQUFnQjtRQUMzQyxPQUFVLFFBQVEsa0JBQWUsQ0FBQztJQUNwQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FvdENvbXBpbGVySG9zdCwgRW1pdHRlclZpc2l0b3JDb250ZXh0LCBHZW5lcmF0ZWRGaWxlLCBQYXJzZVNvdXJjZVNwYW4sIFR5cGVTY3JpcHRFbWl0dGVyLCBjb2xsZWN0RXh0ZXJuYWxSZWZlcmVuY2VzLCBzeW50YXhFcnJvcn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1R5cGVDaGVja0hvc3R9IGZyb20gJy4uL2RpYWdub3N0aWNzL3RyYW5zbGF0ZV9kaWFnbm9zdGljcyc7XG5pbXBvcnQge01vZHVsZU1ldGFkYXRhfSBmcm9tICcuLi9tZXRhZGF0YS9pbmRleCc7XG5pbXBvcnQge2pvaW59IGZyb20gJy4uL25ndHNjL2ZpbGVfc3lzdGVtJztcblxuaW1wb3J0IHtDb21waWxlckhvc3QsIENvbXBpbGVyT3B0aW9ucywgTGlicmFyeVN1bW1hcnl9IGZyb20gJy4vYXBpJztcbmltcG9ydCB7TWV0YWRhdGFSZWFkZXJIb3N0LCBjcmVhdGVNZXRhZGF0YVJlYWRlckNhY2hlLCByZWFkTWV0YWRhdGF9IGZyb20gJy4vbWV0YWRhdGFfcmVhZGVyJztcbmltcG9ydCB7RFRTLCBHRU5FUkFURURfRklMRVMsIGlzSW5Sb290RGlyLCByZWxhdGl2ZVRvUm9vdERpcnN9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IE5PREVfTU9EVUxFU19QQUNLQUdFX05BTUUgPSAvbm9kZV9tb2R1bGVzXFwvKChcXHd8LXxcXC4pK3woQChcXHd8LXxcXC4pK1xcLyhcXHd8LXxcXC4pKykpLztcbmNvbnN0IEVYVCA9IC8oXFwudHN8XFwuZFxcLnRzfFxcLmpzfFxcLmpzeHxcXC50c3gpJC87XG5jb25zdCBDU1NfUFJFUFJPQ0VTU09SX0VYVCA9IC8oXFwuc2Nzc3xcXC5sZXNzfFxcLnN0eWwpJC87XG5cbmxldCB3cmFwSG9zdEZvclRlc3Q6ICgoaG9zdDogdHMuQ29tcGlsZXJIb3N0KSA9PiB0cy5Db21waWxlckhvc3QpfG51bGwgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0V3JhcEhvc3RGb3JUZXN0KHdyYXBGbjogKChob3N0OiB0cy5Db21waWxlckhvc3QpID0+IHRzLkNvbXBpbGVySG9zdCkgfCBudWxsKTpcbiAgICB2b2lkIHtcbiAgd3JhcEhvc3RGb3JUZXN0ID0gd3JhcEZuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZXJIb3N0KFxuICAgIHtvcHRpb25zLCB0c0hvc3QgPSB0cy5jcmVhdGVDb21waWxlckhvc3Qob3B0aW9ucywgdHJ1ZSl9OlxuICAgICAgICB7b3B0aW9uczogQ29tcGlsZXJPcHRpb25zLCB0c0hvc3Q/OiB0cy5Db21waWxlckhvc3R9KTogQ29tcGlsZXJIb3N0IHtcbiAgaWYgKHdyYXBIb3N0Rm9yVGVzdCAhPT0gbnVsbCkge1xuICAgIHRzSG9zdCA9IHdyYXBIb3N0Rm9yVGVzdCh0c0hvc3QpO1xuICB9XG4gIHJldHVybiB0c0hvc3Q7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWV0YWRhdGFQcm92aWRlciB7XG4gIGdldE1ldGFkYXRhKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBNb2R1bGVNZXRhZGF0YXx1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBHZW5Tb3VyY2VGaWxlIHtcbiAgZXh0ZXJuYWxSZWZlcmVuY2VzOiBTZXQ8c3RyaW5nPjtcbiAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZTtcbiAgZW1pdEN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvZGVHZW5lcmF0b3Ige1xuICBnZW5lcmF0ZUZpbGUoZ2VuRmlsZU5hbWU6IHN0cmluZywgYmFzZUZpbGVOYW1lPzogc3RyaW5nKTogR2VuZXJhdGVkRmlsZTtcbiAgZmluZEdlbmVyYXRlZEZpbGVOYW1lcyhmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nW107XG59XG5cbmZ1bmN0aW9uIGFzc2VydDxUPihjb25kaXRpb246IFQgfCBudWxsIHwgdW5kZWZpbmVkKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgLy8gVE9ETyhjaHVja2pheik6IGRvIHRoZSByaWdodCB0aGluZ1xuICB9XG4gIHJldHVybiBjb25kaXRpb24gITtcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBmb2xsb3dpbmcgaG9zdHMgYmFzZWQgb24gYW4gYXBpLkNvbXBpbGVySG9zdDpcbiAqIC0gdHMuQ29tcGlsZXJIb3N0IHRvIGJlIGNvbnN1bWVkIGJ5IGEgdHMuUHJvZ3JhbVxuICogLSBBb3RDb21waWxlckhvc3QgZm9yIEBhbmd1bGFyL2NvbXBpbGVyXG4gKiAtIFR5cGVDaGVja0hvc3QgZm9yIG1hcHBpbmcgdHMgZXJyb3JzIHRvIG5nIGVycm9ycyAodmlhIHRyYW5zbGF0ZURpYWdub3N0aWNzKVxuICovXG5leHBvcnQgY2xhc3MgVHNDb21waWxlckFvdENvbXBpbGVyVHlwZUNoZWNrSG9zdEFkYXB0ZXIgaW1wbGVtZW50cyB0cy5Db21waWxlckhvc3QsIEFvdENvbXBpbGVySG9zdCxcbiAgICBUeXBlQ2hlY2tIb3N0IHtcbiAgcHJpdmF0ZSBtZXRhZGF0YVJlYWRlckNhY2hlID0gY3JlYXRlTWV0YWRhdGFSZWFkZXJDYWNoZSgpO1xuICBwcml2YXRlIGZpbGVOYW1lVG9Nb2R1bGVOYW1lQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICBwcml2YXRlIGZsYXRNb2R1bGVJbmRleENhY2hlID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgZmxhdE1vZHVsZUluZGV4TmFtZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSBmbGF0TW9kdWxlSW5kZXhSZWRpcmVjdE5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIHByaXZhdGUgcm9vdERpcnM6IHN0cmluZ1tdO1xuICBwcml2YXRlIG1vZHVsZVJlc29sdXRpb25DYWNoZTogdHMuTW9kdWxlUmVzb2x1dGlvbkNhY2hlO1xuICBwcml2YXRlIG9yaWdpbmFsU291cmNlRmlsZXMgPSBuZXcgTWFwPHN0cmluZywgdHMuU291cmNlRmlsZXxudWxsPigpO1xuICBwcml2YXRlIG9yaWdpbmFsRmlsZUV4aXN0c0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgZ2VuZXJhdGVkU291cmNlRmlsZXMgPSBuZXcgTWFwPHN0cmluZywgR2VuU291cmNlRmlsZT4oKTtcbiAgcHJpdmF0ZSBnZW5lcmF0ZWRDb2RlRm9yID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBwcml2YXRlIGVtaXR0ZXIgPSBuZXcgVHlwZVNjcmlwdEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBtZXRhZGF0YVJlYWRlckhvc3Q6IE1ldGFkYXRhUmVhZGVySG9zdDtcblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgZ2V0Q2FuY2VsbGF0aW9uVG9rZW4gITogKCkgPT4gdHMuQ2FuY2VsbGF0aW9uVG9rZW47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBnZXREZWZhdWx0TGliTG9jYXRpb24gITogKCkgPT4gc3RyaW5nO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgdHJhY2UgITogKHM6IHN0cmluZykgPT4gdm9pZDtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIGdldERpcmVjdG9yaWVzICE6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZ1tdO1xuICByZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXM/OlxuICAgICAgKG5hbWVzOiBzdHJpbmdbXSwgY29udGFpbmluZ0ZpbGU6IHN0cmluZykgPT4gdHMuUmVzb2x2ZWRUeXBlUmVmZXJlbmNlRGlyZWN0aXZlW107XG4gIGRpcmVjdG9yeUV4aXN0cz86IChkaXJlY3RvcnlOYW1lOiBzdHJpbmcpID0+IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJvb3RGaWxlczogUmVhZG9ubHlBcnJheTxzdHJpbmc+LCBwcml2YXRlIG9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucyxcbiAgICAgIHByaXZhdGUgY29udGV4dDogQ29tcGlsZXJIb3N0LCBwcml2YXRlIG1ldGFkYXRhUHJvdmlkZXI6IE1ldGFkYXRhUHJvdmlkZXIsXG4gICAgICBwcml2YXRlIGNvZGVHZW5lcmF0b3I6IENvZGVHZW5lcmF0b3IsXG4gICAgICBwcml2YXRlIGxpYnJhcnlTdW1tYXJpZXMgPSBuZXcgTWFwPHN0cmluZywgTGlicmFyeVN1bW1hcnk+KCkpIHtcbiAgICB0aGlzLm1vZHVsZVJlc29sdXRpb25DYWNoZSA9IHRzLmNyZWF0ZU1vZHVsZVJlc29sdXRpb25DYWNoZShcbiAgICAgICAgdGhpcy5jb250ZXh0LmdldEN1cnJlbnREaXJlY3RvcnkgISgpLCB0aGlzLmNvbnRleHQuZ2V0Q2Fub25pY2FsRmlsZU5hbWUuYmluZCh0aGlzLmNvbnRleHQpKTtcbiAgICBjb25zdCBiYXNlUGF0aCA9IHRoaXMub3B0aW9ucy5iYXNlUGF0aCAhO1xuICAgIHRoaXMucm9vdERpcnMgPVxuICAgICAgICAodGhpcy5vcHRpb25zLnJvb3REaXJzIHx8IFt0aGlzLm9wdGlvbnMuYmFzZVBhdGggIV0pLm1hcChwID0+IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgcCkpO1xuICAgIGlmIChjb250ZXh0LmdldERpcmVjdG9yaWVzKSB7XG4gICAgICB0aGlzLmdldERpcmVjdG9yaWVzID0gcGF0aCA9PiBjb250ZXh0LmdldERpcmVjdG9yaWVzICEocGF0aCk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LmRpcmVjdG9yeUV4aXN0cykge1xuICAgICAgdGhpcy5kaXJlY3RvcnlFeGlzdHMgPSBkaXJlY3RvcnlOYW1lID0+IGNvbnRleHQuZGlyZWN0b3J5RXhpc3RzICEoZGlyZWN0b3J5TmFtZSk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LmdldENhbmNlbGxhdGlvblRva2VuKSB7XG4gICAgICB0aGlzLmdldENhbmNlbGxhdGlvblRva2VuID0gKCkgPT4gY29udGV4dC5nZXRDYW5jZWxsYXRpb25Ub2tlbiAhKCk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LmdldERlZmF1bHRMaWJMb2NhdGlvbikge1xuICAgICAgdGhpcy5nZXREZWZhdWx0TGliTG9jYXRpb24gPSAoKSA9PiBjb250ZXh0LmdldERlZmF1bHRMaWJMb2NhdGlvbiAhKCk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LnJlc29sdmVUeXBlUmVmZXJlbmNlRGlyZWN0aXZlcykge1xuICAgICAgLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIFR5cGVTY3JpcHQgMi45IGFuZCBvbGRlciBzaW5jZSByZXR1cm5cbiAgICAgIC8vIHR5cGUgaGFzIGNoYW5nZWQgZnJvbSAodHMuUmVzb2x2ZWRUeXBlUmVmZXJlbmNlRGlyZWN0aXZlIHwgdW5kZWZpbmVkKVtdXG4gICAgICAvLyB0byB0cy5SZXNvbHZlZFR5cGVSZWZlcmVuY2VEaXJlY3RpdmVbXSBpbiBUeXBlc2NyaXB0IDMuMFxuICAgICAgdHlwZSB0czNSZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMgPSAobmFtZXM6IHN0cmluZ1tdLCBjb250YWluaW5nRmlsZTogc3RyaW5nKSA9PlxuICAgICAgICAgIHRzLlJlc29sdmVkVHlwZVJlZmVyZW5jZURpcmVjdGl2ZVtdO1xuICAgICAgdGhpcy5yZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMgPSAobmFtZXM6IHN0cmluZ1tdLCBjb250YWluaW5nRmlsZTogc3RyaW5nKSA9PlxuICAgICAgICAgIChjb250ZXh0LnJlc29sdmVUeXBlUmVmZXJlbmNlRGlyZWN0aXZlcyBhcyB0czNSZXNvbHZlVHlwZVJlZmVyZW5jZURpcmVjdGl2ZXMpICEoXG4gICAgICAgICAgICAgIG5hbWVzLCBjb250YWluaW5nRmlsZSk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LnRyYWNlKSB7XG4gICAgICB0aGlzLnRyYWNlID0gcyA9PiBjb250ZXh0LnRyYWNlICEocyk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LmZpbGVOYW1lVG9Nb2R1bGVOYW1lKSB7XG4gICAgICB0aGlzLmZpbGVOYW1lVG9Nb2R1bGVOYW1lID0gY29udGV4dC5maWxlTmFtZVRvTW9kdWxlTmFtZS5iaW5kKGNvbnRleHQpO1xuICAgIH1cbiAgICAvLyBOb3RlOiBkb24ndCBjb3B5IG92ZXIgY29udGV4dC5tb2R1bGVOYW1lVG9GaWxlTmFtZSBhcyB3ZSBmaXJzdFxuICAgIC8vIG5vcm1hbGl6ZSB1bmRlZmluZWQgY29udGFpbmluZ0ZpbGUgdG8gYSBmaWxsZWQgY29udGFpbmluZ0ZpbGUuXG4gICAgaWYgKGNvbnRleHQucmVzb3VyY2VOYW1lVG9GaWxlTmFtZSkge1xuICAgICAgdGhpcy5yZXNvdXJjZU5hbWVUb0ZpbGVOYW1lID0gY29udGV4dC5yZXNvdXJjZU5hbWVUb0ZpbGVOYW1lLmJpbmQoY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LnRvU3VtbWFyeUZpbGVOYW1lKSB7XG4gICAgICB0aGlzLnRvU3VtbWFyeUZpbGVOYW1lID0gY29udGV4dC50b1N1bW1hcnlGaWxlTmFtZS5iaW5kKGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoY29udGV4dC5mcm9tU3VtbWFyeUZpbGVOYW1lKSB7XG4gICAgICB0aGlzLmZyb21TdW1tYXJ5RmlsZU5hbWUgPSBjb250ZXh0LmZyb21TdW1tYXJ5RmlsZU5hbWUuYmluZChjb250ZXh0KTtcbiAgICB9XG4gICAgdGhpcy5tZXRhZGF0YVJlYWRlckhvc3QgPSB7XG4gICAgICBjYWNoZU1ldGFkYXRhOiAoKSA9PiB0cnVlLFxuICAgICAgZ2V0U291cmNlRmlsZU1ldGFkYXRhOiAoZmlsZVBhdGgpID0+IHtcbiAgICAgICAgY29uc3Qgc2YgPSB0aGlzLmdldE9yaWdpbmFsU291cmNlRmlsZShmaWxlUGF0aCk7XG4gICAgICAgIHJldHVybiBzZiA/IHRoaXMubWV0YWRhdGFQcm92aWRlci5nZXRNZXRhZGF0YShzZikgOiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgZmlsZUV4aXN0czogKGZpbGVQYXRoKSA9PiB0aGlzLm9yaWdpbmFsRmlsZUV4aXN0cyhmaWxlUGF0aCksXG4gICAgICByZWFkRmlsZTogKGZpbGVQYXRoKSA9PiBhc3NlcnQodGhpcy5jb250ZXh0LnJlYWRGaWxlKGZpbGVQYXRoKSksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZU1vZHVsZU5hbWUobW9kdWxlTmFtZTogc3RyaW5nLCBjb250YWluaW5nRmlsZTogc3RyaW5nKTogdHMuUmVzb2x2ZWRNb2R1bGVcbiAgICAgIHx1bmRlZmluZWQge1xuICAgIGNvbnN0IHJtID0gdHMucmVzb2x2ZU1vZHVsZU5hbWUoXG4gICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lLCBjb250YWluaW5nRmlsZS5yZXBsYWNlKC9cXFxcL2csICcvJyksIHRoaXMub3B0aW9ucywgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlUmVzb2x1dGlvbkNhY2hlKVxuICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlZE1vZHVsZTtcbiAgICBpZiAocm0gJiYgdGhpcy5pc1NvdXJjZUZpbGUocm0ucmVzb2x2ZWRGaWxlTmFtZSkgJiYgRFRTLnRlc3Qocm0ucmVzb2x2ZWRGaWxlTmFtZSkpIHtcbiAgICAgIC8vIENhc2U6IGdlbmVyYXRlQ29kZUZvckxpYnJhcmllcyA9IHRydWUgYW5kIG1vZHVsZU5hbWUgaXNcbiAgICAgIC8vIGEgLmQudHMgZmlsZSBpbiBhIG5vZGVfbW9kdWxlcyBmb2xkZXIuXG4gICAgICAvLyBOZWVkIHRvIHNldCBpc0V4dGVybmFsTGlicmFyeUltcG9ydCB0byBmYWxzZSBzbyB0aGF0IGdlbmVyYXRlZCBmaWxlcyBmb3IgdGhhdCBmaWxlXG4gICAgICAvLyBhcmUgZW1pdHRlZC5cbiAgICAgIHJtLmlzRXh0ZXJuYWxMaWJyYXJ5SW1wb3J0ID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBybTtcbiAgfVxuXG4gIC8vIE5vdGU6IFdlIGltcGxlbWVudCB0aGlzIG1ldGhvZCBzbyB0aGF0IFR5cGVTY3JpcHQgYW5kIEFuZ3VsYXIgc2hhcmUgdGhlIHNhbWVcbiAgLy8gdHMuTW9kdWxlUmVzb2x1dGlvbkNhY2hlXG4gIC8vIGFuZCB0aGF0IHdlIGNhbiB0ZWxsIHRzLlByb2dyYW0gYWJvdXQgb3VyIGRpZmZlcmVudCBvcGluaW9uIGFib3V0XG4gIC8vIFJlc29sdmVkTW9kdWxlLmlzRXh0ZXJuYWxMaWJyYXJ5SW1wb3J0XG4gIC8vIChzZWUgb3VyIGlzU291cmNlRmlsZSBtZXRob2QpLlxuICByZXNvbHZlTW9kdWxlTmFtZXMobW9kdWxlTmFtZXM6IHN0cmluZ1tdLCBjb250YWluaW5nRmlsZTogc3RyaW5nKTogdHMuUmVzb2x2ZWRNb2R1bGVbXSB7XG4gICAgLy8gVE9ETyh0Ym9zY2gpOiB0aGlzIHNlZW1zIHRvIGJlIGEgdHlwaW5nIGVycm9yIGluIFR5cGVTY3JpcHQsXG4gICAgLy8gYXMgaXQgY29udGFpbnMgYXNzZXJ0aW9ucyB0aGF0IHRoZSByZXN1bHQgY29udGFpbnMgdGhlIHNhbWUgbnVtYmVyIG9mIGVudHJpZXNcbiAgICAvLyBhcyB0aGUgZ2l2ZW4gbW9kdWxlIG5hbWVzLlxuICAgIHJldHVybiA8dHMuUmVzb2x2ZWRNb2R1bGVbXT5tb2R1bGVOYW1lcy5tYXAoXG4gICAgICAgIG1vZHVsZU5hbWUgPT4gdGhpcy5yZXNvbHZlTW9kdWxlTmFtZShtb2R1bGVOYW1lLCBjb250YWluaW5nRmlsZSkpO1xuICB9XG5cbiAgbW9kdWxlTmFtZVRvRmlsZU5hbWUobTogc3RyaW5nLCBjb250YWluaW5nRmlsZT86IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgICBpZiAoIWNvbnRhaW5pbmdGaWxlKSB7XG4gICAgICBpZiAobS5pbmRleE9mKCcuJykgPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXNvbHV0aW9uIG9mIHJlbGF0aXZlIHBhdGhzIHJlcXVpcmVzIGEgY29udGFpbmluZyBmaWxlLicpO1xuICAgICAgfVxuICAgICAgLy8gQW55IGNvbnRhaW5pbmcgZmlsZSBnaXZlcyB0aGUgc2FtZSByZXN1bHQgZm9yIGFic29sdXRlIGltcG9ydHNcbiAgICAgIGNvbnRhaW5pbmdGaWxlID0gdGhpcy5yb290RmlsZXNbMF07XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRleHQubW9kdWxlTmFtZVRvRmlsZU5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQubW9kdWxlTmFtZVRvRmlsZU5hbWUobSwgY29udGFpbmluZ0ZpbGUpO1xuICAgIH1cbiAgICBjb25zdCByZXNvbHZlZCA9IHRoaXMucmVzb2x2ZU1vZHVsZU5hbWUobSwgY29udGFpbmluZ0ZpbGUpO1xuICAgIHJldHVybiByZXNvbHZlZCA/IHJlc29sdmVkLnJlc29sdmVkRmlsZU5hbWUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFdlIHdhbnQgYSBtb2R1bGVJZCB0aGF0IHdpbGwgYXBwZWFyIGluIGltcG9ydCBzdGF0ZW1lbnRzIGluIHRoZSBnZW5lcmF0ZWQgY29kZVxuICAgKiB3aGljaCB3aWxsIGJlIHdyaXR0ZW4gdG8gYGNvbnRhaW5pbmdGaWxlYC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdlIGFsc28gZ2VuZXJhdGUgZmlsZXMgZm9yIGZpbGVzIGluIG5vZGVfbW9kdWxlcywgYXMgbGlicmFyaWVzXG4gICAqIG9ubHkgc2hpcCAubWV0YWRhdGEuanNvbiBmaWxlcyBidXQgbm90IHRoZSBnZW5lcmF0ZWQgY29kZS5cbiAgICpcbiAgICogTG9naWM6XG4gICAqIDEuIGlmIHRoZSBpbXBvcnRlZEZpbGUgYW5kIHRoZSBjb250YWluaW5nRmlsZSBhcmUgZnJvbSB0aGUgcHJvamVjdCBzb3VyY2VzXG4gICAqICAgIG9yIGZyb20gdGhlIHNhbWUgbm9kZV9tb2R1bGVzIHBhY2thZ2UsIHVzZSBhIHJlbGF0aXZlIHBhdGhcbiAgICogMi4gaWYgdGhlIGltcG9ydGVkRmlsZSBpcyBpbiBhIG5vZGVfbW9kdWxlcyBwYWNrYWdlLFxuICAgKiAgICB1c2UgYSBwYXRoIHRoYXQgc3RhcnRzIHdpdGggdGhlIHBhY2thZ2UgbmFtZS5cbiAgICogMy4gRXJyb3IgaWYgdGhlIGNvbnRhaW5pbmdGaWxlIGlzIGluIHRoZSBub2RlX21vZHVsZXMgcGFja2FnZVxuICAgKiAgICBhbmQgdGhlIGltcG9ydGVkRmlsZSBpcyBpbiB0aGUgcHJvamVjdCBzb3VyZXMsXG4gICAqICAgIGFzIHRoYXQgaXMgYSB2aW9sYXRpb24gb2YgdGhlIHByaW5jaXBsZSB0aGF0IG5vZGVfbW9kdWxlcyBwYWNrYWdlcyBjYW5ub3RcbiAgICogICAgaW1wb3J0IHByb2plY3Qgc291cmNlcy5cbiAgICovXG4gIGZpbGVOYW1lVG9Nb2R1bGVOYW1lKGltcG9ydGVkRmlsZTogc3RyaW5nLCBjb250YWluaW5nRmlsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBjYWNoZUtleSA9IGAke2ltcG9ydGVkRmlsZX06JHtjb250YWluaW5nRmlsZX1gO1xuICAgIGxldCBtb2R1bGVOYW1lID0gdGhpcy5maWxlTmFtZVRvTW9kdWxlTmFtZUNhY2hlLmdldChjYWNoZUtleSk7XG4gICAgaWYgKG1vZHVsZU5hbWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG1vZHVsZU5hbWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxJbXBvcnRlZEZpbGUgPSBpbXBvcnRlZEZpbGU7XG4gICAgaWYgKHRoaXMub3B0aW9ucy50cmFjZVJlc29sdXRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ2ZpbGVOYW1lVG9Nb2R1bGVOYW1lIGZyb20gY29udGFpbmluZ0ZpbGUnLCBjb250YWluaW5nRmlsZSwgJ3RvIGltcG9ydGVkRmlsZScsXG4gICAgICAgICAgaW1wb3J0ZWRGaWxlKTtcbiAgICB9XG5cbiAgICAvLyBkcm9wIGV4dGVuc2lvblxuICAgIGltcG9ydGVkRmlsZSA9IGltcG9ydGVkRmlsZS5yZXBsYWNlKEVYVCwgJycpO1xuICAgIGNvbnN0IGltcG9ydGVkRmlsZVBhY2thZ2VOYW1lID0gZ2V0UGFja2FnZU5hbWUoaW1wb3J0ZWRGaWxlKTtcbiAgICBjb25zdCBjb250YWluaW5nRmlsZVBhY2thZ2VOYW1lID0gZ2V0UGFja2FnZU5hbWUoY29udGFpbmluZ0ZpbGUpO1xuXG4gICAgaWYgKGltcG9ydGVkRmlsZVBhY2thZ2VOYW1lID09PSBjb250YWluaW5nRmlsZVBhY2thZ2VOYW1lIHx8XG4gICAgICAgIEdFTkVSQVRFRF9GSUxFUy50ZXN0KG9yaWdpbmFsSW1wb3J0ZWRGaWxlKSkge1xuICAgICAgY29uc3Qgcm9vdGVkQ29udGFpbmluZ0ZpbGUgPSByZWxhdGl2ZVRvUm9vdERpcnMoY29udGFpbmluZ0ZpbGUsIHRoaXMucm9vdERpcnMpO1xuICAgICAgY29uc3Qgcm9vdGVkSW1wb3J0ZWRGaWxlID0gcmVsYXRpdmVUb1Jvb3REaXJzKGltcG9ydGVkRmlsZSwgdGhpcy5yb290RGlycyk7XG5cbiAgICAgIGlmIChyb290ZWRDb250YWluaW5nRmlsZSAhPT0gY29udGFpbmluZ0ZpbGUgJiYgcm9vdGVkSW1wb3J0ZWRGaWxlICE9PSBpbXBvcnRlZEZpbGUpIHtcbiAgICAgICAgLy8gaWYgYm90aCBmaWxlcyBhcmUgY29udGFpbmVkIGluIHRoZSBgcm9vdERpcnNgLCB0aGVuIHN0cmlwIHRoZSByb290RGlyc1xuICAgICAgICBjb250YWluaW5nRmlsZSA9IHJvb3RlZENvbnRhaW5pbmdGaWxlO1xuICAgICAgICBpbXBvcnRlZEZpbGUgPSByb290ZWRJbXBvcnRlZEZpbGU7XG4gICAgICB9XG4gICAgICBtb2R1bGVOYW1lID0gZG90UmVsYXRpdmUocGF0aC5kaXJuYW1lKGNvbnRhaW5pbmdGaWxlKSwgaW1wb3J0ZWRGaWxlKTtcbiAgICB9IGVsc2UgaWYgKGltcG9ydGVkRmlsZVBhY2thZ2VOYW1lKSB7XG4gICAgICBtb2R1bGVOYW1lID0gc3RyaXBOb2RlTW9kdWxlc1ByZWZpeChpbXBvcnRlZEZpbGUpO1xuICAgICAgaWYgKG9yaWdpbmFsSW1wb3J0ZWRGaWxlLmVuZHNXaXRoKCcuZC50cycpKSB7XG4gICAgICAgIC8vIHRoZSBtb2R1bGVOYW1lIGZvciB0aGVzZSB0eXBpbmdzIGNvdWxkIGJlIHNob3J0ZW50ZWQgdG8gdGhlIG5wbSBwYWNrYWdlIG5hbWVcbiAgICAgICAgLy8gaWYgdGhlIG5wbSBwYWNrYWdlIHR5cGluZ3MgbWF0Y2hlcyB0aGUgaW1wb3J0ZWRGaWxlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgbW9kdWxlUGF0aCA9IGltcG9ydGVkRmlsZS5zdWJzdHJpbmcoMCwgaW1wb3J0ZWRGaWxlLmxlbmd0aCAtIG1vZHVsZU5hbWUubGVuZ3RoKSArXG4gICAgICAgICAgICAgIGltcG9ydGVkRmlsZVBhY2thZ2VOYW1lO1xuICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gcmVxdWlyZShtb2R1bGVQYXRoICsgJy9wYWNrYWdlLmpzb24nKTtcbiAgICAgICAgICBjb25zdCBwYWNrYWdlVHlwaW5ncyA9IGpvaW4obW9kdWxlUGF0aCwgcGFja2FnZUpzb24udHlwaW5ncyk7XG4gICAgICAgICAgaWYgKHBhY2thZ2VUeXBpbmdzID09PSBvcmlnaW5hbEltcG9ydGVkRmlsZSkge1xuICAgICAgICAgICAgbW9kdWxlTmFtZSA9IGltcG9ydGVkRmlsZVBhY2thZ2VOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgLy8gdGhlIGFib3ZlIHJlcXVpcmUoKSB3aWxsIHRocm93IGlmIHRoZXJlIGlzIG5vIHBhY2thZ2UuanNvbiBmaWxlXG4gICAgICAgICAgLy8gYW5kIHRoaXMgaXMgc2FmZSB0byBpZ25vcmUgYW5kIGNvcnJlY3QgdG8ga2VlcCB0aGUgbG9uZ2VyXG4gICAgICAgICAgLy8gbW9kdWxlTmFtZSBpbiB0aGlzIGNhc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRyeWluZyB0byBpbXBvcnQgYSBzb3VyY2UgZmlsZSBmcm9tIGEgbm9kZV9tb2R1bGVzIHBhY2thZ2U6IGltcG9ydCAke29yaWdpbmFsSW1wb3J0ZWRGaWxlfSBmcm9tICR7Y29udGFpbmluZ0ZpbGV9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5maWxlTmFtZVRvTW9kdWxlTmFtZUNhY2hlLnNldChjYWNoZUtleSwgbW9kdWxlTmFtZSk7XG4gICAgcmV0dXJuIG1vZHVsZU5hbWU7XG4gIH1cblxuICByZXNvdXJjZU5hbWVUb0ZpbGVOYW1lKHJlc291cmNlTmFtZTogc3RyaW5nLCBjb250YWluaW5nRmlsZTogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICAgIC8vIE5vdGU6IHdlIGNvbnZlcnQgcGFja2FnZSBwYXRocyBpbnRvIHJlbGF0aXZlIHBhdGhzIHRvIGJlIGNvbXBhdGlibGUgd2l0aCB0aGUgdGhlXG4gICAgLy8gcHJldmlvdXMgaW1wbGVtZW50YXRpb24gb2YgVXJsUmVzb2x2ZXIuXG4gICAgY29uc3QgZmlyc3RDaGFyID0gcmVzb3VyY2VOYW1lWzBdO1xuICAgIGlmIChmaXJzdENoYXIgPT09ICcvJykge1xuICAgICAgcmVzb3VyY2VOYW1lID0gcmVzb3VyY2VOYW1lLnNsaWNlKDEpO1xuICAgIH0gZWxzZSBpZiAoZmlyc3RDaGFyICE9PSAnLicpIHtcbiAgICAgIHJlc291cmNlTmFtZSA9IGAuLyR7cmVzb3VyY2VOYW1lfWA7XG4gICAgfVxuICAgIGxldCBmaWxlUGF0aFdpdGhOZ1Jlc291cmNlID1cbiAgICAgICAgdGhpcy5tb2R1bGVOYW1lVG9GaWxlTmFtZShhZGROZ1Jlc291cmNlU3VmZml4KHJlc291cmNlTmFtZSksIGNvbnRhaW5pbmdGaWxlKTtcbiAgICAvLyBJZiB0aGUgdXNlciBzcGVjaWZpZWQgc3R5bGVVcmwgcG9pbnRpbmcgdG8gKi5zY3NzLCBidXQgdGhlIFNhc3MgY29tcGlsZXIgd2FzIHJ1biBiZWZvcmVcbiAgICAvLyBBbmd1bGFyLCB0aGVuIHRoZSByZXNvdXJjZSBtYXkgaGF2ZSBiZWVuIGdlbmVyYXRlZCBhcyAqLmNzcy4gU2ltcGx5IHRyeSB0aGUgcmVzb2x1dGlvbiBhZ2Fpbi5cbiAgICBpZiAoIWZpbGVQYXRoV2l0aE5nUmVzb3VyY2UgJiYgQ1NTX1BSRVBST0NFU1NPUl9FWFQudGVzdChyZXNvdXJjZU5hbWUpKSB7XG4gICAgICBjb25zdCBmYWxsYmFja1Jlc291cmNlTmFtZSA9IHJlc291cmNlTmFtZS5yZXBsYWNlKENTU19QUkVQUk9DRVNTT1JfRVhULCAnLmNzcycpO1xuICAgICAgZmlsZVBhdGhXaXRoTmdSZXNvdXJjZSA9XG4gICAgICAgICAgdGhpcy5tb2R1bGVOYW1lVG9GaWxlTmFtZShhZGROZ1Jlc291cmNlU3VmZml4KGZhbGxiYWNrUmVzb3VyY2VOYW1lKSwgY29udGFpbmluZ0ZpbGUpO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlUGF0aFdpdGhOZ1Jlc291cmNlID8gc3RyaXBOZ1Jlc291cmNlU3VmZml4KGZpbGVQYXRoV2l0aE5nUmVzb3VyY2UpIDogbnVsbDtcbiAgICAvLyBVc2VkIHVuZGVyIEJhemVsIHRvIHJlcG9ydCBtb3JlIHNwZWNpZmljIGVycm9yIHdpdGggcmVtZWRpYXRpb24gYWR2aWNlXG4gICAgaWYgKCFyZXN1bHQgJiYgKHRoaXMuY29udGV4dCBhcyBhbnkpLnJlcG9ydE1pc3NpbmdSZXNvdXJjZSkge1xuICAgICAgKHRoaXMuY29udGV4dCBhcyBhbnkpLnJlcG9ydE1pc3NpbmdSZXNvdXJjZShyZXNvdXJjZU5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdG9TdW1tYXJ5RmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZywgcmVmZXJyaW5nU3JjRmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZU5hbWVUb01vZHVsZU5hbWUoZmlsZU5hbWUsIHJlZmVycmluZ1NyY0ZpbGVOYW1lKTtcbiAgfVxuXG4gIGZyb21TdW1tYXJ5RmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZywgcmVmZXJyaW5nTGliRmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSB0aGlzLm1vZHVsZU5hbWVUb0ZpbGVOYW1lKGZpbGVOYW1lLCByZWZlcnJpbmdMaWJGaWxlTmFtZSk7XG4gICAgaWYgKCFyZXNvbHZlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgcmVzb2x2ZSAke2ZpbGVOYW1lfSBmcm9tICR7cmVmZXJyaW5nTGliRmlsZU5hbWV9YCk7XG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlZDtcbiAgfVxuXG4gIHBhcnNlU291cmNlU3Bhbk9mKGZpbGVOYW1lOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY2hhcmFjdGVyOiBudW1iZXIpOiBQYXJzZVNvdXJjZVNwYW58bnVsbCB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2VuZXJhdGVkU291cmNlRmlsZXMuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmVtaXRDdHgpIHtcbiAgICAgIHJldHVybiBkYXRhLmVtaXRDdHguc3Bhbk9mKGxpbmUsIGNoYXJhY3Rlcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRPcmlnaW5hbFNvdXJjZUZpbGUoXG4gICAgICBmaWxlUGF0aDogc3RyaW5nLCBsYW5ndWFnZVZlcnNpb24/OiB0cy5TY3JpcHRUYXJnZXQsXG4gICAgICBvbkVycm9yPzogKChtZXNzYWdlOiBzdHJpbmcpID0+IHZvaWQpfHVuZGVmaW5lZCk6IHRzLlNvdXJjZUZpbGV8bnVsbCB7XG4gICAgLy8gTm90ZTogd2UgbmVlZCB0aGUgZXhwbGljaXQgY2hlY2sgdmlhIGBoYXNgIGFzIHdlIGFsc28gY2FjaGUgcmVzdWx0c1xuICAgIC8vIHRoYXQgd2VyZSBudWxsIC8gdW5kZWZpbmVkLlxuICAgIGlmICh0aGlzLm9yaWdpbmFsU291cmNlRmlsZXMuaGFzKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxTb3VyY2VGaWxlcy5nZXQoZmlsZVBhdGgpICE7XG4gICAgfVxuICAgIGlmICghbGFuZ3VhZ2VWZXJzaW9uKSB7XG4gICAgICBsYW5ndWFnZVZlcnNpb24gPSB0aGlzLm9wdGlvbnMudGFyZ2V0IHx8IHRzLlNjcmlwdFRhcmdldC5MYXRlc3Q7XG4gICAgfVxuICAgIC8vIE5vdGU6IFRoaXMgY2FuIGFsc28gcmV0dXJuIHVuZGVmaW5lZCxcbiAgICAvLyBhcyB0aGUgVFMgdHlwaW5ncyBhcmUgbm90IGNvcnJlY3QhXG4gICAgY29uc3Qgc2YgPSB0aGlzLmNvbnRleHQuZ2V0U291cmNlRmlsZShmaWxlUGF0aCwgbGFuZ3VhZ2VWZXJzaW9uLCBvbkVycm9yKSB8fCBudWxsO1xuICAgIHRoaXMub3JpZ2luYWxTb3VyY2VGaWxlcy5zZXQoZmlsZVBhdGgsIHNmKTtcbiAgICByZXR1cm4gc2Y7XG4gIH1cblxuICB1cGRhdGVHZW5lcmF0ZWRGaWxlKGdlbkZpbGU6IEdlbmVyYXRlZEZpbGUpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgICBpZiAoIWdlbkZpbGUuc3RtdHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBBcmd1bWVudDogRXhwZWN0ZWQgYSBHZW5lcmF0ZUZpbGUgd2l0aCBzdGF0ZW1lbnRzLiAke2dlbkZpbGUuZ2VuRmlsZVVybH1gKTtcbiAgICB9XG4gICAgY29uc3Qgb2xkR2VuRmlsZSA9IHRoaXMuZ2VuZXJhdGVkU291cmNlRmlsZXMuZ2V0KGdlbkZpbGUuZ2VuRmlsZVVybCk7XG4gICAgaWYgKCFvbGRHZW5GaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgU3RhdGU6IHByZXZpb3VzIEdlbmVyYXRlZEZpbGUgbm90IGZvdW5kIGZvciAke2dlbkZpbGUuZ2VuRmlsZVVybH0uYCk7XG4gICAgfVxuICAgIGNvbnN0IG5ld1JlZnMgPSBnZW5GaWxlRXh0ZXJuYWxSZWZlcmVuY2VzKGdlbkZpbGUpO1xuICAgIGNvbnN0IG9sZFJlZnMgPSBvbGRHZW5GaWxlLmV4dGVybmFsUmVmZXJlbmNlcztcbiAgICBsZXQgcmVmc0FyZUVxdWFsID0gb2xkUmVmcy5zaXplID09PSBuZXdSZWZzLnNpemU7XG4gICAgaWYgKHJlZnNBcmVFcXVhbCkge1xuICAgICAgbmV3UmVmcy5mb3JFYWNoKHIgPT4gcmVmc0FyZUVxdWFsID0gcmVmc0FyZUVxdWFsICYmIG9sZFJlZnMuaGFzKHIpKTtcbiAgICB9XG4gICAgaWYgKCFyZWZzQXJlRXF1YWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSWxsZWdhbCBTdGF0ZTogZXh0ZXJuYWwgcmVmZXJlbmNlcyBjaGFuZ2VkIGluICR7Z2VuRmlsZS5nZW5GaWxlVXJsfS5cXG5PbGQ6ICR7QXJyYXkuZnJvbShvbGRSZWZzKX0uXFxuTmV3OiAke0FycmF5LmZyb20obmV3UmVmcyl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFkZEdlbmVyYXRlZEZpbGUoZ2VuRmlsZSwgbmV3UmVmcyk7XG4gIH1cblxuICBwcml2YXRlIGFkZEdlbmVyYXRlZEZpbGUoZ2VuRmlsZTogR2VuZXJhdGVkRmlsZSwgZXh0ZXJuYWxSZWZlcmVuY2VzOiBTZXQ8c3RyaW5nPik6IHRzLlNvdXJjZUZpbGUge1xuICAgIGlmICghZ2VuRmlsZS5zdG10cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIEFyZ3VtZW50OiBFeHBlY3RlZCBhIEdlbmVyYXRlRmlsZSB3aXRoIHN0YXRlbWVudHMuICR7Z2VuRmlsZS5nZW5GaWxlVXJsfWApO1xuICAgIH1cbiAgICBjb25zdCB7c291cmNlVGV4dCwgY29udGV4dH0gPSB0aGlzLmVtaXR0ZXIuZW1pdFN0YXRlbWVudHNBbmRDb250ZXh0KFxuICAgICAgICBnZW5GaWxlLmdlbkZpbGVVcmwsIGdlbkZpbGUuc3RtdHMsIC8qIHByZWFtYmxlICovICcnLFxuICAgICAgICAvKiBlbWl0U291cmNlTWFwcyAqLyBmYWxzZSk7XG4gICAgY29uc3Qgc2YgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICBnZW5GaWxlLmdlbkZpbGVVcmwsIHNvdXJjZVRleHQsIHRoaXMub3B0aW9ucy50YXJnZXQgfHwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5tb2R1bGUgPT09IHRzLk1vZHVsZUtpbmQuQU1EIHx8IHRoaXMub3B0aW9ucy5tb2R1bGUgPT09IHRzLk1vZHVsZUtpbmQuVU1EKSB7XG4gICAgICBpZiAodGhpcy5jb250ZXh0LmFtZE1vZHVsZU5hbWUpIHtcbiAgICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IHRoaXMuY29udGV4dC5hbWRNb2R1bGVOYW1lKHNmKTtcbiAgICAgICAgaWYgKG1vZHVsZU5hbWUpIHNmLm1vZHVsZU5hbWUgPSBtb2R1bGVOYW1lO1xuICAgICAgfSBlbHNlIGlmICgvbm9kZV9tb2R1bGVzLy50ZXN0KGdlbkZpbGUuZ2VuRmlsZVVybCkpIHtcbiAgICAgICAgLy8gSWYgd2UgYXJlIGdlbmVyYXRpbmcgYW4gbmdNb2R1bGUgZmlsZSB1bmRlciBub2RlX21vZHVsZXMsIHdlIGtub3cgdGhlIHJpZ2h0IG1vZHVsZSBuYW1lXG4gICAgICAgIC8vIFdlIGRvbid0IG5lZWQgdGhlIGhvc3QgdG8gc3VwcGx5IGEgZnVuY3Rpb24gaW4gdGhpcyBjYXNlLlxuICAgICAgICBzZi5tb2R1bGVOYW1lID0gc3RyaXBOb2RlTW9kdWxlc1ByZWZpeChnZW5GaWxlLmdlbkZpbGVVcmwucmVwbGFjZShFWFQsICcnKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ2VuZXJhdGVkU291cmNlRmlsZXMuc2V0KGdlbkZpbGUuZ2VuRmlsZVVybCwge1xuICAgICAgc291cmNlRmlsZTogc2YsXG4gICAgICBlbWl0Q3R4OiBjb250ZXh0LCBleHRlcm5hbFJlZmVyZW5jZXMsXG4gICAgfSk7XG4gICAgcmV0dXJuIHNmO1xuICB9XG5cbiAgc2hvdWxkR2VuZXJhdGVGaWxlKGZpbGVOYW1lOiBzdHJpbmcpOiB7Z2VuZXJhdGU6IGJvb2xlYW4sIGJhc2VGaWxlTmFtZT86IHN0cmluZ30ge1xuICAgIC8vIFRPRE8odGJvc2NoKTogYWxsb3cgZ2VuZXJhdGluZyBmaWxlcyB0aGF0IGFyZSBub3QgaW4gdGhlIHJvb3REaXJcbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTkzMzdcbiAgICBpZiAoIWlzSW5Sb290RGlyKGZpbGVOYW1lLCB0aGlzLm9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4ge2dlbmVyYXRlOiBmYWxzZX07XG4gICAgfVxuICAgIGNvbnN0IGdlbk1hdGNoID0gR0VORVJBVEVEX0ZJTEVTLmV4ZWMoZmlsZU5hbWUpO1xuICAgIGlmICghZ2VuTWF0Y2gpIHtcbiAgICAgIHJldHVybiB7Z2VuZXJhdGU6IGZhbHNlfTtcbiAgICB9XG4gICAgY29uc3QgWywgYmFzZSwgZ2VuU3VmZml4LCBzdWZmaXhdID0gZ2VuTWF0Y2g7XG4gICAgaWYgKHN1ZmZpeCAhPT0gJ3RzJyAmJiBzdWZmaXggIT09ICd0c3gnKSB7XG4gICAgICByZXR1cm4ge2dlbmVyYXRlOiBmYWxzZX07XG4gICAgfVxuICAgIGxldCBiYXNlRmlsZU5hbWU6IHN0cmluZ3x1bmRlZmluZWQ7XG4gICAgaWYgKGdlblN1ZmZpeC5pbmRleE9mKCduZ3N0eWxlJykgPj0gMCkge1xuICAgICAgLy8gTm90ZTogbmdzdHlsZSBmaWxlcyBoYXZlIG5hbWVzIGxpa2UgYGFmaWxlLmNzcy5uZ3N0eWxlLnRzYFxuICAgICAgaWYgKCF0aGlzLm9yaWdpbmFsRmlsZUV4aXN0cyhiYXNlKSkge1xuICAgICAgICByZXR1cm4ge2dlbmVyYXRlOiBmYWxzZX07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vdGU6IG9uLXRoZS1mbHkgZ2VuZXJhdGVkIGZpbGVzIGFsd2F5cyBoYXZlIGEgYC50c2Agc3VmZml4LFxuICAgICAgLy8gYnV0IHRoZSBmaWxlIGZyb20gd2hpY2ggd2UgZ2VuZXJhdGVkIGl0IGNhbiBiZSBhIGAudHNgLyBgLnRzeGAvIGAuZC50c2BcbiAgICAgIC8vIChzZWUgb3B0aW9ucy5nZW5lcmF0ZUNvZGVGb3JMaWJyYXJpZXMpLlxuICAgICAgYmFzZUZpbGVOYW1lID0gW2Ake2Jhc2V9LnRzYCwgYCR7YmFzZX0udHN4YCwgYCR7YmFzZX0uZC50c2BdLmZpbmQoXG4gICAgICAgICAgYmFzZUZpbGVOYW1lID0+IHRoaXMuaXNTb3VyY2VGaWxlKGJhc2VGaWxlTmFtZSkgJiYgdGhpcy5vcmlnaW5hbEZpbGVFeGlzdHMoYmFzZUZpbGVOYW1lKSk7XG4gICAgICBpZiAoIWJhc2VGaWxlTmFtZSkge1xuICAgICAgICByZXR1cm4ge2dlbmVyYXRlOiBmYWxzZX07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7Z2VuZXJhdGU6IHRydWUsIGJhc2VGaWxlTmFtZX07XG4gIH1cblxuICBzaG91bGRHZW5lcmF0ZUZpbGVzRm9yKGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAvLyBUT0RPKHRib3NjaCk6IGFsbG93IGdlbmVyYXRpbmcgZmlsZXMgdGhhdCBhcmUgbm90IGluIHRoZSByb290RGlyXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE5MzM3XG4gICAgcmV0dXJuICFHRU5FUkFURURfRklMRVMudGVzdChmaWxlTmFtZSkgJiYgdGhpcy5pc1NvdXJjZUZpbGUoZmlsZU5hbWUpICYmXG4gICAgICAgIGlzSW5Sb290RGlyKGZpbGVOYW1lLCB0aGlzLm9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0U291cmNlRmlsZShcbiAgICAgIGZpbGVOYW1lOiBzdHJpbmcsIGxhbmd1YWdlVmVyc2lvbjogdHMuU2NyaXB0VGFyZ2V0LFxuICAgICAgb25FcnJvcj86ICgobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKXx1bmRlZmluZWQpOiB0cy5Tb3VyY2VGaWxlIHtcbiAgICAvLyBOb3RlOiBEb24ndCBleGl0IGVhcmx5IGluIHRoaXMgbWV0aG9kIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHdlIGFsd2F5cyBoYXZlIHVwIHRvIGRhdGUgcmVmZXJlbmNlcyBvbiB0aGUgZmlsZSFcbiAgICBsZXQgZ2VuRmlsZU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBzZiA9IHRoaXMuZ2V0R2VuZXJhdGVkRmlsZShmaWxlTmFtZSk7XG4gICAgaWYgKCFzZikge1xuICAgICAgY29uc3Qgc3VtbWFyeSA9IHRoaXMubGlicmFyeVN1bW1hcmllcy5nZXQoZmlsZU5hbWUpO1xuICAgICAgaWYgKHN1bW1hcnkpIHtcbiAgICAgICAgaWYgKCFzdW1tYXJ5LnNvdXJjZUZpbGUpIHtcbiAgICAgICAgICBzdW1tYXJ5LnNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgICAgICAgICBmaWxlTmFtZSwgc3VtbWFyeS50ZXh0LCB0aGlzLm9wdGlvbnMudGFyZ2V0IHx8IHRzLlNjcmlwdFRhcmdldC5MYXRlc3QpO1xuICAgICAgICB9XG4gICAgICAgIHNmID0gc3VtbWFyeS5zb3VyY2VGaWxlO1xuICAgICAgICAvLyBUeXBlU2NyaXB0IGRvZXNuJ3QgYWxsb3cgcmV0dXJuaW5nIHJlZGlyZWN0IHNvdXJjZSBmaWxlcy4gVG8gYXZvaWQgdW5mb3JzZWVuIGVycm9ycyB3ZVxuICAgICAgICAvLyByZXR1cm4gdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIGluc3RlYWQgb2YgdGhlIHJlZGlyZWN0IHRhcmdldC5cbiAgICAgICAgY29uc3QgcmVkaXJlY3RJbmZvID0gKHNmIGFzIGFueSkucmVkaXJlY3RJbmZvO1xuICAgICAgICBpZiAocmVkaXJlY3RJbmZvICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzZiA9IHJlZGlyZWN0SW5mby51bnJlZGlyZWN0ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2VuRmlsZU5hbWVzID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghc2YpIHtcbiAgICAgIHNmID0gdGhpcy5nZXRPcmlnaW5hbFNvdXJjZUZpbGUoZmlsZU5hbWUpO1xuICAgICAgY29uc3QgY2FjaGVkR2VuRmlsZXMgPSB0aGlzLmdlbmVyYXRlZENvZGVGb3IuZ2V0KGZpbGVOYW1lKTtcbiAgICAgIGlmIChjYWNoZWRHZW5GaWxlcykge1xuICAgICAgICBnZW5GaWxlTmFtZXMgPSBjYWNoZWRHZW5GaWxlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLm5vUmVzb2x2ZSAmJiB0aGlzLnNob3VsZEdlbmVyYXRlRmlsZXNGb3IoZmlsZU5hbWUpKSB7XG4gICAgICAgICAgZ2VuRmlsZU5hbWVzID0gdGhpcy5jb2RlR2VuZXJhdG9yLmZpbmRHZW5lcmF0ZWRGaWxlTmFtZXMoZmlsZU5hbWUpLmZpbHRlcihcbiAgICAgICAgICAgICAgZmlsZU5hbWUgPT4gdGhpcy5zaG91bGRHZW5lcmF0ZUZpbGUoZmlsZU5hbWUpLmdlbmVyYXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdlbmVyYXRlZENvZGVGb3Iuc2V0KGZpbGVOYW1lLCBnZW5GaWxlTmFtZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2YpIHtcbiAgICAgIGFkZFJlZmVyZW5jZXNUb1NvdXJjZUZpbGUoc2YsIGdlbkZpbGVOYW1lcyk7XG4gICAgfVxuICAgIC8vIFRPRE8odGJvc2NoKTogVHlwZVNjcmlwdCdzIHR5cGluZ3MgZm9yIGdldFNvdXJjZUZpbGUgYXJlIGluY29ycmVjdCxcbiAgICAvLyBhcyBpdCBjYW4gdmVyeSB3ZWxsIHJldHVybiB1bmRlZmluZWQuXG4gICAgcmV0dXJuIHNmICE7XG4gIH1cblxuICBwcml2YXRlIGdldEdlbmVyYXRlZEZpbGUoZmlsZU5hbWU6IHN0cmluZyk6IHRzLlNvdXJjZUZpbGV8bnVsbCB7XG4gICAgY29uc3QgZ2VuU3JjRmlsZSA9IHRoaXMuZ2VuZXJhdGVkU291cmNlRmlsZXMuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoZ2VuU3JjRmlsZSkge1xuICAgICAgcmV0dXJuIGdlblNyY0ZpbGUuc291cmNlRmlsZTtcbiAgICB9XG4gICAgY29uc3Qge2dlbmVyYXRlLCBiYXNlRmlsZU5hbWV9ID0gdGhpcy5zaG91bGRHZW5lcmF0ZUZpbGUoZmlsZU5hbWUpO1xuICAgIGlmIChnZW5lcmF0ZSkge1xuICAgICAgY29uc3QgZ2VuRmlsZSA9IHRoaXMuY29kZUdlbmVyYXRvci5nZW5lcmF0ZUZpbGUoZmlsZU5hbWUsIGJhc2VGaWxlTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5hZGRHZW5lcmF0ZWRGaWxlKGdlbkZpbGUsIGdlbkZpbGVFeHRlcm5hbFJlZmVyZW5jZXMoZ2VuRmlsZSkpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgb3JpZ2luYWxGaWxlRXhpc3RzKGZpbGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBsZXQgZmlsZUV4aXN0cyA9IHRoaXMub3JpZ2luYWxGaWxlRXhpc3RzQ2FjaGUuZ2V0KGZpbGVOYW1lKTtcbiAgICBpZiAoZmlsZUV4aXN0cyA9PSBudWxsKSB7XG4gICAgICBmaWxlRXhpc3RzID0gdGhpcy5jb250ZXh0LmZpbGVFeGlzdHMoZmlsZU5hbWUpO1xuICAgICAgdGhpcy5vcmlnaW5hbEZpbGVFeGlzdHNDYWNoZS5zZXQoZmlsZU5hbWUsIGZpbGVFeGlzdHMpO1xuICAgIH1cbiAgICByZXR1cm4gZmlsZUV4aXN0cztcbiAgfVxuXG4gIGZpbGVFeGlzdHMoZmlsZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGZpbGVOYW1lID0gc3RyaXBOZ1Jlc291cmNlU3VmZml4KGZpbGVOYW1lKTtcbiAgICBpZiAodGhpcy5saWJyYXJ5U3VtbWFyaWVzLmhhcyhmaWxlTmFtZSkgfHwgdGhpcy5nZW5lcmF0ZWRTb3VyY2VGaWxlcy5oYXMoZmlsZU5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvdWxkR2VuZXJhdGVGaWxlKGZpbGVOYW1lKS5nZW5lcmF0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRmlsZUV4aXN0cyhmaWxlTmFtZSk7XG4gIH1cblxuICBsb2FkU3VtbWFyeShmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICAgIGNvbnN0IHN1bW1hcnkgPSB0aGlzLmxpYnJhcnlTdW1tYXJpZXMuZ2V0KGZpbGVQYXRoKTtcbiAgICBpZiAoc3VtbWFyeSkge1xuICAgICAgcmV0dXJuIHN1bW1hcnkudGV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMub3JpZ2luYWxGaWxlRXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIGFzc2VydCh0aGlzLmNvbnRleHQucmVhZEZpbGUoZmlsZVBhdGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpc1NvdXJjZUZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIC8vIERvbid0IGdlbmVyYXRlIGFueSBmaWxlcyBub3IgdHlwZWNoZWNrIHRoZW1cbiAgICAvLyBpZiBza2lwVGVtcGxhdGVDb2RlZ2VuIGlzIHNldCBhbmQgZnVsbFRlbXBsYXRlVHlwZUNoZWNrIGlzIG5vdCB5ZXQgc2V0LFxuICAgIC8vIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNraXBUZW1wbGF0ZUNvZGVnZW4gJiYgIXRoaXMub3B0aW9ucy5mdWxsVGVtcGxhdGVUeXBlQ2hlY2spIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gSWYgd2UgaGF2ZSBhIHN1bW1hcnkgZnJvbSBhIHByZXZpb3VzIGNvbXBpbGF0aW9uLFxuICAgIC8vIHRyZWF0IHRoZSBmaWxlIG5ldmVyIGFzIGEgc291cmNlIGZpbGUuXG4gICAgaWYgKHRoaXMubGlicmFyeVN1bW1hcmllcy5oYXMoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChHRU5FUkFURURfRklMRVMudGVzdChmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZW5lcmF0ZUNvZGVGb3JMaWJyYXJpZXMgPT09IGZhbHNlICYmIERUUy50ZXN0KGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoRFRTLnRlc3QoZmlsZVBhdGgpKSB7XG4gICAgICAvLyBDaGVjayBmb3IgYSBidW5kbGUgaW5kZXguXG4gICAgICBpZiAodGhpcy5oYXNCdW5kbGVJbmRleChmaWxlUGF0aCkpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsRmlsZVBhdGggPSBwYXRoLm5vcm1hbGl6ZShmaWxlUGF0aCk7XG4gICAgICAgIHJldHVybiB0aGlzLmZsYXRNb2R1bGVJbmRleE5hbWVzLmhhcyhub3JtYWxGaWxlUGF0aCkgfHxcbiAgICAgICAgICAgIHRoaXMuZmxhdE1vZHVsZUluZGV4UmVkaXJlY3ROYW1lcy5oYXMobm9ybWFsRmlsZVBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlYWRGaWxlKGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzdW1tYXJ5ID0gdGhpcy5saWJyYXJ5U3VtbWFyaWVzLmdldChmaWxlTmFtZSk7XG4gICAgaWYgKHN1bW1hcnkpIHtcbiAgICAgIHJldHVybiBzdW1tYXJ5LnRleHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHQucmVhZEZpbGUoZmlsZU5hbWUpO1xuICB9XG5cbiAgZ2V0TWV0YWRhdGFGb3IoZmlsZVBhdGg6IHN0cmluZyk6IE1vZHVsZU1ldGFkYXRhW118dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gcmVhZE1ldGFkYXRhKGZpbGVQYXRoLCB0aGlzLm1ldGFkYXRhUmVhZGVySG9zdCwgdGhpcy5tZXRhZGF0YVJlYWRlckNhY2hlKTtcbiAgfVxuXG4gIGxvYWRSZXNvdXJjZShmaWxlUGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+fHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY29udGV4dC5yZWFkUmVzb3VyY2UpIHJldHVybiB0aGlzLmNvbnRleHQucmVhZFJlc291cmNlKGZpbGVQYXRoKTtcbiAgICBpZiAoIXRoaXMub3JpZ2luYWxGaWxlRXhpc3RzKGZpbGVQYXRoKSkge1xuICAgICAgdGhyb3cgc3ludGF4RXJyb3IoYEVycm9yOiBSZXNvdXJjZSBmaWxlIG5vdCBmb3VuZDogJHtmaWxlUGF0aH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGFzc2VydCh0aGlzLmNvbnRleHQucmVhZEZpbGUoZmlsZVBhdGgpKTtcbiAgfVxuXG4gIGdldE91dHB1dE5hbWUoZmlsZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodGhpcy5nZXRDdXJyZW50RGlyZWN0b3J5KCksIGZpbGVQYXRoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFzQnVuZGxlSW5kZXgoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNoZWNrQnVuZGxlSW5kZXggPSAoZGlyZWN0b3J5OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICAgIGxldCByZXN1bHQgPSB0aGlzLmZsYXRNb2R1bGVJbmRleENhY2hlLmdldChkaXJlY3RvcnkpO1xuICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIGlmIChwYXRoLmJhc2VuYW1lKGRpcmVjdG9yeSkgPT0gJ25vZGVfbW9kdWxlJykge1xuICAgICAgICAgIC8vIERvbid0IGxvb2sgb3V0c2lkZSB0aGUgbm9kZV9tb2R1bGVzIHRoaXMgcGFja2FnZSBpcyBpbnN0YWxsZWQgaW4uXG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQSBidW5kbGUgaW5kZXggZXhpc3RzIGlmIHRoZSB0eXBpbmdzIC5kLnRzIGZpbGUgaGFzIGEgbWV0YWRhdGEuanNvbiB0aGF0IGhhcyBhblxuICAgICAgICAgIC8vIGltcG9ydEFzLlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYWNrYWdlRmlsZSA9IHBhdGguam9pbihkaXJlY3RvcnksICdwYWNrYWdlLmpzb24nKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsRmlsZUV4aXN0cyhwYWNrYWdlRmlsZSkpIHtcbiAgICAgICAgICAgICAgLy8gT25jZSB3ZSBzZWUgYSBwYWNrYWdlLmpzb24gZmlsZSwgYXNzdW1lIGZhbHNlIHVudGlsIGl0IHdlIGZpbmQgdGhlIGJ1bmRsZSBpbmRleC5cbiAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VDb250ZW50OiBhbnkgPSBKU09OLnBhcnNlKGFzc2VydCh0aGlzLmNvbnRleHQucmVhZEZpbGUocGFja2FnZUZpbGUpKSk7XG4gICAgICAgICAgICAgIGlmIChwYWNrYWdlQ29udGVudC50eXBpbmdzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwaW5ncyA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihkaXJlY3RvcnksIHBhY2thZ2VDb250ZW50LnR5cGluZ3MpKTtcbiAgICAgICAgICAgICAgICBpZiAoRFRTLnRlc3QodHlwaW5ncykpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhRmlsZSA9IHR5cGluZ3MucmVwbGFjZShEVFMsICcubWV0YWRhdGEuanNvbicpO1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxGaWxlRXhpc3RzKG1ldGFkYXRhRmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBKU09OLnBhcnNlKGFzc2VydCh0aGlzLmNvbnRleHQucmVhZEZpbGUobWV0YWRhdGFGaWxlKSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0YWRhdGEuZmxhdE1vZHVsZUluZGV4UmVkaXJlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYXRNb2R1bGVJbmRleFJlZGlyZWN0TmFtZXMuYWRkKHR5cGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IGRvbid0IHNldCByZXN1bHQgPSB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIGFzIHRoaXMgd291bGQgbWFyayB0aGlzIGZvbGRlclxuICAgICAgICAgICAgICAgICAgICAgIC8vIGFzIGhhdmluZyBhIGJ1bmRsZUluZGV4IHRvbyBlYXJseSB3aXRob3V0XG4gICAgICAgICAgICAgICAgICAgICAgLy8gZmlsbGluZyB0aGUgYnVuZGxlSW5kZXhOYW1lcy5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5pbXBvcnRBcykge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhdE1vZHVsZUluZGV4TmFtZXMuYWRkKHR5cGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHBhdGguZGlybmFtZShkaXJlY3RvcnkpO1xuICAgICAgICAgICAgICBpZiAocGFyZW50ICE9IGRpcmVjdG9yeSkge1xuICAgICAgICAgICAgICAgIC8vIFRyeSB0aGUgcGFyZW50IGRpcmVjdG9yeS5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBjaGVja0J1bmRsZUluZGV4KHBhcmVudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGVuY291bnRlciBhbnkgZXJyb3JzIGFzc3VtZSB3ZSB0aGlzIGlzbid0IGEgYnVuZGxlIGluZGV4LlxuICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmxhdE1vZHVsZUluZGV4Q2FjaGUuc2V0KGRpcmVjdG9yeSwgcmVzdWx0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHJldHVybiBjaGVja0J1bmRsZUluZGV4KHBhdGguZGlybmFtZShmaWxlUGF0aCkpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdExpYkZpbGVOYW1lID0gKG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucykgPT5cbiAgICAgIHRoaXMuY29udGV4dC5nZXREZWZhdWx0TGliRmlsZU5hbWUob3B0aW9ucylcbiAgZ2V0Q3VycmVudERpcmVjdG9yeSA9ICgpID0+IHRoaXMuY29udGV4dC5nZXRDdXJyZW50RGlyZWN0b3J5KCk7XG4gIGdldENhbm9uaWNhbEZpbGVOYW1lID0gKGZpbGVOYW1lOiBzdHJpbmcpID0+IHRoaXMuY29udGV4dC5nZXRDYW5vbmljYWxGaWxlTmFtZShmaWxlTmFtZSk7XG4gIHVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMgPSAoKSA9PiB0aGlzLmNvbnRleHQudXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lcygpO1xuICBnZXROZXdMaW5lID0gKCkgPT4gdGhpcy5jb250ZXh0LmdldE5ld0xpbmUoKTtcbiAgLy8gTWFrZSBzdXJlIHdlIGRvIG5vdCBgaG9zdC5yZWFscGF0aCgpYCBmcm9tIFRTIGFzIHdlIGRvIG5vdCB3YW50IHRvIHJlc29sdmUgc3ltbGlua3MuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvOTU1MlxuICByZWFscGF0aCA9IChwOiBzdHJpbmcpID0+IHA7XG4gIHdyaXRlRmlsZSA9IHRoaXMuY29udGV4dC53cml0ZUZpbGUuYmluZCh0aGlzLmNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBnZW5GaWxlRXh0ZXJuYWxSZWZlcmVuY2VzKGdlbkZpbGU6IEdlbmVyYXRlZEZpbGUpOiBTZXQ8c3RyaW5nPiB7XG4gIHJldHVybiBuZXcgU2V0KGNvbGxlY3RFeHRlcm5hbFJlZmVyZW5jZXMoZ2VuRmlsZS5zdG10cyAhKS5tYXAoZXIgPT4gZXIubW9kdWxlTmFtZSAhKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFJlZmVyZW5jZXNUb1NvdXJjZUZpbGUoc2Y6IHRzLlNvdXJjZUZpbGUsIGdlbkZpbGVOYW1lczogc3RyaW5nW10pIHtcbiAgLy8gTm90ZTogYXMgd2UgbW9kaWZ5IHRzLlNvdXJjZUZpbGVzIHdlIG5lZWQgdG8ga2VlcCB0aGUgb3JpZ2luYWxcbiAgLy8gdmFsdWUgZm9yIGByZWZlcmVuY2VkRmlsZXNgIGFyb3VuZCBpbiBjYWNoZSB0aGUgb3JpZ2luYWwgaG9zdCBpcyBjYWNoaW5nIHRzLlNvdXJjZUZpbGVzLlxuICAvLyBOb3RlOiBjbG9uaW5nIHRoZSB0cy5Tb3VyY2VGaWxlIGlzIGV4cGVuc2l2ZSBhcyB0aGUgbm9kZXMgaW4gaGF2ZSBwYXJlbnQgcG9pbnRlcnMsXG4gIC8vIGkuZS4gd2Ugd291bGQgYWxzbyBuZWVkIHRvIGNsb25lIGFuZCBhZGp1c3QgYWxsIG5vZGVzLlxuICBsZXQgb3JpZ2luYWxSZWZlcmVuY2VkRmlsZXM6IFJlYWRvbmx5QXJyYXk8dHMuRmlsZVJlZmVyZW5jZT4gPVxuICAgICAgKHNmIGFzIGFueSkub3JpZ2luYWxSZWZlcmVuY2VkRmlsZXM7XG4gIGlmICghb3JpZ2luYWxSZWZlcmVuY2VkRmlsZXMpIHtcbiAgICBvcmlnaW5hbFJlZmVyZW5jZWRGaWxlcyA9IHNmLnJlZmVyZW5jZWRGaWxlcztcbiAgICAoc2YgYXMgYW55KS5vcmlnaW5hbFJlZmVyZW5jZWRGaWxlcyA9IG9yaWdpbmFsUmVmZXJlbmNlZEZpbGVzO1xuICB9XG4gIGNvbnN0IG5ld1JlZmVyZW5jZWRGaWxlcyA9IFsuLi5vcmlnaW5hbFJlZmVyZW5jZWRGaWxlc107XG4gIGdlbkZpbGVOYW1lcy5mb3JFYWNoKGdmID0+IG5ld1JlZmVyZW5jZWRGaWxlcy5wdXNoKHtmaWxlTmFtZTogZ2YsIHBvczogMCwgZW5kOiAwfSkpO1xuICBzZi5yZWZlcmVuY2VkRmlsZXMgPSBuZXdSZWZlcmVuY2VkRmlsZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcmlnaW5hbFJlZmVyZW5jZXMoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHRzLkZpbGVSZWZlcmVuY2VbXXx1bmRlZmluZWQge1xuICByZXR1cm4gc291cmNlRmlsZSAmJiAoc291cmNlRmlsZSBhcyBhbnkpLm9yaWdpbmFsUmVmZXJlbmNlZEZpbGVzO1xufVxuXG5mdW5jdGlvbiBkb3RSZWxhdGl2ZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCByUGF0aDogc3RyaW5nID0gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bykucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICByZXR1cm4gclBhdGguc3RhcnRzV2l0aCgnLicpID8gclBhdGggOiAnLi8nICsgclBhdGg7XG59XG5cbi8qKlxuICogTW92ZXMgdGhlIHBhdGggaW50byBgZ2VuRGlyYCBmb2xkZXIgd2hpbGUgcHJlc2VydmluZyB0aGUgYG5vZGVfbW9kdWxlc2AgZGlyZWN0b3J5LlxuICovXG5mdW5jdGlvbiBnZXRQYWNrYWdlTmFtZShmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCBtYXRjaCA9IE5PREVfTU9EVUxFU19QQUNLQUdFX05BTUUuZXhlYyhmaWxlUGF0aCk7XG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gc3RyaXBOb2RlTW9kdWxlc1ByZWZpeChmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGZpbGVQYXRoLnJlcGxhY2UoLy4qbm9kZV9tb2R1bGVzXFwvLywgJycpO1xufVxuXG5mdW5jdGlvbiBnZXROb2RlTW9kdWxlc1ByZWZpeChmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCBtYXRjaCA9IC8uKm5vZGVfbW9kdWxlc1xcLy8uZXhlYyhmaWxlUGF0aCk7XG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gc3RyaXBOZ1Jlc291cmNlU3VmZml4KGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gZmlsZU5hbWUucmVwbGFjZSgvXFwuXFwkbmdyZXNvdXJjZVxcJC4qLywgJycpO1xufVxuXG5mdW5jdGlvbiBhZGROZ1Jlc291cmNlU3VmZml4KGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZmlsZU5hbWV9LiRuZ3Jlc291cmNlJGA7XG59XG4iXX0=