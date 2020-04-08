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
        define("@angular/localize/src/tools/src/translate/translation_files/message_serialization/message_renderer", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function stripInterpolationMarkers(interpolation) {
        return interpolation.replace(/^\{\{/, '').replace(/}}$/, '');
    }
    exports.stripInterpolationMarkers = stripInterpolationMarkers;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL3RyYW5zbGF0aW9uX2ZpbGVzL21lc3NhZ2Vfc2VyaWFsaXphdGlvbi9tZXNzYWdlX3JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBZ0JILFNBQWdCLHlCQUF5QixDQUFDLGFBQXFCO1FBQzdELE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRkQsOERBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZVJlbmRlcmVyPFQ+IHtcbiAgbWVzc2FnZTogVDtcbiAgc3RhcnRSZW5kZXIoKTogdm9pZDtcbiAgZW5kUmVuZGVyKCk6IHZvaWQ7XG4gIHRleHQodGV4dDogc3RyaW5nKTogdm9pZDtcbiAgcGxhY2Vob2xkZXIobmFtZTogc3RyaW5nLCBib2R5OiBzdHJpbmd8dW5kZWZpbmVkKTogdm9pZDtcbiAgc3RhcnRQbGFjZWhvbGRlcihuYW1lOiBzdHJpbmcpOiB2b2lkO1xuICBjbG9zZVBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZyk6IHZvaWQ7XG4gIHN0YXJ0Q29udGFpbmVyKCk6IHZvaWQ7XG4gIGNsb3NlQ29udGFpbmVyKCk6IHZvaWQ7XG4gIHN0YXJ0SWN1KCk6IHZvaWQ7XG4gIGVuZEljdSgpOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBJbnRlcnBvbGF0aW9uTWFya2VycyhpbnRlcnBvbGF0aW9uOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gaW50ZXJwb2xhdGlvbi5yZXBsYWNlKC9eXFx7XFx7LywgJycpLnJlcGxhY2UoL319JC8sICcnKTtcbn1cbiJdfQ==