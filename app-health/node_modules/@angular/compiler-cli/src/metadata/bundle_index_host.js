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
        define("@angular/compiler-cli/src/metadata/bundle_index_host", ["require", "exports", "tslib", "path", "typescript", "@angular/compiler-cli/src/metadata/bundler", "@angular/compiler-cli/src/metadata/index_writer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var path = require("path");
    var ts = require("typescript");
    var bundler_1 = require("@angular/compiler-cli/src/metadata/bundler");
    var index_writer_1 = require("@angular/compiler-cli/src/metadata/index_writer");
    var DTS = /\.d\.ts$/;
    var JS_EXT = /(\.js|)$/;
    function createSyntheticIndexHost(delegate, syntheticIndex) {
        var normalSyntheticIndexName = path.normalize(syntheticIndex.name);
        var newHost = Object.create(delegate);
        newHost.fileExists = function (fileName) {
            return path.normalize(fileName) == normalSyntheticIndexName || delegate.fileExists(fileName);
        };
        newHost.readFile = function (fileName) {
            return path.normalize(fileName) == normalSyntheticIndexName ? syntheticIndex.content :
                delegate.readFile(fileName);
        };
        newHost.getSourceFile =
            function (fileName, languageVersion, onError) {
                if (path.normalize(fileName) == normalSyntheticIndexName) {
                    var sf = ts.createSourceFile(fileName, syntheticIndex.content, languageVersion, true);
                    if (delegate.fileNameToModuleName) {
                        sf.moduleName = delegate.fileNameToModuleName(fileName);
                    }
                    return sf;
                }
                return delegate.getSourceFile(fileName, languageVersion, onError);
            };
        newHost.writeFile =
            function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                delegate.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
                if (fileName.match(DTS) && sourceFiles && sourceFiles.length == 1 &&
                    path.normalize(sourceFiles[0].fileName) === normalSyntheticIndexName) {
                    // If we are writing the synthetic index, write the metadata along side.
                    var metadataName = fileName.replace(DTS, '.metadata.json');
                    var indexMetadata = syntheticIndex.getMetadata();
                    delegate.writeFile(metadataName, indexMetadata, writeByteOrderMark, onError, []);
                }
            };
        return newHost;
    }
    function createBundleIndexHost(ngOptions, rootFiles, host, getMetadataCache) {
        var e_1, _a;
        var files = rootFiles.filter(function (f) { return !DTS.test(f); });
        var indexFile;
        if (files.length === 1) {
            indexFile = files[0];
        }
        else {
            try {
                for (var files_1 = tslib_1.__values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var f = files_1_1.value;
                    // Assume the shortest file path called index.ts is the entry point. Note that we
                    // need to use the posix path delimiter here because TypeScript internally only
                    // passes posix paths.
                    if (f.endsWith('/index.ts')) {
                        if (!indexFile || indexFile.length > f.length) {
                            indexFile = f;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (!indexFile) {
            return {
                host: host,
                errors: [{
                        file: null,
                        start: null,
                        length: null,
                        messageText: 'Angular compiler option "flatModuleIndex" requires one and only one .ts file in the "files" field.',
                        category: ts.DiagnosticCategory.Error,
                        code: 0
                    }]
            };
        }
        var indexModule = indexFile.replace(/\.ts$/, '');
        // The operation of producing a metadata bundle happens twice - once during setup and once during
        // the emit phase. The first time, the bundle is produced without a metadata cache, to compute the
        // contents of the flat module index. The bundle produced during emit does use the metadata cache
        // with associated transforms, so the metadata will have lowered expressions, resource inlining,
        // etc.
        var getMetadataBundle = function (cache) {
            var bundler = new bundler_1.MetadataBundler(indexModule, ngOptions.flatModuleId, new bundler_1.CompilerHostAdapter(host, cache, ngOptions), ngOptions.flatModulePrivateSymbolPrefix);
            return bundler.getMetadataBundle();
        };
        // First, produce the bundle with no MetadataCache.
        var metadataBundle = getMetadataBundle(/* MetadataCache */ null);
        var name = path.join(path.dirname(indexModule), ngOptions.flatModuleOutFile.replace(JS_EXT, '.ts'));
        var libraryIndex = "./" + path.basename(indexModule);
        var content = index_writer_1.privateEntriesToIndex(libraryIndex, metadataBundle.privates);
        host = createSyntheticIndexHost(host, {
            name: name,
            content: content,
            getMetadata: function () {
                // The second metadata bundle production happens on-demand, and uses the getMetadataCache
                // closure to retrieve an up-to-date MetadataCache which is configured with whatever metadata
                // transforms were used to produce the JS output.
                var metadataBundle = getMetadataBundle(getMetadataCache());
                return JSON.stringify(metadataBundle.metadata);
            }
        });
        return { host: host, indexName: name };
    }
    exports.createBundleIndexHost = createBundleIndexHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlX2luZGV4X2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL21ldGFkYXRhL2J1bmRsZV9pbmRleF9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUdILDJCQUE2QjtJQUM3QiwrQkFBaUM7SUFLakMsc0VBQStEO0lBQy9ELGdGQUFxRDtJQUVyRCxJQUFNLEdBQUcsR0FBRyxVQUFVLENBQUM7SUFDdkIsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDO0lBRTFCLFNBQVMsd0JBQXdCLENBQzdCLFFBQVcsRUFBRSxjQUEwRTtRQUN6RixJQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJFLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFDLFFBQWdCO1lBQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSx3QkFBd0IsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9GLENBQUMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxRQUFRLEdBQUcsVUFBQyxRQUFnQjtZQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RixDQUFDLENBQUM7UUFFRixPQUFPLENBQUMsYUFBYTtZQUNqQixVQUFDLFFBQWdCLEVBQUUsZUFBZ0MsRUFBRSxPQUFtQztnQkFDdEYsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFD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LFFBQVEsQ0FBQyxDQUFDO1lBQ2pELENBQUM7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ2pDLENBQUM7SUFwRUQsc0RBb0VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Q29tcGlsZXJPcHRpb25zfSBmcm9tICcuLi90cmFuc2Zvcm1lcnMvYXBpJztcbmltcG9ydCB7TWV0YWRhdGFDYWNoZX0gZnJvbSAnLi4vdHJhbnNmb3JtZXJzL21ldGFkYXRhX2NhY2hlJztcblxuaW1wb3J0IHtDb21waWxlckhvc3RBZGFwdGVyLCBNZXRhZGF0YUJ1bmRsZXJ9IGZyb20gJy4vYnVuZGxlcic7XG5pbXBvcnQge3ByaXZhdGVFbnRyaWVzVG9JbmRleH0gZnJvbSAnLi9pbmRleF93cml0ZXInO1xuXG5jb25zdCBEVFMgPSAvXFwuZFxcLnRzJC87XG5jb25zdCBKU19FWFQgPSAvKFxcLmpzfCkkLztcblxuZnVuY3Rpb24gY3JlYXRlU3ludGhldGljSW5kZXhIb3N0PEggZXh0ZW5kcyB0cy5Db21waWxlckhvc3Q+KFxuICAgIGRlbGVnYXRlOiBILCBzeW50aGV0aWNJbmRleDoge25hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBnZXRNZXRhZGF0YTogKCkgPT4gc3RyaW5nfSk6IEgge1xuICBjb25zdCBub3JtYWxTeW50aGV0aWNJbmRleE5hbWUgPSBwYXRoLm5vcm1hbGl6ZShzeW50aGV0aWNJbmRleC5uYW1lKTtcblxuICBjb25zdCBuZXdIb3N0ID0gT2JqZWN0LmNyZWF0ZShkZWxlZ2F0ZSk7XG4gIG5ld0hvc3QuZmlsZUV4aXN0cyA9IChmaWxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKGZpbGVOYW1lKSA9PSBub3JtYWxTeW50aGV0aWNJbmRleE5hbWUgfHwgZGVsZWdhdGUuZmlsZUV4aXN0cyhmaWxlTmFtZSk7XG4gIH07XG5cbiAgbmV3SG9zdC5yZWFkRmlsZSA9IChmaWxlTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIHBhdGgubm9ybWFsaXplKGZpbGVOYW1lKSA9PSBub3JtYWxTeW50aGV0aWNJbmRleE5hbWUgPyBzeW50aGV0aWNJbmRleC5jb250ZW50IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGVnYXRlLnJlYWRGaWxlKGZpbGVOYW1lKTtcbiAgfTtcblxuICBuZXdIb3N0LmdldFNvdXJjZUZpbGUgPVxuICAgICAgKGZpbGVOYW1lOiBzdHJpbmcsIGxhbmd1YWdlVmVyc2lvbjogdHMuU2NyaXB0VGFyZ2V0LCBvbkVycm9yPzogKG1lc3NhZ2U6IHN0cmluZykgPT4gdm9pZCkgPT4ge1xuICAgICAgICBpZiAocGF0aC5ub3JtYWxpemUoZmlsZU5hbWUpID09IG5vcm1hbFN5bnRoZXRpY0luZGV4TmFtZSkge1xuICAgICAgICAgIGNvbnN0IHNmID0gdHMuY3JlYXRlU291cmNlRmlsZShmaWxlTmFtZSwgc3ludGhldGljSW5kZXguY29udGVudCwgbGFuZ3VhZ2VWZXJzaW9uLCB0cnVlKTtcbiAgICAgICAgICBpZiAoKGRlbGVnYXRlIGFzIGFueSkuZmlsZU5hbWVUb01vZHVsZU5hbWUpIHtcbiAgICAgICAgICAgIHNmLm1vZHVsZU5hbWUgPSAoZGVsZWdhdGUgYXMgYW55KS5maWxlTmFtZVRvTW9kdWxlTmFtZShmaWxlTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzZjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsZWdhdGUuZ2V0U291cmNlRmlsZShmaWxlTmFtZSwgbGFuZ3VhZ2VWZXJzaW9uLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgbmV3SG9zdC53cml0ZUZpbGUgPVxuICAgICAgKGZpbGVOYW1lOiBzdHJpbmcsIGRhdGE6IHN0cmluZywgd3JpdGVCeXRlT3JkZXJNYXJrOiBib29sZWFuLFxuICAgICAgIG9uRXJyb3I6ICgobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkKSB8IHVuZGVmaW5lZCxcbiAgICAgICBzb3VyY2VGaWxlczogUmVhZG9ubHk8dHMuU291cmNlRmlsZT5bXSkgPT4ge1xuICAgICAgICBkZWxlZ2F0ZS53cml0ZUZpbGUoZmlsZU5hbWUsIGRhdGEsIHdyaXRlQnl0ZU9yZGVyTWFyaywgb25FcnJvciwgc291cmNlRmlsZXMpO1xuICAgICAgICBpZiAoZmlsZU5hbWUubWF0Y2goRFRTKSAmJiBzb3VyY2VGaWxlcyAmJiBzb3VyY2VGaWxlcy5sZW5ndGggPT0gMSAmJlxuICAgICAgICAgICAgcGF0aC5ub3JtYWxpemUoc291cmNlRmlsZXNbMF0uZmlsZU5hbWUpID09PSBub3JtYWxTeW50aGV0aWNJbmRleE5hbWUpIHtcbiAgICAgICAgICAvLyBJZiB3ZSBhcmUgd3JpdGluZyB0aGUgc3ludGhldGljIGluZGV4LCB3cml0ZSB0aGUgbWV0YWRhdGEgYWxvbmcgc2lkZS5cbiAgICAgICAgICBjb25zdCBtZXRhZGF0YU5hbWUgPSBmaWxlTmFtZS5yZXBsYWNlKERUUywgJy5tZXRhZGF0YS5qc29uJyk7XG4gICAgICAgICAgY29uc3QgaW5kZXhNZXRhZGF0YSA9IHN5bnRoZXRpY0luZGV4LmdldE1ldGFkYXRhKCk7XG4gICAgICAgICAgZGVsZWdhdGUud3JpdGVGaWxlKG1ldGFkYXRhTmFtZSwgaW5kZXhNZXRhZGF0YSwgd3JpdGVCeXRlT3JkZXJNYXJrLCBvbkVycm9yLCBbXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gIHJldHVybiBuZXdIb3N0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQnVuZGxlSW5kZXhIb3N0PEggZXh0ZW5kcyB0cy5Db21waWxlckhvc3Q+KFxuICAgIG5nT3B0aW9uczogQ29tcGlsZXJPcHRpb25zLCByb290RmlsZXM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiwgaG9zdDogSCxcbiAgICBnZXRNZXRhZGF0YUNhY2hlOiAoKSA9PlxuICAgICAgICBNZXRhZGF0YUNhY2hlKToge2hvc3Q6IEgsIGluZGV4TmFtZT86IHN0cmluZywgZXJyb3JzPzogdHMuRGlhZ25vc3RpY1tdfSB7XG4gIGNvbnN0IGZpbGVzID0gcm9vdEZpbGVzLmZpbHRlcihmID0+ICFEVFMudGVzdChmKSk7XG4gIGxldCBpbmRleEZpbGU6IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGlmIChmaWxlcy5sZW5ndGggPT09IDEpIHtcbiAgICBpbmRleEZpbGUgPSBmaWxlc1swXTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmlsZXMpIHtcbiAgICAgIC8vIEFzc3VtZSB0aGUgc2hvcnRlc3QgZmlsZSBwYXRoIGNhbGxlZCBpbmRleC50cyBpcyB0aGUgZW50cnkgcG9pbnQuIE5vdGUgdGhhdCB3ZVxuICAgICAgLy8gbmVlZCB0byB1c2UgdGhlIHBvc2l4IHBhdGggZGVsaW1pdGVyIGhlcmUgYmVjYXVzZSBUeXBlU2NyaXB0IGludGVybmFsbHkgb25seVxuICAgICAgLy8gcGFzc2VzIHBvc2l4IHBhdGhzLlxuICAgICAgaWYgKGYuZW5kc1dpdGgoJy9pbmRleC50cycpKSB7XG4gICAgICAgIGlmICghaW5kZXhGaWxlIHx8IGluZGV4RmlsZS5sZW5ndGggPiBmLmxlbmd0aCkge1xuICAgICAgICAgIGluZGV4RmlsZSA9IGY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpbmRleEZpbGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaG9zdCxcbiAgICAgIGVycm9yczogW3tcbiAgICAgICAgZmlsZTogbnVsbCBhcyBhbnkgYXMgdHMuU291cmNlRmlsZSxcbiAgICAgICAgc3RhcnQ6IG51bGwgYXMgYW55IGFzIG51bWJlcixcbiAgICAgICAgbGVuZ3RoOiBudWxsIGFzIGFueSBhcyBudW1iZXIsXG4gICAgICAgIG1lc3NhZ2VUZXh0OlxuICAgICAgICAgICAgJ0FuZ3VsYXIgY29tcGlsZXIgb3B0aW9uIFwiZmxhdE1vZHVsZUluZGV4XCIgcmVxdWlyZXMgb25lIGFuZCBvbmx5IG9uZSAudHMgZmlsZSBpbiB0aGUgXCJmaWxlc1wiIGZpZWxkLicsXG4gICAgICAgIGNhdGVnb3J5OiB0cy5EaWFnbm9zdGljQ2F0ZWdvcnkuRXJyb3IsXG4gICAgICAgIGNvZGU6IDBcbiAgICAgIH1dXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4TW9kdWxlID0gaW5kZXhGaWxlLnJlcGxhY2UoL1xcLnRzJC8sICcnKTtcblxuICAvLyBUaGUgb3BlcmF0aW9uIG9mIHByb2R1Y2luZyBhIG1ldGFkYXRhIGJ1bmRsZSBoYXBwZW5zIHR3aWNlIC0gb25jZSBkdXJpbmcgc2V0dXAgYW5kIG9uY2UgZHVyaW5nXG4gIC8vIHRoZSBlbWl0IHBoYXNlLiBUaGUgZmlyc3QgdGltZSwgdGhlIGJ1bmRsZSBpcyBwcm9kdWNlZCB3aXRob3V0IGEgbWV0YWRhdGEgY2FjaGUsIHRvIGNvbXB1dGUgdGhlXG4gIC8vIGNvbnRlbnRzIG9mIHRoZSBmbGF0IG1vZHVsZSBpbmRleC4gVGhlIGJ1bmRsZSBwcm9kdWNlZCBkdXJpbmcgZW1pdCBkb2VzIHVzZSB0aGUgbWV0YWRhdGEgY2FjaGVcbiAgLy8gd2l0aCBhc3NvY2lhdGVkIHRyYW5zZm9ybXMsIHNvIHRoZSBtZXRhZGF0YSB3aWxsIGhhdmUgbG93ZXJlZCBleHByZXNzaW9ucywgcmVzb3VyY2UgaW5saW5pbmcsXG4gIC8vIGV0Yy5cbiAgY29uc3QgZ2V0TWV0YWRhdGFCdW5kbGUgPSAoY2FjaGU6IE1ldGFkYXRhQ2FjaGUgfCBudWxsKSA9PiB7XG4gICAgY29uc3QgYnVuZGxlciA9IG5ldyBNZXRhZGF0YUJ1bmRsZXIoXG4gICAgICAgIGluZGV4TW9kdWxlLCBuZ09wdGlvbnMuZmxhdE1vZHVsZUlkLCBuZXcgQ29tcGlsZXJIb3N0QWRhcHRlcihob3N0LCBjYWNoZSwgbmdPcHRpb25zKSxcbiAgICAgICAgbmdPcHRpb25zLmZsYXRNb2R1bGVQcml2YXRlU3ltYm9sUHJlZml4KTtcbiAgICByZXR1cm4gYnVuZGxlci5nZXRNZXRhZGF0YUJ1bmRsZSgpO1xuICB9O1xuXG4gIC8vIEZpcnN0LCBwcm9kdWNlIHRoZSBidW5kbGUgd2l0aCBubyBNZXRhZGF0YUNhY2hlLlxuICBjb25zdCBtZXRhZGF0YUJ1bmRsZSA9IGdldE1ldGFkYXRhQnVuZGxlKC8qIE1ldGFkYXRhQ2FjaGUgKi8gbnVsbCk7XG4gIGNvbnN0IG5hbWUgPVxuICAgICAgcGF0aC5qb2luKHBhdGguZGlybmFtZShpbmRleE1vZHVsZSksIG5nT3B0aW9ucy5mbGF0TW9kdWxlT3V0RmlsZSAhLnJlcGxhY2UoSlNfRVhULCAnLnRzJykpO1xuICBjb25zdCBsaWJyYXJ5SW5kZXggPSBgLi8ke3BhdGguYmFzZW5hbWUoaW5kZXhNb2R1bGUpfWA7XG4gIGNvbnN0IGNvbnRlbnQgPSBwcml2YXRlRW50cmllc1RvSW5kZXgobGlicmFyeUluZGV4LCBtZXRhZGF0YUJ1bmRsZS5wcml2YXRlcyk7XG5cbiAgaG9zdCA9IGNyZWF0ZVN5bnRoZXRpY0luZGV4SG9zdChob3N0LCB7XG4gICAgbmFtZSxcbiAgICBjb250ZW50LFxuICAgIGdldE1ldGFkYXRhOiAoKSA9PiB7XG4gICAgICAvLyBUaGUgc2Vjb25kIG1ldGFkYXRhIGJ1bmRsZSBwcm9kdWN0aW9uIGhhcHBlbnMgb24tZGVtYW5kLCBhbmQgdXNlcyB0aGUgZ2V0TWV0YWRhdGFDYWNoZVxuICAgICAgLy8gY2xvc3VyZSB0byByZXRyaWV2ZSBhbiB1cC10by1kYXRlIE1ldGFkYXRhQ2FjaGUgd2hpY2ggaXMgY29uZmlndXJlZCB3aXRoIHdoYXRldmVyIG1ldGFkYXRhXG4gICAgICAvLyB0cmFuc2Zvcm1zIHdlcmUgdXNlZCB0byBwcm9kdWNlIHRoZSBKUyBvdXRwdXQuXG4gICAgICBjb25zdCBtZXRhZGF0YUJ1bmRsZSA9IGdldE1ldGFkYXRhQnVuZGxlKGdldE1ldGFkYXRhQ2FjaGUoKSk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWV0YWRhdGFCdW5kbGUubWV0YWRhdGEpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7aG9zdCwgaW5kZXhOYW1lOiBuYW1lfTtcbn1cbiJdfQ==