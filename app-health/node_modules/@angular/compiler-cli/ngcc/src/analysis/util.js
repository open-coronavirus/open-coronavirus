(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/analysis/util", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/transform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    function isWithinPackage(packagePath, sourceFile) {
        return !file_system_1.relative(packagePath, file_system_1.absoluteFromSourceFile(sourceFile)).startsWith('..');
    }
    exports.isWithinPackage = isWithinPackage;
    function analyzeDecorators(symbol, decorators, handlers) {
        var e_1, _a, e_2, _b;
        var declaration = symbol.valueDeclaration;
        var matchingHandlers = handlers
            .map(function (handler) {
            var detected = handler.detect(declaration, decorators);
            return { handler: handler, detected: detected };
        })
            .filter(isMatchingHandler);
        if (matchingHandlers.length === 0) {
            return null;
        }
        var detections = [];
        var hasWeakHandler = false;
        var hasNonWeakHandler = false;
        var hasPrimaryHandler = false;
        try {
            for (var matchingHandlers_1 = tslib_1.__values(matchingHandlers), matchingHandlers_1_1 = matchingHandlers_1.next(); !matchingHandlers_1_1.done; matchingHandlers_1_1 = matchingHandlers_1.next()) {
                var _c = matchingHandlers_1_1.value, handler = _c.handler, detected = _c.detected;
                if (hasNonWeakHandler && handler.precedence === transform_1.HandlerPrecedence.WEAK) {
                    continue;
                }
                else if (hasWeakHandler && handler.precedence !== transform_1.HandlerPrecedence.WEAK) {
                    // Clear all the WEAK handlers from the list of matches.
                    detections.length = 0;
                }
                if (hasPrimaryHandler && handler.precedence === transform_1.HandlerPrecedence.PRIMARY) {
                    throw new Error("TODO.Diagnostic: Class has multiple incompatible Angular decorators.");
                }
                detections.push({ handler: handler, detected: detected });
                if (handler.precedence === transform_1.HandlerPrecedence.WEAK) {
                    hasWeakHandler = true;
                }
                else if (handler.precedence === transform_1.HandlerPrecedence.SHARED) {
                    hasNonWeakHandler = true;
                }
                else if (handler.precedence === transform_1.HandlerPrecedence.PRIMARY) {
                    hasNonWeakHandler = true;
                    hasPrimaryHandler = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (matchingHandlers_1_1 && !matchingHandlers_1_1.done && (_a = matchingHandlers_1.return)) _a.call(matchingHandlers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var matches = [];
        var allDiagnostics = [];
        try {
            for (var detections_1 = tslib_1.__values(detections), detections_1_1 = detections_1.next(); !detections_1_1.done; detections_1_1 = detections_1.next()) {
                var _d = detections_1_1.value, handler = _d.handler, detected = _d.detected;
                var _e = handler.analyze(declaration, detected.metadata), analysis = _e.analysis, diagnostics = _e.diagnostics;
                if (diagnostics !== undefined) {
                    allDiagnostics.push.apply(allDiagnostics, tslib_1.__spread(diagnostics));
                }
                matches.push({ handler: handler, analysis: analysis });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (detections_1_1 && !detections_1_1.done && (_b = detections_1.return)) _b.call(detections_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return {
            name: symbol.name,
            declaration: declaration,
            decorators: decorators,
            matches: matches,
            diagnostics: allDiagnostics.length > 0 ? allDiagnostics : undefined
        };
    }
    exports.analyzeDecorators = analyzeDecorators;
    function isMatchingHandler(handler) {
        return !!handler.detected;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9hbmFseXNpcy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVFBLDJFQUFnRztJQUVoRyx1RUFBK0Y7SUFHL0YsU0FBZ0IsZUFBZSxDQUFDLFdBQTJCLEVBQUUsVUFBeUI7UUFDcEYsT0FBTyxDQUFDLHNCQUFRLENBQUMsV0FBVyxFQUFFLG9DQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFGRCwwQ0FFQztJQUVELFNBQWdCLGlCQUFpQixDQUM3QixNQUFtQixFQUFFLFVBQThCLEVBQ25ELFFBQXNDOztRQUN4QyxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDNUMsSUFBTSxnQkFBZ0IsR0FBRyxRQUFRO2FBQ0gsR0FBRyxDQUFDLFVBQUEsT0FBTztZQUNWLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3pELE9BQU8sRUFBQyxPQUFPLFNBQUEsRUFBRSxRQUFRLFVBQUEsRUFBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRXhELElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBTSxVQUFVLEdBQXlFLEVBQUUsQ0FBQztRQUM1RixJQUFJLGNBQWMsR0FBWSxLQUFLLENBQUM7UUFDcEMsSUFBSSxpQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFDdkMsSUFBSSxpQkFBaUIsR0FBWSxLQUFLLENBQUM7O1lBRXZDLEtBQWtDLElBQUEscUJBQUEsaUJBQUEsZ0JBQWdCLENBQUEsa0RBQUEsZ0ZBQUU7Z0JBQXpDLElBQUEsK0JBQW1CLEVBQWxCLG9CQUFPLEVBQUUsc0JBQVE7Z0JBQzNCLElBQUksaUJBQWlCLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyw2QkFBaUIsQ0FBQyxJQUFJLEVBQUU7b0JBQ3RFLFNBQVM7aUJBQ1Y7cUJBQU0sSUFBSSxjQUFjLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyw2QkFBaUIsQ0FBQyxJQUFJLEVBQUU7b0JBQzFFLHdEQUF3RDtvQkFDeEQsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELElBQUksaUJBQWlCLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyw2QkFBaUIsQ0FBQyxPQUFPLEVBQUU7b0JBQ3pFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztpQkFDekY7Z0JBRUQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sU0FBQSxFQUFFLFFBQVEsVUFBQSxFQUFDLENBQUMsQ0FBQztnQkFDckMsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLDZCQUFpQixDQUFDLElBQUksRUFBRTtvQkFDakQsY0FBYyxHQUFHLElBQUksQ0FBQztpQkFDdkI7cUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLDZCQUFpQixDQUFDLE1BQU0sRUFBRTtvQkFDMUQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO2lCQUMxQjtxQkFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEtBQUssNkJBQWlCLENBQUMsT0FBTyxFQUFFO29CQUMzRCxpQkFBaUIsR0FBRyxJQUFJLENBQUM7b0JBQ3pCLGlCQUFpQixHQUFHLElBQUksQ0FBQztpQkFDMUI7YUFDRjs7Ozs7Ozs7O1FBRUQsSUFBTSxPQUFPLEdBQTJELEVBQUUsQ0FBQztRQUMzRSxJQUFNLGNBQWMsR0FBb0IsRUFBRSxDQUFDOztZQUMzQyxLQUFrQyxJQUFBLGVBQUEsaUJBQUEsVUFBVSxDQUFBLHNDQUFBLDhEQUFFO2dCQUFuQyxJQUFBLHlCQUFtQixFQUFsQixvQkFBTyxFQUFFLHNCQUFRO2dCQUNyQixJQUFBLG9EQUF5RSxFQUF4RSxzQkFBUSxFQUFFLDRCQUE4RCxDQUFDO2dCQUNoRixJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7b0JBQzdCLGNBQWMsQ0FBQyxJQUFJLE9BQW5CLGNBQWMsbUJBQVMsV0FBVyxHQUFFO2lCQUNyQztnQkFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxTQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUMsQ0FBQyxDQUFDO2FBQ25DOzs7Ozs7Ozs7UUFDRCxPQUFPO1lBQ0wsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLFdBQVcsYUFBQTtZQUNYLFVBQVUsWUFBQTtZQUNWLE9BQU8sU0FBQTtZQUNQLFdBQVcsRUFBRSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQ3BFLENBQUM7SUFDSixDQUFDO0lBekRELDhDQXlEQztJQUVELFNBQVMsaUJBQWlCLENBQU8sT0FBdUM7UUFFdEUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUM1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlLCByZWxhdGl2ZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL2ZpbGVfc3lzdGVtJztcbmltcG9ydCB7Q2xhc3NTeW1ib2wsIERlY29yYXRvcn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtEZWNvcmF0b3JIYW5kbGVyLCBEZXRlY3RSZXN1bHQsIEhhbmRsZXJQcmVjZWRlbmNlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvdHJhbnNmb3JtJztcbmltcG9ydCB7QW5hbHl6ZWRDbGFzcywgTWF0Y2hpbmdIYW5kbGVyfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2l0aGluUGFja2FnZShwYWNrYWdlUGF0aDogQWJzb2x1dGVGc1BhdGgsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBib29sZWFuIHtcbiAgcmV0dXJuICFyZWxhdGl2ZShwYWNrYWdlUGF0aCwgYWJzb2x1dGVGcm9tU291cmNlRmlsZShzb3VyY2VGaWxlKSkuc3RhcnRzV2l0aCgnLi4nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFuYWx5emVEZWNvcmF0b3JzKFxuICAgIHN5bWJvbDogQ2xhc3NTeW1ib2wsIGRlY29yYXRvcnM6IERlY29yYXRvcltdIHwgbnVsbCxcbiAgICBoYW5kbGVyczogRGVjb3JhdG9ySGFuZGxlcjxhbnksIGFueT5bXSk6IEFuYWx5emVkQ2xhc3N8bnVsbCB7XG4gIGNvbnN0IGRlY2xhcmF0aW9uID0gc3ltYm9sLnZhbHVlRGVjbGFyYXRpb247XG4gIGNvbnN0IG1hdGNoaW5nSGFuZGxlcnMgPSBoYW5kbGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoaGFuZGxlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXRlY3RlZCA9IGhhbmRsZXIuZGV0ZWN0KGRlY2xhcmF0aW9uLCBkZWNvcmF0b3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aGFuZGxlciwgZGV0ZWN0ZWR9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpc01hdGNoaW5nSGFuZGxlcik7XG5cbiAgaWYgKG1hdGNoaW5nSGFuZGxlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZGV0ZWN0aW9uczoge2hhbmRsZXI6IERlY29yYXRvckhhbmRsZXI8YW55LCBhbnk+LCBkZXRlY3RlZDogRGV0ZWN0UmVzdWx0PGFueT59W10gPSBbXTtcbiAgbGV0IGhhc1dlYWtIYW5kbGVyOiBib29sZWFuID0gZmFsc2U7XG4gIGxldCBoYXNOb25XZWFrSGFuZGxlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBsZXQgaGFzUHJpbWFyeUhhbmRsZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IHtoYW5kbGVyLCBkZXRlY3RlZH0gb2YgbWF0Y2hpbmdIYW5kbGVycykge1xuICAgIGlmIChoYXNOb25XZWFrSGFuZGxlciAmJiBoYW5kbGVyLnByZWNlZGVuY2UgPT09IEhhbmRsZXJQcmVjZWRlbmNlLldFQUspIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAoaGFzV2Vha0hhbmRsZXIgJiYgaGFuZGxlci5wcmVjZWRlbmNlICE9PSBIYW5kbGVyUHJlY2VkZW5jZS5XRUFLKSB7XG4gICAgICAvLyBDbGVhciBhbGwgdGhlIFdFQUsgaGFuZGxlcnMgZnJvbSB0aGUgbGlzdCBvZiBtYXRjaGVzLlxuICAgICAgZGV0ZWN0aW9ucy5sZW5ndGggPSAwO1xuICAgIH1cbiAgICBpZiAoaGFzUHJpbWFyeUhhbmRsZXIgJiYgaGFuZGxlci5wcmVjZWRlbmNlID09PSBIYW5kbGVyUHJlY2VkZW5jZS5QUklNQVJZKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRPRE8uRGlhZ25vc3RpYzogQ2xhc3MgaGFzIG11bHRpcGxlIGluY29tcGF0aWJsZSBBbmd1bGFyIGRlY29yYXRvcnMuYCk7XG4gICAgfVxuXG4gICAgZGV0ZWN0aW9ucy5wdXNoKHtoYW5kbGVyLCBkZXRlY3RlZH0pO1xuICAgIGlmIChoYW5kbGVyLnByZWNlZGVuY2UgPT09IEhhbmRsZXJQcmVjZWRlbmNlLldFQUspIHtcbiAgICAgIGhhc1dlYWtIYW5kbGVyID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIucHJlY2VkZW5jZSA9PT0gSGFuZGxlclByZWNlZGVuY2UuU0hBUkVEKSB7XG4gICAgICBoYXNOb25XZWFrSGFuZGxlciA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVyLnByZWNlZGVuY2UgPT09IEhhbmRsZXJQcmVjZWRlbmNlLlBSSU1BUlkpIHtcbiAgICAgIGhhc05vbldlYWtIYW5kbGVyID0gdHJ1ZTtcbiAgICAgIGhhc1ByaW1hcnlIYW5kbGVyID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtYXRjaGVzOiB7aGFuZGxlcjogRGVjb3JhdG9ySGFuZGxlcjxhbnksIGFueT4sIGFuYWx5c2lzOiBhbnl9W10gPSBbXTtcbiAgY29uc3QgYWxsRGlhZ25vc3RpY3M6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuICBmb3IgKGNvbnN0IHtoYW5kbGVyLCBkZXRlY3RlZH0gb2YgZGV0ZWN0aW9ucykge1xuICAgIGNvbnN0IHthbmFseXNpcywgZGlhZ25vc3RpY3N9ID0gaGFuZGxlci5hbmFseXplKGRlY2xhcmF0aW9uLCBkZXRlY3RlZC5tZXRhZGF0YSk7XG4gICAgaWYgKGRpYWdub3N0aWNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFsbERpYWdub3N0aWNzLnB1c2goLi4uZGlhZ25vc3RpY3MpO1xuICAgIH1cbiAgICBtYXRjaGVzLnB1c2goe2hhbmRsZXIsIGFuYWx5c2lzfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBzeW1ib2wubmFtZSxcbiAgICBkZWNsYXJhdGlvbixcbiAgICBkZWNvcmF0b3JzLFxuICAgIG1hdGNoZXMsXG4gICAgZGlhZ25vc3RpY3M6IGFsbERpYWdub3N0aWNzLmxlbmd0aCA+IDAgPyBhbGxEaWFnbm9zdGljcyA6IHVuZGVmaW5lZFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc01hdGNoaW5nSGFuZGxlcjxBLCBNPihoYW5kbGVyOiBQYXJ0aWFsPE1hdGNoaW5nSGFuZGxlcjxBLCBNPj4pOlxuICAgIGhhbmRsZXIgaXMgTWF0Y2hpbmdIYW5kbGVyPEEsIE0+IHtcbiAgcmV0dXJuICEhaGFuZGxlci5kZXRlY3RlZDtcbn1cbiJdfQ==