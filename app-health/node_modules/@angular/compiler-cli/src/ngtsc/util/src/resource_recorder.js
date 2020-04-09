(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/util/src/resource_recorder", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NoopResourceDependencyRecorder = /** @class */ (function () {
        function NoopResourceDependencyRecorder() {
        }
        NoopResourceDependencyRecorder.prototype.recordResourceDependency = function () { };
        return NoopResourceDependencyRecorder;
    }());
    exports.NoopResourceDependencyRecorder = NoopResourceDependencyRecorder;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfcmVjb3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3V0aWwvc3JjL3Jlc291cmNlX3JlY29yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBaUJBO1FBQUE7UUFFQSxDQUFDO1FBREMsaUVBQXdCLEdBQXhCLGNBQWtDLENBQUM7UUFDckMscUNBQUM7SUFBRCxDQUFDLEFBRkQsSUFFQztJQUZZLHdFQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHRvIHJlY29yZCB3aGF0IHJlc291cmNlcyBhIHNvdXJjZSBmaWxlIGRlcGVuZHMgdXBvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZURlcGVuZGVuY3lSZWNvcmRlciB7XG4gIHJlY29yZFJlc291cmNlRGVwZW5kZW5jeShmaWxlOiB0cy5Tb3VyY2VGaWxlLCByZXNvdXJjZVBhdGg6IHN0cmluZyk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBOb29wUmVzb3VyY2VEZXBlbmRlbmN5UmVjb3JkZXIgaW1wbGVtZW50cyBSZXNvdXJjZURlcGVuZGVuY3lSZWNvcmRlciB7XG4gIHJlY29yZFJlc291cmNlRGVwZW5kZW5jeSgpOiB2b2lkIHt9XG59XG4iXX0=