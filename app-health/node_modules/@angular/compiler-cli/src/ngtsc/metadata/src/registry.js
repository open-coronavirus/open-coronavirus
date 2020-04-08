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
        define("@angular/compiler-cli/src/ngtsc/metadata/src/registry", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * A registry of directive, pipe, and module metadata for types defined in the current compilation
     * unit, which supports both reading and registering.
     */
    var LocalMetadataRegistry = /** @class */ (function () {
        function LocalMetadataRegistry() {
            this.directives = new Map();
            this.ngModules = new Map();
            this.pipes = new Map();
        }
        LocalMetadataRegistry.prototype.getDirectiveMetadata = function (ref) {
            return this.directives.has(ref.node) ? this.directives.get(ref.node) : null;
        };
        LocalMetadataRegistry.prototype.getNgModuleMetadata = function (ref) {
            return this.ngModules.has(ref.node) ? this.ngModules.get(ref.node) : null;
        };
        LocalMetadataRegistry.prototype.getPipeMetadata = function (ref) {
            return this.pipes.has(ref.node) ? this.pipes.get(ref.node) : null;
        };
        LocalMetadataRegistry.prototype.registerDirectiveMetadata = function (meta) { this.directives.set(meta.ref.node, meta); };
        LocalMetadataRegistry.prototype.registerNgModuleMetadata = function (meta) { this.ngModules.set(meta.ref.node, meta); };
        LocalMetadataRegistry.prototype.registerPipeMetadata = function (meta) { this.pipes.set(meta.ref.node, meta); };
        return LocalMetadataRegistry;
    }());
    exports.LocalMetadataRegistry = LocalMetadataRegistry;
    /**
     * A `MetadataRegistry` which registers metdata with multiple delegate `MetadataRegistry` instances.
     */
    var CompoundMetadataRegistry = /** @class */ (function () {
        function CompoundMetadataRegistry(registries) {
            this.registries = registries;
        }
        CompoundMetadataRegistry.prototype.registerDirectiveMetadata = function (meta) {
            var e_1, _a;
            try {
                for (var _b = tslib_1.__values(this.registries), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var registry = _c.value;
                    registry.registerDirectiveMetadata(meta);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        CompoundMetadataRegistry.prototype.registerNgModuleMetadata = function (meta) {
            var e_2, _a;
            try {
                for (var _b = tslib_1.__values(this.registries), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var registry = _c.value;
                    registry.registerNgModuleMetadata(meta);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        CompoundMetadataRegistry.prototype.registerPipeMetadata = function (meta) {
            var e_3, _a;
            try {
                for (var _b = tslib_1.__values(this.registries), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var registry = _c.value;
                    registry.registerPipeMetadata(meta);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        return CompoundMetadataRegistry;
    }());
    exports.CompoundMetadataRegistry = CompoundMetadataRegistry;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL21ldGFkYXRhL3NyYy9yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFPSDs7O09BR0c7SUFDSDtRQUFBO1lBQ1UsZUFBVSxHQUFHLElBQUksR0FBRyxFQUFtQyxDQUFDO1lBQ3hELGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztZQUN0RCxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFleEQsQ0FBQztRQWJDLG9EQUFvQixHQUFwQixVQUFxQixHQUFnQztZQUNuRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDaEYsQ0FBQztRQUNELG1EQUFtQixHQUFuQixVQUFvQixHQUFnQztZQUNsRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUUsQ0FBQztRQUNELCtDQUFlLEdBQWYsVUFBZ0IsR0FBZ0M7WUFDOUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3RFLENBQUM7UUFFRCx5REFBeUIsR0FBekIsVUFBMEIsSUFBbUIsSUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEcsd0RBQXdCLEdBQXhCLFVBQXlCLElBQWtCLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9GLG9EQUFvQixHQUFwQixVQUFxQixJQUFjLElBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLDRCQUFDO0lBQUQsQ0FBQyxBQWxCRCxJQWtCQztJQWxCWSxzREFBcUI7SUFvQmxDOztPQUVHO0lBQ0g7UUFDRSxrQ0FBb0IsVUFBOEI7WUFBOUIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFBRyxDQUFDO1FBRXRELDREQUF5QixHQUF6QixVQUEwQixJQUFtQjs7O2dCQUMzQyxLQUF1QixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQSxnQkFBQSw0QkFBRTtvQkFBbkMsSUFBTSxRQUFRLFdBQUE7b0JBQ2pCLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDMUM7Ozs7Ozs7OztRQUNILENBQUM7UUFFRCwyREFBd0IsR0FBeEIsVUFBeUIsSUFBa0I7OztnQkFDekMsS0FBdUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7b0JBQW5DLElBQU0sUUFBUSxXQUFBO29CQUNqQixRQUFRLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pDOzs7Ozs7Ozs7UUFDSCxDQUFDO1FBRUQsdURBQW9CLEdBQXBCLFVBQXFCLElBQWM7OztnQkFDakMsS0FBdUIsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxVQUFVLENBQUEsZ0JBQUEsNEJBQUU7b0JBQW5DLElBQU0sUUFBUSxXQUFBO29CQUNqQixRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3JDOzs7Ozs7Ozs7UUFDSCxDQUFDO1FBQ0gsK0JBQUM7SUFBRCxDQUFDLEFBcEJELElBb0JDO0lBcEJZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSZWZlcmVuY2V9IGZyb20gJy4uLy4uL2ltcG9ydHMnO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9ufSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcblxuaW1wb3J0IHtEaXJlY3RpdmVNZXRhLCBNZXRhZGF0YVJlYWRlciwgTWV0YWRhdGFSZWdpc3RyeSwgTmdNb2R1bGVNZXRhLCBQaXBlTWV0YX0gZnJvbSAnLi9hcGknO1xuXG4vKipcbiAqIEEgcmVnaXN0cnkgb2YgZGlyZWN0aXZlLCBwaXBlLCBhbmQgbW9kdWxlIG1ldGFkYXRhIGZvciB0eXBlcyBkZWZpbmVkIGluIHRoZSBjdXJyZW50IGNvbXBpbGF0aW9uXG4gKiB1bml0LCB3aGljaCBzdXBwb3J0cyBib3RoIHJlYWRpbmcgYW5kIHJlZ2lzdGVyaW5nLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxNZXRhZGF0YVJlZ2lzdHJ5IGltcGxlbWVudHMgTWV0YWRhdGFSZWdpc3RyeSwgTWV0YWRhdGFSZWFkZXIge1xuICBwcml2YXRlIGRpcmVjdGl2ZXMgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIERpcmVjdGl2ZU1ldGE+KCk7XG4gIHByaXZhdGUgbmdNb2R1bGVzID0gbmV3IE1hcDxDbGFzc0RlY2xhcmF0aW9uLCBOZ01vZHVsZU1ldGE+KCk7XG4gIHByaXZhdGUgcGlwZXMgPSBuZXcgTWFwPENsYXNzRGVjbGFyYXRpb24sIFBpcGVNZXRhPigpO1xuXG4gIGdldERpcmVjdGl2ZU1ldGFkYXRhKHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+KTogRGlyZWN0aXZlTWV0YXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3RpdmVzLmhhcyhyZWYubm9kZSkgPyB0aGlzLmRpcmVjdGl2ZXMuZ2V0KHJlZi5ub2RlKSAhIDogbnVsbDtcbiAgfVxuICBnZXROZ01vZHVsZU1ldGFkYXRhKHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+KTogTmdNb2R1bGVNZXRhfG51bGwge1xuICAgIHJldHVybiB0aGlzLm5nTW9kdWxlcy5oYXMocmVmLm5vZGUpID8gdGhpcy5uZ01vZHVsZXMuZ2V0KHJlZi5ub2RlKSAhIDogbnVsbDtcbiAgfVxuICBnZXRQaXBlTWV0YWRhdGEocmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj4pOiBQaXBlTWV0YXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5waXBlcy5oYXMocmVmLm5vZGUpID8gdGhpcy5waXBlcy5nZXQocmVmLm5vZGUpICEgOiBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJEaXJlY3RpdmVNZXRhZGF0YShtZXRhOiBEaXJlY3RpdmVNZXRhKTogdm9pZCB7IHRoaXMuZGlyZWN0aXZlcy5zZXQobWV0YS5yZWYubm9kZSwgbWV0YSk7IH1cbiAgcmVnaXN0ZXJOZ01vZHVsZU1ldGFkYXRhKG1ldGE6IE5nTW9kdWxlTWV0YSk6IHZvaWQgeyB0aGlzLm5nTW9kdWxlcy5zZXQobWV0YS5yZWYubm9kZSwgbWV0YSk7IH1cbiAgcmVnaXN0ZXJQaXBlTWV0YWRhdGEobWV0YTogUGlwZU1ldGEpOiB2b2lkIHsgdGhpcy5waXBlcy5zZXQobWV0YS5yZWYubm9kZSwgbWV0YSk7IH1cbn1cblxuLyoqXG4gKiBBIGBNZXRhZGF0YVJlZ2lzdHJ5YCB3aGljaCByZWdpc3RlcnMgbWV0ZGF0YSB3aXRoIG11bHRpcGxlIGRlbGVnYXRlIGBNZXRhZGF0YVJlZ2lzdHJ5YCBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3VuZE1ldGFkYXRhUmVnaXN0cnkgaW1wbGVtZW50cyBNZXRhZGF0YVJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWdpc3RyaWVzOiBNZXRhZGF0YVJlZ2lzdHJ5W10pIHt9XG5cbiAgcmVnaXN0ZXJEaXJlY3RpdmVNZXRhZGF0YShtZXRhOiBEaXJlY3RpdmVNZXRhKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCByZWdpc3RyeSBvZiB0aGlzLnJlZ2lzdHJpZXMpIHtcbiAgICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyRGlyZWN0aXZlTWV0YWRhdGEobWV0YSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJOZ01vZHVsZU1ldGFkYXRhKG1ldGE6IE5nTW9kdWxlTWV0YSk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgcmVnaXN0cnkgb2YgdGhpcy5yZWdpc3RyaWVzKSB7XG4gICAgICByZWdpc3RyeS5yZWdpc3Rlck5nTW9kdWxlTWV0YWRhdGEobWV0YSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJQaXBlTWV0YWRhdGEobWV0YTogUGlwZU1ldGEpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IHJlZ2lzdHJ5IG9mIHRoaXMucmVnaXN0cmllcykge1xuICAgICAgcmVnaXN0cnkucmVnaXN0ZXJQaXBlTWV0YWRhdGEobWV0YSk7XG4gICAgfVxuICB9XG59XG4iXX0=