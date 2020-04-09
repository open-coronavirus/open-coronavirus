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
        define("@angular/compiler-cli/src/ngtsc/metadata/src/inheritance", ["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * Given a reference to a directive, return a flattened version of its `DirectiveMeta` metadata
     * which includes metadata from its entire inheritance chain.
     *
     * The returned `DirectiveMeta` will either have `baseClass: null` if the inheritance chain could be
     * fully resolved, or `baseClass: 'dynamic'` if the inheritance chain could not be completely
     * followed.
     */
    function flattenInheritedDirectiveMetadata(reader, dir) {
        var topMeta = reader.getDirectiveMetadata(dir);
        if (topMeta === null) {
            throw new Error("Metadata not found for directive: " + dir.debugName);
        }
        var inputs = {};
        var outputs = {};
        var isDynamic = false;
        var addMetadata = function (meta) {
            if (meta.baseClass === 'dynamic') {
                isDynamic = true;
            }
            else if (meta.baseClass !== null) {
                var baseMeta = reader.getDirectiveMetadata(meta.baseClass);
                if (baseMeta !== null) {
                    addMetadata(baseMeta);
                }
                else {
                    // Missing metadata for the base class means it's effectively dynamic.
                    isDynamic = true;
                }
            }
            inputs = tslib_1.__assign({}, inputs, meta.inputs);
            outputs = tslib_1.__assign({}, outputs, meta.outputs);
        };
        addMetadata(topMeta);
        return tslib_1.__assign({}, topMeta, { inputs: inputs,
            outputs: outputs, baseClass: isDynamic ? 'dynamic' : null });
    }
    exports.flattenInheritedDirectiveMetadata = flattenInheritedDirectiveMetadata;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5oZXJpdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL21ldGFkYXRhL3NyYy9pbmhlcml0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFNSDs7Ozs7OztPQU9HO0lBQ0gsU0FBZ0IsaUNBQWlDLENBQzdDLE1BQXNCLEVBQUUsR0FBZ0M7UUFDMUQsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUFxQyxHQUFHLENBQUMsU0FBVyxDQUFDLENBQUM7U0FDdkU7UUFFRCxJQUFJLE1BQU0sR0FBK0MsRUFBRSxDQUFDO1FBQzVELElBQUksT0FBTyxHQUE0QixFQUFFLENBQUM7UUFDMUMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBbUI7WUFDdEMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDaEMsU0FBUyxHQUFHLElBQUksQ0FBQzthQUNsQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUNsQyxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7b0JBQ3JCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdkI7cUJBQU07b0JBQ0wsc0VBQXNFO29CQUN0RSxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjthQUNGO1lBQ0QsTUFBTSx3QkFBTyxNQUFNLEVBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sd0JBQU8sT0FBTyxFQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUM7UUFFRixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckIsNEJBQ0ssT0FBTyxJQUNWLE1BQU0sUUFBQTtZQUNOLE9BQU8sU0FBQSxFQUNQLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUN2QztJQUNKLENBQUM7SUFuQ0QsOEVBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0RpcmVjdGl2ZU1ldGEsIE1ldGFkYXRhUmVhZGVyfSBmcm9tICcuLi8uLi9tZXRhZGF0YSc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG4vKipcbiAqIEdpdmVuIGEgcmVmZXJlbmNlIHRvIGEgZGlyZWN0aXZlLCByZXR1cm4gYSBmbGF0dGVuZWQgdmVyc2lvbiBvZiBpdHMgYERpcmVjdGl2ZU1ldGFgIG1ldGFkYXRhXG4gKiB3aGljaCBpbmNsdWRlcyBtZXRhZGF0YSBmcm9tIGl0cyBlbnRpcmUgaW5oZXJpdGFuY2UgY2hhaW4uXG4gKlxuICogVGhlIHJldHVybmVkIGBEaXJlY3RpdmVNZXRhYCB3aWxsIGVpdGhlciBoYXZlIGBiYXNlQ2xhc3M6IG51bGxgIGlmIHRoZSBpbmhlcml0YW5jZSBjaGFpbiBjb3VsZCBiZVxuICogZnVsbHkgcmVzb2x2ZWQsIG9yIGBiYXNlQ2xhc3M6ICdkeW5hbWljJ2AgaWYgdGhlIGluaGVyaXRhbmNlIGNoYWluIGNvdWxkIG5vdCBiZSBjb21wbGV0ZWx5XG4gKiBmb2xsb3dlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5Jbmhlcml0ZWREaXJlY3RpdmVNZXRhZGF0YShcbiAgICByZWFkZXI6IE1ldGFkYXRhUmVhZGVyLCBkaXI6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPik6IERpcmVjdGl2ZU1ldGEge1xuICBjb25zdCB0b3BNZXRhID0gcmVhZGVyLmdldERpcmVjdGl2ZU1ldGFkYXRhKGRpcik7XG4gIGlmICh0b3BNZXRhID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBNZXRhZGF0YSBub3QgZm91bmQgZm9yIGRpcmVjdGl2ZTogJHtkaXIuZGVidWdOYW1lfWApO1xuICB9XG5cbiAgbGV0IGlucHV0czoge1trZXk6IHN0cmluZ106IHN0cmluZyB8IFtzdHJpbmcsIHN0cmluZ119ID0ge307XG4gIGxldCBvdXRwdXRzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBsZXQgaXNEeW5hbWljID0gZmFsc2U7XG5cbiAgY29uc3QgYWRkTWV0YWRhdGEgPSAobWV0YTogRGlyZWN0aXZlTWV0YSk6IHZvaWQgPT4ge1xuICAgIGlmIChtZXRhLmJhc2VDbGFzcyA9PT0gJ2R5bmFtaWMnKSB7XG4gICAgICBpc0R5bmFtaWMgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAobWV0YS5iYXNlQ2xhc3MgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGJhc2VNZXRhID0gcmVhZGVyLmdldERpcmVjdGl2ZU1ldGFkYXRhKG1ldGEuYmFzZUNsYXNzKTtcbiAgICAgIGlmIChiYXNlTWV0YSAhPT0gbnVsbCkge1xuICAgICAgICBhZGRNZXRhZGF0YShiYXNlTWV0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBNaXNzaW5nIG1ldGFkYXRhIGZvciB0aGUgYmFzZSBjbGFzcyBtZWFucyBpdCdzIGVmZmVjdGl2ZWx5IGR5bmFtaWMuXG4gICAgICAgIGlzRHluYW1pYyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlucHV0cyA9IHsuLi5pbnB1dHMsIC4uLm1ldGEuaW5wdXRzfTtcbiAgICBvdXRwdXRzID0gey4uLm91dHB1dHMsIC4uLm1ldGEub3V0cHV0c307XG4gIH07XG5cbiAgYWRkTWV0YWRhdGEodG9wTWV0YSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi50b3BNZXRhLFxuICAgIGlucHV0cyxcbiAgICBvdXRwdXRzLFxuICAgIGJhc2VDbGFzczogaXNEeW5hbWljID8gJ2R5bmFtaWMnIDogbnVsbCxcbiAgfTtcbn1cbiJdfQ==