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
        define("@angular/compiler-cli/src/ngtsc/imports/src/alias", ["require", "exports", "@angular/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compiler_1 = require("@angular/compiler");
    // Escape anything that isn't alphanumeric, '/' or '_'.
    var CHARS_TO_ESCAPE = /[^a-zA-Z0-9/_]/g;
    var AliasGenerator = /** @class */ (function () {
        function AliasGenerator(fileToModuleHost) {
            this.fileToModuleHost = fileToModuleHost;
        }
        AliasGenerator.prototype.aliasSymbolName = function (decl, context) {
            // The declared module is used to get the name of the alias.
            var declModule = this.fileToModuleHost.fileNameToModuleName(decl.getSourceFile().fileName, context.fileName);
            var replaced = declModule.replace(CHARS_TO_ESCAPE, '_').replace(/\//g, '$');
            return 'ɵng$' + replaced + '$$' + decl.name.text;
        };
        AliasGenerator.prototype.aliasTo = function (decl, via) {
            var name = this.aliasSymbolName(decl, via);
            // viaModule is the module it'll actually be imported from.
            var moduleName = this.fileToModuleHost.fileNameToModuleName(via.fileName, via.fileName);
            return new compiler_1.ExternalExpr({ moduleName: moduleName, name: name });
        };
        return AliasGenerator;
    }());
    exports.AliasGenerator = AliasGenerator;
    var AliasStrategy = /** @class */ (function () {
        function AliasStrategy() {
        }
        AliasStrategy.prototype.emit = function (ref, context, importMode) {
            return ref.alias;
        };
        return AliasStrategy;
    }());
    exports.AliasStrategy = AliasStrategy;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2ltcG9ydHMvc3JjL2FsaWFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOENBQTJEO0lBTzNELHVEQUF1RDtJQUN2RCxJQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztJQUUxQztRQUNFLHdCQUFvQixnQkFBa0M7WUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFHLENBQUM7UUFFMUQsd0NBQWUsR0FBZixVQUFnQixJQUFzQixFQUFFLE9BQXNCO1lBQzVELDREQUE0RDtZQUM1RCxJQUFNLFVBQVUsR0FDWixJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFaEcsSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RSxPQUFPLE1BQU0sR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25ELENBQUM7UUFFRCxnQ0FBTyxHQUFQLFVBQVEsSUFBc0IsRUFBRSxHQUFrQjtZQUNoRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3QywyREFBMkQ7WUFDM0QsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFGLE9BQU8sSUFBSSx1QkFBWSxDQUFDLEVBQUMsVUFBVSxZQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDSCxxQkFBQztJQUFELENBQUMsQUFsQkQsSUFrQkM7SUFsQlksd0NBQWM7SUFvQjNCO1FBQUE7UUFJQSxDQUFDO1FBSEMsNEJBQUksR0FBSixVQUFLLEdBQXVCLEVBQUUsT0FBc0IsRUFBRSxVQUFzQjtZQUMxRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDbkIsQ0FBQztRQUNILG9CQUFDO0lBQUQsQ0FBQyxBQUpELElBSUM7SUFKWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFeHByZXNzaW9uLCBFeHRlcm5hbEV4cHJ9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtGaWxlVG9Nb2R1bGVIb3N0LCBSZWZlcmVuY2VFbWl0U3RyYXRlZ3l9IGZyb20gJy4vZW1pdHRlcic7XG5pbXBvcnQge0ltcG9ydE1vZGUsIFJlZmVyZW5jZX0gZnJvbSAnLi9yZWZlcmVuY2VzJztcblxuLy8gRXNjYXBlIGFueXRoaW5nIHRoYXQgaXNuJ3QgYWxwaGFudW1lcmljLCAnLycgb3IgJ18nLlxuY29uc3QgQ0hBUlNfVE9fRVNDQVBFID0gL1teYS16QS1aMC05L19dL2c7XG5cbmV4cG9ydCBjbGFzcyBBbGlhc0dlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZmlsZVRvTW9kdWxlSG9zdDogRmlsZVRvTW9kdWxlSG9zdCkge31cblxuICBhbGlhc1N5bWJvbE5hbWUoZGVjbDogQ2xhc3NEZWNsYXJhdGlvbiwgY29udGV4dDogdHMuU291cmNlRmlsZSk6IHN0cmluZyB7XG4gICAgLy8gVGhlIGRlY2xhcmVkIG1vZHVsZSBpcyB1c2VkIHRvIGdldCB0aGUgbmFtZSBvZiB0aGUgYWxpYXMuXG4gICAgY29uc3QgZGVjbE1vZHVsZSA9XG4gICAgICAgIHRoaXMuZmlsZVRvTW9kdWxlSG9zdC5maWxlTmFtZVRvTW9kdWxlTmFtZShkZWNsLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSwgY29udGV4dC5maWxlTmFtZSk7XG5cbiAgICBjb25zdCByZXBsYWNlZCA9IGRlY2xNb2R1bGUucmVwbGFjZShDSEFSU19UT19FU0NBUEUsICdfJykucmVwbGFjZSgvXFwvL2csICckJyk7XG4gICAgcmV0dXJuICfJtW5nJCcgKyByZXBsYWNlZCArICckJCcgKyBkZWNsLm5hbWUudGV4dDtcbiAgfVxuXG4gIGFsaWFzVG8oZGVjbDogQ2xhc3NEZWNsYXJhdGlvbiwgdmlhOiB0cy5Tb3VyY2VGaWxlKTogRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuYWxpYXNTeW1ib2xOYW1lKGRlY2wsIHZpYSk7XG4gICAgLy8gdmlhTW9kdWxlIGlzIHRoZSBtb2R1bGUgaXQnbGwgYWN0dWFsbHkgYmUgaW1wb3J0ZWQgZnJvbS5cbiAgICBjb25zdCBtb2R1bGVOYW1lID0gdGhpcy5maWxlVG9Nb2R1bGVIb3N0LmZpbGVOYW1lVG9Nb2R1bGVOYW1lKHZpYS5maWxlTmFtZSwgdmlhLmZpbGVOYW1lKTtcbiAgICByZXR1cm4gbmV3IEV4dGVybmFsRXhwcih7bW9kdWxlTmFtZSwgbmFtZX0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBbGlhc1N0cmF0ZWd5IGltcGxlbWVudHMgUmVmZXJlbmNlRW1pdFN0cmF0ZWd5IHtcbiAgZW1pdChyZWY6IFJlZmVyZW5jZTx0cy5Ob2RlPiwgY29udGV4dDogdHMuU291cmNlRmlsZSwgaW1wb3J0TW9kZTogSW1wb3J0TW9kZSk6IEV4cHJlc3Npb258bnVsbCB7XG4gICAgcmV0dXJuIHJlZi5hbGlhcztcbiAgfVxufVxuIl19