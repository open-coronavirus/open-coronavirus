(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/perf/src/tracking", ["require", "exports", "fs", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/perf/src/clock"], factory);
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
    /// <reference types="node" />
    var fs = require("fs");
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var clock_1 = require("@angular/compiler-cli/src/ngtsc/perf/src/clock");
    var PerfTracker = /** @class */ (function () {
        function PerfTracker(zeroTime) {
            this.zeroTime = zeroTime;
            this.nextSpanId = 1;
            this.log = [];
            this.enabled = true;
        }
        PerfTracker.zeroedToNow = function () { return new PerfTracker(clock_1.mark()); };
        PerfTracker.prototype.mark = function (name, node, category, detail) {
            var msg = this.makeLogMessage(PerfLogEventType.MARK, name, node, category, detail, undefined);
            this.log.push(msg);
        };
        PerfTracker.prototype.start = function (name, node, category, detail) {
            var span = this.nextSpanId++;
            var msg = this.makeLogMessage(PerfLogEventType.SPAN_OPEN, name, node, category, detail, span);
            this.log.push(msg);
            return span;
        };
        PerfTracker.prototype.stop = function (span) {
            this.log.push({
                type: PerfLogEventType.SPAN_CLOSE,
                span: span,
                stamp: clock_1.timeSinceInMicros(this.zeroTime),
            });
        };
        PerfTracker.prototype.makeLogMessage = function (type, name, node, category, detail, span) {
            var msg = {
                type: type,
                name: name,
                stamp: clock_1.timeSinceInMicros(this.zeroTime),
            };
            if (category !== undefined) {
                msg.category = category;
            }
            if (detail !== undefined) {
                msg.detail = detail;
            }
            if (span !== undefined) {
                msg.span = span;
            }
            if (node !== undefined) {
                msg.file = node.getSourceFile().fileName;
                if (!ts.isSourceFile(node)) {
                    var name_1 = ts.getNameOfDeclaration(node);
                    if (name_1 !== undefined && ts.isIdentifier(name_1)) {
                        msg.declaration = name_1.text;
                    }
                }
            }
            return msg;
        };
        PerfTracker.prototype.asJson = function () { return this.log; };
        PerfTracker.prototype.serializeToFile = function (target, host) {
            var json = JSON.stringify(this.log, null, 2);
            if (target.startsWith('ts:')) {
                target = target.substr('ts:'.length);
                var outFile = file_system_1.resolve(host.getCurrentDirectory(), target);
                host.writeFile(outFile, json, false);
            }
            else {
                var outFile = file_system_1.resolve(host.getCurrentDirectory(), target);
                fs.writeFileSync(outFile, json);
            }
        };
        return PerfTracker;
    }());
    exports.PerfTracker = PerfTracker;
    var PerfLogEventType;
    (function (PerfLogEventType) {
        PerfLogEventType[PerfLogEventType["SPAN_OPEN"] = 0] = "SPAN_OPEN";
        PerfLogEventType[PerfLogEventType["SPAN_CLOSE"] = 1] = "SPAN_CLOSE";
        PerfLogEventType[PerfLogEventType["MARK"] = 2] = "MARK";
    })(PerfLogEventType = exports.PerfLogEventType || (exports.PerfLogEventType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3BlcmYvc3JjL3RyYWNraW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gsOEJBQThCO0lBQzlCLHVCQUF5QjtJQUN6QiwrQkFBaUM7SUFDakMsMkVBQTBDO0lBRTFDLHdFQUF3RDtJQUV4RDtRQU1FLHFCQUE0QixRQUFnQjtZQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1lBTHBDLGVBQVUsR0FBRyxDQUFDLENBQUM7WUFDZixRQUFHLEdBQW1CLEVBQUUsQ0FBQztZQUV4QixZQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXVCLENBQUM7UUFFekMsdUJBQVcsR0FBbEIsY0FBb0MsT0FBTyxJQUFJLFdBQVcsQ0FBQyxZQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyRSwwQkFBSSxHQUFKLFVBQUssSUFBWSxFQUFFLElBQW1DLEVBQUUsUUFBaUIsRUFBRSxNQUFlO1lBRXhGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNoRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBRUQsMkJBQUssR0FBTCxVQUFNLElBQVksRUFBRSxJQUFtQyxFQUFFLFFBQWlCLEVBQUUsTUFBZTtZQUV6RixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFR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QUpXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBSTNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJub2RlXCIgLz5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtyZXNvbHZlfSBmcm9tICcuLi8uLi9maWxlX3N5c3RlbSc7XG5pbXBvcnQge1BlcmZSZWNvcmRlcn0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtIclRpbWUsIG1hcmssIHRpbWVTaW5jZUluTWljcm9zfSBmcm9tICcuL2Nsb2NrJztcblxuZXhwb3J0IGNsYXNzIFBlcmZUcmFja2VyIGltcGxlbWVudHMgUGVyZlJlY29yZGVyIHtcbiAgcHJpdmF0ZSBuZXh0U3BhbklkID0gMTtcbiAgcHJpdmF0ZSBsb2c6IFBlcmZMb2dFdmVudFtdID0gW107XG5cbiAgcmVhZG9ubHkgZW5hYmxlZCA9IHRydWU7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHplcm9UaW1lOiBIclRpbWUpIHt9XG5cbiAgc3RhdGljIHplcm9lZFRvTm93KCk6IFBlcmZUcmFja2VyIHsgcmV0dXJuIG5ldyBQZXJmVHJhY2tlcihtYXJrKCkpOyB9XG5cbiAgbWFyayhuYW1lOiBzdHJpbmcsIG5vZGU/OiB0cy5Tb3VyY2VGaWxlfHRzLkRlY2xhcmF0aW9uLCBjYXRlZ29yeT86IHN0cmluZywgZGV0YWlsPzogc3RyaW5nKTpcbiAgICAgIHZvaWQge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMubWFrZUxvZ01lc3NhZ2UoUGVyZkxvZ0V2ZW50VHlwZS5NQVJLLCBuYW1lLCBub2RlLCBjYXRlZ29yeSwgZGV0YWlsLCB1bmRlZmluZWQpO1xuICAgIHRoaXMubG9nLnB1c2gobXNnKTtcbiAgfVxuXG4gIHN0YXJ0KG5hbWU6IHN0cmluZywgbm9kZT86IHRzLlNvdXJjZUZpbGV8dHMuRGVjbGFyYXRpb24sIGNhdGVnb3J5Pzogc3RyaW5nLCBkZXRhaWw/OiBzdHJpbmcpOlxuICAgICAgbnVtYmVyIHtcbiAgICBjb25zdCBzcGFuID0gdGhpcy5uZXh0U3BhbklkKys7XG4gICAgY29uc3QgbXNnID0gdGhpcy5tYWtlTG9nTWVzc2FnZShQZXJmTG9nRXZlbnRUeXBlLlNQQU5fT1BFTiwgbmFtZSwgbm9kZSwgY2F0ZWdvcnksIGRldGFpbCwgc3Bhbik7XG4gICAgdGhpcy5sb2cucHVzaChtc2cpO1xuICAgIHJldHVybiBzcGFuO1xuICB9XG5cbiAgc3RvcChzcGFuOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmxvZy5wdXNoKHtcbiAgICAgIHR5cGU6IFBlcmZMb2dFdmVudFR5cGUuU1BBTl9DTE9TRSxcbiAgICAgIHNwYW4sXG4gICAgICBzdGFtcDogdGltZVNpbmNlSW5NaWNyb3ModGhpcy56ZXJvVGltZSksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG1ha2VMb2dNZXNzYWdlKFxuICAgICAgdHlwZTogUGVyZkxvZ0V2ZW50VHlwZSwgbmFtZTogc3RyaW5nLCBub2RlOiB0cy5Tb3VyY2VGaWxlfHRzLkRlY2xhcmF0aW9ufHVuZGVmaW5lZCxcbiAgICAgIGNhdGVnb3J5OiBzdHJpbmd8dW5kZWZpbmVkLCBkZXRhaWw6IHN0cmluZ3x1bmRlZmluZWQsIHNwYW46IG51bWJlcnx1bmRlZmluZWQpOiBQZXJmTG9nRXZlbnQge1xuICAgIGNvbnN0IG1zZzogUGVyZkxvZ0V2ZW50ID0ge1xuICAgICAgdHlwZSxcbiAgICAgIG5hbWUsXG4gICAgICBzdGFtcDogdGltZVNpbmNlSW5NaWNyb3ModGhpcy56ZXJvVGltZSksXG4gICAgfTtcbiAgICBpZiAoY2F0ZWdvcnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbXNnLmNhdGVnb3J5ID0gY2F0ZWdvcnk7XG4gICAgfVxuICAgIGlmIChkZXRhaWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbXNnLmRldGFpbCA9IGRldGFpbDtcbiAgICB9XG4gICAgaWYgKHNwYW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbXNnLnNwYW4gPSBzcGFuO1xuICAgIH1cbiAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtc2cuZmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuICAgICAgaWYgKCF0cy5pc1NvdXJjZUZpbGUobm9kZSkpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRzLmdldE5hbWVPZkRlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICBpZiAobmFtZSAhPT0gdW5kZWZpbmVkICYmIHRzLmlzSWRlbnRpZmllcihuYW1lKSkge1xuICAgICAgICAgIG1zZy5kZWNsYXJhdGlvbiA9IG5hbWUudGV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbXNnO1xuICB9XG5cbiAgYXNKc29uKCk6IHVua25vd24geyByZXR1cm4gdGhpcy5sb2c7IH1cblxuICBzZXJpYWxpemVUb0ZpbGUodGFyZ2V0OiBzdHJpbmcsIGhvc3Q6IHRzLkNvbXBpbGVySG9zdCk6IHZvaWQge1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmxvZywgbnVsbCwgMik7XG5cbiAgICBpZiAodGFyZ2V0LnN0YXJ0c1dpdGgoJ3RzOicpKSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQuc3Vic3RyKCd0czonLmxlbmd0aCk7XG4gICAgICBjb25zdCBvdXRGaWxlID0gcmVzb2x2ZShob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKSwgdGFyZ2V0KTtcbiAgICAgIGhvc3Qud3JpdGVGaWxlKG91dEZpbGUsIGpzb24sIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3V0RmlsZSA9IHJlc29sdmUoaG9zdC5nZXRDdXJyZW50RGlyZWN0b3J5KCksIHRhcmdldCk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG91dEZpbGUsIGpzb24pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBlcmZMb2dFdmVudCB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHNwYW4/OiBudW1iZXI7XG4gIGZpbGU/OiBzdHJpbmc7XG4gIGRlY2xhcmF0aW9uPzogc3RyaW5nO1xuICB0eXBlOiBQZXJmTG9nRXZlbnRUeXBlO1xuICBjYXRlZ29yeT86IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICBzdGFtcDogbnVtYmVyO1xufVxuXG5leHBvcnQgZW51bSBQZXJmTG9nRXZlbnRUeXBlIHtcbiAgU1BBTl9PUEVOLFxuICBTUEFOX0NMT1NFLFxuICBNQVJLLFxufVxuIl19