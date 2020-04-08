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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/injectable", ["require", "exports", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/annotations/src/metadata", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var metadata_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/metadata");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    /**
     * Adapts the `compileIvyInjectable` compiler for `@Injectable` decorators to the Ivy compiler.
     */
    var InjectableDecoratorHandler = /** @class */ (function () {
        function InjectableDecoratorHandler(reflector, defaultImportRecorder, isCore, strictCtorDeps) {
            this.reflector = reflector;
            this.defaultImportRecorder = defaultImportRecorder;
            this.isCore = isCore;
            this.strictCtorDeps = strictCtorDeps;
            this.precedence = transform_1.HandlerPrecedence.SHARED;
        }
        InjectableDecoratorHandler.prototype.detect = function (node, decorators) {
            if (!decorators) {
                return undefined;
            }
            var decorator = util_1.findAngularDecorator(decorators, 'Injectable', this.isCore);
            if (decorator !== undefined) {
                return {
                    trigger: decorator.node,
                    metadata: decorator,
                };
            }
            else {
                return undefined;
            }
        };
        InjectableDecoratorHandler.prototype.analyze = function (node, decorator) {
            return {
                analysis: {
                    meta: extractInjectableMetadata(node, decorator, this.reflector, this.defaultImportRecorder, this.isCore, this.strictCtorDeps),
                    metadataStmt: metadata_1.generateSetClassMetadataCall(node, this.reflector, this.defaultImportRecorder, this.isCore),
                },
            };
        };
        InjectableDecoratorHandler.prototype.compile = function (node, analysis) {
            var res = compiler_1.compileInjectable(analysis.meta);
            var statements = res.statements;
            if (analysis.metadataStmt !== null) {
                statements.push(analysis.metadataStmt);
            }
            return {
                name: 'ngInjectableDef',
                initializer: res.expression, statements: statements,
                type: res.type,
            };
        };
        return InjectableDecoratorHandler;
    }());
    exports.InjectableDecoratorHandler = InjectableDecoratorHandler;
    /**
     * Read metadata from the `@Injectable` decorator and produce the `IvyInjectableMetadata`, the input
     * metadata needed to run `compileIvyInjectable`.
     *
     * A `null` return value indicates this is @Injectable has invalid data.
     */
    function extractInjectableMetadata(clazz, decorator, reflector, defaultImportRecorder, isCore, strictCtorDeps) {
        var name = clazz.name.text;
        var type = new compiler_1.WrappedNodeExpr(clazz.name);
        var typeArgumentCount = reflector.getGenericArityOfClass(clazz) || 0;
        if (decorator.args === null) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_NOT_CALLED, decorator.node, '@Injectable must be called');
        }
        if (decorator.args.length === 0) {
            // Ideally, using @Injectable() would have the same effect as using @Injectable({...}), and be
            // subject to the same validation. However, existing Angular code abuses @Injectable, applying
            // it to things like abstract classes with constructors that were never meant for use with
            // Angular's DI.
            //
            // To deal with this, @Injectable() without an argument is more lenient, and if the constructor
            // signature does not work for DI then an ngInjectableDef that throws.
            var ctorDeps = null;
            if (strictCtorDeps) {
                ctorDeps = util_1.getValidConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore);
            }
            else {
                var possibleCtorDeps = util_1.getConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore);
                if (possibleCtorDeps !== null) {
                    if (possibleCtorDeps.deps !== null) {
                        // This use of @Injectable has valid constructor dependencies.
                        ctorDeps = possibleCtorDeps.deps;
                    }
                    else {
                        // This use of @Injectable is technically invalid. Generate a factory function which
                        // throws
                        // an error.
                        // TODO(alxhub): log warnings for the bad use of @Injectable.
                        ctorDeps = 'invalid';
                    }
                }
            }
            return {
                name: name,
                type: type,
                typeArgumentCount: typeArgumentCount,
                providedIn: new compiler_1.LiteralExpr(null), ctorDeps: ctorDeps,
            };
        }
        else if (decorator.args.length === 1) {
            var rawCtorDeps = util_1.getConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore);
            var ctorDeps = null;
            // rawCtorDeps will be null if the class has no constructor.
            if (rawCtorDeps !== null) {
                if (rawCtorDeps.deps !== null) {
                    // A constructor existed and had valid dependencies.
                    ctorDeps = rawCtorDeps.deps;
                }
                else {
                    // A constructor existed but had invalid dependencies.
                    ctorDeps = 'invalid';
                }
            }
            var metaNode = decorator.args[0];
            // Firstly make sure the decorator argument is an inline literal - if not, it's illegal to
            // transport references from one location to another. This is the problem that lowering
            // used to solve - if this restriction proves too undesirable we can re-implement lowering.
            if (!ts.isObjectLiteralExpression(metaNode)) {
                throw new Error("In Ivy, decorator metadata must be inline.");
            }
            // Resolve the fields of the literal into a map of field name to expression.
            var meta = reflection_1.reflectObjectLiteral(metaNode);
            var providedIn = new compiler_1.LiteralExpr(null);
            if (meta.has('providedIn')) {
                providedIn = new compiler_1.WrappedNodeExpr(meta.get('providedIn'));
            }
            var userDeps = undefined;
            if ((meta.has('useClass') || meta.has('useFactory')) && meta.has('deps')) {
                var depsExpr = meta.get('deps');
                if (!ts.isArrayLiteralExpression(depsExpr)) {
                    throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_NOT_LITERAL, depsExpr, "In Ivy, deps metadata must be an inline array.");
                }
                userDeps = depsExpr.elements.map(function (dep) { return getDep(dep, reflector); });
            }
            if (meta.has('useValue')) {
                return {
                    name: name,
                    type: type,
                    typeArgumentCount: typeArgumentCount,
                    ctorDeps: ctorDeps,
                    providedIn: providedIn,
                    useValue: new compiler_1.WrappedNodeExpr(meta.get('useValue')),
                };
            }
            else if (meta.has('useExisting')) {
                return {
                    name: name,
                    type: type,
                    typeArgumentCount: typeArgumentCount,
                    ctorDeps: ctorDeps,
                    providedIn: providedIn,
                    useExisting: new compiler_1.WrappedNodeExpr(meta.get('useExisting')),
                };
            }
            else if (meta.has('useClass')) {
                return {
                    name: name,
                    type: type,
                    typeArgumentCount: typeArgumentCount,
                    ctorDeps: ctorDeps,
                    providedIn: providedIn,
                    useClass: new compiler_1.WrappedNodeExpr(meta.get('useClass')), userDeps: userDeps,
                };
            }
            else if (meta.has('useFactory')) {
                // useFactory is special - the 'deps' property must be analyzed.
                var factory = new compiler_1.WrappedNodeExpr(meta.get('useFactory'));
                return {
                    name: name,
                    type: type,
                    typeArgumentCount: typeArgumentCount,
                    providedIn: providedIn,
                    useFactory: factory, ctorDeps: ctorDeps, userDeps: userDeps,
                };
            }
            else {
                if (strictCtorDeps) {
                    // Since use* was not provided, validate the deps according to strictCtorDeps.
                    util_1.validateConstructorDependencies(clazz, rawCtorDeps);
                }
                return { name: name, type: type, typeArgumentCount: typeArgumentCount, providedIn: providedIn, ctorDeps: ctorDeps };
            }
        }
        else {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, decorator.args[2], 'Too many arguments to @Injectable');
        }
    }
    function getDep(dep, reflector) {
        var meta = {
            token: new compiler_1.WrappedNodeExpr(dep),
            host: false,
            resolved: compiler_1.R3ResolvedDependencyType.Token,
            optional: false,
            self: false,
            skipSelf: false,
        };
        function maybeUpdateDecorator(dec, reflector, token) {
            var source = reflector.getImportOfIdentifier(dec);
            if (source === null || source.from !== '@angular/core') {
                return;
            }
            switch (source.name) {
                case 'Inject':
                    if (token !== undefined) {
                        meta.token = new compiler_1.WrappedNodeExpr(token);
                    }
                    break;
                case 'Optional':
                    meta.optional = true;
                    break;
                case 'SkipSelf':
                    meta.skipSelf = true;
                    break;
                case 'Self':
                    meta.self = true;
                    break;
            }
        }
        if (ts.isArrayLiteralExpression(dep)) {
            dep.elements.forEach(function (el) {
                if (ts.isIdentifier(el)) {
                    maybeUpdateDecorator(el, reflector);
                }
                else if (ts.isNewExpression(el) && ts.isIdentifier(el.expression)) {
                    var token = el.arguments && el.arguments.length > 0 && el.arguments[0] || undefined;
                    maybeUpdateDecorator(el.expression, reflector, token);
                }
            });
        }
        return meta;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL2luamVjdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCw4Q0FBdU07SUFDdk0sK0JBQWlDO0lBRWpDLDJFQUFrRTtJQUVsRSx5RUFBbUc7SUFDbkcsdUVBQWlIO0lBRWpILHFGQUF3RDtJQUN4RCw2RUFBMEk7SUFPMUk7O09BRUc7SUFDSDtRQUVFLG9DQUNZLFNBQXlCLEVBQVUscUJBQTRDLEVBQy9FLE1BQWUsRUFBVSxjQUF1QjtZQURoRCxjQUFTLEdBQVQsU0FBUyxDQUFnQjtZQUFVLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7WUFDL0UsV0FBTSxHQUFOLE1BQU0sQ0FBUztZQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1lBRW5ELGVBQVUsR0FBRyw2QkFBaUIsQ0FBQyxNQUFNLENBQUM7UUFGZ0IsQ0FBQztRQUloRSwyQ0FBTSxHQUFOLFVBQU8sSUFBc0IsRUFBRSxVQUE0QjtZQUN6RCxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsSUFBTSxTQUFTLEdBQUcsMkJBQW9CLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUUsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUMzQixPQUFPO29CQUNMLE9BQU8sRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDdkIsUUFBUSxFQUFFLFNBQVM7aUJBQ3BCLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxPQUFPLFNBQVMsQ0FBQzthQUNsQjtRQUNILENBQUM7UUFFRCw0Q0FBTyxHQUFQLFVBQVEsSUFBc0IsRUFBRSxTQUFvQjtZQUNsRCxPQUFPO2dCQUNMLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUseUJBQXlCLENBQzNCLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFDeEUsSUFBSSxDQUFDLGNBQWMsQ0FBQztvQkFDeEIsWUFBWSxFQUFFLHVDQUE0QixDQUN0QyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDbkU7YUFDRixDQUFDO1FBQ0osQ0FBQztRQUVELDRDQUFPLEdBQVAsVUFBUSxJQUFzQixFQUFFLFFBQStCO1lBQzdELElBQU0sR0FBRyxHQUFHLDRCQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQ2xDLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7Z0JBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3hDO1lBQ0QsT0FBTztnQkFDTCxJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLFlBQUE7Z0JBQ3ZDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTthQUNmLENBQUM7UUFDSixDQUFDO1FBQ0gsaUNBQUM7SUFBRCxDQUFDLEFBL0NELElBK0NDO0lBL0NZLGdFQUEwQjtJQWlEdkM7Ozs7O09BS0c7SUFDSCxTQUFTLHlCQUF5QixDQUM5QixLQUF1QixFQUFFLFNBQW9CLEVBQUUsU0FBeUIsRUFDeEUscUJBQTRDLEVBQUUsTUFBZSxFQUM3RCxjQUF1QjtRQUN6QixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFNLElBQUksR0FBRyxJQUFJLDBCQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxrQ0FBb0IsQ0FDMUIsdUJBQVMsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLDRCQUE0QixDQUFDLENBQUM7U0FDbkY7UUFDRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvQiw4RkFBOEY7WUFDOUYsOEZBQThGO1lBQzlGLDBGQUEwRjtZQUMxRixnQkFBZ0I7WUFDaEIsRUFBRTtZQUNGLCtGQUErRjtZQUMvRixzRUFBc0U7WUFDdEUsSUFBSSxRQUFRLEdBQTBDLElBQUksQ0FBQztZQUMzRCxJQUFJLGNBQWMsRUFBRTtnQkFDbEIsUUFBUSxHQUFHLHNDQUErQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDN0Y7aUJBQU07Z0JBQ0wsSUFBTSxnQkFBZ0IsR0FDbEIsaUNBQTBCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDaEYsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7b0JBQzdCLElBQUksZ0JBQWdCLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTt3QkFDbEMsOERBQThEO3dCQUM5RCxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO3FCQUNsQzt5QkFBTTt3QkFDTCxvRkFBb0Y7d0JBQ3BGLFNBQVM7d0JBQ1QsWUFBWTt3QkFDWiw2REFBNkQ7d0JBQzdELFFBQVEsR0FBRyxTQUFTLENBQUM7cUJBQ3RCO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPO2dCQUNMLElBQUksTUFBQTtnQkFDSixJQUFJLE1BQUE7Z0JBQ0osaUJBQWlCLG1CQUFBO2dCQUNqQixVQUFVLEVBQUUsSUFBSSxzQkFBVyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsVUFBQTthQUM1QyxDQUFDO1NBQ0g7YUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN0QyxJQUFNLFdBQVcsR0FBRyxpQ0FBMEIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2hHLElBQUksUUFBUSxHQUEwQyxJQUFJLENBQUM7WUFFM0QsNERBQTREO1lBQzVELElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDeEIsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDN0Isb0RBQW9EO29CQUNwRCxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztpQkFDN0I7cUJBQU07b0JBQ0wsc0RBQXNEO29CQUN0RCxRQUFRLEdBQUcsU0FBUyxDQUFDO2lCQUN0QjthQUNGO1lBRUQsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQywwRkFBMEY7WUFDMUYsdUZBQXVGO1lBQ3ZGLDJGQUEyRjtZQUMzRixJQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7YUFDL0Q7WUFFRCw0RUFBNEU7WUFDNUUsSUFBTSxJQUFJLEdBQUcsaUNBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUMsSUFBSSxVQUFVLEdBQWUsSUFBSSxzQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDMUIsVUFBVSxHQUFHLElBQUksMEJBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBRyxDQUFDLENBQUM7YUFDNUQ7WUFFRCxJQUFJLFFBQVEsR0FBcUMsU0FBUyxDQUFDO1lBQzNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4RSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUMxQyxNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUNyQyxnREFBZ0QsQ0FBQyxDQUFDO2lCQUN2RDtnQkFDRCxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxNQUFNLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7YUFDakU7WUFFRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3hCLE9BQU87b0JBQ0wsSUFBSSxNQUFBO29CQUNKLElBQUksTUFBQTtvQkFDSixpQkFBaUIsbUJBQUE7b0JBQ2pCLFFBQVEsVUFBQTtvQkFDUixVQUFVLFlBQUE7b0JBQ1YsUUFBUSxFQUFFLElBQUksMEJBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRyxDQUFDO2lCQUN0RCxDQUFDO2FBQ0g7aUJBQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNsQyxPQUFPO29CQUNMLElBQUksTUFBQTtvQkFDSixJQUFJLE1BQUE7b0JBQ0osaUJBQWlCLG1CQUFBO29CQUNqQixRQUFRLFVBQUE7b0JBQ1IsVUFBVSxZQUFBO29CQUNWLFdBQVcsRUFBRSxJQUFJLDBCQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUcsQ0FBQztpQkFDNUQsQ0FBQzthQUNIO2lCQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDL0IsT0FBTztvQkFDTCxJQUFJLE1BQUE7b0JBQ0osSUFBSSxNQUFBO29CQUNKLGlCQUFpQixtQkFBQTtvQkFDakIsUUFBUSxVQUFBO29CQUNSLFVBQVUsWUFBQTtvQkFDVixRQUFRLEVBQUUsSUFBSSwwQkFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFHLENBQUMsRUFBRSxRQUFRLFVBQUE7aUJBQ2hFLENBQUM7YUFDSDtpQkFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ2pDLGdFQUFnRTtnQkFDaEUsSUFBTSxPQUFPLEdBQUcsSUFBSSwwQkFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFHLENBQUMsQ0FBQztnQkFDOUQsT0FBTztvQkFDTCxJQUFJLE1BQUE7b0JBQ0osSUFBSSxNQUFBO29CQUNKLGlCQUFpQixtQkFBQTtvQkFDakIsVUFBVSxZQUFBO29CQUNWLFVBQVUsRUFBRSxPQUFPLEVBQUUsUUFBUSxVQUFBLEVBQUUsUUFBUSxVQUFBO2lCQUN4QyxDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsSUFBSSxjQUFjLEVBQUU7b0JBQ2xCLDhFQUE4RTtvQkFDOUUsc0NBQStCLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2lCQUNyRDtnQkFDRCxPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsaUJBQWlCLG1CQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUMsQ0FBQzthQUM5RDtTQUNGO2FBQU07WUFDTCxNQUFNLElBQUksa0NBQW9CLENBQzFCLHVCQUFTLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1NBQzlGO0lBQ0gsQ0FBQztJQUlELFNBQVMsTUFBTSxDQUFDLEdBQWtCLEVBQUUsU0FBeUI7UUFDM0QsSUFBTSxJQUFJLEdBQXlCO1lBQ2pDLEtBQUssRUFBRSxJQUFJLDBCQUFlLENBQUMsR0FBRyxDQUFDO1lBQy9CLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLG1DQUF3QixDQUFDLEtBQUs7WUFDeEMsUUFBUSxFQUFFLEtBQUs7WUFDZixJQUFJLEVBQUUsS0FBSztZQUNYLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUM7UUFFRixTQUFTLG9CQUFvQixDQUN6QixHQUFrQixFQUFFLFNBQXlCLEVBQUUsS0FBcUI7WUFDdEUsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELElBQUksTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBRTtnQkFDdEQsT0FBTzthQUNSO1lBQ0QsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNuQixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO3dCQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksMEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDekM7b0JBQ0QsTUFBTTtnQkFDUixLQUFLLFVBQVU7b0JBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLE1BQU07Z0JBQ1IsS0FBSyxVQUFVO29CQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNyQixNQUFNO2dCQUNSLEtBQUssTUFBTTtvQkFDVCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDakIsTUFBTTthQUNUO1FBQ0gsQ0FBQztRQUVELElBQUksRUFBRSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtnQkFDckIsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN2QixvQkFBb0IsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQ3JDO3FCQUFNLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDbkUsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUM7b0JBQ3RGLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN2RDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXhwcmVzc2lvbiwgTGl0ZXJhbEV4cHIsIFIzRGVwZW5kZW5jeU1ldGFkYXRhLCBSM0luamVjdGFibGVNZXRhZGF0YSwgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLCBTdGF0ZW1lbnQsIFdyYXBwZWROb2RlRXhwciwgY29tcGlsZUluamVjdGFibGUgYXMgY29tcGlsZUl2eUluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Vycm9yQ29kZSwgRmF0YWxEaWFnbm9zdGljRXJyb3J9IGZyb20gJy4uLy4uL2RpYWdub3N0aWNzJztcbmltcG9ydCB7RGVmYXVsdEltcG9ydFJlY29yZGVyfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbiwgRGVjb3JhdG9yLCBSZWZsZWN0aW9uSG9zdCwgcmVmbGVjdE9iamVjdExpdGVyYWx9IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtBbmFseXNpc091dHB1dCwgQ29tcGlsZVJlc3VsdCwgRGVjb3JhdG9ySGFuZGxlciwgRGV0ZWN0UmVzdWx0LCBIYW5kbGVyUHJlY2VkZW5jZX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcblxuaW1wb3J0IHtnZW5lcmF0ZVNldENsYXNzTWV0YWRhdGFDYWxsfSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7ZmluZEFuZ3VsYXJEZWNvcmF0b3IsIGdldENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzLCBnZXRWYWxpZENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzLCB2YWxpZGF0ZUNvbnN0cnVjdG9yRGVwZW5kZW5jaWVzfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdGFibGVIYW5kbGVyRGF0YSB7XG4gIG1ldGE6IFIzSW5qZWN0YWJsZU1ldGFkYXRhO1xuICBtZXRhZGF0YVN0bXQ6IFN0YXRlbWVudHxudWxsO1xufVxuXG4vKipcbiAqIEFkYXB0cyB0aGUgYGNvbXBpbGVJdnlJbmplY3RhYmxlYCBjb21waWxlciBmb3IgYEBJbmplY3RhYmxlYCBkZWNvcmF0b3JzIHRvIHRoZSBJdnkgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbmplY3RhYmxlRGVjb3JhdG9ySGFuZGxlciBpbXBsZW1lbnRzXG4gICAgRGVjb3JhdG9ySGFuZGxlcjxJbmplY3RhYmxlSGFuZGxlckRhdGEsIERlY29yYXRvcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgcHJpdmF0ZSBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlcixcbiAgICAgIHByaXZhdGUgaXNDb3JlOiBib29sZWFuLCBwcml2YXRlIHN0cmljdEN0b3JEZXBzOiBib29sZWFuKSB7fVxuXG4gIHJlYWRvbmx5IHByZWNlZGVuY2UgPSBIYW5kbGVyUHJlY2VkZW5jZS5TSEFSRUQ7XG5cbiAgZGV0ZWN0KG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGRlY29yYXRvcnM6IERlY29yYXRvcltdfG51bGwpOiBEZXRlY3RSZXN1bHQ8RGVjb3JhdG9yPnx1bmRlZmluZWQge1xuICAgIGlmICghZGVjb3JhdG9ycykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgZGVjb3JhdG9yID0gZmluZEFuZ3VsYXJEZWNvcmF0b3IoZGVjb3JhdG9ycywgJ0luamVjdGFibGUnLCB0aGlzLmlzQ29yZSk7XG4gICAgaWYgKGRlY29yYXRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmlnZ2VyOiBkZWNvcmF0b3Iubm9kZSxcbiAgICAgICAgbWV0YWRhdGE6IGRlY29yYXRvcixcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgYW5hbHl6ZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBkZWNvcmF0b3I6IERlY29yYXRvcik6IEFuYWx5c2lzT3V0cHV0PEluamVjdGFibGVIYW5kbGVyRGF0YT4ge1xuICAgIHJldHVybiB7XG4gICAgICBhbmFseXNpczoge1xuICAgICAgICBtZXRhOiBleHRyYWN0SW5qZWN0YWJsZU1ldGFkYXRhKFxuICAgICAgICAgICAgbm9kZSwgZGVjb3JhdG9yLCB0aGlzLnJlZmxlY3RvciwgdGhpcy5kZWZhdWx0SW1wb3J0UmVjb3JkZXIsIHRoaXMuaXNDb3JlLFxuICAgICAgICAgICAgdGhpcy5zdHJpY3RDdG9yRGVwcyksXG4gICAgICAgIG1ldGFkYXRhU3RtdDogZ2VuZXJhdGVTZXRDbGFzc01ldGFkYXRhQ2FsbChcbiAgICAgICAgICAgIG5vZGUsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmRlZmF1bHRJbXBvcnRSZWNvcmRlciwgdGhpcy5pc0NvcmUpLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY29tcGlsZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBhbmFseXNpczogSW5qZWN0YWJsZUhhbmRsZXJEYXRhKTogQ29tcGlsZVJlc3VsdCB7XG4gICAgY29uc3QgcmVzID0gY29tcGlsZUl2eUluamVjdGFibGUoYW5hbHlzaXMubWV0YSk7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IHJlcy5zdGF0ZW1lbnRzO1xuICAgIGlmIChhbmFseXNpcy5tZXRhZGF0YVN0bXQgIT09IG51bGwpIHtcbiAgICAgIHN0YXRlbWVudHMucHVzaChhbmFseXNpcy5tZXRhZGF0YVN0bXQpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ25nSW5qZWN0YWJsZURlZicsXG4gICAgICBpbml0aWFsaXplcjogcmVzLmV4cHJlc3Npb24sIHN0YXRlbWVudHMsXG4gICAgICB0eXBlOiByZXMudHlwZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUmVhZCBtZXRhZGF0YSBmcm9tIHRoZSBgQEluamVjdGFibGVgIGRlY29yYXRvciBhbmQgcHJvZHVjZSB0aGUgYEl2eUluamVjdGFibGVNZXRhZGF0YWAsIHRoZSBpbnB1dFxuICogbWV0YWRhdGEgbmVlZGVkIHRvIHJ1biBgY29tcGlsZUl2eUluamVjdGFibGVgLlxuICpcbiAqIEEgYG51bGxgIHJldHVybiB2YWx1ZSBpbmRpY2F0ZXMgdGhpcyBpcyBASW5qZWN0YWJsZSBoYXMgaW52YWxpZCBkYXRhLlxuICovXG5mdW5jdGlvbiBleHRyYWN0SW5qZWN0YWJsZU1ldGFkYXRhKFxuICAgIGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uLCBkZWNvcmF0b3I6IERlY29yYXRvciwgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCxcbiAgICBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlciwgaXNDb3JlOiBib29sZWFuLFxuICAgIHN0cmljdEN0b3JEZXBzOiBib29sZWFuKTogUjNJbmplY3RhYmxlTWV0YWRhdGEge1xuICBjb25zdCBuYW1lID0gY2xhenoubmFtZS50ZXh0O1xuICBjb25zdCB0eXBlID0gbmV3IFdyYXBwZWROb2RlRXhwcihjbGF6ei5uYW1lKTtcbiAgY29uc3QgdHlwZUFyZ3VtZW50Q291bnQgPSByZWZsZWN0b3IuZ2V0R2VuZXJpY0FyaXR5T2ZDbGFzcyhjbGF6eikgfHwgMDtcbiAgaWYgKGRlY29yYXRvci5hcmdzID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX05PVF9DQUxMRUQsIGRlY29yYXRvci5ub2RlLCAnQEluamVjdGFibGUgbXVzdCBiZSBjYWxsZWQnKTtcbiAgfVxuICBpZiAoZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gSWRlYWxseSwgdXNpbmcgQEluamVjdGFibGUoKSB3b3VsZCBoYXZlIHRoZSBzYW1lIGVmZmVjdCBhcyB1c2luZyBASW5qZWN0YWJsZSh7Li4ufSksIGFuZCBiZVxuICAgIC8vIHN1YmplY3QgdG8gdGhlIHNhbWUgdmFsaWRhdGlvbi4gSG93ZXZlciwgZXhpc3RpbmcgQW5ndWxhciBjb2RlIGFidXNlcyBASW5qZWN0YWJsZSwgYXBwbHlpbmdcbiAgICAvLyBpdCB0byB0aGluZ3MgbGlrZSBhYnN0cmFjdCBjbGFzc2VzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgd2VyZSBuZXZlciBtZWFudCBmb3IgdXNlIHdpdGhcbiAgICAvLyBBbmd1bGFyJ3MgREkuXG4gICAgLy9cbiAgICAvLyBUbyBkZWFsIHdpdGggdGhpcywgQEluamVjdGFibGUoKSB3aXRob3V0IGFuIGFyZ3VtZW50IGlzIG1vcmUgbGVuaWVudCwgYW5kIGlmIHRoZSBjb25zdHJ1Y3RvclxuICAgIC8vIHNpZ25hdHVyZSBkb2VzIG5vdCB3b3JrIGZvciBESSB0aGVuIGFuIG5nSW5qZWN0YWJsZURlZiB0aGF0IHRocm93cy5cbiAgICBsZXQgY3RvckRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW118J2ludmFsaWQnfG51bGwgPSBudWxsO1xuICAgIGlmIChzdHJpY3RDdG9yRGVwcykge1xuICAgICAgY3RvckRlcHMgPSBnZXRWYWxpZENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzKGNsYXp6LCByZWZsZWN0b3IsIGRlZmF1bHRJbXBvcnRSZWNvcmRlciwgaXNDb3JlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcG9zc2libGVDdG9yRGVwcyA9XG4gICAgICAgICAgZ2V0Q29uc3RydWN0b3JEZXBlbmRlbmNpZXMoY2xhenosIHJlZmxlY3RvciwgZGVmYXVsdEltcG9ydFJlY29yZGVyLCBpc0NvcmUpO1xuICAgICAgaWYgKHBvc3NpYmxlQ3RvckRlcHMgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlQ3RvckRlcHMuZGVwcyAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFRoaXMgdXNlIG9mIEBJbmplY3RhYmxlIGhhcyB2YWxpZCBjb25zdHJ1Y3RvciBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgY3RvckRlcHMgPSBwb3NzaWJsZUN0b3JEZXBzLmRlcHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhpcyB1c2Ugb2YgQEluamVjdGFibGUgaXMgdGVjaG5pY2FsbHkgaW52YWxpZC4gR2VuZXJhdGUgYSBmYWN0b3J5IGZ1bmN0aW9uIHdoaWNoXG4gICAgICAgICAgLy8gdGhyb3dzXG4gICAgICAgICAgLy8gYW4gZXJyb3IuXG4gICAgICAgICAgLy8gVE9ETyhhbHhodWIpOiBsb2cgd2FybmluZ3MgZm9yIHRoZSBiYWQgdXNlIG9mIEBJbmplY3RhYmxlLlxuICAgICAgICAgIGN0b3JEZXBzID0gJ2ludmFsaWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgdHlwZSxcbiAgICAgIHR5cGVBcmd1bWVudENvdW50LFxuICAgICAgcHJvdmlkZWRJbjogbmV3IExpdGVyYWxFeHByKG51bGwpLCBjdG9yRGVwcyxcbiAgICB9O1xuICB9IGVsc2UgaWYgKGRlY29yYXRvci5hcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgIGNvbnN0IHJhd0N0b3JEZXBzID0gZ2V0Q29uc3RydWN0b3JEZXBlbmRlbmNpZXMoY2xhenosIHJlZmxlY3RvciwgZGVmYXVsdEltcG9ydFJlY29yZGVyLCBpc0NvcmUpO1xuICAgIGxldCBjdG9yRGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXXwnaW52YWxpZCd8bnVsbCA9IG51bGw7XG5cbiAgICAvLyByYXdDdG9yRGVwcyB3aWxsIGJlIG51bGwgaWYgdGhlIGNsYXNzIGhhcyBubyBjb25zdHJ1Y3Rvci5cbiAgICBpZiAocmF3Q3RvckRlcHMgIT09IG51bGwpIHtcbiAgICAgIGlmIChyYXdDdG9yRGVwcy5kZXBzICE9PSBudWxsKSB7XG4gICAgICAgIC8vIEEgY29uc3RydWN0b3IgZXhpc3RlZCBhbmQgaGFkIHZhbGlkIGRlcGVuZGVuY2llcy5cbiAgICAgICAgY3RvckRlcHMgPSByYXdDdG9yRGVwcy5kZXBzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQSBjb25zdHJ1Y3RvciBleGlzdGVkIGJ1dCBoYWQgaW52YWxpZCBkZXBlbmRlbmNpZXMuXG4gICAgICAgIGN0b3JEZXBzID0gJ2ludmFsaWQnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1ldGFOb2RlID0gZGVjb3JhdG9yLmFyZ3NbMF07XG4gICAgLy8gRmlyc3RseSBtYWtlIHN1cmUgdGhlIGRlY29yYXRvciBhcmd1bWVudCBpcyBhbiBpbmxpbmUgbGl0ZXJhbCAtIGlmIG5vdCwgaXQncyBpbGxlZ2FsIHRvXG4gICAgLy8gdHJhbnNwb3J0IHJlZmVyZW5jZXMgZnJvbSBvbmUgbG9jYXRpb24gdG8gYW5vdGhlci4gVGhpcyBpcyB0aGUgcHJvYmxlbSB0aGF0IGxvd2VyaW5nXG4gICAgLy8gdXNlZCB0byBzb2x2ZSAtIGlmIHRoaXMgcmVzdHJpY3Rpb24gcHJvdmVzIHRvbyB1bmRlc2lyYWJsZSB3ZSBjYW4gcmUtaW1wbGVtZW50IGxvd2VyaW5nLlxuICAgIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihtZXRhTm9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW4gSXZ5LCBkZWNvcmF0b3IgbWV0YWRhdGEgbXVzdCBiZSBpbmxpbmUuYCk7XG4gICAgfVxuXG4gICAgLy8gUmVzb2x2ZSB0aGUgZmllbGRzIG9mIHRoZSBsaXRlcmFsIGludG8gYSBtYXAgb2YgZmllbGQgbmFtZSB0byBleHByZXNzaW9uLlxuICAgIGNvbnN0IG1ldGEgPSByZWZsZWN0T2JqZWN0TGl0ZXJhbChtZXRhTm9kZSk7XG4gICAgbGV0IHByb3ZpZGVkSW46IEV4cHJlc3Npb24gPSBuZXcgTGl0ZXJhbEV4cHIobnVsbCk7XG4gICAgaWYgKG1ldGEuaGFzKCdwcm92aWRlZEluJykpIHtcbiAgICAgIHByb3ZpZGVkSW4gPSBuZXcgV3JhcHBlZE5vZGVFeHByKG1ldGEuZ2V0KCdwcm92aWRlZEluJykgISk7XG4gICAgfVxuXG4gICAgbGV0IHVzZXJEZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoKG1ldGEuaGFzKCd1c2VDbGFzcycpIHx8IG1ldGEuaGFzKCd1c2VGYWN0b3J5JykpICYmIG1ldGEuaGFzKCdkZXBzJykpIHtcbiAgICAgIGNvbnN0IGRlcHNFeHByID0gbWV0YS5nZXQoJ2RlcHMnKSAhO1xuICAgICAgaWYgKCF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24oZGVwc0V4cHIpKSB7XG4gICAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICAgIEVycm9yQ29kZS5WQUxVRV9OT1RfTElURVJBTCwgZGVwc0V4cHIsXG4gICAgICAgICAgICBgSW4gSXZ5LCBkZXBzIG1ldGFkYXRhIG11c3QgYmUgYW4gaW5saW5lIGFycmF5LmApO1xuICAgICAgfVxuICAgICAgdXNlckRlcHMgPSBkZXBzRXhwci5lbGVtZW50cy5tYXAoZGVwID0+IGdldERlcChkZXAsIHJlZmxlY3RvcikpO1xuICAgIH1cblxuICAgIGlmIChtZXRhLmhhcygndXNlVmFsdWUnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdHlwZUFyZ3VtZW50Q291bnQsXG4gICAgICAgIGN0b3JEZXBzLFxuICAgICAgICBwcm92aWRlZEluLFxuICAgICAgICB1c2VWYWx1ZTogbmV3IFdyYXBwZWROb2RlRXhwcihtZXRhLmdldCgndXNlVmFsdWUnKSAhKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtZXRhLmhhcygndXNlRXhpc3RpbmcnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdHlwZUFyZ3VtZW50Q291bnQsXG4gICAgICAgIGN0b3JEZXBzLFxuICAgICAgICBwcm92aWRlZEluLFxuICAgICAgICB1c2VFeGlzdGluZzogbmV3IFdyYXBwZWROb2RlRXhwcihtZXRhLmdldCgndXNlRXhpc3RpbmcnKSAhKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtZXRhLmhhcygndXNlQ2xhc3MnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdHlwZUFyZ3VtZW50Q291bnQsXG4gICAgICAgIGN0b3JEZXBzLFxuICAgICAgICBwcm92aWRlZEluLFxuICAgICAgICB1c2VDbGFzczogbmV3IFdyYXBwZWROb2RlRXhwcihtZXRhLmdldCgndXNlQ2xhc3MnKSAhKSwgdXNlckRlcHMsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobWV0YS5oYXMoJ3VzZUZhY3RvcnknKSkge1xuICAgICAgLy8gdXNlRmFjdG9yeSBpcyBzcGVjaWFsIC0gdGhlICdkZXBzJyBwcm9wZXJ0eSBtdXN0IGJlIGFuYWx5emVkLlxuICAgICAgY29uc3QgZmFjdG9yeSA9IG5ldyBXcmFwcGVkTm9kZUV4cHIobWV0YS5nZXQoJ3VzZUZhY3RvcnknKSAhKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHR5cGVBcmd1bWVudENvdW50LFxuICAgICAgICBwcm92aWRlZEluLFxuICAgICAgICB1c2VGYWN0b3J5OiBmYWN0b3J5LCBjdG9yRGVwcywgdXNlckRlcHMsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RyaWN0Q3RvckRlcHMpIHtcbiAgICAgICAgLy8gU2luY2UgdXNlKiB3YXMgbm90IHByb3ZpZGVkLCB2YWxpZGF0ZSB0aGUgZGVwcyBhY2NvcmRpbmcgdG8gc3RyaWN0Q3RvckRlcHMuXG4gICAgICAgIHZhbGlkYXRlQ29uc3RydWN0b3JEZXBlbmRlbmNpZXMoY2xhenosIHJhd0N0b3JEZXBzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7bmFtZSwgdHlwZSwgdHlwZUFyZ3VtZW50Q291bnQsIHByb3ZpZGVkSW4sIGN0b3JEZXBzfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBkZWNvcmF0b3IuYXJnc1syXSwgJ1RvbyBtYW55IGFyZ3VtZW50cyB0byBASW5qZWN0YWJsZScpO1xuICB9XG59XG5cblxuXG5mdW5jdGlvbiBnZXREZXAoZGVwOiB0cy5FeHByZXNzaW9uLCByZWZsZWN0b3I6IFJlZmxlY3Rpb25Ib3N0KTogUjNEZXBlbmRlbmN5TWV0YWRhdGEge1xuICBjb25zdCBtZXRhOiBSM0RlcGVuZGVuY3lNZXRhZGF0YSA9IHtcbiAgICB0b2tlbjogbmV3IFdyYXBwZWROb2RlRXhwcihkZXApLFxuICAgIGhvc3Q6IGZhbHNlLFxuICAgIHJlc29sdmVkOiBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuVG9rZW4sXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIHNlbGY6IGZhbHNlLFxuICAgIHNraXBTZWxmOiBmYWxzZSxcbiAgfTtcblxuICBmdW5jdGlvbiBtYXliZVVwZGF0ZURlY29yYXRvcihcbiAgICAgIGRlYzogdHMuSWRlbnRpZmllciwgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgdG9rZW4/OiB0cy5FeHByZXNzaW9uKTogdm9pZCB7XG4gICAgY29uc3Qgc291cmNlID0gcmVmbGVjdG9yLmdldEltcG9ydE9mSWRlbnRpZmllcihkZWMpO1xuICAgIGlmIChzb3VyY2UgPT09IG51bGwgfHwgc291cmNlLmZyb20gIT09ICdAYW5ndWxhci9jb3JlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2l0Y2ggKHNvdXJjZS5uYW1lKSB7XG4gICAgICBjYXNlICdJbmplY3QnOlxuICAgICAgICBpZiAodG9rZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG1ldGEudG9rZW4gPSBuZXcgV3JhcHBlZE5vZGVFeHByKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ09wdGlvbmFsJzpcbiAgICAgICAgbWV0YS5vcHRpb25hbCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnU2tpcFNlbGYnOlxuICAgICAgICBtZXRhLnNraXBTZWxmID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdTZWxmJzpcbiAgICAgICAgbWV0YS5zZWxmID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihkZXApKSB7XG4gICAgZGVwLmVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihlbCkpIHtcbiAgICAgICAgbWF5YmVVcGRhdGVEZWNvcmF0b3IoZWwsIHJlZmxlY3Rvcik7XG4gICAgICB9IGVsc2UgaWYgKHRzLmlzTmV3RXhwcmVzc2lvbihlbCkgJiYgdHMuaXNJZGVudGlmaWVyKGVsLmV4cHJlc3Npb24pKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gZWwuYXJndW1lbnRzICYmIGVsLmFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGVsLmFyZ3VtZW50c1swXSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIG1heWJlVXBkYXRlRGVjb3JhdG9yKGVsLmV4cHJlc3Npb24sIHJlZmxlY3RvciwgdG9rZW4pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBtZXRhO1xufVxuIl19