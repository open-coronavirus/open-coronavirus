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
        define("@angular/compiler-cli/src/ngtsc/resource_loader", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var CSS_PREPROCESSOR_EXT = /(\.scss|\.less|\.styl)$/;
    /**
     * `ResourceLoader` which delegates to a `CompilerHost` resource loading method.
     */
    var HostResourceLoader = /** @class */ (function () {
        function HostResourceLoader(host, options) {
            this.host = host;
            this.options = options;
            this.cache = new Map();
            this.fetching = new Map();
            this.canPreload = !!this.host.readResource;
            this.rootDirs = typescript_1.getRootDirs(host, options);
        }
        /**
         * Resolve the url of a resource relative to the file that contains the reference to it.
         * The return value of this method can be used in the `load()` and `preload()` methods.
         *
         * Uses the provided CompilerHost if it supports mapping resources to filenames.
         * Otherwise, uses a fallback mechanism that searches the module resolution candidates.
         *
         * @param url The, possibly relative, url of the resource.
         * @param fromFile The path to the file that contains the URL of the resource.
         * @returns A resolved url of resource.
         * @throws An error if the resource cannot be resolved.
         */
        HostResourceLoader.prototype.resolve = function (url, fromFile) {
            var resolvedUrl = null;
            if (this.host.resourceNameToFileName) {
                resolvedUrl = this.host.resourceNameToFileName(url, fromFile);
            }
            else {
                resolvedUrl = this.fallbackResolve(url, fromFile);
            }
            if (resolvedUrl === null) {
                throw new Error("HostResourceResolver: could not resolve " + url + " in context of " + fromFile + ")");
            }
            return resolvedUrl;
        };
        /**
         * Preload the specified resource, asynchronously.
         *
         * Once the resource is loaded, its value is cached so it can be accessed synchronously via the
         * `load()` method.
         *
         * @param resolvedUrl The url (resolved by a call to `resolve()`) of the resource to preload.
         * @returns A Promise that is resolved once the resource has been loaded or `undefined` if the
         * file has already been loaded.
         * @throws An Error if pre-loading is not available.
         */
        HostResourceLoader.prototype.preload = function (resolvedUrl) {
            var _this = this;
            if (!this.host.readResource) {
                throw new Error('HostResourceLoader: the CompilerHost provided does not support pre-loading resources.');
            }
            if (this.cache.has(resolvedUrl)) {
                return undefined;
            }
            else if (this.fetching.has(resolvedUrl)) {
                return this.fetching.get(resolvedUrl);
            }
            var result = this.host.readResource(resolvedUrl);
            if (typeof result === 'string') {
                this.cache.set(resolvedUrl, result);
                return undefined;
            }
            else {
                var fetchCompletion = result.then(function (str) {
                    _this.fetching.delete(resolvedUrl);
                    _this.cache.set(resolvedUrl, str);
                });
                this.fetching.set(resolvedUrl, fetchCompletion);
                return fetchCompletion;
            }
        };
        /**
         * Load the resource at the given url, synchronously.
         *
         * The contents of the resource may have been cached by a previous call to `preload()`.
         *
         * @param resolvedUrl The url (resolved by a call to `resolve()`) of the resource to load.
         * @returns The contents of the resource.
         */
        HostResourceLoader.prototype.load = function (resolvedUrl) {
            if (this.cache.has(resolvedUrl)) {
                return this.cache.get(resolvedUrl);
            }
            var result = this.host.readResource ? this.host.readResource(resolvedUrl) :
                this.host.readFile(resolvedUrl);
            if (typeof result !== 'string') {
                throw new Error("HostResourceLoader: loader(" + resolvedUrl + ") returned a Promise");
            }
            this.cache.set(resolvedUrl, result);
            return result;
        };
        /**
         * Attempt to resolve `url` in the context of `fromFile`, while respecting the rootDirs
         * option from the tsconfig. First, normalize the file name.
         */
        HostResourceLoader.prototype.fallbackResolve = function (url, fromFile) {
            var e_1, _a;
            var candidateLocations;
            if (url.startsWith('/')) {
                // This path is not really an absolute path, but instead the leading '/' means that it's
                // rooted in the project rootDirs. So look for it according to the rootDirs.
                candidateLocations = this.getRootedCandidateLocations(url);
            }
            else {
                // This path is a "relative" path and can be resolved as such. To make this easier on the
                // downstream resolver, the './' prefix is added if missing to distinguish these paths from
                // absolute node_modules paths.
                if (!url.startsWith('.')) {
                    url = "./" + url;
                }
                candidateLocations = this.getResolvedCandidateLocations(url, fromFile);
            }
            try {
                for (var candidateLocations_1 = tslib_1.__values(candidateLocations), candidateLocations_1_1 = candidateLocations_1.next(); !candidateLocations_1_1.done; candidateLocations_1_1 = candidateLocations_1.next()) {
                    var candidate = candidateLocations_1_1.value;
                    if (this.host.fileExists(candidate)) {
                        return candidate;
                    }
                    else if (CSS_PREPROCESSOR_EXT.test(candidate)) {
                        /**
                         * If the user specified styleUrl points to *.scss, but the Sass compiler was run before
                         * Angular, then the resource may have been generated as *.css. Simply try the resolution
                         * again.
                         */
                        var cssFallbackUrl = candidate.replace(CSS_PREPROCESSOR_EXT, '.css');
                        if (this.host.fileExists(cssFallbackUrl)) {
                            return cssFallbackUrl;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (candidateLocations_1_1 && !candidateLocations_1_1.done && (_a = candidateLocations_1.return)) _a.call(candidateLocations_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        HostResourceLoader.prototype.getRootedCandidateLocations = function (url) {
            // The path already starts with '/', so add a '.' to make it relative.
            var segment = ('.' + url);
            return this.rootDirs.map(function (rootDir) { return file_system_1.join(rootDir, segment); });
        };
        /**
         * TypeScript provides utilities to resolve module names, but not resource files (which aren't
         * a part of the ts.Program). However, TypeScript's module resolution can be used creatively
         * to locate where resource files should be expected to exist. Since module resolution returns
         * a list of file names that were considered, the loader can enumerate the possible locations
         * for the file by setting up a module resolution for it that will fail.
         */
        HostResourceLoader.prototype.getResolvedCandidateLocations = function (url, fromFile) {
            // clang-format off
            var failedLookup = ts.resolveModuleName(url + '.$ngresource$', fromFile, this.options, this.host);
            // clang-format on
            if (failedLookup.failedLookupLocations === undefined) {
                throw new Error("Internal error: expected to find failedLookupLocations during resolution of resource '" + url + "' in context of " + fromFile);
            }
            return failedLookup.failedLookupLocations
                .filter(function (candidate) { return candidate.endsWith('.$ngresource$.ts'); })
                .map(function (candidate) { return candidate.replace(/\.\$ngresource\$\.ts$/, ''); });
        };
        return HostResourceLoader;
    }());
    exports.HostResourceLoader = HostResourceLoader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9yZXNvdXJjZV9sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBS2pDLDJFQUFnRTtJQUNoRSxrRkFBa0Q7SUFFbEQsSUFBTSxvQkFBb0IsR0FBRyx5QkFBeUIsQ0FBQztJQUV2RDs7T0FFRztJQUNIO1FBUUUsNEJBQW9CLElBQWtCLEVBQVUsT0FBMkI7WUFBdkQsU0FBSSxHQUFKLElBQUksQ0FBYztZQUFVLFlBQU8sR0FBUCxPQUFPLENBQW9CO1lBUG5FLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztZQUNsQyxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXlCLENBQUM7WUFJcEQsZUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUdwQyxJQUFJLENBQUMsUUFBUSxHQUFHLHdCQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7V0FXRztRQUNILG9DQUFPLEdBQVAsVUFBUSxHQUFXLEVBQUUsUUFBZ0I7WUFDbkMsSUFBSSxXQUFXLEdBQWdCLElBQUksQ0FBQztZQUNwQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ3BDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMvRDtpQkFBTTtnQkFDTCxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDbkQ7WUFDRCxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxL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L0ksa0JBQWtCO1lBQ2xCLElBQUksWUFBWSxDQUFDLHFCQUFxQixLQUFLLFNBQVMsRUFBRTtnQkFDcEQsTUFBTSxJQUFJLEtBQUssQ0FDWCwyRkFBeUYsR0FBRyx3QkFBbUIsUUFBVSxDQUFDLENBQUM7YUFDaEk7WUFFRCxPQUFPLFlBQVksQ0FBQyxxQkFBcUI7aUJBQ3BDLE1BQU0sQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQztpQkFDM0QsR0FBRyxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFDSCx5QkFBQztJQUFELENBQUMsQUFyS0QsSUFxS0M7SUFyS1ksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtDb21waWxlckhvc3R9IGZyb20gJy4uL3RyYW5zZm9ybWVycy9hcGknO1xuXG5pbXBvcnQge1Jlc291cmNlTG9hZGVyfSBmcm9tICcuL2Fubm90YXRpb25zJztcbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIFBhdGhTZWdtZW50LCBqb2lufSBmcm9tICcuL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Z2V0Um9vdERpcnN9IGZyb20gJy4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbmNvbnN0IENTU19QUkVQUk9DRVNTT1JfRVhUID0gLyhcXC5zY3NzfFxcLmxlc3N8XFwuc3R5bCkkLztcblxuLyoqXG4gKiBgUmVzb3VyY2VMb2FkZXJgIHdoaWNoIGRlbGVnYXRlcyB0byBhIGBDb21waWxlckhvc3RgIHJlc291cmNlIGxvYWRpbmcgbWV0aG9kLlxuICovXG5leHBvcnQgY2xhc3MgSG9zdFJlc291cmNlTG9hZGVyIGltcGxlbWVudHMgUmVzb3VyY2VMb2FkZXIge1xuICBwcml2YXRlIGNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgcHJpdmF0ZSBmZXRjaGluZyA9IG5ldyBNYXA8c3RyaW5nLCBQcm9taXNlPHZvaWQ+PigpO1xuXG4gIHByaXZhdGUgcm9vdERpcnM6IEFic29sdXRlRnNQYXRoW107XG5cbiAgY2FuUHJlbG9hZCA9ICEhdGhpcy5ob3N0LnJlYWRSZXNvdXJjZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGhvc3Q6IENvbXBpbGVySG9zdCwgcHJpdmF0ZSBvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMpIHtcbiAgICB0aGlzLnJvb3REaXJzID0gZ2V0Um9vdERpcnMoaG9zdCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgdXJsIG9mIGEgcmVzb3VyY2UgcmVsYXRpdmUgdG8gdGhlIGZpbGUgdGhhdCBjb250YWlucyB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIGluIHRoZSBgbG9hZCgpYCBhbmQgYHByZWxvYWQoKWAgbWV0aG9kcy5cbiAgICpcbiAgICogVXNlcyB0aGUgcHJvdmlkZWQgQ29tcGlsZXJIb3N0IGlmIGl0IHN1cHBvcnRzIG1hcHBpbmcgcmVzb3VyY2VzIHRvIGZpbGVuYW1lcy5cbiAgICogT3RoZXJ3aXNlLCB1c2VzIGEgZmFsbGJhY2sgbWVjaGFuaXNtIHRoYXQgc2VhcmNoZXMgdGhlIG1vZHVsZSByZXNvbHV0aW9uIGNhbmRpZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB1cmwgVGhlLCBwb3NzaWJseSByZWxhdGl2ZSwgdXJsIG9mIHRoZSByZXNvdXJjZS5cbiAgICogQHBhcmFtIGZyb21GaWxlIFRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY29udGFpbnMgdGhlIFVSTCBvZiB0aGUgcmVzb3VyY2UuXG4gICAqIEByZXR1cm5zIEEgcmVzb2x2ZWQgdXJsIG9mIHJlc291cmNlLlxuICAgKiBAdGhyb3dzIEFuIGVycm9yIGlmIHRoZSByZXNvdXJjZSBjYW5ub3QgYmUgcmVzb2x2ZWQuXG4gICAqL1xuICByZXNvbHZlKHVybDogc3RyaW5nLCBmcm9tRmlsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzb2x2ZWRVcmw6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICBpZiAodGhpcy5ob3N0LnJlc291cmNlTmFtZVRvRmlsZU5hbWUpIHtcbiAgICAgIHJlc29sdmVkVXJsID0gdGhpcy5ob3N0LnJlc291cmNlTmFtZVRvRmlsZU5hbWUodXJsLCBmcm9tRmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmVkVXJsID0gdGhpcy5mYWxsYmFja1Jlc29sdmUodXJsLCBmcm9tRmlsZSk7XG4gICAgfVxuICAgIGlmIChyZXNvbHZlZFVybCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBIb3N0UmVzb3VyY2VSZXNvbHZlcjogY291bGQgbm90IHJlc29sdmUgJHt1cmx9IGluIGNvbnRleHQgb2YgJHtmcm9tRmlsZX0pYCk7XG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlZFVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVsb2FkIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UsIGFzeW5jaHJvbm91c2x5LlxuICAgKlxuICAgKiBPbmNlIHRoZSByZXNvdXJjZSBpcyBsb2FkZWQsIGl0cyB2YWx1ZSBpcyBjYWNoZWQgc28gaXQgY2FuIGJlIGFjY2Vzc2VkIHN5bmNocm9ub3VzbHkgdmlhIHRoZVxuICAgKiBgbG9hZCgpYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSByZXNvbHZlZFVybCBUaGUgdXJsIChyZXNvbHZlZCBieSBhIGNhbGwgdG8gYHJlc29sdmUoKWApIG9mIHRoZSByZXNvdXJjZSB0byBwcmVsb2FkLlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBvbmNlIHRoZSByZXNvdXJjZSBoYXMgYmVlbiBsb2FkZWQgb3IgYHVuZGVmaW5lZGAgaWYgdGhlXG4gICAqIGZpbGUgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQuXG4gICAqIEB0aHJvd3MgQW4gRXJyb3IgaWYgcHJlLWxvYWRpbmcgaXMgbm90IGF2YWlsYWJsZS5cbiAgICovXG4gIHByZWxvYWQocmVzb2x2ZWRVcmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD58dW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuaG9zdC5yZWFkUmVzb3VyY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnSG9zdFJlc291cmNlTG9hZGVyOiB0aGUgQ29tcGlsZXJIb3N0IHByb3ZpZGVkIGRvZXMgbm90IHN1cHBvcnQgcHJlLWxvYWRpbmcgcmVzb3VyY2VzLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jYWNoZS5oYXMocmVzb2x2ZWRVcmwpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mZXRjaGluZy5oYXMocmVzb2x2ZWRVcmwpKSB7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaGluZy5nZXQocmVzb2x2ZWRVcmwpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuaG9zdC5yZWFkUmVzb3VyY2UocmVzb2x2ZWRVcmwpO1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5jYWNoZS5zZXQocmVzb2x2ZWRVcmwsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmZXRjaENvbXBsZXRpb24gPSByZXN1bHQudGhlbihzdHIgPT4ge1xuICAgICAgICB0aGlzLmZldGNoaW5nLmRlbGV0ZShyZXNvbHZlZFVybCk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2V0KHJlc29sdmVkVXJsLCBzdHIpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmZldGNoaW5nLnNldChyZXNvbHZlZFVybCwgZmV0Y2hDb21wbGV0aW9uKTtcbiAgICAgIHJldHVybiBmZXRjaENvbXBsZXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIHJlc291cmNlIGF0IHRoZSBnaXZlbiB1cmwsIHN5bmNocm9ub3VzbHkuXG4gICAqXG4gICAqIFRoZSBjb250ZW50cyBvZiB0aGUgcmVzb3VyY2UgbWF5IGhhdmUgYmVlbiBjYWNoZWQgYnkgYSBwcmV2aW91cyBjYWxsIHRvIGBwcmVsb2FkKClgLlxuICAgKlxuICAgKiBAcGFyYW0gcmVzb2x2ZWRVcmwgVGhlIHVybCAocmVzb2x2ZWQgYnkgYSBjYWxsIHRvIGByZXNvbHZlKClgKSBvZiB0aGUgcmVzb3VyY2UgdG8gbG9hZC5cbiAgICogQHJldHVybnMgVGhlIGNvbnRlbnRzIG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIGxvYWQocmVzb2x2ZWRVcmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuY2FjaGUuaGFzKHJlc29sdmVkVXJsKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0KHJlc29sdmVkVXJsKSAhO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuaG9zdC5yZWFkUmVzb3VyY2UgPyB0aGlzLmhvc3QucmVhZFJlc291cmNlKHJlc29sdmVkVXJsKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9zdC5yZWFkRmlsZShyZXNvbHZlZFVybCk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3RSZXNvdXJjZUxvYWRlcjogbG9hZGVyKCR7cmVzb2x2ZWRVcmx9KSByZXR1cm5lZCBhIFByb21pc2VgKTtcbiAgICB9XG4gICAgdGhpcy5jYWNoZS5zZXQocmVzb2x2ZWRVcmwsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0IHRvIHJlc29sdmUgYHVybGAgaW4gdGhlIGNvbnRleHQgb2YgYGZyb21GaWxlYCwgd2hpbGUgcmVzcGVjdGluZyB0aGUgcm9vdERpcnNcbiAgICogb3B0aW9uIGZyb20gdGhlIHRzY29uZmlnLiBGaXJzdCwgbm9ybWFsaXplIHRoZSBmaWxlIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIGZhbGxiYWNrUmVzb2x2ZSh1cmw6IHN0cmluZywgZnJvbUZpbGU6IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgICBsZXQgY2FuZGlkYXRlTG9jYXRpb25zOiBzdHJpbmdbXTtcbiAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgLy8gVGhpcyBwYXRoIGlzIG5vdCByZWFsbHkgYW4gYWJzb2x1dGUgcGF0aCwgYnV0IGluc3RlYWQgdGhlIGxlYWRpbmcgJy8nIG1lYW5zIHRoYXQgaXQnc1xuICAgICAgLy8gcm9vdGVkIGluIHRoZSBwcm9qZWN0IHJvb3REaXJzLiBTbyBsb29rIGZvciBpdCBhY2NvcmRpbmcgdG8gdGhlIHJvb3REaXJzLlxuICAgICAgY2FuZGlkYXRlTG9jYXRpb25zID0gdGhpcy5nZXRSb290ZWRDYW5kaWRhdGVMb2NhdGlvbnModXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBwYXRoIGlzIGEgXCJyZWxhdGl2ZVwiIHBhdGggYW5kIGNhbiBiZSByZXNvbHZlZCBhcyBzdWNoLiBUbyBtYWtlIHRoaXMgZWFzaWVyIG9uIHRoZVxuICAgICAgLy8gZG93bnN0cmVhbSByZXNvbHZlciwgdGhlICcuLycgcHJlZml4IGlzIGFkZGVkIGlmIG1pc3NpbmcgdG8gZGlzdGluZ3Vpc2ggdGhlc2UgcGF0aHMgZnJvbVxuICAgICAgLy8gYWJzb2x1dGUgbm9kZV9tb2R1bGVzIHBhdGhzLlxuICAgICAgaWYgKCF1cmwuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICAgIHVybCA9IGAuLyR7dXJsfWA7XG4gICAgICB9XG4gICAgICBjYW5kaWRhdGVMb2NhdGlvbnMgPSB0aGlzLmdldFJlc29sdmVkQ2FuZGlkYXRlTG9jYXRpb25zKHVybCwgZnJvbUZpbGUpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZUxvY2F0aW9ucykge1xuICAgICAgaWYgKHRoaXMuaG9zdC5maWxlRXhpc3RzKGNhbmRpZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgICAgIH0gZWxzZSBpZiAoQ1NTX1BSRVBST0NFU1NPUl9FWFQudGVzdChjYW5kaWRhdGUpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgdXNlciBzcGVjaWZpZWQgc3R5bGVVcmwgcG9pbnRzIHRvICouc2NzcywgYnV0IHRoZSBTYXNzIGNvbXBpbGVyIHdhcyBydW4gYmVmb3JlXG4gICAgICAgICAqIEFuZ3VsYXIsIHRoZW4gdGhlIHJlc291cmNlIG1heSBoYXZlIGJlZW4gZ2VuZXJhdGVkIGFzICouY3NzLiBTaW1wbHkgdHJ5IHRoZSByZXNvbHV0aW9uXG4gICAgICAgICAqIGFnYWluLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY3NzRmFsbGJhY2tVcmwgPSBjYW5kaWRhdGUucmVwbGFjZShDU1NfUFJFUFJPQ0VTU09SX0VYVCwgJy5jc3MnKTtcbiAgICAgICAgaWYgKHRoaXMuaG9zdC5maWxlRXhpc3RzKGNzc0ZhbGxiYWNrVXJsKSkge1xuICAgICAgICAgIHJldHVybiBjc3NGYWxsYmFja1VybDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Um9vdGVkQ2FuZGlkYXRlTG9jYXRpb25zKHVybDogc3RyaW5nKTogQWJzb2x1dGVGc1BhdGhbXSB7XG4gICAgLy8gVGhlIHBhdGggYWxyZWFkeSBzdGFydHMgd2l0aCAnLycsIHNvIGFkZCBhICcuJyB0byBtYWtlIGl0IHJlbGF0aXZlLlxuICAgIGNvbnN0IHNlZ21lbnQ6IFBhdGhTZWdtZW50ID0gKCcuJyArIHVybCkgYXMgUGF0aFNlZ21lbnQ7XG4gICAgcmV0dXJuIHRoaXMucm9vdERpcnMubWFwKHJvb3REaXIgPT4gam9pbihyb290RGlyLCBzZWdtZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogVHlwZVNjcmlwdCBwcm92aWRlcyB1dGlsaXRpZXMgdG8gcmVzb2x2ZSBtb2R1bGUgbmFtZXMsIGJ1dCBub3QgcmVzb3VyY2UgZmlsZXMgKHdoaWNoIGFyZW4ndFxuICAgKiBhIHBhcnQgb2YgdGhlIHRzLlByb2dyYW0pLiBIb3dldmVyLCBUeXBlU2NyaXB0J3MgbW9kdWxlIHJlc29sdXRpb24gY2FuIGJlIHVzZWQgY3JlYXRpdmVseVxuICAgKiB0byBsb2NhdGUgd2hlcmUgcmVzb3VyY2UgZmlsZXMgc2hvdWxkIGJlIGV4cGVjdGVkIHRvIGV4aXN0LiBTaW5jZSBtb2R1bGUgcmVzb2x1dGlvbiByZXR1cm5zXG4gICAqIGEgbGlzdCBvZiBmaWxlIG5hbWVzIHRoYXQgd2VyZSBjb25zaWRlcmVkLCB0aGUgbG9hZGVyIGNhbiBlbnVtZXJhdGUgdGhlIHBvc3NpYmxlIGxvY2F0aW9uc1xuICAgKiBmb3IgdGhlIGZpbGUgYnkgc2V0dGluZyB1cCBhIG1vZHVsZSByZXNvbHV0aW9uIGZvciBpdCB0aGF0IHdpbGwgZmFpbC5cbiAgICovXG4gIHByaXZhdGUgZ2V0UmVzb2x2ZWRDYW5kaWRhdGVMb2NhdGlvbnModXJsOiBzdHJpbmcsIGZyb21GaWxlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgLy8gYGZhaWxlZExvb2t1cExvY2F0aW9uc2AgaXMgaW4gdGhlIG5hbWUgb2YgdGhlIHR5cGUgdHMuUmVzb2x2ZWRNb2R1bGVXaXRoRmFpbGVkTG9va3VwTG9jYXRpb25zXG4gICAgLy8gYnV0IGlzIG1hcmtlZCBAaW50ZXJuYWwgaW4gVHlwZVNjcmlwdC4gU2VlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yODc3MC5cbiAgICB0eXBlIFJlc29sdmVkTW9kdWxlV2l0aEZhaWxlZExvb2t1cExvY2F0aW9ucyA9XG4gICAgICAgIHRzLlJlc29sdmVkTW9kdWxlV2l0aEZhaWxlZExvb2t1cExvY2F0aW9ucyAmIHtmYWlsZWRMb29rdXBMb2NhdGlvbnM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPn07XG5cbiAgICAvLyBjbGFuZy1mb3JtYXQgb2ZmXG4gICAgY29uc3QgZmFpbGVkTG9va3VwID0gdHMucmVzb2x2ZU1vZHVsZU5hbWUodXJsICsgJy4kbmdyZXNvdXJjZSQnLCBmcm9tRmlsZSwgdGhpcy5vcHRpb25zLCB0aGlzLmhvc3QpIGFzIFJlc29sdmVkTW9kdWxlV2l0aEZhaWxlZExvb2t1cExvY2F0aW9ucztcbiAgICAvLyBjbGFuZy1mb3JtYXQgb25cbiAgICBpZiAoZmFpbGVkTG9va3VwLmZhaWxlZExvb2t1cExvY2F0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludGVybmFsIGVycm9yOiBleHBlY3RlZCB0byBmaW5kIGZhaWxlZExvb2t1cExvY2F0aW9ucyBkdXJpbmcgcmVzb2x1dGlvbiBvZiByZXNvdXJjZSAnJHt1cmx9JyBpbiBjb250ZXh0IG9mICR7ZnJvbUZpbGV9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhaWxlZExvb2t1cC5mYWlsZWRMb29rdXBMb2NhdGlvbnNcbiAgICAgICAgLmZpbHRlcihjYW5kaWRhdGUgPT4gY2FuZGlkYXRlLmVuZHNXaXRoKCcuJG5ncmVzb3VyY2UkLnRzJykpXG4gICAgICAgIC5tYXAoY2FuZGlkYXRlID0+IGNhbmRpZGF0ZS5yZXBsYWNlKC9cXC5cXCRuZ3Jlc291cmNlXFwkXFwudHMkLywgJycpKTtcbiAgfVxufVxuIl19