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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/directive", ["require", "exports", "tslib", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/metadata/src/util", "@angular/compiler-cli/src/ngtsc/partial_evaluator", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/transform", "@angular/compiler-cli/src/ngtsc/annotations/src/metadata", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/metadata/src/util");
    var partial_evaluator_1 = require("@angular/compiler-cli/src/ngtsc/partial_evaluator");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var transform_1 = require("@angular/compiler-cli/src/ngtsc/transform");
    var metadata_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/metadata");
    var util_2 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    var EMPTY_OBJECT = {};
    var DirectiveDecoratorHandler = /** @class */ (function () {
        function DirectiveDecoratorHandler(reflector, evaluator, metaRegistry, defaultImportRecorder, isCore) {
            this.reflector = reflector;
            this.evaluator = evaluator;
            this.metaRegistry = metaRegistry;
            this.defaultImportRecorder = defaultImportRecorder;
            this.isCore = isCore;
            this.precedence = transform_1.HandlerPrecedence.PRIMARY;
        }
        DirectiveDecoratorHandler.prototype.detect = function (node, decorators) {
            if (!decorators) {
                return undefined;
            }
            var decorator = util_2.findAngularDecorator(decorators, 'Directive', this.isCore);
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
        DirectiveDecoratorHandler.prototype.analyze = function (node, decorator) {
            var directiveResult = extractDirectiveMetadata(node, decorator, this.reflector, this.evaluator, this.defaultImportRecorder, this.isCore);
            var analysis = directiveResult && directiveResult.metadata;
            // If the directive has a selector, it should be registered with the `SelectorScopeRegistry` so
            // when this directive appears in an `@NgModule` scope, its selector can be determined.
            if (analysis && analysis.selector !== null) {
                var ref = new imports_1.Reference(node);
                this.metaRegistry.registerDirectiveMetadata(tslib_1.__assign({ ref: ref, name: node.name.text, selector: analysis.selector, exportAs: analysis.exportAs, inputs: analysis.inputs, outputs: analysis.outputs, queries: analysis.queries.map(function (query) { return query.propertyName; }), isComponent: false }, util_1.extractDirectiveGuards(node, this.reflector), { baseClass: util_2.readBaseClass(node, this.reflector, this.evaluator) }));
            }
            if (analysis === undefined) {
                return {};
            }
            return {
                analysis: {
                    meta: analysis,
                    metadataStmt: metadata_1.generateSetClassMetadataCall(node, this.reflector, this.defaultImportRecorder, this.isCore),
                }
            };
        };
        DirectiveDecoratorHandler.prototype.compile = function (node, analysis, pool) {
            var res = compiler_1.compileDirectiveFromMetadata(analysis.meta, pool, compiler_1.makeBindingParser());
            var statements = res.statements;
            if (analysis.metadataStmt !== null) {
                statements.push(analysis.metadataStmt);
            }
            return {
                name: 'ngDirectiveDef',
                initializer: res.expression,
                statements: statements,
                type: res.type,
            };
        };
        return DirectiveDecoratorHandler;
    }());
    exports.DirectiveDecoratorHandler = DirectiveDecoratorHandler;
    /**
     * Helper function to extract metadata from a `Directive` or `Component`.
     */
    function extractDirectiveMetadata(clazz, decorator, reflector, evaluator, defaultImportRecorder, isCore, defaultSelector) {
        if (defaultSelector === void 0) { defaultSelector = null; }
        if (decorator.args === null || decorator.args.length !== 1) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, decorator.node, "Incorrect number of arguments to @" + decorator.name + " decorator");
        }
        var meta = util_2.unwrapExpression(decorator.args[0]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, "@" + decorator.name + " argument must be literal.");
        }
        var directive = reflection_1.reflectObjectLiteral(meta);
        if (directive.has('jit')) {
            // The only allowed value is true, so there's no need to expand further.
            return undefined;
        }
        var members = reflector.getMembersOfClass(clazz);
        // Precompute a list of ts.ClassElements that have decorators. This includes things like @Input,
        // @Output, @HostBinding, etc.
        var decoratedElements = members.filter(function (member) { return !member.isStatic && member.decorators !== null; });
        var coreModule = isCore ? undefined : '@angular/core';
        // Construct the map of inputs both from the @Directive/@Component
        // decorator, and the decorated
        // fields.
        var inputsFromMeta = parseFieldToPropertyMapping(directive, 'inputs', evaluator);
        var inputsFromFields = parseDecoratedFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'Input', coreModule), evaluator, resolveInput);
        // And outputs.
        var outputsFromMeta = parseFieldToPropertyMapping(directive, 'outputs', evaluator);
        var outputsFromFields = parseDecoratedFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'Output', coreModule), evaluator, resolveOutput);
        // Construct the list of queries.
        var contentChildFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ContentChild', coreModule), reflector, evaluator);
        var contentChildrenFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ContentChildren', coreModule), reflector, evaluator);
        var queries = tslib_1.__spread(contentChildFromFields, contentChildrenFromFields);
        // Construct the list of view queries.
        var viewChildFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ViewChild', coreModule), reflector, evaluator);
        var viewChildrenFromFields = queriesFromFields(reflection_1.filterToMembersWithDecorator(decoratedElements, 'ViewChildren', coreModule), reflector, evaluator);
        var viewQueries = tslib_1.__spread(viewChildFromFields, viewChildrenFromFields);
        if (directive.has('queries')) {
            var queriesFromDecorator = extractQueriesFromDecorator(directive.get('queries'), reflector, evaluator, isCore);
            queries.push.apply(queries, tslib_1.__spread(queriesFromDecorator.content));
            viewQueries.push.apply(viewQueries, tslib_1.__spread(queriesFromDecorator.view));
        }
        // Parse the selector.
        var selector = defaultSelector;
        if (directive.has('selector')) {
            var expr = directive.get('selector');
            var resolved = evaluator.evaluate(expr);
            if (typeof resolved !== 'string') {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, expr, "selector must be a string");
            }
            // use default selector in case selector is an empty string
            selector = resolved === '' ? defaultSelector : resolved;
        }
        if (!selector) {
            throw new Error("Directive " + clazz.name.text + " has no selector, please add it!");
        }
        var host = extractHostBindings(decoratedElements, evaluator, coreModule, directive);
        var providers = directive.has('providers') ? new compiler_1.WrappedNodeExpr(directive.get('providers')) : null;
        // Determine if `ngOnChanges` is a lifecycle hook defined on the component.
        var usesOnChanges = members.some(function (member) { return !member.isStatic && member.kind === reflection_1.ClassMemberKind.Method &&
            member.name === 'ngOnChanges'; });
        // Parse exportAs.
        var exportAs = null;
        if (directive.has('exportAs')) {
            var expr = directive.get('exportAs');
            var resolved = evaluator.evaluate(expr);
            if (typeof resolved !== 'string') {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, expr, "exportAs must be a string");
            }
            exportAs = resolved.split(',').map(function (part) { return part.trim(); });
        }
        // Detect if the component inherits from another class
        var usesInheritance = reflector.hasBaseClass(clazz);
        var metadata = {
            name: clazz.name.text,
            deps: util_2.getValidConstructorDependencies(clazz, reflector, defaultImportRecorder, isCore), host: host,
            lifecycle: {
                usesOnChanges: usesOnChanges,
            },
            inputs: tslib_1.__assign({}, inputsFromMeta, inputsFromFields),
            outputs: tslib_1.__assign({}, outputsFromMeta, outputsFromFields), queries: queries, viewQueries: viewQueries, selector: selector,
            type: new compiler_1.WrappedNodeExpr(clazz.name),
            typeArgumentCount: reflector.getGenericArityOfClass(clazz) || 0,
            typeSourceSpan: compiler_1.EMPTY_SOURCE_SPAN, usesInheritance: usesInheritance, exportAs: exportAs, providers: providers
        };
        return { decoratedElements: decoratedElements, decorator: directive, metadata: metadata };
    }
    exports.extractDirectiveMetadata = extractDirectiveMetadata;
    function extractQueryMetadata(exprNode, name, args, propertyName, reflector, evaluator) {
        if (args.length === 0) {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, exprNode, "@" + name + " must have arguments");
        }
        var first = name === 'ViewChild' || name === 'ContentChild';
        var node = util_2.unwrapForwardRef(args[0], reflector);
        var arg = evaluator.evaluate(node);
        /** Whether or not this query should collect only static results (see view/api.ts)  */
        var isStatic = false;
        // Extract the predicate
        var predicate = null;
        if (arg instanceof imports_1.Reference) {
            predicate = new compiler_1.WrappedNodeExpr(node);
        }
        else if (typeof arg === 'string') {
            predicate = [arg];
        }
        else if (isStringArrayOrDie(arg, '@' + name)) {
            predicate = arg;
        }
        else {
            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, node, "@" + name + " predicate cannot be interpreted");
        }
        // Extract the read and descendants options.
        var read = null;
        // The default value for descendants is true for every decorator except @ContentChildren.
        var descendants = name !== 'ContentChildren';
        if (args.length === 2) {
            var optionsExpr = util_2.unwrapExpression(args[1]);
            if (!ts.isObjectLiteralExpression(optionsExpr)) {
                throw new Error("@" + name + " options must be an object literal");
            }
            var options = reflection_1.reflectObjectLiteral(optionsExpr);
            if (options.has('read')) {
                read = new compiler_1.WrappedNodeExpr(options.get('read'));
            }
            if (options.has('descendants')) {
                var descendantsValue = evaluator.evaluate(options.get('descendants'));
                if (typeof descendantsValue !== 'boolean') {
                    throw new Error("@" + name + " options.descendants must be a boolean");
                }
                descendants = descendantsValue;
            }
            if (options.has('static')) {
                var staticValue = evaluator.evaluate(options.get('static'));
                if (typeof staticValue !== 'boolean') {
                    throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, node, "@" + name + " options.static must be a boolean");
                }
                isStatic = staticValue;
            }
        }
        else if (args.length > 2) {
            // Too many arguments.
            throw new Error("@" + name + " has too many arguments");
        }
        return {
            propertyName: propertyName,
            predicate: predicate,
            first: first,
            descendants: descendants,
            read: read,
            static: isStatic,
        };
    }
    exports.extractQueryMetadata = extractQueryMetadata;
    function extractQueriesFromDecorator(queryData, reflector, evaluator, isCore) {
        var content = [], view = [];
        var expr = util_2.unwrapExpression(queryData);
        if (!ts.isObjectLiteralExpression(queryData)) {
            throw new Error("queries metadata must be an object literal");
        }
        reflection_1.reflectObjectLiteral(queryData).forEach(function (queryExpr, propertyName) {
            queryExpr = util_2.unwrapExpression(queryExpr);
            if (!ts.isNewExpression(queryExpr) || !ts.isIdentifier(queryExpr.expression)) {
                throw new Error("query metadata must be an instance of a query type");
            }
            var type = reflector.getImportOfIdentifier(queryExpr.expression);
            if (type === null || (!isCore && type.from !== '@angular/core') ||
                !QUERY_TYPES.has(type.name)) {
                throw new Error("query metadata must be an instance of a query type");
            }
            var query = extractQueryMetadata(queryExpr, type.name, queryExpr.arguments || [], propertyName, reflector, evaluator);
            if (type.name.startsWith('Content')) {
                content.push(query);
            }
            else {
                view.push(query);
            }
        });
        return { content: content, view: view };
    }
    exports.extractQueriesFromDecorator = extractQueriesFromDecorator;
    function isStringArrayOrDie(value, name) {
        if (!Array.isArray(value)) {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            if (typeof value[i] !== 'string') {
                throw new Error("Failed to resolve " + name + "[" + i + "] to a string");
            }
        }
        return true;
    }
    function parseFieldArrayValue(directive, field, evaluator) {
        if (!directive.has(field)) {
            return null;
        }
        // Resolve the field of interest from the directive metadata to a string[].
        var value = evaluator.evaluate(directive.get(field));
        if (!isStringArrayOrDie(value, field)) {
            throw new Error("Failed to resolve @Directive." + field);
        }
        return value;
    }
    exports.parseFieldArrayValue = parseFieldArrayValue;
    /**
     * Interpret property mapping fields on the decorator (e.g. inputs or outputs) and return the
     * correctly shaped metadata object.
     */
    function parseFieldToPropertyMapping(directive, field, evaluator) {
        var metaValues = parseFieldArrayValue(directive, field, evaluator);
        if (!metaValues) {
            return EMPTY_OBJECT;
        }
        return metaValues.reduce(function (results, value) {
            // Either the value is 'field' or 'field: property'. In the first case, `property` will
            // be undefined, in which case the field name should also be used as the property name.
            var _a = tslib_1.__read(value.split(':', 2).map(function (str) { return str.trim(); }), 2), field = _a[0], property = _a[1];
            results[field] = property || field;
            return results;
        }, {});
    }
    /**
     * Parse property decorators (e.g. `Input` or `Output`) and return the correctly shaped metadata
     * object.
     */
    function parseDecoratedFields(fields, evaluator, mapValueResolver) {
        return fields.reduce(function (results, field) {
            var fieldName = field.member.name;
            field.decorators.forEach(function (decorator) {
                // The decorator either doesn't have an argument (@Input()) in which case the property
                // name is used, or it has one argument (@Output('named')).
                if (decorator.args == null || decorator.args.length === 0) {
                    results[fieldName] = fieldName;
                }
                else if (decorator.args.length === 1) {
                    var property = evaluator.evaluate(decorator.args[0]);
                    if (typeof property !== 'string') {
                        throw new Error("Decorator argument must resolve to a string");
                    }
                    results[fieldName] = mapValueResolver(property, fieldName);
                }
                else {
                    // Too many arguments.
                    throw new Error("Decorator must have 0 or 1 arguments, got " + decorator.args.length + " argument(s)");
                }
            });
            return results;
        }, {});
    }
    function resolveInput(publicName, internalName) {
        return [publicName, internalName];
    }
    function resolveOutput(publicName, internalName) {
        return publicName;
    }
    function queriesFromFields(fields, reflector, evaluator) {
        return fields.map(function (_a) {
            var member = _a.member, decorators = _a.decorators;
            var decorator = decorators[0];
            var node = member.node || decorator.node;
            // Throw in case of `@Input() @ContentChild('foo') foo: any`, which is not supported in Ivy
            if (member.decorators.some(function (v) { return v.name === 'Input'; })) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_COLLISION, node, 'Cannot combine @Input decorators with query decorators');
            }
            if (decorators.length !== 1) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_COLLISION, node, 'Cannot have multiple query decorators on the same class member');
            }
            else if (!isPropertyTypeMember(member)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_UNEXPECTED, node, 'Query decorator must go on a property-type member');
            }
            return extractQueryMetadata(decorator.node, decorator.name, decorator.args || [], member.name, reflector, evaluator);
        });
    }
    exports.queriesFromFields = queriesFromFields;
    function isPropertyTypeMember(member) {
        return member.kind === reflection_1.ClassMemberKind.Getter || member.kind === reflection_1.ClassMemberKind.Setter ||
            member.kind === reflection_1.ClassMemberKind.Property;
    }
    function extractHostBindings(members, evaluator, coreModule, metadata) {
        var hostMetadata = {};
        if (metadata && metadata.has('host')) {
            var expr = metadata.get('host');
            var hostMetaMap = evaluator.evaluate(expr);
            if (!(hostMetaMap instanceof Map)) {
                throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARG_NOT_LITERAL, expr, "Decorator host metadata must be an object");
            }
            hostMetaMap.forEach(function (value, key) {
                // Resolve Enum references to their declared value.
                if (value instanceof partial_evaluator_1.EnumValue) {
                    value = value.resolved;
                }
                if (typeof key !== 'string') {
                    throw new Error("Decorator host metadata must be a string -> string object, but found unparseable key " + key);
                }
                if (typeof value == 'string') {
                    hostMetadata[key] = value;
                }
                else if (value instanceof partial_evaluator_1.DynamicValue) {
                    hostMetadata[key] = new compiler_1.WrappedNodeExpr(value.node);
                }
                else {
                    throw new Error("Decorator host metadata must be a string -> string object, but found unparseable value " + value);
                }
            });
        }
        var bindings = compiler_1.parseHostBindings(hostMetadata);
        // TODO: create and provide proper sourceSpan to make error message more descriptive (FW-995)
        // For now, pass an incorrect (empty) but valid sourceSpan.
        var errors = compiler_1.verifyHostBindings(bindings, compiler_1.EMPTY_SOURCE_SPAN);
        if (errors.length > 0) {
            throw new diagnostics_1.FatalDiagnosticError(
            // TODO: provide more granular diagnostic and output specific host expression that triggered
            // an error instead of the whole host object
            diagnostics_1.ErrorCode.HOST_BINDING_PARSE_ERROR, metadata.get('host'), errors.map(function (error) { return error.msg; }).join('\n'));
        }
        reflection_1.filterToMembersWithDecorator(members, 'HostBinding', coreModule)
            .forEach(function (_a) {
            var member = _a.member, decorators = _a.decorators;
            decorators.forEach(function (decorator) {
                var hostPropertyName = member.name;
                if (decorator.args !== null && decorator.args.length > 0) {
                    if (decorator.args.length !== 1) {
                        throw new Error("@HostBinding() can have at most one argument");
                    }
                    var resolved = evaluator.evaluate(decorator.args[0]);
                    if (typeof resolved !== 'string') {
                        throw new Error("@HostBinding()'s argument must be a string");
                    }
                    hostPropertyName = resolved;
                }
                bindings.properties[hostPropertyName] = member.name;
            });
        });
        reflection_1.filterToMembersWithDecorator(members, 'HostListener', coreModule)
            .forEach(function (_a) {
            var member = _a.member, decorators = _a.decorators;
            decorators.forEach(function (decorator) {
                var eventName = member.name;
                var args = [];
                if (decorator.args !== null && decorator.args.length > 0) {
                    if (decorator.args.length > 2) {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.DECORATOR_ARITY_WRONG, decorator.args[2], "@HostListener() can have at most two arguments");
                    }
                    var resolved = evaluator.evaluate(decorator.args[0]);
                    if (typeof resolved !== 'string') {
                        throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, decorator.args[0], "@HostListener()'s event name argument must be a string");
                    }
                    eventName = resolved;
                    if (decorator.args.length === 2) {
                        var resolvedArgs = evaluator.evaluate(decorator.args[1]);
                        if (!isStringArrayOrDie(resolvedArgs, '@HostListener.args')) {
                            throw new diagnostics_1.FatalDiagnosticError(diagnostics_1.ErrorCode.VALUE_HAS_WRONG_TYPE, decorator.args[1], "@HostListener second argument must be a string array");
                        }
                        args = resolvedArgs;
                    }
                }
                bindings.listeners[eventName] = member.name + "(" + args.join(',') + ")";
            });
        });
        return bindings;
    }
    exports.extractHostBindings = extractHostBindings;
    var QUERY_TYPES = new Set([
        'ContentChild',
        'ContentChildren',
        'ViewChild',
        'ViewChildren',
    ]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucy9zcmMvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDhDQUF3UTtJQUN4USwrQkFBaUM7SUFFakMsMkVBQWtFO0lBQ2xFLG1FQUErRDtJQUUvRCwwRUFBK0Q7SUFDL0QsdUZBQWtGO0lBQ2xGLHlFQUErSjtJQUMvSix1RUFBaUg7SUFFakgscUZBQXdEO0lBQ3hELDZFQUFnSTtJQUVoSSxJQUFNLFlBQVksR0FBNEIsRUFBRSxDQUFDO0lBTWpEO1FBRUUsbUNBQ1ksU0FBeUIsRUFBVSxTQUEyQixFQUM5RCxZQUE4QixFQUFVLHFCQUE0QyxFQUNwRixNQUFlO1lBRmYsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7WUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtZQUM5RCxpQkFBWSxHQUFaLFlBQVksQ0FBa0I7WUFBVSwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1lBQ3BGLFdBQU0sR0FBTixNQUFNLENBQVM7WUFFbEIsZUFBVSxHQUFHLDZCQUFpQixDQUFDLE9BQU8sQ0FBQztRQUZsQixDQUFDO1FBSS9CLDBDQUFNLEdBQU4sVUFBTyxJQUFzQixFQUFFLFVBQTRCO1lBQ3pELElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFDRCxJQUFNLFNBQVMsR0FBRywyQkFBb0IsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3RSxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQzNCLE9BQU87b0JBQ0wsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUN2QixRQUFRLEVBQUUsU0FBUztpQkFDcEIsQ0FBQzthQUNI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QUFJLENBQUMsQ0FBQyxDQUFDLEVBQ2pELHNEQUFzRCxDQUFDLENBQUM7eUJBQzdEO3dCQUNELElBQUksR0FBRyxZQUFZLENBQUM7cUJBQ3JCO2lCQUNGO2dCQUVELFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQU0sTUFBTSxDQUFDLElBQUksU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFHLENBQUM7WUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUF2R0Qsa0RBdUdDO0lBRUQsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDMUIsY0FBYztRQUNkLGlCQUFpQjtRQUNqQixXQUFXO1FBQ1gsY0FBYztLQUNmLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25zdGFudFBvb2wsIEVNUFRZX1NPVVJDRV9TUEFOLCBFeHByZXNzaW9uLCBQYXJzZUVycm9yLCBQYXJzZWRIb3N0QmluZGluZ3MsIFIzRGlyZWN0aXZlTWV0YWRhdGEsIFIzUXVlcnlNZXRhZGF0YSwgU3RhdGVtZW50LCBXcmFwcGVkTm9kZUV4cHIsIGNvbXBpbGVEaXJlY3RpdmVGcm9tTWV0YWRhdGEsIG1ha2VCaW5kaW5nUGFyc2VyLCBwYXJzZUhvc3RCaW5kaW5ncywgdmVyaWZ5SG9zdEJpbmRpbmdzfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtFcnJvckNvZGUsIEZhdGFsRGlhZ25vc3RpY0Vycm9yfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0RlZmF1bHRJbXBvcnRSZWNvcmRlciwgUmVmZXJlbmNlfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7TWV0YWRhdGFSZWdpc3RyeX0gZnJvbSAnLi4vLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHtleHRyYWN0RGlyZWN0aXZlR3VhcmRzfSBmcm9tICcuLi8uLi9tZXRhZGF0YS9zcmMvdXRpbCc7XG5pbXBvcnQge0R5bmFtaWNWYWx1ZSwgRW51bVZhbHVlLCBQYXJ0aWFsRXZhbHVhdG9yfSBmcm9tICcuLi8uLi9wYXJ0aWFsX2V2YWx1YXRvcic7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIENsYXNzTWVtYmVyLCBDbGFzc01lbWJlcktpbmQsIERlY29yYXRvciwgUmVmbGVjdGlvbkhvc3QsIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IsIHJlZmxlY3RPYmplY3RMaXRlcmFsfSBmcm9tICcuLi8uLi9yZWZsZWN0aW9uJztcbmltcG9ydCB7QW5hbHlzaXNPdXRwdXQsIENvbXBpbGVSZXN1bHQsIERlY29yYXRvckhhbmRsZXIsIERldGVjdFJlc3VsdCwgSGFuZGxlclByZWNlZGVuY2V9IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5cbmltcG9ydCB7Z2VuZXJhdGVTZXRDbGFzc01ldGFkYXRhQ2FsbH0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQge2ZpbmRBbmd1bGFyRGVjb3JhdG9yLCBnZXRWYWxpZENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzLCByZWFkQmFzZUNsYXNzLCB1bndyYXBFeHByZXNzaW9uLCB1bndyYXBGb3J3YXJkUmVmfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBFTVBUWV9PQkpFQ1Q6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlyZWN0aXZlSGFuZGxlckRhdGEge1xuICBtZXRhOiBSM0RpcmVjdGl2ZU1ldGFkYXRhO1xuICBtZXRhZGF0YVN0bXQ6IFN0YXRlbWVudHxudWxsO1xufVxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZURlY29yYXRvckhhbmRsZXIgaW1wbGVtZW50c1xuICAgIERlY29yYXRvckhhbmRsZXI8RGlyZWN0aXZlSGFuZGxlckRhdGEsIERlY29yYXRvcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgcHJpdmF0ZSBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IsXG4gICAgICBwcml2YXRlIG1ldGFSZWdpc3RyeTogTWV0YWRhdGFSZWdpc3RyeSwgcHJpdmF0ZSBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlcixcbiAgICAgIHByaXZhdGUgaXNDb3JlOiBib29sZWFuKSB7fVxuXG4gIHJlYWRvbmx5IHByZWNlZGVuY2UgPSBIYW5kbGVyUHJlY2VkZW5jZS5QUklNQVJZO1xuXG4gIGRldGVjdChub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBkZWNvcmF0b3JzOiBEZWNvcmF0b3JbXXxudWxsKTogRGV0ZWN0UmVzdWx0PERlY29yYXRvcj58dW5kZWZpbmVkIHtcbiAgICBpZiAoIWRlY29yYXRvcnMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IGRlY29yYXRvciA9IGZpbmRBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvcnMsICdEaXJlY3RpdmUnLCB0aGlzLmlzQ29yZSk7XG4gICAgaWYgKGRlY29yYXRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmlnZ2VyOiBkZWNvcmF0b3Iubm9kZSxcbiAgICAgICAgbWV0YWRhdGE6IGRlY29yYXRvcixcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgYW5hbHl6ZShub2RlOiBDbGFzc0RlY2xhcmF0aW9uLCBkZWNvcmF0b3I6IERlY29yYXRvcik6IEFuYWx5c2lzT3V0cHV0PERpcmVjdGl2ZUhhbmRsZXJEYXRhPiB7XG4gICAgY29uc3QgZGlyZWN0aXZlUmVzdWx0ID0gZXh0cmFjdERpcmVjdGl2ZU1ldGFkYXRhKFxuICAgICAgICBub2RlLCBkZWNvcmF0b3IsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmV2YWx1YXRvciwgdGhpcy5kZWZhdWx0SW1wb3J0UmVjb3JkZXIsIHRoaXMuaXNDb3JlKTtcbiAgICBjb25zdCBhbmFseXNpcyA9IGRpcmVjdGl2ZVJlc3VsdCAmJiBkaXJlY3RpdmVSZXN1bHQubWV0YWRhdGE7XG5cbiAgICAvLyBJZiB0aGUgZGlyZWN0aXZlIGhhcyBhIHNlbGVjdG9yLCBpdCBzaG91bGQgYmUgcmVnaXN0ZXJlZCB3aXRoIHRoZSBgU2VsZWN0b3JTY29wZVJlZ2lzdHJ5YCBzb1xuICAgIC8vIHdoZW4gdGhpcyBkaXJlY3RpdmUgYXBwZWFycyBpbiBhbiBgQE5nTW9kdWxlYCBzY29wZSwgaXRzIHNlbGVjdG9yIGNhbiBiZSBkZXRlcm1pbmVkLlxuICAgIGlmIChhbmFseXNpcyAmJiBhbmFseXNpcy5zZWxlY3RvciAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgcmVmID0gbmV3IFJlZmVyZW5jZShub2RlKTtcbiAgICAgIHRoaXMubWV0YVJlZ2lzdHJ5LnJlZ2lzdGVyRGlyZWN0aXZlTWV0YWRhdGEoe1xuICAgICAgICByZWYsXG4gICAgICAgIG5hbWU6IG5vZGUubmFtZS50ZXh0LFxuICAgICAgICBzZWxlY3RvcjogYW5hbHlzaXMuc2VsZWN0b3IsXG4gICAgICAgIGV4cG9ydEFzOiBhbmFseXNpcy5leHBvcnRBcyxcbiAgICAgICAgaW5wdXRzOiBhbmFseXNpcy5pbnB1dHMsXG4gICAgICAgIG91dHB1dHM6IGFuYWx5c2lzLm91dHB1dHMsXG4gICAgICAgIHF1ZXJpZXM6IGFuYWx5c2lzLnF1ZXJpZXMubWFwKHF1ZXJ5ID0+IHF1ZXJ5LnByb3BlcnR5TmFtZSksXG4gICAgICAgIGlzQ29tcG9uZW50OiBmYWxzZSwgLi4uZXh0cmFjdERpcmVjdGl2ZUd1YXJkcyhub2RlLCB0aGlzLnJlZmxlY3RvciksXG4gICAgICAgIGJhc2VDbGFzczogcmVhZEJhc2VDbGFzcyhub2RlLCB0aGlzLnJlZmxlY3RvciwgdGhpcy5ldmFsdWF0b3IpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFuYWx5c2lzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYW5hbHlzaXM6IHtcbiAgICAgICAgbWV0YTogYW5hbHlzaXMsXG4gICAgICAgIG1ldGFkYXRhU3RtdDogZ2VuZXJhdGVTZXRDbGFzc01ldGFkYXRhQ2FsbChcbiAgICAgICAgICAgIG5vZGUsIHRoaXMucmVmbGVjdG9yLCB0aGlzLmRlZmF1bHRJbXBvcnRSZWNvcmRlciwgdGhpcy5pc0NvcmUpLFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBjb21waWxlKG5vZGU6IENsYXNzRGVjbGFyYXRpb24sIGFuYWx5c2lzOiBEaXJlY3RpdmVIYW5kbGVyRGF0YSwgcG9vbDogQ29uc3RhbnRQb29sKTpcbiAgICAgIENvbXBpbGVSZXN1bHQge1xuICAgIGNvbnN0IHJlcyA9IGNvbXBpbGVEaXJlY3RpdmVGcm9tTWV0YWRhdGEoYW5hbHlzaXMubWV0YSwgcG9vbCwgbWFrZUJpbmRpbmdQYXJzZXIoKSk7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IHJlcy5zdGF0ZW1lbnRzO1xuICAgIGlmIChhbmFseXNpcy5tZXRhZGF0YVN0bXQgIT09IG51bGwpIHtcbiAgICAgIHN0YXRlbWVudHMucHVzaChhbmFseXNpcy5tZXRhZGF0YVN0bXQpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ25nRGlyZWN0aXZlRGVmJyxcbiAgICAgIGluaXRpYWxpemVyOiByZXMuZXhwcmVzc2lvbixcbiAgICAgIHN0YXRlbWVudHM6IHN0YXRlbWVudHMsXG4gICAgICB0eXBlOiByZXMudHlwZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGV4dHJhY3QgbWV0YWRhdGEgZnJvbSBhIGBEaXJlY3RpdmVgIG9yIGBDb21wb25lbnRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdERpcmVjdGl2ZU1ldGFkYXRhKFxuICAgIGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uLCBkZWNvcmF0b3I6IERlY29yYXRvciwgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCxcbiAgICBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IsIGRlZmF1bHRJbXBvcnRSZWNvcmRlcjogRGVmYXVsdEltcG9ydFJlY29yZGVyLCBpc0NvcmU6IGJvb2xlYW4sXG4gICAgZGVmYXVsdFNlbGVjdG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbCk6IHtcbiAgZGVjb3JhdG9yOiBNYXA8c3RyaW5nLCB0cy5FeHByZXNzaW9uPixcbiAgbWV0YWRhdGE6IFIzRGlyZWN0aXZlTWV0YWRhdGEsXG4gIGRlY29yYXRlZEVsZW1lbnRzOiBDbGFzc01lbWJlcltdLFxufXx1bmRlZmluZWQge1xuICBpZiAoZGVjb3JhdG9yLmFyZ3MgPT09IG51bGwgfHwgZGVjb3JhdG9yLmFyZ3MubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBkZWNvcmF0b3Iubm9kZSxcbiAgICAgICAgYEluY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzIHRvIEAke2RlY29yYXRvci5uYW1lfSBkZWNvcmF0b3JgKTtcbiAgfVxuICBjb25zdCBtZXRhID0gdW53cmFwRXhwcmVzc2lvbihkZWNvcmF0b3IuYXJnc1swXSk7XG4gIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihtZXRhKSkge1xuICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9BUkdfTk9UX0xJVEVSQUwsIG1ldGEsIGBAJHtkZWNvcmF0b3IubmFtZX0gYXJndW1lbnQgbXVzdCBiZSBsaXRlcmFsLmApO1xuICB9XG4gIGNvbnN0IGRpcmVjdGl2ZSA9IHJlZmxlY3RPYmplY3RMaXRlcmFsKG1ldGEpO1xuXG4gIGlmIChkaXJlY3RpdmUuaGFzKCdqaXQnKSkge1xuICAgIC8vIFRoZSBvbmx5IGFsbG93ZWQgdmFsdWUgaXMgdHJ1ZSwgc28gdGhlcmUncyBubyBuZWVkIHRvIGV4cGFuZCBmdXJ0aGVyLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBtZW1iZXJzID0gcmVmbGVjdG9yLmdldE1lbWJlcnNPZkNsYXNzKGNsYXp6KTtcblxuICAvLyBQcmVjb21wdXRlIGEgbGlzdCBvZiB0cy5DbGFzc0VsZW1lbnRzIHRoYXQgaGF2ZSBkZWNvcmF0b3JzLiBUaGlzIGluY2x1ZGVzIHRoaW5ncyBsaWtlIEBJbnB1dCxcbiAgLy8gQE91dHB1dCwgQEhvc3RCaW5kaW5nLCBldGMuXG4gIGNvbnN0IGRlY29yYXRlZEVsZW1lbnRzID1cbiAgICAgIG1lbWJlcnMuZmlsdGVyKG1lbWJlciA9PiAhbWVtYmVyLmlzU3RhdGljICYmIG1lbWJlci5kZWNvcmF0b3JzICE9PSBudWxsKTtcblxuICBjb25zdCBjb3JlTW9kdWxlID0gaXNDb3JlID8gdW5kZWZpbmVkIDogJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gIC8vIENvbnN0cnVjdCB0aGUgbWFwIG9mIGlucHV0cyBib3RoIGZyb20gdGhlIEBEaXJlY3RpdmUvQENvbXBvbmVudFxuICAvLyBkZWNvcmF0b3IsIGFuZCB0aGUgZGVjb3JhdGVkXG4gIC8vIGZpZWxkcy5cbiAgY29uc3QgaW5wdXRzRnJvbU1ldGEgPSBwYXJzZUZpZWxkVG9Qcm9wZXJ0eU1hcHBpbmcoZGlyZWN0aXZlLCAnaW5wdXRzJywgZXZhbHVhdG9yKTtcbiAgY29uc3QgaW5wdXRzRnJvbUZpZWxkcyA9IHBhcnNlRGVjb3JhdGVkRmllbGRzKFxuICAgICAgZmlsdGVyVG9NZW1iZXJzV2l0aERlY29yYXRvcihkZWNvcmF0ZWRFbGVtZW50cywgJ0lucHV0JywgY29yZU1vZHVsZSksIGV2YWx1YXRvcixcbiAgICAgIHJlc29sdmVJbnB1dCk7XG5cbiAgLy8gQW5kIG91dHB1dHMuXG4gIGNvbnN0IG91dHB1dHNGcm9tTWV0YSA9IHBhcnNlRmllbGRUb1Byb3BlcnR5TWFwcGluZyhkaXJlY3RpdmUsICdvdXRwdXRzJywgZXZhbHVhdG9yKTtcbiAgY29uc3Qgb3V0cHV0c0Zyb21GaWVsZHMgPSBwYXJzZURlY29yYXRlZEZpZWxkcyhcbiAgICAgIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IoZGVjb3JhdGVkRWxlbWVudHMsICdPdXRwdXQnLCBjb3JlTW9kdWxlKSwgZXZhbHVhdG9yLFxuICAgICAgcmVzb2x2ZU91dHB1dCkgYXN7W2ZpZWxkOiBzdHJpbmddOiBzdHJpbmd9O1xuICAvLyBDb25zdHJ1Y3QgdGhlIGxpc3Qgb2YgcXVlcmllcy5cbiAgY29uc3QgY29udGVudENoaWxkRnJvbUZpZWxkcyA9IHF1ZXJpZXNGcm9tRmllbGRzKFxuICAgICAgZmlsdGVyVG9NZW1iZXJzV2l0aERlY29yYXRvcihkZWNvcmF0ZWRFbGVtZW50cywgJ0NvbnRlbnRDaGlsZCcsIGNvcmVNb2R1bGUpLCByZWZsZWN0b3IsXG4gICAgICBldmFsdWF0b3IpO1xuICBjb25zdCBjb250ZW50Q2hpbGRyZW5Gcm9tRmllbGRzID0gcXVlcmllc0Zyb21GaWVsZHMoXG4gICAgICBmaWx0ZXJUb01lbWJlcnNXaXRoRGVjb3JhdG9yKGRlY29yYXRlZEVsZW1lbnRzLCAnQ29udGVudENoaWxkcmVuJywgY29yZU1vZHVsZSksIHJlZmxlY3RvcixcbiAgICAgIGV2YWx1YXRvcik7XG5cbiAgY29uc3QgcXVlcmllcyA9IFsuLi5jb250ZW50Q2hpbGRGcm9tRmllbGRzLCAuLi5jb250ZW50Q2hpbGRyZW5Gcm9tRmllbGRzXTtcblxuICAvLyBDb25zdHJ1Y3QgdGhlIGxpc3Qgb2YgdmlldyBxdWVyaWVzLlxuICBjb25zdCB2aWV3Q2hpbGRGcm9tRmllbGRzID0gcXVlcmllc0Zyb21GaWVsZHMoXG4gICAgICBmaWx0ZXJUb01lbWJlcnNXaXRoRGVjb3JhdG9yKGRlY29yYXRlZEVsZW1lbnRzLCAnVmlld0NoaWxkJywgY29yZU1vZHVsZSksIHJlZmxlY3RvcixcbiAgICAgIGV2YWx1YXRvcik7XG4gIGNvbnN0IHZpZXdDaGlsZHJlbkZyb21GaWVsZHMgPSBxdWVyaWVzRnJvbUZpZWxkcyhcbiAgICAgIGZpbHRlclRvTWVtYmVyc1dpdGhEZWNvcmF0b3IoZGVjb3JhdGVkRWxlbWVudHMsICdWaWV3Q2hpbGRyZW4nLCBjb3JlTW9kdWxlKSwgcmVmbGVjdG9yLFxuICAgICAgZXZhbHVhdG9yKTtcbiAgY29uc3Qgdmlld1F1ZXJpZXMgPSBbLi4udmlld0NoaWxkRnJvbUZpZWxkcywgLi4udmlld0NoaWxkcmVuRnJvbUZpZWxkc107XG5cbiAgaWYgKGRpcmVjdGl2ZS5oYXMoJ3F1ZXJpZXMnKSkge1xuICAgIGNvbnN0IHF1ZXJpZXNGcm9tRGVjb3JhdG9yID1cbiAgICAgICAgZXh0cmFjdFF1ZXJpZXNGcm9tRGVjb3JhdG9yKGRpcmVjdGl2ZS5nZXQoJ3F1ZXJpZXMnKSAhLCByZWZsZWN0b3IsIGV2YWx1YXRvciwgaXNDb3JlKTtcbiAgICBxdWVyaWVzLnB1c2goLi4ucXVlcmllc0Zyb21EZWNvcmF0b3IuY29udGVudCk7XG4gICAgdmlld1F1ZXJpZXMucHVzaCguLi5xdWVyaWVzRnJvbURlY29yYXRvci52aWV3KTtcbiAgfVxuXG4gIC8vIFBhcnNlIHRoZSBzZWxlY3Rvci5cbiAgbGV0IHNlbGVjdG9yID0gZGVmYXVsdFNlbGVjdG9yO1xuICBpZiAoZGlyZWN0aXZlLmhhcygnc2VsZWN0b3InKSkge1xuICAgIGNvbnN0IGV4cHIgPSBkaXJlY3RpdmUuZ2V0KCdzZWxlY3RvcicpICE7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSBldmFsdWF0b3IuZXZhbHVhdGUoZXhwcik7XG4gICAgaWYgKHR5cGVvZiByZXNvbHZlZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuVkFMVUVfSEFTX1dST05HX1RZUEUsIGV4cHIsIGBzZWxlY3RvciBtdXN0IGJlIGEgc3RyaW5nYCk7XG4gICAgfVxuICAgIC8vIHVzZSBkZWZhdWx0IHNlbGVjdG9yIGluIGNhc2Ugc2VsZWN0b3IgaXMgYW4gZW1wdHkgc3RyaW5nXG4gICAgc2VsZWN0b3IgPSByZXNvbHZlZCA9PT0gJycgPyBkZWZhdWx0U2VsZWN0b3IgOiByZXNvbHZlZDtcbiAgfVxuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBEaXJlY3RpdmUgJHtjbGF6ei5uYW1lLnRleHR9IGhhcyBubyBzZWxlY3RvciwgcGxlYXNlIGFkZCBpdCFgKTtcbiAgfVxuXG4gIGNvbnN0IGhvc3QgPSBleHRyYWN0SG9zdEJpbmRpbmdzKGRlY29yYXRlZEVsZW1lbnRzLCBldmFsdWF0b3IsIGNvcmVNb2R1bGUsIGRpcmVjdGl2ZSk7XG5cbiAgY29uc3QgcHJvdmlkZXJzOiBFeHByZXNzaW9ufG51bGwgPVxuICAgICAgZGlyZWN0aXZlLmhhcygncHJvdmlkZXJzJykgPyBuZXcgV3JhcHBlZE5vZGVFeHByKGRpcmVjdGl2ZS5nZXQoJ3Byb3ZpZGVycycpICEpIDogbnVsbDtcblxuICAvLyBEZXRlcm1pbmUgaWYgYG5nT25DaGFuZ2VzYCBpcyBhIGxpZmVjeWNsZSBob29rIGRlZmluZWQgb24gdGhlIGNvbXBvbmVudC5cbiAgY29uc3QgdXNlc09uQ2hhbmdlcyA9IG1lbWJlcnMuc29tZShcbiAgICAgIG1lbWJlciA9PiAhbWVtYmVyLmlzU3RhdGljICYmIG1lbWJlci5raW5kID09PSBDbGFzc01lbWJlcktpbmQuTWV0aG9kICYmXG4gICAgICAgICAgbWVtYmVyLm5hbWUgPT09ICduZ09uQ2hhbmdlcycpO1xuXG4gIC8vIFBhcnNlIGV4cG9ydEFzLlxuICBsZXQgZXhwb3J0QXM6IHN0cmluZ1tdfG51bGwgPSBudWxsO1xuICBpZiAoZGlyZWN0aXZlLmhhcygnZXhwb3J0QXMnKSkge1xuICAgIGNvbnN0IGV4cHIgPSBkaXJlY3RpdmUuZ2V0KCdleHBvcnRBcycpICE7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSBldmFsdWF0b3IuZXZhbHVhdGUoZXhwcik7XG4gICAgaWYgKHR5cGVvZiByZXNvbHZlZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuVkFMVUVfSEFTX1dST05HX1RZUEUsIGV4cHIsIGBleHBvcnRBcyBtdXN0IGJlIGEgc3RyaW5nYCk7XG4gICAgfVxuICAgIGV4cG9ydEFzID0gcmVzb2x2ZWQuc3BsaXQoJywnKS5tYXAocGFydCA9PiBwYXJ0LnRyaW0oKSk7XG4gIH1cblxuICAvLyBEZXRlY3QgaWYgdGhlIGNvbXBvbmVudCBpbmhlcml0cyBmcm9tIGFub3RoZXIgY2xhc3NcbiAgY29uc3QgdXNlc0luaGVyaXRhbmNlID0gcmVmbGVjdG9yLmhhc0Jhc2VDbGFzcyhjbGF6eik7XG4gIGNvbnN0IG1ldGFkYXRhOiBSM0RpcmVjdGl2ZU1ldGFkYXRhID0ge1xuICAgIG5hbWU6IGNsYXp6Lm5hbWUudGV4dCxcbiAgICBkZXBzOiBnZXRWYWxpZENvbnN0cnVjdG9yRGVwZW5kZW5jaWVzKGNsYXp6LCByZWZsZWN0b3IsIGRlZmF1bHRJbXBvcnRSZWNvcmRlciwgaXNDb3JlKSwgaG9zdCxcbiAgICBsaWZlY3ljbGU6IHtcbiAgICAgICAgdXNlc09uQ2hhbmdlcyxcbiAgICB9LFxuICAgIGlucHV0czogey4uLmlucHV0c0Zyb21NZXRhLCAuLi5pbnB1dHNGcm9tRmllbGRzfSxcbiAgICBvdXRwdXRzOiB7Li4ub3V0cHV0c0Zyb21NZXRhLCAuLi5vdXRwdXRzRnJvbUZpZWxkc30sIHF1ZXJpZXMsIHZpZXdRdWVyaWVzLCBzZWxlY3RvcixcbiAgICB0eXBlOiBuZXcgV3JhcHBlZE5vZGVFeHByKGNsYXp6Lm5hbWUpLFxuICAgIHR5cGVBcmd1bWVudENvdW50OiByZWZsZWN0b3IuZ2V0R2VuZXJpY0FyaXR5T2ZDbGFzcyhjbGF6eikgfHwgMCxcbiAgICB0eXBlU291cmNlU3BhbjogRU1QVFlfU09VUkNFX1NQQU4sIHVzZXNJbmhlcml0YW5jZSwgZXhwb3J0QXMsIHByb3ZpZGVyc1xuICB9O1xuICByZXR1cm4ge2RlY29yYXRlZEVsZW1lbnRzLCBkZWNvcmF0b3I6IGRpcmVjdGl2ZSwgbWV0YWRhdGF9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5TWV0YWRhdGEoXG4gICAgZXhwck5vZGU6IHRzLk5vZGUsIG5hbWU6IHN0cmluZywgYXJnczogUmVhZG9ubHlBcnJheTx0cy5FeHByZXNzaW9uPiwgcHJvcGVydHlOYW1lOiBzdHJpbmcsXG4gICAgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yKTogUjNRdWVyeU1ldGFkYXRhIHtcbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSSVRZX1dST05HLCBleHByTm9kZSwgYEAke25hbWV9IG11c3QgaGF2ZSBhcmd1bWVudHNgKTtcbiAgfVxuICBjb25zdCBmaXJzdCA9IG5hbWUgPT09ICdWaWV3Q2hpbGQnIHx8IG5hbWUgPT09ICdDb250ZW50Q2hpbGQnO1xuICBjb25zdCBub2RlID0gdW53cmFwRm9yd2FyZFJlZihhcmdzWzBdLCByZWZsZWN0b3IpO1xuICBjb25zdCBhcmcgPSBldmFsdWF0b3IuZXZhbHVhdGUobm9kZSk7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoaXMgcXVlcnkgc2hvdWxkIGNvbGxlY3Qgb25seSBzdGF0aWMgcmVzdWx0cyAoc2VlIHZpZXcvYXBpLnRzKSAgKi9cbiAgbGV0IGlzU3RhdGljOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gRXh0cmFjdCB0aGUgcHJlZGljYXRlXG4gIGxldCBwcmVkaWNhdGU6IEV4cHJlc3Npb258c3RyaW5nW118bnVsbCA9IG51bGw7XG4gIGlmIChhcmcgaW5zdGFuY2VvZiBSZWZlcmVuY2UpIHtcbiAgICBwcmVkaWNhdGUgPSBuZXcgV3JhcHBlZE5vZGVFeHByKG5vZGUpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgcHJlZGljYXRlID0gW2FyZ107XG4gIH0gZWxzZSBpZiAoaXNTdHJpbmdBcnJheU9yRGllKGFyZywgJ0AnICsgbmFtZSkpIHtcbiAgICBwcmVkaWNhdGUgPSBhcmcgYXMgc3RyaW5nW107XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICBFcnJvckNvZGUuVkFMVUVfSEFTX1dST05HX1RZUEUsIG5vZGUsIGBAJHtuYW1lfSBwcmVkaWNhdGUgY2Fubm90IGJlIGludGVycHJldGVkYCk7XG4gIH1cblxuICAvLyBFeHRyYWN0IHRoZSByZWFkIGFuZCBkZXNjZW5kYW50cyBvcHRpb25zLlxuICBsZXQgcmVhZDogRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcbiAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGRlc2NlbmRhbnRzIGlzIHRydWUgZm9yIGV2ZXJ5IGRlY29yYXRvciBleGNlcHQgQENvbnRlbnRDaGlsZHJlbi5cbiAgbGV0IGRlc2NlbmRhbnRzOiBib29sZWFuID0gbmFtZSAhPT0gJ0NvbnRlbnRDaGlsZHJlbic7XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgIGNvbnN0IG9wdGlvbnNFeHByID0gdW53cmFwRXhwcmVzc2lvbihhcmdzWzFdKTtcbiAgICBpZiAoIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24ob3B0aW9uc0V4cHIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEAke25hbWV9IG9wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QgbGl0ZXJhbGApO1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0gcmVmbGVjdE9iamVjdExpdGVyYWwob3B0aW9uc0V4cHIpO1xuICAgIGlmIChvcHRpb25zLmhhcygncmVhZCcpKSB7XG4gICAgICByZWFkID0gbmV3IFdyYXBwZWROb2RlRXhwcihvcHRpb25zLmdldCgncmVhZCcpICEpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhhcygnZGVzY2VuZGFudHMnKSkge1xuICAgICAgY29uc3QgZGVzY2VuZGFudHNWYWx1ZSA9IGV2YWx1YXRvci5ldmFsdWF0ZShvcHRpb25zLmdldCgnZGVzY2VuZGFudHMnKSAhKTtcbiAgICAgIGlmICh0eXBlb2YgZGVzY2VuZGFudHNWYWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQCR7bmFtZX0gb3B0aW9ucy5kZXNjZW5kYW50cyBtdXN0IGJlIGEgYm9vbGVhbmApO1xuICAgICAgfVxuICAgICAgZGVzY2VuZGFudHMgPSBkZXNjZW5kYW50c1ZhbHVlO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhhcygnc3RhdGljJykpIHtcbiAgICAgIGNvbnN0IHN0YXRpY1ZhbHVlID0gZXZhbHVhdG9yLmV2YWx1YXRlKG9wdGlvbnMuZ2V0KCdzdGF0aWMnKSAhKTtcbiAgICAgIGlmICh0eXBlb2Ygc3RhdGljVmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgICBFcnJvckNvZGUuVkFMVUVfSEFTX1dST05HX1RZUEUsIG5vZGUsIGBAJHtuYW1lfSBvcHRpb25zLnN0YXRpYyBtdXN0IGJlIGEgYm9vbGVhbmApO1xuICAgICAgfVxuICAgICAgaXNTdGF0aWMgPSBzdGF0aWNWYWx1ZTtcbiAgICB9XG5cbiAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA+IDIpIHtcbiAgICAvLyBUb28gbWFueSBhcmd1bWVudHMuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBAJHtuYW1lfSBoYXMgdG9vIG1hbnkgYXJndW1lbnRzYCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHByb3BlcnR5TmFtZSxcbiAgICBwcmVkaWNhdGUsXG4gICAgZmlyc3QsXG4gICAgZGVzY2VuZGFudHMsXG4gICAgcmVhZCxcbiAgICBzdGF0aWM6IGlzU3RhdGljLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFF1ZXJpZXNGcm9tRGVjb3JhdG9yKFxuICAgIHF1ZXJ5RGF0YTogdHMuRXhwcmVzc2lvbiwgcmVmbGVjdG9yOiBSZWZsZWN0aW9uSG9zdCwgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yLFxuICAgIGlzQ29yZTogYm9vbGVhbik6IHtcbiAgY29udGVudDogUjNRdWVyeU1ldGFkYXRhW10sXG4gIHZpZXc6IFIzUXVlcnlNZXRhZGF0YVtdLFxufSB7XG4gIGNvbnN0IGNvbnRlbnQ6IFIzUXVlcnlNZXRhZGF0YVtdID0gW10sIHZpZXc6IFIzUXVlcnlNZXRhZGF0YVtdID0gW107XG4gIGNvbnN0IGV4cHIgPSB1bndyYXBFeHByZXNzaW9uKHF1ZXJ5RGF0YSk7XG4gIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihxdWVyeURhdGEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBxdWVyaWVzIG1ldGFkYXRhIG11c3QgYmUgYW4gb2JqZWN0IGxpdGVyYWxgKTtcbiAgfVxuICByZWZsZWN0T2JqZWN0TGl0ZXJhbChxdWVyeURhdGEpLmZvckVhY2goKHF1ZXJ5RXhwciwgcHJvcGVydHlOYW1lKSA9PiB7XG4gICAgcXVlcnlFeHByID0gdW53cmFwRXhwcmVzc2lvbihxdWVyeUV4cHIpO1xuICAgIGlmICghdHMuaXNOZXdFeHByZXNzaW9uKHF1ZXJ5RXhwcikgfHwgIXRzLmlzSWRlbnRpZmllcihxdWVyeUV4cHIuZXhwcmVzc2lvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcXVlcnkgbWV0YWRhdGEgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBhIHF1ZXJ5IHR5cGVgKTtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IHJlZmxlY3Rvci5nZXRJbXBvcnRPZklkZW50aWZpZXIocXVlcnlFeHByLmV4cHJlc3Npb24pO1xuICAgIGlmICh0eXBlID09PSBudWxsIHx8ICghaXNDb3JlICYmIHR5cGUuZnJvbSAhPT0gJ0Bhbmd1bGFyL2NvcmUnKSB8fFxuICAgICAgICAhUVVFUllfVFlQRVMuaGFzKHR5cGUubmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcXVlcnkgbWV0YWRhdGEgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBhIHF1ZXJ5IHR5cGVgKTtcbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeSA9IGV4dHJhY3RRdWVyeU1ldGFkYXRhKFxuICAgICAgICBxdWVyeUV4cHIsIHR5cGUubmFtZSwgcXVlcnlFeHByLmFyZ3VtZW50cyB8fCBbXSwgcHJvcGVydHlOYW1lLCByZWZsZWN0b3IsIGV2YWx1YXRvcik7XG4gICAgaWYgKHR5cGUubmFtZS5zdGFydHNXaXRoKCdDb250ZW50JykpIHtcbiAgICAgIGNvbnRlbnQucHVzaChxdWVyeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcucHVzaChxdWVyeSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtjb250ZW50LCB2aWV3fTtcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmdBcnJheU9yRGllKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyk6IHZhbHVlIGlzIHN0cmluZ1tdIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlW2ldICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gcmVzb2x2ZSAke25hbWV9WyR7aX1dIHRvIGEgc3RyaW5nYCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGaWVsZEFycmF5VmFsdWUoXG4gICAgZGlyZWN0aXZlOiBNYXA8c3RyaW5nLCB0cy5FeHByZXNzaW9uPiwgZmllbGQ6IHN0cmluZywgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yKTogbnVsbHxcbiAgICBzdHJpbmdbXSB7XG4gIGlmICghZGlyZWN0aXZlLmhhcyhmaWVsZCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFJlc29sdmUgdGhlIGZpZWxkIG9mIGludGVyZXN0IGZyb20gdGhlIGRpcmVjdGl2ZSBtZXRhZGF0YSB0byBhIHN0cmluZ1tdLlxuICBjb25zdCB2YWx1ZSA9IGV2YWx1YXRvci5ldmFsdWF0ZShkaXJlY3RpdmUuZ2V0KGZpZWxkKSAhKTtcbiAgaWYgKCFpc1N0cmluZ0FycmF5T3JEaWUodmFsdWUsIGZpZWxkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHJlc29sdmUgQERpcmVjdGl2ZS4ke2ZpZWxkfWApO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIEludGVycHJldCBwcm9wZXJ0eSBtYXBwaW5nIGZpZWxkcyBvbiB0aGUgZGVjb3JhdG9yIChlLmcuIGlucHV0cyBvciBvdXRwdXRzKSBhbmQgcmV0dXJuIHRoZVxuICogY29ycmVjdGx5IHNoYXBlZCBtZXRhZGF0YSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRmllbGRUb1Byb3BlcnR5TWFwcGluZyhcbiAgICBkaXJlY3RpdmU6IE1hcDxzdHJpbmcsIHRzLkV4cHJlc3Npb24+LCBmaWVsZDogc3RyaW5nLFxuICAgIGV2YWx1YXRvcjogUGFydGlhbEV2YWx1YXRvcik6IHtbZmllbGQ6IHN0cmluZ106IHN0cmluZ30ge1xuICBjb25zdCBtZXRhVmFsdWVzID0gcGFyc2VGaWVsZEFycmF5VmFsdWUoZGlyZWN0aXZlLCBmaWVsZCwgZXZhbHVhdG9yKTtcbiAgaWYgKCFtZXRhVmFsdWVzKSB7XG4gICAgcmV0dXJuIEVNUFRZX09CSkVDVDtcbiAgfVxuXG4gIHJldHVybiBtZXRhVmFsdWVzLnJlZHVjZShcbiAgICAgIChyZXN1bHRzLCB2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBFaXRoZXIgdGhlIHZhbHVlIGlzICdmaWVsZCcgb3IgJ2ZpZWxkOiBwcm9wZXJ0eScuIEluIHRoZSBmaXJzdCBjYXNlLCBgcHJvcGVydHlgIHdpbGxcbiAgICAgICAgLy8gYmUgdW5kZWZpbmVkLCBpbiB3aGljaCBjYXNlIHRoZSBmaWVsZCBuYW1lIHNob3VsZCBhbHNvIGJlIHVzZWQgYXMgdGhlIHByb3BlcnR5IG5hbWUuXG4gICAgICAgIGNvbnN0IFtmaWVsZCwgcHJvcGVydHldID0gdmFsdWUuc3BsaXQoJzonLCAyKS5tYXAoc3RyID0+IHN0ci50cmltKCkpO1xuICAgICAgICByZXN1bHRzW2ZpZWxkXSA9IHByb3BlcnR5IHx8IGZpZWxkO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0sXG4gICAgICB7fSBhc3tbZmllbGQ6IHN0cmluZ106IHN0cmluZ30pO1xufVxuXG4vKipcbiAqIFBhcnNlIHByb3BlcnR5IGRlY29yYXRvcnMgKGUuZy4gYElucHV0YCBvciBgT3V0cHV0YCkgYW5kIHJldHVybiB0aGUgY29ycmVjdGx5IHNoYXBlZCBtZXRhZGF0YVxuICogb2JqZWN0LlxuICovXG5mdW5jdGlvbiBwYXJzZURlY29yYXRlZEZpZWxkcyhcbiAgICBmaWVsZHM6IHttZW1iZXI6IENsYXNzTWVtYmVyLCBkZWNvcmF0b3JzOiBEZWNvcmF0b3JbXX1bXSwgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yLFxuICAgIG1hcFZhbHVlUmVzb2x2ZXI6IChwdWJsaWNOYW1lOiBzdHJpbmcsIGludGVybmFsTmFtZTogc3RyaW5nKSA9PlxuICAgICAgICBzdHJpbmcgfCBbc3RyaW5nLCBzdHJpbmddKToge1tmaWVsZDogc3RyaW5nXTogc3RyaW5nIHwgW3N0cmluZywgc3RyaW5nXX0ge1xuICByZXR1cm4gZmllbGRzLnJlZHVjZShcbiAgICAgIChyZXN1bHRzLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSBmaWVsZC5tZW1iZXIubmFtZTtcbiAgICAgICAgZmllbGQuZGVjb3JhdG9ycy5mb3JFYWNoKGRlY29yYXRvciA9PiB7XG4gICAgICAgICAgLy8gVGhlIGRlY29yYXRvciBlaXRoZXIgZG9lc24ndCBoYXZlIGFuIGFyZ3VtZW50IChASW5wdXQoKSkgaW4gd2hpY2ggY2FzZSB0aGUgcHJvcGVydHlcbiAgICAgICAgICAvLyBuYW1lIGlzIHVzZWQsIG9yIGl0IGhhcyBvbmUgYXJndW1lbnQgKEBPdXRwdXQoJ25hbWVkJykpLlxuICAgICAgICAgIGlmIChkZWNvcmF0b3IuYXJncyA9PSBudWxsIHx8IGRlY29yYXRvci5hcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmVzdWx0c1tmaWVsZE5hbWVdID0gZmllbGROYW1lO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IGV2YWx1YXRvci5ldmFsdWF0ZShkZWNvcmF0b3IuYXJnc1swXSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERlY29yYXRvciBhcmd1bWVudCBtdXN0IHJlc29sdmUgdG8gYSBzdHJpbmdgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdHNbZmllbGROYW1lXSA9IG1hcFZhbHVlUmVzb2x2ZXIocHJvcGVydHksIGZpZWxkTmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRvbyBtYW55IGFyZ3VtZW50cy5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgRGVjb3JhdG9yIG11c3QgaGF2ZSAwIG9yIDEgYXJndW1lbnRzLCBnb3QgJHtkZWNvcmF0b3IuYXJncy5sZW5ndGh9IGFyZ3VtZW50KHMpYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgICAge30gYXN7W2ZpZWxkOiBzdHJpbmddOiBzdHJpbmcgfCBbc3RyaW5nLCBzdHJpbmddfSk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVJbnB1dChwdWJsaWNOYW1lOiBzdHJpbmcsIGludGVybmFsTmFtZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nXSB7XG4gIHJldHVybiBbcHVibGljTmFtZSwgaW50ZXJuYWxOYW1lXTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU91dHB1dChwdWJsaWNOYW1lOiBzdHJpbmcsIGludGVybmFsTmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBwdWJsaWNOYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVlcmllc0Zyb21GaWVsZHMoXG4gICAgZmllbGRzOiB7bWVtYmVyOiBDbGFzc01lbWJlciwgZGVjb3JhdG9yczogRGVjb3JhdG9yW119W10sIHJlZmxlY3RvcjogUmVmbGVjdGlvbkhvc3QsXG4gICAgZXZhbHVhdG9yOiBQYXJ0aWFsRXZhbHVhdG9yKTogUjNRdWVyeU1ldGFkYXRhW10ge1xuICByZXR1cm4gZmllbGRzLm1hcCgoe21lbWJlciwgZGVjb3JhdG9yc30pID0+IHtcbiAgICBjb25zdCBkZWNvcmF0b3IgPSBkZWNvcmF0b3JzWzBdO1xuICAgIGNvbnN0IG5vZGUgPSBtZW1iZXIubm9kZSB8fCBkZWNvcmF0b3Iubm9kZTtcblxuICAgIC8vIFRocm93IGluIGNhc2Ugb2YgYEBJbnB1dCgpIEBDb250ZW50Q2hpbGQoJ2ZvbycpIGZvbzogYW55YCwgd2hpY2ggaXMgbm90IHN1cHBvcnRlZCBpbiBJdnlcbiAgICBpZiAobWVtYmVyLmRlY29yYXRvcnMgIS5zb21lKHYgPT4gdi5uYW1lID09PSAnSW5wdXQnKSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfQ09MTElTSU9OLCBub2RlLFxuICAgICAgICAgICdDYW5ub3QgY29tYmluZSBASW5wdXQgZGVjb3JhdG9ycyB3aXRoIHF1ZXJ5IGRlY29yYXRvcnMnKTtcbiAgICB9XG4gICAgaWYgKGRlY29yYXRvcnMubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9DT0xMSVNJT04sIG5vZGUsXG4gICAgICAgICAgJ0Nhbm5vdCBoYXZlIG11bHRpcGxlIHF1ZXJ5IGRlY29yYXRvcnMgb24gdGhlIHNhbWUgY2xhc3MgbWVtYmVyJyk7XG4gICAgfSBlbHNlIGlmICghaXNQcm9wZXJ0eVR5cGVNZW1iZXIobWVtYmVyKSkge1xuICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgIEVycm9yQ29kZS5ERUNPUkFUT1JfVU5FWFBFQ1RFRCwgbm9kZSxcbiAgICAgICAgICAnUXVlcnkgZGVjb3JhdG9yIG11c3QgZ28gb24gYSBwcm9wZXJ0eS10eXBlIG1lbWJlcicpO1xuICAgIH1cbiAgICByZXR1cm4gZXh0cmFjdFF1ZXJ5TWV0YWRhdGEoXG4gICAgICAgIGRlY29yYXRvci5ub2RlLCBkZWNvcmF0b3IubmFtZSwgZGVjb3JhdG9yLmFyZ3MgfHwgW10sIG1lbWJlci5uYW1lLCByZWZsZWN0b3IsIGV2YWx1YXRvcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc1Byb3BlcnR5VHlwZU1lbWJlcihtZW1iZXI6IENsYXNzTWVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLkdldHRlciB8fCBtZW1iZXIua2luZCA9PT0gQ2xhc3NNZW1iZXJLaW5kLlNldHRlciB8fFxuICAgICAgbWVtYmVyLmtpbmQgPT09IENsYXNzTWVtYmVyS2luZC5Qcm9wZXJ0eTtcbn1cblxudHlwZSBTdHJpbmdNYXA8VD4gPSB7XG4gIFtrZXk6IHN0cmluZ106IFQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEhvc3RCaW5kaW5ncyhcbiAgICBtZW1iZXJzOiBDbGFzc01lbWJlcltdLCBldmFsdWF0b3I6IFBhcnRpYWxFdmFsdWF0b3IsIGNvcmVNb2R1bGU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YT86IE1hcDxzdHJpbmcsIHRzLkV4cHJlc3Npb24+KTogUGFyc2VkSG9zdEJpbmRpbmdzIHtcbiAgbGV0IGhvc3RNZXRhZGF0YTogU3RyaW5nTWFwPHN0cmluZ3xFeHByZXNzaW9uPiA9IHt9O1xuICBpZiAobWV0YWRhdGEgJiYgbWV0YWRhdGEuaGFzKCdob3N0JykpIHtcbiAgICBjb25zdCBleHByID0gbWV0YWRhdGEuZ2V0KCdob3N0JykgITtcbiAgICBjb25zdCBob3N0TWV0YU1hcCA9IGV2YWx1YXRvci5ldmFsdWF0ZShleHByKTtcbiAgICBpZiAoIShob3N0TWV0YU1hcCBpbnN0YW5jZW9mIE1hcCkpIHtcbiAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICBFcnJvckNvZGUuREVDT1JBVE9SX0FSR19OT1RfTElURVJBTCwgZXhwciwgYERlY29yYXRvciBob3N0IG1ldGFkYXRhIG11c3QgYmUgYW4gb2JqZWN0YCk7XG4gICAgfVxuICAgIGhvc3RNZXRhTWFwLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIC8vIFJlc29sdmUgRW51bSByZWZlcmVuY2VzIHRvIHRoZWlyIGRlY2xhcmVkIHZhbHVlLlxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRW51bVZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVzb2x2ZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgRGVjb3JhdG9yIGhvc3QgbWV0YWRhdGEgbXVzdCBiZSBhIHN0cmluZyAtPiBzdHJpbmcgb2JqZWN0LCBidXQgZm91bmQgdW5wYXJzZWFibGUga2V5ICR7a2V5fWApO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGhvc3RNZXRhZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgRHluYW1pY1ZhbHVlKSB7XG4gICAgICAgIGhvc3RNZXRhZGF0YVtrZXldID0gbmV3IFdyYXBwZWROb2RlRXhwcih2YWx1ZS5ub2RlIGFzIHRzLkV4cHJlc3Npb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYERlY29yYXRvciBob3N0IG1ldGFkYXRhIG11c3QgYmUgYSBzdHJpbmcgLT4gc3RyaW5nIG9iamVjdCwgYnV0IGZvdW5kIHVucGFyc2VhYmxlIHZhbHVlICR7dmFsdWV9YCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBiaW5kaW5ncyA9IHBhcnNlSG9zdEJpbmRpbmdzKGhvc3RNZXRhZGF0YSk7XG5cbiAgLy8gVE9ETzogY3JlYXRlIGFuZCBwcm92aWRlIHByb3BlciBzb3VyY2VTcGFuIHRvIG1ha2UgZXJyb3IgbWVzc2FnZSBtb3JlIGRlc2NyaXB0aXZlIChGVy05OTUpXG4gIC8vIEZvciBub3csIHBhc3MgYW4gaW5jb3JyZWN0IChlbXB0eSkgYnV0IHZhbGlkIHNvdXJjZVNwYW4uXG4gIGNvbnN0IGVycm9ycyA9IHZlcmlmeUhvc3RCaW5kaW5ncyhiaW5kaW5ncywgRU1QVFlfU09VUkNFX1NQQU4pO1xuICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgIC8vIFRPRE86IHByb3ZpZGUgbW9yZSBncmFudWxhciBkaWFnbm9zdGljIGFuZCBvdXRwdXQgc3BlY2lmaWMgaG9zdCBleHByZXNzaW9uIHRoYXQgdHJpZ2dlcmVkXG4gICAgICAgIC8vIGFuIGVycm9yIGluc3RlYWQgb2YgdGhlIHdob2xlIGhvc3Qgb2JqZWN0XG4gICAgICAgIEVycm9yQ29kZS5IT1NUX0JJTkRJTkdfUEFSU0VfRVJST1IsIG1ldGFkYXRhICEuZ2V0KCdob3N0JykgISxcbiAgICAgICAgZXJyb3JzLm1hcCgoZXJyb3I6IFBhcnNlRXJyb3IpID0+IGVycm9yLm1zZykuam9pbignXFxuJykpO1xuICB9XG5cbiAgZmlsdGVyVG9NZW1iZXJzV2l0aERlY29yYXRvcihtZW1iZXJzLCAnSG9zdEJpbmRpbmcnLCBjb3JlTW9kdWxlKVxuICAgICAgLmZvckVhY2goKHttZW1iZXIsIGRlY29yYXRvcnN9KSA9PiB7XG4gICAgICAgIGRlY29yYXRvcnMuZm9yRWFjaChkZWNvcmF0b3IgPT4ge1xuICAgICAgICAgIGxldCBob3N0UHJvcGVydHlOYW1lOiBzdHJpbmcgPSBtZW1iZXIubmFtZTtcbiAgICAgICAgICBpZiAoZGVjb3JhdG9yLmFyZ3MgIT09IG51bGwgJiYgZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGRlY29yYXRvci5hcmdzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEBIb3N0QmluZGluZygpIGNhbiBoYXZlIGF0IG1vc3Qgb25lIGFyZ3VtZW50YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gZXZhbHVhdG9yLmV2YWx1YXRlKGRlY29yYXRvci5hcmdzWzBdKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQEhvc3RCaW5kaW5nKCkncyBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhvc3RQcm9wZXJ0eU5hbWUgPSByZXNvbHZlZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiaW5kaW5ncy5wcm9wZXJ0aWVzW2hvc3RQcm9wZXJ0eU5hbWVdID0gbWVtYmVyLm5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgZmlsdGVyVG9NZW1iZXJzV2l0aERlY29yYXRvcihtZW1iZXJzLCAnSG9zdExpc3RlbmVyJywgY29yZU1vZHVsZSlcbiAgICAgIC5mb3JFYWNoKCh7bWVtYmVyLCBkZWNvcmF0b3JzfSkgPT4ge1xuICAgICAgICBkZWNvcmF0b3JzLmZvckVhY2goZGVjb3JhdG9yID0+IHtcbiAgICAgICAgICBsZXQgZXZlbnROYW1lOiBzdHJpbmcgPSBtZW1iZXIubmFtZTtcbiAgICAgICAgICBsZXQgYXJnczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICBpZiAoZGVjb3JhdG9yLmFyZ3MgIT09IG51bGwgJiYgZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGRlY29yYXRvci5hcmdzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEZhdGFsRGlhZ25vc3RpY0Vycm9yKFxuICAgICAgICAgICAgICAgICAgRXJyb3JDb2RlLkRFQ09SQVRPUl9BUklUWV9XUk9ORywgZGVjb3JhdG9yLmFyZ3NbMl0sXG4gICAgICAgICAgICAgICAgICBgQEhvc3RMaXN0ZW5lcigpIGNhbiBoYXZlIGF0IG1vc3QgdHdvIGFyZ3VtZW50c2ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNvbHZlZCA9IGV2YWx1YXRvci5ldmFsdWF0ZShkZWNvcmF0b3IuYXJnc1swXSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc29sdmVkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRmF0YWxEaWFnbm9zdGljRXJyb3IoXG4gICAgICAgICAgICAgICAgICBFcnJvckNvZGUuVkFMVUVfSEFTX1dST05HX1RZUEUsIGRlY29yYXRvci5hcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgYEBIb3N0TGlzdGVuZXIoKSdzIGV2ZW50IG5hbWUgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZ2ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudE5hbWUgPSByZXNvbHZlZDtcblxuICAgICAgICAgICAgaWYgKGRlY29yYXRvci5hcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICBjb25zdCByZXNvbHZlZEFyZ3MgPSBldmFsdWF0b3IuZXZhbHVhdGUoZGVjb3JhdG9yLmFyZ3NbMV0pO1xuICAgICAgICAgICAgICBpZiAoIWlzU3RyaW5nQXJyYXlPckRpZShyZXNvbHZlZEFyZ3MsICdASG9zdExpc3RlbmVyLmFyZ3MnKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBGYXRhbERpYWdub3N0aWNFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgRXJyb3JDb2RlLlZBTFVFX0hBU19XUk9OR19UWVBFLCBkZWNvcmF0b3IuYXJnc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgYEBIb3N0TGlzdGVuZXIgc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcgYXJyYXlgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcmdzID0gcmVzb2x2ZWRBcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJpbmRpbmdzLmxpc3RlbmVyc1tldmVudE5hbWVdID0gYCR7bWVtYmVyLm5hbWV9KCR7YXJncy5qb2luKCcsJyl9KWA7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIHJldHVybiBiaW5kaW5ncztcbn1cblxuY29uc3QgUVVFUllfVFlQRVMgPSBuZXcgU2V0KFtcbiAgJ0NvbnRlbnRDaGlsZCcsXG4gICdDb250ZW50Q2hpbGRyZW4nLFxuICAnVmlld0NoaWxkJyxcbiAgJ1ZpZXdDaGlsZHJlbicsXG5dKTtcbiJdfQ==