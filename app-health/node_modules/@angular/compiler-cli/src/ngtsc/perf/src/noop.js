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
        define("@angular/compiler-cli/src/ngtsc/perf/src/noop", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOOP_PERF_RECORDER = {
        enabled: false,
        mark: function (name, node, category, detail) { },
        start: function (name, node, category, detail) { return 0; },
        stop: function (span) { },
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcGVyZi9zcmMvbm9vcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQU1VLFFBQUEsa0JBQWtCLEdBQWlCO1FBQzlDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsSUFBSSxFQUFFLFVBQUMsSUFBWSxFQUFFLElBQW9DLEVBQUUsUUFBaUIsRUFBRSxNQUFlLElBQzFFLENBQUM7UUFDcEIsS0FBSyxFQUFFLFVBQUMsSUFBWSxFQUFFLElBQW9DLEVBQUUsUUFBaUIsRUFBRSxNQUFlLElBQ3ZFLE9BQU8sQ0FBQyxDQUFDLENBQUEsQ0FBQztRQUNqQyxJQUFJLEVBQUUsVUFBQyxJQUFvQixJQUFZLENBQUM7S0FDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7UGVyZlJlY29yZGVyfSBmcm9tICcuL2FwaSc7XG5cbmV4cG9ydCBjb25zdCBOT09QX1BFUkZfUkVDT1JERVI6IFBlcmZSZWNvcmRlciA9IHtcbiAgZW5hYmxlZDogZmFsc2UsXG4gIG1hcms6IChuYW1lOiBzdHJpbmcsIG5vZGU6IHRzLlNvdXJjZUZpbGUgfCB0cy5EZWNsYXJhdGlvbiwgY2F0ZWdvcnk/OiBzdHJpbmcsIGRldGFpbD86IHN0cmluZyk6XG4gICAgICAgICAgICB2b2lkID0+IHt9LFxuICBzdGFydDogKG5hbWU6IHN0cmluZywgbm9kZTogdHMuU291cmNlRmlsZSB8IHRzLkRlY2xhcmF0aW9uLCBjYXRlZ29yeT86IHN0cmluZywgZGV0YWlsPzogc3RyaW5nKTpcbiAgICAgICAgICAgICBudW1iZXIgPT4geyByZXR1cm4gMDt9LFxuICBzdG9wOiAoc3BhbjogbnVtYmVyIHwgZmFsc2UpOiB2b2lkID0+IHt9LFxufTtcbiJdfQ==