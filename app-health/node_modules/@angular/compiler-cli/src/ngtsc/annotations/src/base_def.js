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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/base_def", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/annotations/src/directive", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var directive_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/directive");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    function containsNgTopLevelDecorator(decorators, isCore) {
        if (!decorators) {
            return false;
        }
        return decorators.some(function (decorator) { return util_1.isAngularDecorator(decorator, 'Component', isCore) ||
            util_1.isAngularDecorator(decorator, 'Directive', isCore) ||
            util_1.isAngularDecorator(decorator, 'NgModule', isCore); });
    }
    var BaseDefDecoratorHandler = /** @class */ (function () {
        function BaseDefDecoratorHandler(reflector, evaluator, isCore) {
            this.reflector = reflector;
            this.evaluator = evaluator;
            this.isCore = isCore;
            this.precedence = transform_1.HandlerPrecedence.WEAK;
        }
        BaseDefDecoratorHandler.prototype.detect = function (node, decorators) {
            var _this = this;
            if (containsNgTopLevelDecorator(decorators, this.isCore)) {
                // If the class is already decorated by @Component or @Directive let that
                // DecoratorHandler handle this. BaseDef is unnecessary.
                return undefined;
            }
            var result = undefined;
            this.reflector.getMembersOfClass(node).forEach(function (property) {
                var e_1, _a;
                var decorators = property.decorators;
                if (!decorators) {
                    return;
                }
                try {
                    for (var decorators_1 = tslib_1.__values(decorators), decorators_1_1 = decorators_1.next(); !decorators_1_1.done; decorators_1_1 = decorators_1.next()) {
                        var decorator = decorators_1_1.value;
                        if (util_1.isAngularDecorator(decorator, 'Input', _this.isCore)) {
                            result = result || {};
                            var inputs = result.inputs = result.inputs || [];
                            inputs.push({ decorator: decorator, property: property });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'Output', _this.isCore)) {
                            result = result || {};
                            var outputs = result.outputs = result.outputs || [];
                            outputs.push({ decorator: decorator, property: property });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'ViewChild', _this.isCore) ||
                            util_1.isAngularDecorator(decorator, 'ViewChildren', _this.isCore)) {
                            result = result || {};
                            var viewQueries = result.viewQueries = result.viewQueries || [];
                            viewQueries.push({ member: property, decorators: decorators });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'ContentChild', _this.isCore) ||
                            util_1.isAngularDecorator(decorator, 'ContentChildren', _this.isCore)) {
                            result = result || {};
                            var queries = result.queries = result.queries || [];
                            queries.push({ member: property, decorators: decorators });
                        }
                        else if (util_1.isAngularDecorator(decorator, 'HostBinding', _this.isCore) ||
                            util_1.isAngularDecorator(decorator, 'HostListener', _this.isCore)) {
                            result = result || {};
                            var host = result.host = result.host || [];
                            host.push(property);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (decorators_1_1 && !decorators_1_1.done && (_a = decorators_1.return)) _a.call(decorators_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
            if (result !== undefined) {
                return {
                    metadata: result,
                    trigger: null,
                };
            }
            else {
                return undefined;
            }
        };
        BaseDefDecoratorHandler.prototype.analyze = function (node, metadata) {
            var _this = this;
            var analysis = {
                name: node.name.text,
                type: new compiler_1.WrappedNodeExpr(node.name),
                typeSourceSpan: compiler_1.EMPTY_SOURCE_SPAN,
            };
            if (metadata.inputs) {
                var inputs_1 = analysis.inputs = {};
                metadata.inputs.forEach(function (_a) {
                    var decorator = _a.decorator, property = _a.property;
                    var propName = property.name;
                    var args = decorator.args;
                    var value;
                    if (args && args.length > 0) {
                        var resolvedValue = _this.evaluator.evaluate(args[0]);
                        if (typeof resolvedValue !== 'string') {
                            throw new TypeError('Input alias does not resolve to a string value');
                        }
                        value = [resolvedValue, propName];
                    }
                    else {
                        value = propName;
                    }
                    inputs_1[propName] = value;
                });
            }
            if (metadata.outputs) {
                var outputs_1 = analysis.outputs = {};
                metadata.outputs.forEach(function (_a) {
                    var decorator = _a.decorator, property = _a.property;
                    var propName = property.name;
                    var args = decorator.args;
                    var value;
                    if (args && args.length > 0) {
                        var resolvedValue = _this.evaluator.evaluate(args[0]);
                        if (typeof resolvedValue !== 'string') {
                            throw new TypeError('Output alias does not resolve to a string value');
                        }
                        value = resolvedValue;
                    }
                    else {
                        value = propName;
                    }
                    outputs_1[propName] = value;
                });
            }
            if (metadata.viewQueries) {
                analysis.viewQueries =
                    directive_1.queriesFromFields(metadata.viewQueries, this.reflector, this.evaluator);
            }
            if (metadata.queries) {
                analysis.queries = directive_1.queriesFromFields(metadata.queries, this.reflector, this.evaluator);
            }
            if (metadata.host) {
                analysis.host = directive_1.extractHostBindings(metadata.host, this.evaluator, this.isCore ? undefined : '@angular/core');
            }
            return { analysis: analysis };
        };
        BaseDefDecoratorHandler.prototype.compile = function (node, analysis, pool) {
            var _a = compiler_1.compileBaseDefFromMetadata(analysis, pool, compiler_1.makeBindingParser()), expression = _a.expression, type = _a.type;
            return {
                name: 'ngBaseDef',
                initializer: expression, type: type,
                statements: [],
            };
        };
        return BaseDefDecoratorHandler;
    }());
    exports.BaseDefDecoratorHandler = BaseDefDecoratorHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9kZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2Fubm90YXRpb25zL3NyYy9iYXNlX2RlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBcUo7SUFJckosdUVBQWlIO0lBRWpILHVGQUFtRTtJQUNuRSw2RUFBMEM7SUFFMUMsU0FBUywyQkFBMkIsQ0FBQyxVQUE4QixFQUFFLE1BQWU7UUFDbEYsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQ2xCLFVBQUEsU0FBUyxJQUFJLE9BQUEseUJBQWtCLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUM7WUFDM0QseUJBQWtCLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUM7WUFDbEQseUJBQWtCLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFGeEMsQ0FFd0MsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDtRQUVFLGlDQUNZLFNBQXlCLEVBQVUsU0FBMkIsRUFDOUQsTUFBZTtZQURmLGNBQVMsR0FBVCxTQUFTLENBQWdCO1lBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7WUFDOUQsV0FBTSxHQUFOLE1BQU0sQ0FBUztZQUVsQixlQUFVLEdBQUcsNkJBQWlCLENBQUMsSUFBSSxDQUFDO1FBRmYsQ0FBQztRQUkvQix3Q0FBTSxHQUFOLFVBQU8sSUFBc0IsRUFBRSxVQUE0QjtZQUEzRCxpQkFzREM7WUFwREMsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4RCx5RUFBeUU7Z0JBQ3pFLHdEQUF3RDtnQkFDeEQsT0FBTyxTQUFTLENBQUM7YUFDbEI7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Q0FBQyxDQUFDO2FBQ3hGO1lBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNqQixRQUFRLENBQUMsSUFBSSxHQUFHLCtCQUFtQixDQUMvQixRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUMvRTtZQUVELE9BQU8sRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDO1FBQ3BCLENBQUM7UUFFRCx5Q0FBTyxHQUFQLFVBQVEsSUFBc0IsRUFBRSxRQUEyQixFQUFFLElBQWtCO1lBRXZFLElBQUEsMEZBQW9GLEVBQW5GLDBCQUFVLEVBQUUsY0FBdUUsQ0FBQztZQUUzRixPQUFPO2dCQUNMLElBQUksRUFBRSxXQUFXO2dCQUNqQixXQUFXLEVBQUUsVUFBVSxFQUFFLElBQUksTUFBQTtnQkFDN0IsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDO1FBQ0osQ0FBQztRQUNILDhCQUFDO0lBQUQsQ0FBQyxBQXpJRCxJQXlJQztJQXpJWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RhbnRQb29sLCBFTVBUWV9TT1VSQ0VfU1BBTiwgUjNCYXNlUmVmTWV0YURhdGEsIFdyYXBwZWROb2RlRXhwciwgY29tcGlsZUJhc2VEZWZGcm9tTWV0YWRhdGEsIG1ha2VCaW5kaW5nUGFyc2VyfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7UGFydGlhbEV2YWx1YXRvcn0gZnJvbSAnLi4vLi4vcGFydGlhbF9ldmFsdWF0b3InO1xuaW1wb3J0IHtDbGFzc0RlY2xhcmF0aW9uLCBDbGFzc01lbWJlciwgRGVjb3JhdG9yLCBSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0FuYWx5c2lzT3V0cHV0LCBDb21waWxlUmVzdWx0LCBEZWNvcmF0b3JIYW5kbGVyLCBEZXRlY3RSZXN1bHQsIEhhbmRsZXJQcmVjZWRlbmNlfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuXG5pbXBvcnQge2V4dHJhY3RIb3N0QmluZGluZ3MsIHF1ZXJpZXNGcm9tRmllbGRzfSBmcm9tICcuL2RpcmVjdGl2ZSc7XG5pbXBvcnQge2lzQW5ndWxhckRlY29yYXRvcn0gZnJvbSAnLi91dGlsJztcblxuZnVuY3Rpb24gY29udGFpbnNOZ1RvcExldmVsRGVjb3JhdG9yKGRlY29yYXRvcnM6IERlY29yYXRvcltdIHwgbnVsbCwgaXNDb3JlOiBib29sZWFuKTogYm9vbGVhbiB7XG4gIGlmICghZGVjb3JhdG9ycykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZGVjb3JhdG9ycy5zb21lKFxuICAgICAgZGVjb3JhdG9yID0+IGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3IsICdDb21wb25lbnQnLCBpc0NvcmUpIHx8XG4gICAgICAgICAgaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ0RpcmVjdGl2ZScsIGlzQ29yZSkgfHxcbiAgICAgICAgICBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9yLCAnTmdNb2R1bGUnLCBpc0NvcmUpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEJhc2VEZWZEZWNvcmF0b3JIYW5kbGVyIGltcGxlbWVudHNcbiAgICBEZWNvcmF0b3JIYW5kbGVyPFIzQmFzZVJlZk1ldGFEYXRhLCBSM0Jhc2VSZWZEZWNvcmF0b3JEZXRlY3Rpb24+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QsIHByaXZhdGUgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yLFxuICAgICAgcHJpdmF0ZSBpc0NvcmU6IGJvb2xlYW4pIHt9XG5cbiAgcmVhZG9ubHkgcHJlY2VkZW5jZSA9IEhhbmRsZXJQcmVjZWRlbmNlLldFQUs7XG5cbiAgZGV0ZWN0KG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcnM6IERlY29yYXRvcltdfG51bGwpOlxuICAgICAgRGV0ZWN0UmVzdWx0PFIzQmFzZVJlZkRlY29yYXRvckRldGVjdGlvbj58dW5kZWZpbmVkIHtcbiAgICBpZiAoY29udGFpbnNOZ1RvcExldmVsRGVjb3JhdG9yKGRlY29yYXRvcnMsIHRoaXMuaXNDb3JlKSkge1xuICAgICAgLy8gSWYgdGhlIGNsYXNzIGlzIGFscmVhZHkgZGVjb3JhdGVkIGJ5IEBDb21wb25lbnQgb3IgQERpcmVjdGl2ZSBsZXQgdGhhdFxuICAgICAgLy8gRGVjb3JhdG9ySGFuZGxlciBoYW5kbGUgdGhpcy4gQmFzZURlZiBpcyB1bm5lY2Vzc2FyeS5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogUjNCYXNlUmVmRGVjb3JhdG9yRGV0ZWN0aW9ufHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMucmVmbGVjdG9yLmdldE1lbWJlcnNPZkNsYXNzKG5vZGUpLmZvckVhY2gocHJvcGVydHkgPT4ge1xuICAgICAgY29uc3Qge2RlY29yYXRvcnN9ID0gcHJvcGVydHk7XG4gICAgICBpZiAoIWRlY29yYXRvcnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBkZWNvcmF0b3Igb2YgZGVjb3JhdG9ycykge1xuICAgICAgICBpZiAoaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ0lucHV0JywgdGhpcy5pc0NvcmUpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt9O1xuICAgICAgICAgIGNvbnN0IGlucHV0cyA9IHJlc3VsdC5pbnB1dHMgPSByZXN1bHQuaW5wdXRzIHx8IFtdO1xuICAgICAgICAgIGlucHV0cy5wdXNoKHtkZWNvcmF0b3IsIHByb3BlcnR5fSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ091dHB1dCcsIHRoaXMuaXNDb3JlKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB7fTtcbiAgICAgICAgICBjb25zdCBvdXRwdXRzID0gcmVzdWx0Lm91dHB1dHMgPSByZXN1bHQub3V0cHV0cyB8fCBbXTtcbiAgICAgICAgICBvdXRwdXRzLnB1c2goe2RlY29yYXRvciwgcHJvcGVydHl9KTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3IsICdWaWV3Q2hpbGQnLCB0aGlzLmlzQ29yZSkgfHxcbiAgICAgICAgICAgIGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3IsICdWaWV3Q2hpbGRyZW4nLCB0aGlzLmlzQ29yZSkpIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwge307XG4gICAgICAgICAgY29uc3Qgdmlld1F1ZXJpZXMgPSByZXN1bHQudmlld1F1ZXJpZXMgPSByZXN1bHQudmlld1F1ZXJpZXMgfHwgW107XG4gICAgICAgICAgdmlld1F1ZXJpZXMucHVzaCh7bWVtYmVyOiBwcm9wZXJ0eSwgZGVjb3JhdG9yc30pO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ0NvbnRlbnRDaGlsZCcsIHRoaXMuaXNDb3JlKSB8fFxuICAgICAgICAgICAgaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ0NvbnRlbnRDaGlsZHJlbicsIHRoaXMuaXNDb3JlKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB7fTtcbiAgICAgICAgICBjb25zdCBxdWVyaWVzID0gcmVzdWx0LnF1ZXJpZXMgPSByZXN1bHQucXVlcmllcyB8fCBbXTtcbiAgICAgICAgICBxdWVyaWVzLnB1c2goe21lbWJlcjogcHJvcGVydHksIGRlY29yYXRvcnN9KTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGlzQW5ndWxhckRlY29yYXRvcihkZWNvcmF0b3IsICdIb3N0QmluZGluZycsIHRoaXMuaXNDb3JlKSB8fFxuICAgICAgICAgICAgaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvciwgJ0hvc3RMaXN0ZW5lcicsIHRoaXMuaXNDb3JlKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB7fTtcbiAgICAgICAgICBjb25zdCBob3N0ID0gcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdCB8fCBbXTtcbiAgICAgICAgICBob3N0LnB1c2gocHJvcGVydHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1ldGFkYXRhOiByZXN1bHQsXG4gICAgICAgIHRyaWdnZXI6IG51bGwsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGFuYWx5emUobm9kZTogQ2xhc3NEZWNsYXJhdGlvbiwgbWV0YWRhdGE6IFIzQmFzZVJlZkRlY29yYXRvckRldGVjdGlvbik6XG4gICAgICBBbmFseXNpc091dHB1dDxSM0Jhc2VSZWZNZXRhRGF0YT4ge1xuICAgIGNvbnN0IGFuYWx5c2lzOiBSM0Jhc2VSZWZNZXRhRGF0YSA9IHtcbiAgICAgIG5hbWU6IG5vZGUubmFtZS50ZXh0LFxuICAgICAgdHlwZTogbmV3IFdyYXBwZWROb2RlRXhwcihub2RlLm5hbWUpLFxuICAgICAgdHlwZVNvdXJjZVNwYW46IEVNUFRZX1NPVVJDRV9TUEFOLFxuICAgIH07XG5cbiAgICBpZiAobWV0YWRhdGEuaW5wdXRzKSB7XG4gICAgICBjb25zdCBpbnB1dHMgPSBhbmFseXNpcy5pbnB1dHMgPSB7fSBhc3tba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBbc3RyaW5nLCBzdHJpbmddfTtcbiAgICAgIG1ldGFkYXRhLmlucHV0cy5mb3JFYWNoKCh7ZGVjb3JhdG9yLCBwcm9wZXJ0eX0pID0+IHtcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xuICAgICAgICBjb25zdCBhcmdzID0gZGVjb3JhdG9yLmFyZ3M7XG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nfFtzdHJpbmcsIHN0cmluZ107XG4gICAgICAgIGlmIChhcmdzICYmIGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHJlc29sdmVkVmFsdWUgPSB0aGlzLmV2YWx1YXRvci5ldmFsdWF0ZShhcmdzWzBdKTtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkVmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnB1dCBhbGlhcyBkb2VzIG5vdCByZXNvbHZlIHRvIGEgc3RyaW5nIHZhbHVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gW3Jlc29sdmVkVmFsdWUsIHByb3BOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHByb3BOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0c1twcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChtZXRhZGF0YS5vdXRwdXRzKSB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gYW5hbHlzaXMub3V0cHV0cyA9IHt9IGFze1trZXk6IHN0cmluZ106IHN0cmluZ307XG4gICAgICBtZXRhZGF0YS5vdXRwdXRzLmZvckVhY2goKHtkZWNvcmF0b3IsIHByb3BlcnR5fSkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHByb3BlcnR5Lm5hbWU7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBkZWNvcmF0b3IuYXJncztcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG4gICAgICAgIGlmIChhcmdzICYmIGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHJlc29sdmVkVmFsdWUgPSB0aGlzLmV2YWx1YXRvci5ldmFsdWF0ZShhcmdzWzBdKTtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkVmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPdXRwdXQgYWxpYXMgZG9lcyBub3QgcmVzb2x2ZSB0byBhIHN0cmluZyB2YWx1ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHJlc29sdmVkVmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBwcm9wTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXRzW3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGFkYXRhLnZpZXdRdWVyaWVzKSB7XG4gICAgICBhbmFseXNpcy52aWV3UXVlcmllcyA9XG4gICAgICAgICAgcXVlcmllc0Zyb21GaWVsZHMobWV0YWRhdGEudmlld1F1ZXJpZXMsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmV2YWx1YXRvcik7XG4gICAgfVxuXG4gICAgaWYgKG1ldGFkYXRhLnF1ZXJpZXMpIHtcbiAgICAgIGFuYWx5c2lzLnF1ZXJpZXMgPSBxdWVyaWVzRnJvbUZpZWxkcyhtZXRhZGF0YS5xdWVyaWVzLCB0aGlzLnJlZmxlY3RvciwgdGhpcy5ldmFsdWF0b3IpO1xuICAgIH1cblxuICAgIGlmIChtZXRhZGF0YS5ob3N0KSB7XG4gICAgICBhbmFseXNpcy5ob3N0ID0gZXh0cmFjdEhvc3RCaW5kaW5ncyhcbiAgICAgICAgICBtZXRhZGF0YS5ob3N0LCB0aGlzLmV2YWx1YXRvciwgdGhpcy5pc0NvcmUgPyB1bmRlZmluZWQgOiAnQGFuZ3VsYXIvY29yZScpO1xuICAgIH1cblxuICAgIHJldHVybiB7YW5hbHlzaXN9O1xuICB9XG5cbiAgY29tcGlsZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBhbmFseXNpczogUjNCYXNlUmVmTWV0YURhdGEsIHBvb2w6IENvbnN0YW50UG9vbCk6XG4gICAgICBDb21waWxlUmVzdWx0W118Q29tcGlsZVJlc3VsdCB7XG4gICAgY29uc3Qge2V4cHJlc3Npb24sIHR5cGV9ID0gY29tcGlsZUJhc2VEZWZGcm9tTWV0YWRhdGEoYW5hbHlzaXMsIHBvb2wsIG1ha2VCaW5kaW5nUGFyc2VyKCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICduZ0Jhc2VEZWYnLFxuICAgICAgaW5pdGlhbGl6ZXI6IGV4cHJlc3Npb24sIHR5cGUsXG4gICAgICBzdGF0ZW1lbnRzOiBbXSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNCYXNlUmVmRGVjb3JhdG9yRGV0ZWN0aW9uIHtcbiAgaW5wdXRzPzoge3Byb3BlcnR5OiBDbGFzc01lbWJlciwgZGVjb3JhdG9yOiBEZWNvcmF0b3J9W107XG4gIG91dHB1dHM/OiB7cHJvcGVydHk6IENsYXNzTWVtYmVyLCBkZWNvcmF0b3I6IERlY29yYXRvcn1bXTtcbiAgdmlld1F1ZXJpZXM/OiB7bWVtYmVyOiBDbGFzc01lbWJlciwgZGVjb3JhdG9yczogRGVjb3JhdG9yW119W107XG4gIHF1ZXJpZXM/OiB7bWVtYmVyOiBDbGFzc01lbWJlciwgZGVjb3JhdG9yczogRGVjb3JhdG9yW119W107XG4gIGhvc3Q/OiBDbGFzc01lbWJlcltdO1xufVxuIl19