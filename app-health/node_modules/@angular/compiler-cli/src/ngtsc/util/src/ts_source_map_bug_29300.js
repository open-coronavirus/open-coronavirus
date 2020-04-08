(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/util/src/ts_source_map_bug_29300", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ts = require("typescript");
    var _tsSourceMapBug29300Fixed;
    /**
     * Test the current version of TypeScript to see if it has fixed the external SourceMap
     * file bug: https://github.com/Microsoft/TypeScript/issues/29300.
     *
     * The bug is fixed in TS 3.3+ but this check avoid us having to rely upon the version number,
     * and allows us to gracefully fail if the TS version still has the bug.
     *
     * We check for the bug by compiling a very small program `a;` and transforming it to `b;`,
     * where we map the new `b` identifier to an external source file, which has different lines to
     * the original source file.  If the bug is fixed then the output SourceMap should contain
     * mappings that correspond ot the correct line/col pairs for this transformed node.
     *
     * @returns true if the bug is fixed.
     */
    function tsSourceMapBug29300Fixed() {
        if (_tsSourceMapBug29300Fixed === undefined) {
            var writtenFiles_1 = {};
            var sourceFile_1 = ts.createSourceFile('test.ts', 'a;', ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);
            var host = {
                getSourceFile: function () { return sourceFile_1; },
                fileExists: function () { return true; },
                readFile: function () { return ''; },
                writeFile: function (fileName, data) { writtenFiles_1[fileName] = data; },
                getDefaultLibFileName: function () { return ''; },
                getCurrentDirectory: function () { return ''; },
                getDirectories: function () { return []; },
                getCanonicalFileName: function () { return ''; },
                useCaseSensitiveFileNames: function () { return true; },
                getNewLine: function () { return '\n'; },
            };
            var transform = function (context) {
                return function (node) { return ts.visitNode(node, visitor); };
                function visitor(node) {
                    if (ts.isIdentifier(node) && node.text === 'a') {
                        var newNode = ts.createIdentifier('b');
                        ts.setSourceMapRange(newNode, {
                            pos: 16,
                            end: 16,
                            source: ts.createSourceMapSource('test.html', 'abc\ndef\nghi\njkl\nmno\npqr')
                        });
                        return newNode;
                    }
                    return ts.visitEachChild(node, visitor, context);
                }
            };
            var program = ts.createProgram(['test.ts'], { sourceMap: true }, host);
            program.emit(sourceFile_1, undefined, undefined, undefined, { after: [transform] });
            // The first two mappings in the source map should look like:
            // [0,1,4,0] col 0 => source file 1, row 4, column 0)
            // [1,0,0,0] col 1 => source file 1, row 4, column 0)
            _tsSourceMapBug29300Fixed = /ACIA,CAAA/.test(writtenFiles_1['test.js.map']);
        }
        return _tsSourceMapBug29300Fixed;
    }
    exports.tsSourceMapBug29300Fixed = tsSourceMapBug29300Fixed;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfc291cmNlX21hcF9idWdfMjkzMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3V0aWwvc3JjL3RzX3NvdXJjZV9tYXBfYnVnXzI5MzAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsK0JBQWlDO0lBRWpDLElBQUkseUJBQTRDLENBQUM7SUFFakQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFNBQWdCLHdCQUF3QjtRQUN0QyxJQUFJLHlCQUF5QixLQUFLLFNBQVMsRUFBRTtZQUMzQyxJQUFJLGNBQVksR0FBaUMsRUFBRSxDQUFDO1lBQ3BELElBQU0sWUFBVSxHQUNaLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLElBQU0sSUFBSSxHQUFHO2dCQUNYLGFBQWEsRUFBYixjQUEyQyxPQUFPLFlBQVUsQ0FBQyxDQUFBLENBQUM7Z0JBQzlELFVBQVUsRUFBVixjQUFzQixPQUFPLElBQUksQ0FBQyxDQUFBLENBQUM7Z0JBQ25DLFFBQVEsRUFBUixjQUErQixPQUFPLEVBQUUsQ0FBQyxDQUFBLENBQUM7Z0JBQzFDLFNBQVMsRUFBVCxVQUFVLFFBQWdCLEVBQUUsSUFBWSxJQUFJLGNBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxxQkFBcUIsRUFBckIsY0FBZ0MsT0FBTyxFQUFFLENBQUMsQ0FBQSxDQUFDO2dCQUMzQyxtQkFBbUIsRUFBbkIsY0FBOEIsT0FBTyxFQUFFLENBQUMsQ0FBQSxDQUFDO2dCQUN6QyxjQUFjLEVBQWQsY0FBMkIsT0FBTyxFQUFFLENBQUMsQ0FBQSxDQUFDO2dCQUN0QyxvQkFBb0IsRUFBcEIsY0FBK0IsT0FBTyxFQUFFLENBQUMsQ0FBQSxDQUFDO2dCQUMxQyx5QkFBeUIsRUFBekIsY0FBcUMsT0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUNsRCxVQUFVLEVBQVYsY0FBcUIsT0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFDO2FBQ25DLENBQUM7WUFFRixJQUFNLFNBQVMsR0FBRyxVQUFDLE9BQWlDO2dCQUNsRCxPQUFPLFVBQUMsSUFBbUIsSUFBSyxPQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUEzQixDQUEyQixDQUFDO2dCQUM1RCxTQUFTLE9BQU8sQ0FBQyxJQUFhO29CQUM1QixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7d0JBQzlDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDekMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRTs0QkFDNUIsR0FBRyxFQUFFLEVBQUU7NEJBQ1AsR0FBRyxFQUFFLEVBQUU7NEJBQ1AsTUFBTSxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsOEJBQThCLENBQUM7eUJBQzlFLENBQUMsQ0FBQzt3QkFDSCxPQUFPLE9BQU8sQ0FBQztxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELENBQUM7WUFDSCxDQUFDLENBQUM7WUFFRixJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkUsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFVLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDaEYsNkRBQTZEO1lBQzdELHFEQUFxRDtZQUNyRCxxREFBcUQ7WUFDckQseUJBQXlCLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztTQUMzRTtRQUNELE9BQU8seUJBQXlCLENBQUM7SUFDbkMsQ0FBQztJQTFDRCw0REEwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxubGV0IF90c1NvdXJjZU1hcEJ1ZzI5MzAwRml4ZWQ6IGJvb2xlYW58dW5kZWZpbmVkO1xuXG4vKipcbiAqIFRlc3QgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiBUeXBlU2NyaXB0IHRvIHNlZSBpZiBpdCBoYXMgZml4ZWQgdGhlIGV4dGVybmFsIFNvdXJjZU1hcFxuICogZmlsZSBidWc6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjkzMDAuXG4gKlxuICogVGhlIGJ1ZyBpcyBmaXhlZCBpbiBUUyAzLjMrIGJ1dCB0aGlzIGNoZWNrIGF2b2lkIHVzIGhhdmluZyB0byByZWx5IHVwb24gdGhlIHZlcnNpb24gbnVtYmVyLFxuICogYW5kIGFsbG93cyB1cyB0byBncmFjZWZ1bGx5IGZhaWwgaWYgdGhlIFRTIHZlcnNpb24gc3RpbGwgaGFzIHRoZSBidWcuXG4gKlxuICogV2UgY2hlY2sgZm9yIHRoZSBidWcgYnkgY29tcGlsaW5nIGEgdmVyeSBzbWFsbCBwcm9ncmFtIGBhO2AgYW5kIHRyYW5zZm9ybWluZyBpdCB0byBgYjtgLFxuICogd2hlcmUgd2UgbWFwIHRoZSBuZXcgYGJgIGlkZW50aWZpZXIgdG8gYW4gZXh0ZXJuYWwgc291cmNlIGZpbGUsIHdoaWNoIGhhcyBkaWZmZXJlbnQgbGluZXMgdG9cbiAqIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZS4gIElmIHRoZSBidWcgaXMgZml4ZWQgdGhlbiB0aGUgb3V0cHV0IFNvdXJjZU1hcCBzaG91bGQgY29udGFpblxuICogbWFwcGluZ3MgdGhhdCBjb3JyZXNwb25kIG90IHRoZSBjb3JyZWN0IGxpbmUvY29sIHBhaXJzIGZvciB0aGlzIHRyYW5zZm9ybWVkIG5vZGUuXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgYnVnIGlzIGZpeGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHNTb3VyY2VNYXBCdWcyOTMwMEZpeGVkKCkge1xuICBpZiAoX3RzU291cmNlTWFwQnVnMjkzMDBGaXhlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGV0IHdyaXR0ZW5GaWxlczoge1tmaWxlbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPVxuICAgICAgICB0cy5jcmVhdGVTb3VyY2VGaWxlKCd0ZXN0LnRzJywgJ2E7JywgdHMuU2NyaXB0VGFyZ2V0LkVTMjAxNSwgdHJ1ZSwgdHMuU2NyaXB0S2luZC5UUyk7XG4gICAgY29uc3QgaG9zdCA9IHtcbiAgICAgIGdldFNvdXJjZUZpbGUoKTogdHMuU291cmNlRmlsZSB8IHVuZGVmaW5lZHtyZXR1cm4gc291cmNlRmlsZTt9LFxuICAgICAgZmlsZUV4aXN0cygpOiBib29sZWFue3JldHVybiB0cnVlO30sXG4gICAgICByZWFkRmlsZSgpOiBzdHJpbmcgfCB1bmRlZmluZWR7cmV0dXJuICcnO30sXG4gICAgICB3cml0ZUZpbGUoZmlsZU5hbWU6IHN0cmluZywgZGF0YTogc3RyaW5nKSB7IHdyaXR0ZW5GaWxlc1tmaWxlTmFtZV0gPSBkYXRhOyB9LFxuICAgICAgZ2V0RGVmYXVsdExpYkZpbGVOYW1lKCk6IHN0cmluZ3tyZXR1cm4gJyc7fSxcbiAgICAgIGdldEN1cnJlbnREaXJlY3RvcnkoKTogc3RyaW5ne3JldHVybiAnJzt9LFxuICAgICAgZ2V0RGlyZWN0b3JpZXMoKTogc3RyaW5nW117cmV0dXJuIFtdO30sXG4gICAgICBnZXRDYW5vbmljYWxGaWxlTmFtZSgpOiBzdHJpbmd7cmV0dXJuICcnO30sXG4gICAgICB1c2VDYXNlU2Vuc2l0aXZlRmlsZU5hbWVzKCk6IGJvb2xlYW57cmV0dXJuIHRydWU7fSxcbiAgICAgIGdldE5ld0xpbmUoKTogc3RyaW5ne3JldHVybiAnXFxuJzt9LFxuICAgIH07XG5cbiAgICBjb25zdCB0cmFuc2Zvcm0gPSAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KSA9PiB7XG4gICAgICByZXR1cm4gKG5vZGU6IHRzLlNvdXJjZUZpbGUpID0+IHRzLnZpc2l0Tm9kZShub2RlLCB2aXNpdG9yKTtcbiAgICAgIGZ1bmN0aW9uIHZpc2l0b3Iobm9kZTogdHMuTm9kZSk6IHRzLk5vZGUge1xuICAgICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpICYmIG5vZGUudGV4dCA9PT0gJ2EnKSB7XG4gICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoJ2InKTtcbiAgICAgICAgICB0cy5zZXRTb3VyY2VNYXBSYW5nZShuZXdOb2RlLCB7XG4gICAgICAgICAgICBwb3M6IDE2LFxuICAgICAgICAgICAgZW5kOiAxNixcbiAgICAgICAgICAgIHNvdXJjZTogdHMuY3JlYXRlU291cmNlTWFwU291cmNlKCd0ZXN0Lmh0bWwnLCAnYWJjXFxuZGVmXFxuZ2hpXFxuamtsXFxubW5vXFxucHFyJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gbmV3Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHByb2dyYW0gPSB0cy5jcmVhdGVQcm9ncmFtKFsndGVzdC50cyddLCB7c291cmNlTWFwOiB0cnVlfSwgaG9zdCk7XG4gICAgcHJvZ3JhbS5lbWl0KHNvdXJjZUZpbGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHthZnRlcjogW3RyYW5zZm9ybV19KTtcbiAgICAvLyBUaGUgZmlyc3QgdHdvIG1hcHBpbmdzIGluIHRoZSBzb3VyY2UgbWFwIHNob3VsZCBsb29rIGxpa2U6XG4gICAgLy8gWzAsMSw0LDBdIGNvbCAwID0+IHNvdXJjZSBmaWxlIDEsIHJvdyA0LCBjb2x1bW4gMClcbiAgICAvLyBbMSwwLDAsMF0gY29sIDEgPT4gc291cmNlIGZpbGUgMSwgcm93IDQsIGNvbHVtbiAwKVxuICAgIF90c1NvdXJjZU1hcEJ1ZzI5MzAwRml4ZWQgPSAvQUNJQSxDQUFBLy50ZXN0KHdyaXR0ZW5GaWxlc1sndGVzdC5qcy5tYXAnXSk7XG4gIH1cbiAgcmV0dXJuIF90c1NvdXJjZU1hcEJ1ZzI5MzAwRml4ZWQ7XG59Il19