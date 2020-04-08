(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/output_path", ["require", "exports", "tslib", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var path_1 = require("path");
    /**
     * Create a function that will compute the absolute path to where a translated file should be
     * written.
     *
     * The special `{{LOCALE}}` marker will be replaced with the locale code of the current translation.
     * @param outputFolder An absolute path to the folder containing this set of translations.
     */
    function getOutputPathFn(outputFolder) {
        var _a = tslib_1.__read(outputFolder.split('{{LOCALE}}'), 2), pre = _a[0], post = _a[1];
        return post === undefined ? function (_locale, relativePath) { return path_1.join(pre, relativePath); } :
            function (locale, relativePath) { return path_1.join(pre + locale + post, relativePath); };
    }
    exports.getOutputPathFn = getOutputPathFn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X3BhdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9vdXRwdXRfcGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCw2QkFBMEI7SUFJMUI7Ozs7OztPQU1HO0lBQ0gsU0FBZ0IsZUFBZSxDQUFDLFlBQW9CO1FBQzVDLElBQUEsd0RBQThDLEVBQTdDLFdBQUcsRUFBRSxZQUF3QyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBQyxPQUFPLEVBQUUsWUFBWSxJQUFLLE9BQUEsV0FBSSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1lBQ3BELFVBQUMsTUFBTSxFQUFFLFlBQVksSUFBSyxPQUFBLFdBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksRUFBRSxZQUFZLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQztJQUNoRyxDQUFDO0lBSkQsMENBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2pvaW59IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE91dHB1dFBhdGhGbiB7IChsb2NhbGU6IHN0cmluZywgcmVsYXRpdmVQYXRoOiBzdHJpbmcpOiBzdHJpbmc7IH1cblxuLyoqXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHdpbGwgY29tcHV0ZSB0aGUgYWJzb2x1dGUgcGF0aCB0byB3aGVyZSBhIHRyYW5zbGF0ZWQgZmlsZSBzaG91bGQgYmVcbiAqIHdyaXR0ZW4uXG4gKlxuICogVGhlIHNwZWNpYWwgYHt7TE9DQUxFfX1gIG1hcmtlciB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIGxvY2FsZSBjb2RlIG9mIHRoZSBjdXJyZW50IHRyYW5zbGF0aW9uLlxuICogQHBhcmFtIG91dHB1dEZvbGRlciBBbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBmb2xkZXIgY29udGFpbmluZyB0aGlzIHNldCBvZiB0cmFuc2xhdGlvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXRQYXRoRm4ob3V0cHV0Rm9sZGVyOiBzdHJpbmcpOiBPdXRwdXRQYXRoRm4ge1xuICBjb25zdCBbcHJlLCBwb3N0XSA9IG91dHB1dEZvbGRlci5zcGxpdCgne3tMT0NBTEV9fScpO1xuICByZXR1cm4gcG9zdCA9PT0gdW5kZWZpbmVkID8gKF9sb2NhbGUsIHJlbGF0aXZlUGF0aCkgPT4gam9pbihwcmUsIHJlbGF0aXZlUGF0aCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxvY2FsZSwgcmVsYXRpdmVQYXRoKSA9PiBqb2luKHByZSArIGxvY2FsZSArIHBvc3QsIHJlbGF0aXZlUGF0aCk7XG59XG4iXX0=