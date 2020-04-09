(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/indexer/src/template", ["require", "exports", "tslib", "@angular/compiler", "@angular/compiler-cli/src/ngtsc/indexer/src/api"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var compiler_1 = require("@angular/compiler");
    var api_1 = require("@angular/compiler-cli/src/ngtsc/indexer/src/api");
    /**
     * Visits the AST of an Angular template syntax expression, finding interesting
     * entities (variable references, etc.). Creates an array of Entities found in
     * the expression, with the location of the Entities being relative to the
     * expression.
     *
     * Visiting `text {{prop}}` will return
     * `[TopLevelIdentifier {name: 'prop', span: {start: 7, end: 11}}]`.
     */
    var ExpressionVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(ExpressionVisitor, _super);
        function ExpressionVisitor(expressionStr, absoluteOffset, boundTemplate, targetToIdentifier) {
            var _this = _super.call(this) || this;
            _this.expressionStr = expressionStr;
            _this.absoluteOffset = absoluteOffset;
            _this.boundTemplate = boundTemplate;
            _this.targetToIdentifier = targetToIdentifier;
            _this.identifiers = [];
            return _this;
        }
        /**
         * Returns identifiers discovered in an expression.
         *
         * @param ast expression AST to visit
         * @param source expression AST source code
         * @param absoluteOffset absolute byte offset from start of the file to the start of the AST
         * source code.
         * @param boundTemplate bound target of the entire template, which can be used to query for the
         * entities expressions target.
         * @param targetToIdentifier closure converting a template target node to its identifier.
         */
        ExpressionVisitor.getIdentifiers = function (ast, source, absoluteOffset, boundTemplate, targetToIdentifier) {
            var visitor = new ExpressionVisitor(source, absoluteOffset, boundTemplate, targetToIdentifier);
            visitor.visit(ast);
            return visitor.identifiers;
        };
        ExpressionVisitor.prototype.visit = function (ast) { ast.visit(this); };
        ExpressionVisitor.prototype.visitMethodCall = function (ast, context) {
            this.visitIdentifier(ast, api_1.IdentifierKind.Method);
            _super.prototype.visitMethodCall.call(this, ast, context);
        };
        ExpressionVisitor.prototype.visitPropertyRead = function (ast, context) {
            this.visitIdentifier(ast, api_1.IdentifierKind.Property);
            _super.prototype.visitPropertyRead.call(this, ast, context);
        };
        ExpressionVisitor.prototype.visitPropertyWrite = function (ast, context) {
            this.visitIdentifier(ast, api_1.IdentifierKind.Property);
            _super.prototype.visitPropertyWrite.call(this, ast, context);
        };
        /**
         * Visits an identifier, adding it to the identifier store if it is useful for indexing.
         *
         * @param ast expression AST the identifier is in
         * @param kind identifier kind
         */
        ExpressionVisitor.prototype.visitIdentifier = function (ast, kind) {
            // The definition of a non-top-level property such as `bar` in `{{foo.bar}}` is currently
            // impossible to determine by an indexer and unsupported by the indexing module.
            // The indexing module also does not currently support references to identifiers declared in the
            // template itself, which have a non-null expression target.
            if (!(ast.receiver instanceof compiler_1.ImplicitReceiver)) {
                return;
            }
            // Get the location of the identifier of real interest.
            // The compiler's expression parser records the location of some expressions in a manner not
            // useful to the indexer. For example, a `MethodCall` `foo(a, b)` will record the span of the
            // entire method call, but the indexer is interested only in the method identifier.
            var localExpression = this.expressionStr.substr(ast.span.start);
            if (!localExpression.includes(ast.name)) {
                throw new Error("Impossible state: \"" + ast.name + "\" not found in \"" + localExpression + "\"");
            }
            var identifierStart = ast.span.start + localExpression.indexOf(ast.name);
            // Join the relative position of the expression within a node with the absolute position
            // of the node to get the absolute position of the expression in the source code.
            var absoluteStart = this.absoluteOffset + identifierStart;
            var span = new api_1.AbsoluteSourceSpan(absoluteStart, absoluteStart + ast.name.length);
            var targetAst = this.boundTemplate.getExpressionTarget(ast);
            var target = targetAst ? this.targetToIdentifier(targetAst) : null;
            var identifier = {
                name: ast.name,
                span: span,
                kind: kind,
                target: target,
            };
            this.identifiers.push(identifier);
        };
        return ExpressionVisitor;
    }(compiler_1.RecursiveAstVisitor));
    /**
     * Visits the AST of a parsed Angular template. Discovers and stores
     * identifiers of interest, deferring to an `ExpressionVisitor` as needed.
     */
    var TemplateVisitor = /** @class */ (function (_super) {
        tslib_1.__extends(TemplateVisitor, _super);
        /**
         * Creates a template visitor for a bound template target. The bound target can be used when
         * deferred to the expression visitor to get information about the target of an expression.
         *
         * @param boundTemplate bound template target
         */
        function TemplateVisitor(boundTemplate) {
            var _this = _super.call(this) || this;
            _this.boundTemplate = boundTemplate;
            // Identifiers of interest found in the template.
            _this.identifiers = new Set();
            // Map of targets in a template to their identifiers.
            _this.targetIdentifierCache = new Map();
            // Map of elements and templates to their identifiers.
            _this.elementAndTemplateIdentifierCache = new Map();
            return _this;
        }
        /**
         * Visits a node in the template.
         *
         * @param node node to visit
         */
        TemplateVisitor.prototype.visit = function (node) { node.visit(this); };
        TemplateVisitor.prototype.visitAll = function (nodes) {
            var _this = this;
            nodes.forEach(function (node) { return _this.visit(node); });
        };
        /**
         * Add an identifier for an HTML element and visit its children recursively.
         *
         * @param element
         */
        TemplateVisitor.prototype.visitElement = function (element) {
            var elementIdentifier = this.elementOrTemplateToIdentifier(element);
            this.identifiers.add(elementIdentifier);
            this.visitAll(element.references);
            this.visitAll(element.inputs);
            this.visitAll(element.attributes);
            this.visitAll(element.children);
            this.visitAll(element.outputs);
        };
        TemplateVisitor.prototype.visitTemplate = function (template) {
            var templateIdentifier = this.elementOrTemplateToIdentifier(template);
            this.identifiers.add(templateIdentifier);
            this.visitAll(template.variables);
            this.visitAll(template.attributes);
            this.visitAll(template.templateAttrs);
            this.visitAll(template.children);
            this.visitAll(template.references);
        };
        TemplateVisitor.prototype.visitBoundAttribute = function (attribute) {
            var _this = this;
            // A BoundAttribute's value (the parent AST) may have subexpressions (children ASTs) that have
            // recorded spans extending past the recorded span of the parent. The most common example of
            // this is with `*ngFor`.
            // To resolve this, use the information on the BoundAttribute Template AST, which is always
            // correct, to determine locations of identifiers in the expression.
            //
            // TODO(ayazhafiz): Remove this when https://github.com/angular/angular/pull/31813 lands.
            var attributeSrc = attribute.sourceSpan.toString();
            var attributeAbsolutePosition = attribute.sourceSpan.start.offset;
            // Skip the bytes of the attribute name so that there are no collisions between the attribute
            // name and expression identifier names later.
            var nameSkipOffet = attributeSrc.indexOf(attribute.name) + attribute.name.length;
            var expressionSrc = attributeSrc.substring(nameSkipOffet);
            var expressionAbsolutePosition = attributeAbsolutePosition + nameSkipOffet;
            var identifiers = ExpressionVisitor.getIdentifiers(attribute.value, expressionSrc, expressionAbsolutePosition, this.boundTemplate, this.targetToIdentifier);
            identifiers.forEach(function (id) { return _this.identifiers.add(id); });
        };
        TemplateVisitor.prototype.visitBoundEvent = function (attribute) { this.visitExpression(attribute.handler); };
        TemplateVisitor.prototype.visitBoundText = function (text) { this.visitExpression(text.value); };
        TemplateVisitor.prototype.visitReference = function (reference) {
            var referenceIdentifer = this.targetToIdentifier(reference);
            this.identifiers.add(referenceIdentifer);
        };
        TemplateVisitor.prototype.visitVariable = function (variable) {
            var variableIdentifier = this.targetToIdentifier(variable);
            this.identifiers.add(variableIdentifier);
        };
        /** Creates an identifier for a template element or template node. */
        TemplateVisitor.prototype.elementOrTemplateToIdentifier = function (node) {
            // If this node has already been seen, return the cached result.
            if (this.elementAndTemplateIdentifierCache.has(node)) {
                return this.elementAndTemplateIdentifierCache.get(node);
            }
            var name;
            var kind;
            if (node instanceof compiler_1.TmplAstTemplate) {
                name = node.tagName;
                kind = api_1.IdentifierKind.Template;
            }
            else {
                name = node.name;
                kind = api_1.IdentifierKind.Element;
            }
            var sourceSpan = node.sourceSpan;
            // An element's or template's source span can be of the form `<element>`, `<element />`, or
            // `<element></element>`. Only the selector is interesting to the indexer, so the source is
            // searched for the first occurrence of the element (selector) name.
            var start = this.getStartLocation(name, sourceSpan);
            var absoluteSpan = new api_1.AbsoluteSourceSpan(start, start + name.length);
            // Record the nodes's attributes, which an indexer can later traverse to see if any of them
            // specify a used directive on the node.
            var attributes = node.attributes.map(function (_a) {
                var name = _a.name, sourceSpan = _a.sourceSpan;
                return {
                    name: name,
                    span: new api_1.AbsoluteSourceSpan(sourceSpan.start.offset, sourceSpan.end.offset),
                    kind: api_1.IdentifierKind.Attribute,
                };
            });
            var usedDirectives = this.boundTemplate.getDirectivesOfNode(node) || [];
            var identifier = {
                name: name,
                span: absoluteSpan, kind: kind,
                attributes: new Set(attributes),
                usedDirectives: new Set(usedDirectives.map(function (dir) {
                    return {
                        node: dir.ref.node,
                        selector: dir.selector,
                    };
                })),
            };
            this.elementAndTemplateIdentifierCache.set(node, identifier);
            return identifier;
        };
        /** Creates an identifier for a template reference or template variable target. */
        TemplateVisitor.prototype.targetToIdentifier = function (node) {
            // If this node has already been seen, return the cached result.
            if (this.targetIdentifierCache.has(node)) {
                return this.targetIdentifierCache.get(node);
            }
            var name = node.name, sourceSpan = node.sourceSpan;
            var start = this.getStartLocation(name, sourceSpan);
            var span = new api_1.AbsoluteSourceSpan(start, start + name.length);
            var identifier;
            if (node instanceof compiler_1.TmplAstReference) {
                // If the node is a reference, we care about its target. The target can be an element, a
                // template, a directive applied on a template or element (in which case the directive field
                // is non-null), or nothing at all.
                var refTarget = this.boundTemplate.getReferenceTarget(node);
                var target = null;
                if (refTarget) {
                    if (refTarget instanceof compiler_1.TmplAstElement || refTarget instanceof compiler_1.TmplAstTemplate) {
                        target = {
                            node: this.elementOrTemplateToIdentifier(refTarget),
                            directive: null,
                        };
                    }
                    else {
                        target = {
                            node: this.elementOrTemplateToIdentifier(refTarget.node),
                            directive: refTarget.directive.ref.node,
                        };
                    }
                }
                identifier = {
                    name: name,
                    span: span,
                    kind: api_1.IdentifierKind.Reference, target: target,
                };
            }
            else {
                identifier = {
                    name: name,
                    span: span,
                    kind: api_1.IdentifierKind.Variable,
                };
            }
            this.targetIdentifierCache.set(node, identifier);
            return identifier;
        };
        /** Gets the start location of a string in a SourceSpan */
        TemplateVisitor.prototype.getStartLocation = function (name, context) {
            var localStr = context.toString();
            if (!localStr.includes(name)) {
                throw new Error("Impossible state: \"" + name + "\" not found in \"" + localStr + "\"");
            }
            return context.start.offset + localStr.indexOf(name);
        };
        /**
         * Visits a node's expression and adds its identifiers, if any, to the visitor's state.
         * Only ASTs with information about the expression source and its location are visited.
         *
         * @param node node whose expression to visit
         */
        TemplateVisitor.prototype.visitExpression = function (ast) {
            var _this = this;
            // Only include ASTs that have information about their source and absolute source spans.
            if (ast instanceof compiler_1.ASTWithSource && ast.source !== null) {
                // Make target to identifier mapping closure stateful to this visitor instance.
                var targetToIdentifier = this.targetToIdentifier.bind(this);
                var absoluteOffset = ast.sourceSpan.start;
                var identifiers = ExpressionVisitor.getIdentifiers(ast, ast.source, absoluteOffset, this.boundTemplate, targetToIdentifier);
                identifiers.forEach(function (id) { return _this.identifiers.add(id); });
            }
        };
        return TemplateVisitor;
    }(compiler_1.TmplAstRecursiveVisitor));
    /**
     * Traverses a template AST and builds identifiers discovered in it.
     *
     * @param boundTemplate bound template target, which can be used for querying expression targets.
     * @return identifiers in template
     */
    function getTemplateIdentifiers(boundTemplate) {
        var visitor = new TemplateVisitor(boundTemplate);
        if (boundTemplate.target.template !== undefined) {
            visitor.visitAll(boundTemplate.target.template);
        }
        return visitor.identifiers;
    }
    exports.getTemplateIdentifiers = getTemplateIdentifiers;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2luZGV4ZXIvc3JjL3RlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILDhDQUF5VTtJQUN6VSx1RUFBNE47SUFpQjVOOzs7Ozs7OztPQVFHO0lBQ0g7UUFBZ0MsNkNBQW1CO1FBR2pELDJCQUNxQixhQUFxQixFQUFtQixjQUFzQixFQUM5RCxhQUF5QyxFQUN6QyxrQkFBNEQ7WUFIakYsWUFJRSxpQkFBTyxTQUNSO1lBSm9CLG1CQUFhLEdBQWIsYUFBYSxDQUFRO1lBQW1CLG9CQUFjLEdBQWQsY0FBYyxDQUFRO1lBQzlELG1CQUFhLEdBQWIsYUFBYSxDQUE0QjtZQUN6Qyx3QkFBa0IsR0FBbEIsa0JBQWtCLENBQTBDO1lBTHhFLGlCQUFXLEdBQTJCLEVBQUUsQ0FBQzs7UUFPbEQsQ0FBQztRQUVEOzs7Ozs7Ozs7O1dBVUc7UUFDSSxnQ0FBYyxHQUFyQixVQUNJLEdBQVEsRUFBRSxNQUFjLEVBQUUsY0FBc0IsRUFBRSxhQUF5QyxFQUMzRixrQkFBNEQ7WUFDOUQsSUFBTSxPQUFPLEdBQ1QsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3JGLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzdCLENBQUM7UUFFRCxpQ0FBSyxHQUFMLFVBQU0sR0FBUSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBDLDJDQUFlLEdBQWYsVUFBZ0IsR0FBZSxFQUFFLE9BQVc7WUFDMUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUs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Q0FBQztnQkFDOUQsSUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQzVDLElBQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLGNBQWMsQ0FDaEQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDN0UsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7YUFDckQ7UUFDSCxDQUFDO1FBQ0gsc0JBQUM7SUFBRCxDQUFDLEFBek5ELENBQThCLGtDQUF1QixHQXlOcEQ7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLHNCQUFzQixDQUFDLGFBQXlDO1FBRTlFLElBQU0sT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQy9DLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqRDtRQUNELE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUM3QixDQUFDO0lBUEQsd0RBT0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FTVCwgQVNUV2l0aFNvdXJjZSwgQm91bmRUYXJnZXQsIEltcGxpY2l0UmVjZWl2ZXIsIE1ldGhvZENhbGwsIFBhcnNlU291cmNlU3BhbiwgUHJvcGVydHlSZWFkLCBQcm9wZXJ0eVdyaXRlLCBSZWN1cnNpdmVBc3RWaXNpdG9yLCBUbXBsQXN0Qm91bmRBdHRyaWJ1dGUsIFRtcGxBc3RCb3VuZEV2ZW50LCBUbXBsQXN0Qm91bmRUZXh0LCBUbXBsQXN0RWxlbWVudCwgVG1wbEFzdE5vZGUsIFRtcGxBc3RSZWN1cnNpdmVWaXNpdG9yLCBUbXBsQXN0UmVmZXJlbmNlLCBUbXBsQXN0VGVtcGxhdGUsIFRtcGxBc3RWYXJpYWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0IHtBYnNvbHV0ZVNvdXJjZVNwYW4sIEF0dHJpYnV0ZUlkZW50aWZpZXIsIEVsZW1lbnRJZGVudGlmaWVyLCBJZGVudGlmaWVyS2luZCwgTWV0aG9kSWRlbnRpZmllciwgUHJvcGVydHlJZGVudGlmaWVyLCBSZWZlcmVuY2VJZGVudGlmaWVyLCBUZW1wbGF0ZU5vZGVJZGVudGlmaWVyLCBUb3BMZXZlbElkZW50aWZpZXIsIFZhcmlhYmxlSWRlbnRpZmllcn0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtDb21wb25lbnRNZXRhfSBmcm9tICcuL2NvbnRleHQnO1xuXG4vKipcbiAqIEEgcGFyc2VkIG5vZGUgaW4gYSB0ZW1wbGF0ZSwgd2hpY2ggbWF5IGhhdmUgYSBuYW1lIChpZiBpdCBpcyBhIHNlbGVjdG9yKSBvclxuICogYmUgYW5vbnltb3VzIChsaWtlIGEgdGV4dCBzcGFuKS5cbiAqL1xuaW50ZXJmYWNlIEhUTUxOb2RlIGV4dGVuZHMgVG1wbEFzdE5vZGUge1xuICB0YWdOYW1lPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xufVxuXG50eXBlIEV4cHJlc3Npb25JZGVudGlmaWVyID0gUHJvcGVydHlJZGVudGlmaWVyIHwgTWV0aG9kSWRlbnRpZmllcjtcbnR5cGUgVG1wbFRhcmdldCA9IFRtcGxBc3RSZWZlcmVuY2UgfCBUbXBsQXN0VmFyaWFibGU7XG50eXBlIFRhcmdldElkZW50aWZpZXIgPSBSZWZlcmVuY2VJZGVudGlmaWVyIHwgVmFyaWFibGVJZGVudGlmaWVyO1xudHlwZSBUYXJnZXRJZGVudGlmaWVyTWFwID0gTWFwPFRtcGxUYXJnZXQsIFRhcmdldElkZW50aWZpZXI+O1xuXG4vKipcbiAqIFZpc2l0cyB0aGUgQVNUIG9mIGFuIEFuZ3VsYXIgdGVtcGxhdGUgc3ludGF4IGV4cHJlc3Npb24sIGZpbmRpbmcgaW50ZXJlc3RpbmdcbiAqIGVudGl0aWVzICh2YXJpYWJsZSByZWZlcmVuY2VzLCBldGMuKS4gQ3JlYXRlcyBhbiBhcnJheSBvZiBFbnRpdGllcyBmb3VuZCBpblxuICogdGhlIGV4cHJlc3Npb24sIHdpdGggdGhlIGxvY2F0aW9uIG9mIHRoZSBFbnRpdGllcyBiZWluZyByZWxhdGl2ZSB0byB0aGVcbiAqIGV4cHJlc3Npb24uXG4gKlxuICogVmlzaXRpbmcgYHRleHQge3twcm9wfX1gIHdpbGwgcmV0dXJuXG4gKiBgW1RvcExldmVsSWRlbnRpZmllciB7bmFtZTogJ3Byb3AnLCBzcGFuOiB7c3RhcnQ6IDcsIGVuZDogMTF9fV1gLlxuICovXG5jbGFzcyBFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFJlY3Vyc2l2ZUFzdFZpc2l0b3Ige1xuICByZWFkb25seSBpZGVudGlmaWVyczogRXhwcmVzc2lvbklkZW50aWZpZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGV4cHJlc3Npb25TdHI6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBhYnNvbHV0ZU9mZnNldDogbnVtYmVyLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBib3VuZFRlbXBsYXRlOiBCb3VuZFRhcmdldDxDb21wb25lbnRNZXRhPixcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgdGFyZ2V0VG9JZGVudGlmaWVyOiAodGFyZ2V0OiBUbXBsVGFyZ2V0KSA9PiBUYXJnZXRJZGVudGlmaWVyKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGlkZW50aWZpZXJzIGRpc2NvdmVyZWQgaW4gYW4gZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIGFzdCBleHByZXNzaW9uIEFTVCB0byB2aXNpdFxuICAgKiBAcGFyYW0gc291cmNlIGV4cHJlc3Npb24gQVNUIHNvdXJjZSBjb2RlXG4gICAqIEBwYXJhbSBhYnNvbHV0ZU9mZnNldCBhYnNvbHV0ZSBieXRlIG9mZnNldCBmcm9tIHN0YXJ0IG9mIHRoZSBmaWxlIHRvIHRoZSBzdGFydCBvZiB0aGUgQVNUXG4gICAqIHNvdXJjZSBjb2RlLlxuICAgKiBAcGFyYW0gYm91bmRUZW1wbGF0ZSBib3VuZCB0YXJnZXQgb2YgdGhlIGVudGlyZSB0ZW1wbGF0ZSwgd2hpY2ggY2FuIGJlIHVzZWQgdG8gcXVlcnkgZm9yIHRoZVxuICAgKiBlbnRpdGllcyBleHByZXNzaW9ucyB0YXJnZXQuXG4gICAqIEBwYXJhbSB0YXJnZXRUb0lkZW50aWZpZXIgY2xvc3VyZSBjb252ZXJ0aW5nIGEgdGVtcGxhdGUgdGFyZ2V0IG5vZGUgdG8gaXRzIGlkZW50aWZpZXIuXG4gICAqL1xuICBzdGF0aWMgZ2V0SWRlbnRpZmllcnMoXG4gICAgICBhc3Q6IEFTVCwgc291cmNlOiBzdHJpbmcsIGFic29sdXRlT2Zmc2V0OiBudW1iZXIsIGJvdW5kVGVtcGxhdGU6IEJvdW5kVGFyZ2V0PENvbXBvbmVudE1ldGE+LFxuICAgICAgdGFyZ2V0VG9JZGVudGlmaWVyOiAodGFyZ2V0OiBUbXBsVGFyZ2V0KSA9PiBUYXJnZXRJZGVudGlmaWVyKTogVG9wTGV2ZWxJZGVudGlmaWVyW10ge1xuICAgIGNvbnN0IHZpc2l0b3IgPVxuICAgICAgICBuZXcgRXhwcmVzc2lvblZpc2l0b3Ioc291cmNlLCBhYnNvbHV0ZU9mZnNldCwgYm91bmRUZW1wbGF0ZSwgdGFyZ2V0VG9JZGVudGlmaWVyKTtcbiAgICB2aXNpdG9yLnZpc2l0KGFzdCk7XG4gICAgcmV0dXJuIHZpc2l0b3IuaWRlbnRpZmllcnM7XG4gIH1cblxuICB2aXNpdChhc3Q6IEFTVCkgeyBhc3QudmlzaXQodGhpcyk7IH1cblxuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsLCBjb250ZXh0OiB7fSkge1xuICAgIHRoaXMudmlzaXRJZGVudGlmaWVyKGFzdCwgSWRlbnRpZmllcktpbmQuTWV0aG9kKTtcbiAgICBzdXBlci52aXNpdE1ldGhvZENhbGwoYXN0LCBjb250ZXh0KTtcbiAgfVxuXG4gIHZpc2l0UHJvcGVydHlSZWFkKGFzdDogUHJvcGVydHlSZWFkLCBjb250ZXh0OiB7fSkge1xuICAgIHRoaXMudmlzaXRJZGVudGlmaWVyKGFzdCwgSWRlbnRpZmllcktpbmQuUHJvcGVydHkpO1xuICAgIHN1cGVyLnZpc2l0UHJvcGVydHlSZWFkKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICB2aXNpdFByb3BlcnR5V3JpdGUoYXN0OiBQcm9wZXJ0eVdyaXRlLCBjb250ZXh0OiB7fSkge1xuICAgIHRoaXMudmlzaXRJZGVudGlmaWVyKGFzdCwgSWRlbnRpZmllcktpbmQuUHJvcGVydHkpO1xuICAgIHN1cGVyLnZpc2l0UHJvcGVydHlXcml0ZShhc3QsIGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpc2l0cyBhbiBpZGVudGlmaWVyLCBhZGRpbmcgaXQgdG8gdGhlIGlkZW50aWZpZXIgc3RvcmUgaWYgaXQgaXMgdXNlZnVsIGZvciBpbmRleGluZy5cbiAgICpcbiAgICogQHBhcmFtIGFzdCBleHByZXNzaW9uIEFTVCB0aGUgaWRlbnRpZmllciBpcyBpblxuICAgKiBAcGFyYW0ga2luZCBpZGVudGlmaWVyIGtpbmRcbiAgICovXG4gIHByaXZhdGUgdmlzaXRJZGVudGlmaWVyKFxuICAgICAgYXN0OiBBU1Qme25hbWU6IHN0cmluZywgcmVjZWl2ZXI6IEFTVH0sIGtpbmQ6IEV4cHJlc3Npb25JZGVudGlmaWVyWydraW5kJ10pIHtcbiAgICAvLyBUaGUgZGVmaW5pdGlvbiBvZiBhIG5vbi10b3AtbGV2ZWwgcHJvcGVydHkgc3VjaCBhcyBgYmFyYCBpbiBge3tmb28uYmFyfX1gIGlzIGN1cnJlbnRseVxuICAgIC8vIGltcG9zc2libGUgdG8gZGV0ZXJtaW5lIGJ5IGFuIGluZGV4ZXIgYW5kIHVuc3VwcG9ydGVkIGJ5IHRoZSBpbmRleGluZyBtb2R1bGUuXG4gICAgLy8gVGhlIGluZGV4aW5nIG1vZHVsZSBhbHNvIGRvZXMgbm90IGN1cnJlbnRseSBzdXBwb3J0IHJlZmVyZW5jZXMgdG8gaWRlbnRpZmllcnMgZGVjbGFyZWQgaW4gdGhlXG4gICAgLy8gdGVtcGxhdGUgaXRzZWxmLCB3aGljaCBoYXZlIGEgbm9uLW51bGwgZXhwcmVzc2lvbiB0YXJnZXQuXG4gICAgaWYgKCEoYXN0LnJlY2VpdmVyIGluc3RhbmNlb2YgSW1wbGljaXRSZWNlaXZlcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIGxvY2F0aW9uIG9mIHRoZSBpZGVudGlmaWVyIG9mIHJlYWwgaW50ZXJlc3QuXG4gICAgLy8gVGhlIGNvbXBpbGVyJ3MgZXhwcmVzc2lvbiBwYXJzZXIgcmVjb3JkcyB0aGUgbG9jYXRpb24gb2Ygc29tZSBleHByZXNzaW9ucyBpbiBhIG1hbm5lciBub3RcbiAgICAvLyB1c2VmdWwgdG8gdGhlIGluZGV4ZXIuIEZvciBleGFtcGxlLCBhIGBNZXRob2RDYWxsYCBgZm9vKGEsIGIpYCB3aWxsIHJlY29yZCB0aGUgc3BhbiBvZiB0aGVcbiAgICAvLyBlbnRpcmUgbWV0aG9kIGNhbGwsIGJ1dCB0aGUgaW5kZXhlciBpcyBpbnRlcmVzdGVkIG9ubHkgaW4gdGhlIG1ldGhvZCBpZGVudGlmaWVyLlxuICAgIGNvbnN0IGxvY2FsRXhwcmVzc2lvbiA9IHRoaXMuZXhwcmVzc2lvblN0ci5zdWJzdHIoYXN0LnNwYW4uc3RhcnQpO1xuICAgIGlmICghbG9jYWxFeHByZXNzaW9uLmluY2x1ZGVzKGFzdC5uYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbXBvc3NpYmxlIHN0YXRlOiBcIiR7YXN0Lm5hbWV9XCIgbm90IGZvdW5kIGluIFwiJHtsb2NhbEV4cHJlc3Npb259XCJgKTtcbiAgICB9XG4gICAgY29uc3QgaWRlbnRpZmllclN0YXJ0ID0gYXN0LnNwYW4uc3RhcnQgKyBsb2NhbEV4cHJlc3Npb24uaW5kZXhPZihhc3QubmFtZSk7XG5cbiAgICAvLyBKb2luIHRoZSByZWxhdGl2ZSBwb3NpdGlvbiBvZiB0aGUgZXhwcmVzc2lvbiB3aXRoaW4gYSBub2RlIHdpdGggdGhlIGFic29sdXRlIHBvc2l0aW9uXG4gICAgLy8gb2YgdGhlIG5vZGUgdG8gZ2V0IHRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgZXhwcmVzc2lvbiBpbiB0aGUgc291cmNlIGNvZGUuXG4gICAgY29uc3QgYWJzb2x1dGVTdGFydCA9IHRoaXMuYWJzb2x1dGVPZmZzZXQgKyBpZGVudGlmaWVyU3RhcnQ7XG4gICAgY29uc3Qgc3BhbiA9IG5ldyBBYnNvbHV0ZVNvdXJjZVNwYW4oYWJzb2x1dGVTdGFydCwgYWJzb2x1dGVTdGFydCArIGFzdC5uYW1lLmxlbmd0aCk7XG5cbiAgICBjb25zdCB0YXJnZXRBc3QgPSB0aGlzLmJvdW5kVGVtcGxhdGUuZ2V0RXhwcmVzc2lvblRhcmdldChhc3QpO1xuICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldEFzdCA/IHRoaXMudGFyZ2V0VG9JZGVudGlmaWVyKHRhcmdldEFzdCkgOiBudWxsO1xuICAgIGNvbnN0IGlkZW50aWZpZXIgPSB7XG4gICAgICBuYW1lOiBhc3QubmFtZSxcbiAgICAgIHNwYW4sXG4gICAgICBraW5kLFxuICAgICAgdGFyZ2V0LFxuICAgIH0gYXMgRXhwcmVzc2lvbklkZW50aWZpZXI7XG5cbiAgICB0aGlzLmlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbn1cblxuLyoqXG4gKiBWaXNpdHMgdGhlIEFTVCBvZiBhIHBhcnNlZCBBbmd1bGFyIHRlbXBsYXRlLiBEaXNjb3ZlcnMgYW5kIHN0b3Jlc1xuICogaWRlbnRpZmllcnMgb2YgaW50ZXJlc3QsIGRlZmVycmluZyB0byBhbiBgRXhwcmVzc2lvblZpc2l0b3JgIGFzIG5lZWRlZC5cbiAqL1xuY2xhc3MgVGVtcGxhdGVWaXNpdG9yIGV4dGVuZHMgVG1wbEFzdFJlY3Vyc2l2ZVZpc2l0b3Ige1xuICAvLyBJZGVudGlmaWVycyBvZiBpbnRlcmVzdCBmb3VuZCBpbiB0aGUgdGVtcGxhdGUuXG4gIHJlYWRvbmx5IGlkZW50aWZpZXJzID0gbmV3IFNldDxUb3BMZXZlbElkZW50aWZpZXI+KCk7XG5cbiAgLy8gTWFwIG9mIHRhcmdldHMgaW4gYSB0ZW1wbGF0ZSB0byB0aGVpciBpZGVudGlmaWVycy5cbiAgcHJpdmF0ZSByZWFkb25seSB0YXJnZXRJZGVudGlmaWVyQ2FjaGU6IFRhcmdldElkZW50aWZpZXJNYXAgPSBuZXcgTWFwKCk7XG5cbiAgLy8gTWFwIG9mIGVsZW1lbnRzIGFuZCB0ZW1wbGF0ZXMgdG8gdGhlaXIgaWRlbnRpZmllcnMuXG4gIHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudEFuZFRlbXBsYXRlSWRlbnRpZmllckNhY2hlID1cbiAgICAgIG5ldyBNYXA8VG1wbEFzdEVsZW1lbnR8VG1wbEFzdFRlbXBsYXRlLCBFbGVtZW50SWRlbnRpZmllcnxUZW1wbGF0ZU5vZGVJZGVudGlmaWVyPigpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgdmlzaXRvciBmb3IgYSBib3VuZCB0ZW1wbGF0ZSB0YXJnZXQuIFRoZSBib3VuZCB0YXJnZXQgY2FuIGJlIHVzZWQgd2hlblxuICAgKiBkZWZlcnJlZCB0byB0aGUgZXhwcmVzc2lvbiB2aXNpdG9yIHRvIGdldCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFyZ2V0IG9mIGFuIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSBib3VuZFRlbXBsYXRlIGJvdW5kIHRlbXBsYXRlIHRhcmdldFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBib3VuZFRlbXBsYXRlOiBCb3VuZFRhcmdldDxDb21wb25lbnRNZXRhPikgeyBzdXBlcigpOyB9XG5cbiAgLyoqXG4gICAqIFZpc2l0cyBhIG5vZGUgaW4gdGhlIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSBub2RlIHRvIHZpc2l0XG4gICAqL1xuICB2aXNpdChub2RlOiBIVE1MTm9kZSkgeyBub2RlLnZpc2l0KHRoaXMpOyB9XG5cbiAgdmlzaXRBbGwobm9kZXM6IFRtcGxBc3ROb2RlW10pIHsgbm9kZXMuZm9yRWFjaChub2RlID0+IHRoaXMudmlzaXQobm9kZSkpOyB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBpZGVudGlmaWVyIGZvciBhbiBIVE1MIGVsZW1lbnQgYW5kIHZpc2l0IGl0cyBjaGlsZHJlbiByZWN1cnNpdmVseS5cbiAgICpcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBUbXBsQXN0RWxlbWVudCkge1xuICAgIGNvbnN0IGVsZW1lbnRJZGVudGlmaWVyID0gdGhpcy5lbGVtZW50T3JUZW1wbGF0ZVRvSWRlbnRpZmllcihlbGVtZW50KTtcblxuICAgIHRoaXMuaWRlbnRpZmllcnMuYWRkKGVsZW1lbnRJZGVudGlmaWVyKTtcblxuICAgIHRoaXMudmlzaXRBbGwoZWxlbWVudC5yZWZlcmVuY2VzKTtcbiAgICB0aGlzLnZpc2l0QWxsKGVsZW1lbnQuaW5wdXRzKTtcbiAgICB0aGlzLnZpc2l0QWxsKGVsZW1lbnQuYXR0cmlidXRlcyk7XG4gICAgdGhpcy52aXNpdEFsbChlbGVtZW50LmNoaWxkcmVuKTtcbiAgICB0aGlzLnZpc2l0QWxsKGVsZW1lbnQub3V0cHV0cyk7XG4gIH1cbiAgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogVG1wbEFzdFRlbXBsYXRlKSB7XG4gICAgY29uc3QgdGVtcGxhdGVJZGVudGlmaWVyID0gdGhpcy5lbGVtZW50T3JUZW1wbGF0ZVRvSWRlbnRpZmllcih0ZW1wbGF0ZSk7XG5cbiAgICB0aGlzLmlkZW50aWZpZXJzLmFkZCh0ZW1wbGF0ZUlkZW50aWZpZXIpO1xuXG4gICAgdGhpcy52aXNpdEFsbCh0ZW1wbGF0ZS52YXJpYWJsZXMpO1xuICAgIHRoaXMudmlzaXRBbGwodGVtcGxhdGUuYXR0cmlidXRlcyk7XG4gICAgdGhpcy52aXNpdEFsbCh0ZW1wbGF0ZS50ZW1wbGF0ZUF0dHJzKTtcbiAgICB0aGlzLnZpc2l0QWxsKHRlbXBsYXRlLmNoaWxkcmVuKTtcbiAgICB0aGlzLnZpc2l0QWxsKHRlbXBsYXRlLnJlZmVyZW5jZXMpO1xuICB9XG4gIHZpc2l0Qm91bmRBdHRyaWJ1dGUoYXR0cmlidXRlOiBUbXBsQXN0Qm91bmRBdHRyaWJ1dGUpIHtcbiAgICAvLyBBIEJvdW5kQXR0cmlidXRlJ3MgdmFsdWUgKHRoZSBwYXJlbnQgQVNUKSBtYXkgaGF2ZSBzdWJleHByZXNzaW9ucyAoY2hpbGRyZW4gQVNUcykgdGhhdCBoYXZlXG4gICAgLy8gcmVjb3JkZWQgc3BhbnMgZXh0ZW5kaW5nIHBhc3QgdGhlIHJlY29yZGVkIHNwYW4gb2YgdGhlIHBhcmVudC4gVGhlIG1vc3QgY29tbW9uIGV4YW1wbGUgb2ZcbiAgICAvLyB0aGlzIGlzIHdpdGggYCpuZ0ZvcmAuXG4gICAgLy8gVG8gcmVzb2x2ZSB0aGlzLCB1c2UgdGhlIGluZm9ybWF0aW9uIG9uIHRoZSBCb3VuZEF0dHJpYnV0ZSBUZW1wbGF0ZSBBU1QsIHdoaWNoIGlzIGFsd2F5c1xuICAgIC8vIGNvcnJlY3QsIHRvIGRldGVybWluZSBsb2NhdGlvbnMgb2YgaWRlbnRpZmllcnMgaW4gdGhlIGV4cHJlc3Npb24uXG4gICAgLy9cbiAgICAvLyBUT0RPKGF5YXpoYWZpeik6IFJlbW92ZSB0aGlzIHdoZW4gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzMxODEzIGxhbmRzLlxuICAgIGNvbnN0IGF0dHJpYnV0ZVNyYyA9IGF0dHJpYnV0ZS5zb3VyY2VTcGFuLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgYXR0cmlidXRlQWJzb2x1dGVQb3NpdGlvbiA9IGF0dHJpYnV0ZS5zb3VyY2VTcGFuLnN0YXJ0Lm9mZnNldDtcblxuICAgIC8vIFNraXAgdGhlIGJ5dGVzIG9mIHRoZSBhdHRyaWJ1dGUgbmFtZSBzbyB0aGF0IHRoZXJlIGFyZSBubyBjb2xsaXNpb25zIGJldHdlZW4gdGhlIGF0dHJpYnV0ZVxuICAgIC8vIG5hbWUgYW5kIGV4cHJlc3Npb24gaWRlbnRpZmllciBuYW1lcyBsYXRlci5cbiAgICBjb25zdCBuYW1lU2tpcE9mZmV0ID0gYXR0cmlidXRlU3JjLmluZGV4T2YoYXR0cmlidXRlLm5hbWUpICsgYXR0cmlidXRlLm5hbWUubGVuZ3RoO1xuICAgIGNvbnN0IGV4cHJlc3Npb25TcmMgPSBhdHRyaWJ1dGVTcmMuc3Vic3RyaW5nKG5hbWVTa2lwT2ZmZXQpO1xuICAgIGNvbnN0IGV4cHJlc3Npb25BYnNvbHV0ZVBvc2l0aW9uID0gYXR0cmlidXRlQWJzb2x1dGVQb3NpdGlvbiArIG5hbWVTa2lwT2ZmZXQ7XG5cbiAgICBjb25zdCBpZGVudGlmaWVycyA9IEV4cHJlc3Npb25WaXNpdG9yLmdldElkZW50aWZpZXJzKFxuICAgICAgICBhdHRyaWJ1dGUudmFsdWUsIGV4cHJlc3Npb25TcmMsIGV4cHJlc3Npb25BYnNvbHV0ZVBvc2l0aW9uLCB0aGlzLmJvdW5kVGVtcGxhdGUsXG4gICAgICAgIHRoaXMudGFyZ2V0VG9JZGVudGlmaWVyKTtcbiAgICBpZGVudGlmaWVycy5mb3JFYWNoKGlkID0+IHRoaXMuaWRlbnRpZmllcnMuYWRkKGlkKSk7XG4gIH1cbiAgdmlzaXRCb3VuZEV2ZW50KGF0dHJpYnV0ZTogVG1wbEFzdEJvdW5kRXZlbnQpIHsgdGhpcy52aXNpdEV4cHJlc3Npb24oYXR0cmlidXRlLmhhbmRsZXIpOyB9XG4gIHZpc2l0Qm91bmRUZXh0KHRleHQ6IFRtcGxBc3RCb3VuZFRleHQpIHsgdGhpcy52aXNpdEV4cHJlc3Npb24odGV4dC52YWx1ZSk7IH1cbiAgdmlzaXRSZWZlcmVuY2UocmVmZXJlbmNlOiBUbXBsQXN0UmVmZXJlbmNlKSB7XG4gICAgY29uc3QgcmVmZXJlbmNlSWRlbnRpZmVyID0gdGhpcy50YXJnZXRUb0lkZW50aWZpZXIocmVmZXJlbmNlKTtcblxuICAgIHRoaXMuaWRlbnRpZmllcnMuYWRkKHJlZmVyZW5jZUlkZW50aWZlcik7XG4gIH1cbiAgdmlzaXRWYXJpYWJsZSh2YXJpYWJsZTogVG1wbEFzdFZhcmlhYmxlKSB7XG4gICAgY29uc3QgdmFyaWFibGVJZGVudGlmaWVyID0gdGhpcy50YXJnZXRUb0lkZW50aWZpZXIodmFyaWFibGUpO1xuXG4gICAgdGhpcy5pZGVudGlmaWVycy5hZGQodmFyaWFibGVJZGVudGlmaWVyKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGFuIGlkZW50aWZpZXIgZm9yIGEgdGVtcGxhdGUgZWxlbWVudCBvciB0ZW1wbGF0ZSBub2RlLiAqL1xuICBwcml2YXRlIGVsZW1lbnRPclRlbXBsYXRlVG9JZGVudGlmaWVyKG5vZGU6IFRtcGxBc3RFbGVtZW50fFRtcGxBc3RUZW1wbGF0ZSk6IEVsZW1lbnRJZGVudGlmaWVyXG4gICAgICB8VGVtcGxhdGVOb2RlSWRlbnRpZmllciB7XG4gICAgLy8gSWYgdGhpcyBub2RlIGhhcyBhbHJlYWR5IGJlZW4gc2VlbiwgcmV0dXJuIHRoZSBjYWNoZWQgcmVzdWx0LlxuICAgIGlmICh0aGlzLmVsZW1lbnRBbmRUZW1wbGF0ZUlkZW50aWZpZXJDYWNoZS5oYXMobm9kZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRBbmRUZW1wbGF0ZUlkZW50aWZpZXJDYWNoZS5nZXQobm9kZSkgITtcbiAgICB9XG5cbiAgICBsZXQgbmFtZTogc3RyaW5nO1xuICAgIGxldCBraW5kOiBJZGVudGlmaWVyS2luZC5FbGVtZW50fElkZW50aWZpZXJLaW5kLlRlbXBsYXRlO1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgVG1wbEFzdFRlbXBsYXRlKSB7XG4gICAgICBuYW1lID0gbm9kZS50YWdOYW1lO1xuICAgICAga2luZCA9IElkZW50aWZpZXJLaW5kLlRlbXBsYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbm9kZS5uYW1lO1xuICAgICAga2luZCA9IElkZW50aWZpZXJLaW5kLkVsZW1lbnQ7XG4gICAgfVxuICAgIGNvbnN0IHtzb3VyY2VTcGFufSA9IG5vZGU7XG4gICAgLy8gQW4gZWxlbWVudCdzIG9yIHRlbXBsYXRlJ3Mgc291cmNlIHNwYW4gY2FuIGJlIG9mIHRoZSBmb3JtIGA8ZWxlbWVudD5gLCBgPGVsZW1lbnQgLz5gLCBvclxuICAgIC8vIGA8ZWxlbWVudD48L2VsZW1lbnQ+YC4gT25seSB0aGUgc2VsZWN0b3IgaXMgaW50ZXJlc3RpbmcgdG8gdGhlIGluZGV4ZXIsIHNvIHRoZSBzb3VyY2UgaXNcbiAgICAvLyBzZWFyY2hlZCBmb3IgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgdGhlIGVsZW1lbnQgKHNlbGVjdG9yKSBuYW1lLlxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5nZXRTdGFydExvY2F0aW9uKG5hbWUsIHNvdXJjZVNwYW4pO1xuICAgIGNvbnN0IGFic29sdXRlU3BhbiA9IG5ldyBBYnNvbHV0ZVNvdXJjZVNwYW4oc3RhcnQsIHN0YXJ0ICsgbmFtZS5sZW5ndGgpO1xuXG4gICAgLy8gUmVjb3JkIHRoZSBub2RlcydzIGF0dHJpYnV0ZXMsIHdoaWNoIGFuIGluZGV4ZXIgY2FuIGxhdGVyIHRyYXZlcnNlIHRvIHNlZSBpZiBhbnkgb2YgdGhlbVxuICAgIC8vIHNwZWNpZnkgYSB1c2VkIGRpcmVjdGl2ZSBvbiB0aGUgbm9kZS5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzLm1hcCgoe25hbWUsIHNvdXJjZVNwYW59KTogQXR0cmlidXRlSWRlbnRpZmllciA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lLFxuICAgICAgICBzcGFuOiBuZXcgQWJzb2x1dGVTb3VyY2VTcGFuKHNvdXJjZVNwYW4uc3RhcnQub2Zmc2V0LCBzb3VyY2VTcGFuLmVuZC5vZmZzZXQpLFxuICAgICAgICBraW5kOiBJZGVudGlmaWVyS2luZC5BdHRyaWJ1dGUsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGNvbnN0IHVzZWREaXJlY3RpdmVzID0gdGhpcy5ib3VuZFRlbXBsYXRlLmdldERpcmVjdGl2ZXNPZk5vZGUobm9kZSkgfHwgW107XG5cbiAgICBjb25zdCBpZGVudGlmaWVyID0ge1xuICAgICAgbmFtZSxcbiAgICAgIHNwYW46IGFic29sdXRlU3Bhbiwga2luZCxcbiAgICAgIGF0dHJpYnV0ZXM6IG5ldyBTZXQoYXR0cmlidXRlcyksXG4gICAgICB1c2VkRGlyZWN0aXZlczogbmV3IFNldCh1c2VkRGlyZWN0aXZlcy5tYXAoZGlyID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBub2RlOiBkaXIucmVmLm5vZGUsXG4gICAgICAgICAgc2VsZWN0b3I6IGRpci5zZWxlY3RvcixcbiAgICAgICAgfTtcbiAgICAgIH0pKSxcbiAgICAgIC8vIGNhc3QgYi9jIHByZS1UeXBlU2NyaXB0IDMuNSB1bmlvbnMgYXJlbid0IHdlbGwgZGlzY3JpbWluYXRlZFxuICAgIH0gYXMgRWxlbWVudElkZW50aWZpZXIgfFxuICAgICAgICBUZW1wbGF0ZU5vZGVJZGVudGlmaWVyO1xuXG4gICAgdGhpcy5lbGVtZW50QW5kVGVtcGxhdGVJZGVudGlmaWVyQ2FjaGUuc2V0KG5vZGUsIGlkZW50aWZpZXIpO1xuICAgIHJldHVybiBpZGVudGlmaWVyO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYW4gaWRlbnRpZmllciBmb3IgYSB0ZW1wbGF0ZSByZWZlcmVuY2Ugb3IgdGVtcGxhdGUgdmFyaWFibGUgdGFyZ2V0LiAqL1xuICBwcml2YXRlIHRhcmdldFRvSWRlbnRpZmllcihub2RlOiBUbXBsQXN0UmVmZXJlbmNlfFRtcGxBc3RWYXJpYWJsZSk6IFRhcmdldElkZW50aWZpZXIge1xuICAgIC8vIElmIHRoaXMgbm9kZSBoYXMgYWxyZWFkeSBiZWVuIHNlZW4sIHJldHVybiB0aGUgY2FjaGVkIHJlc3VsdC5cbiAgICBpZiAodGhpcy50YXJnZXRJZGVudGlmaWVyQ2FjaGUuaGFzKG5vZGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXRJZGVudGlmaWVyQ2FjaGUuZ2V0KG5vZGUpICE7XG4gICAgfVxuXG4gICAgY29uc3Qge25hbWUsIHNvdXJjZVNwYW59ID0gbm9kZTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuZ2V0U3RhcnRMb2NhdGlvbihuYW1lLCBzb3VyY2VTcGFuKTtcbiAgICBjb25zdCBzcGFuID0gbmV3IEFic29sdXRlU291cmNlU3BhbihzdGFydCwgc3RhcnQgKyBuYW1lLmxlbmd0aCk7XG4gICAgbGV0IGlkZW50aWZpZXI6IFJlZmVyZW5jZUlkZW50aWZpZXJ8VmFyaWFibGVJZGVudGlmaWVyO1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgVG1wbEFzdFJlZmVyZW5jZSkge1xuICAgICAgLy8gSWYgdGhlIG5vZGUgaXMgYSByZWZlcmVuY2UsIHdlIGNhcmUgYWJvdXQgaXRzIHRhcmdldC4gVGhlIHRhcmdldCBjYW4gYmUgYW4gZWxlbWVudCwgYVxuICAgICAgLy8gdGVtcGxhdGUsIGEgZGlyZWN0aXZlIGFwcGxpZWQgb24gYSB0ZW1wbGF0ZSBvciBlbGVtZW50IChpbiB3aGljaCBjYXNlIHRoZSBkaXJlY3RpdmUgZmllbGRcbiAgICAgIC8vIGlzIG5vbi1udWxsKSwgb3Igbm90aGluZyBhdCBhbGwuXG4gICAgICBjb25zdCByZWZUYXJnZXQgPSB0aGlzLmJvdW5kVGVtcGxhdGUuZ2V0UmVmZXJlbmNlVGFyZ2V0KG5vZGUpO1xuICAgICAgbGV0IHRhcmdldCA9IG51bGw7XG4gICAgICBpZiAocmVmVGFyZ2V0KSB7XG4gICAgICAgIGlmIChyZWZUYXJnZXQgaW5zdGFuY2VvZiBUbXBsQXN0RWxlbWVudCB8fCByZWZUYXJnZXQgaW5zdGFuY2VvZiBUbXBsQXN0VGVtcGxhdGUpIHtcbiAgICAgICAgICB0YXJnZXQgPSB7XG4gICAgICAgICAgICBub2RlOiB0aGlzLmVsZW1lbnRPclRlbXBsYXRlVG9JZGVudGlmaWVyKHJlZlRhcmdldCksXG4gICAgICAgICAgICBkaXJlY3RpdmU6IG51bGwsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQgPSB7XG4gICAgICAgICAgICBub2RlOiB0aGlzLmVsZW1lbnRPclRlbXBsYXRlVG9JZGVudGlmaWVyKHJlZlRhcmdldC5ub2RlKSxcbiAgICAgICAgICAgIGRpcmVjdGl2ZTogcmVmVGFyZ2V0LmRpcmVjdGl2ZS5yZWYubm9kZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlkZW50aWZpZXIgPSB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNwYW4sXG4gICAgICAgIGtpbmQ6IElkZW50aWZpZXJLaW5kLlJlZmVyZW5jZSwgdGFyZ2V0LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRlbnRpZmllciA9IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc3BhbixcbiAgICAgICAga2luZDogSWRlbnRpZmllcktpbmQuVmFyaWFibGUsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0SWRlbnRpZmllckNhY2hlLnNldChub2RlLCBpZGVudGlmaWVyKTtcbiAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzdGFydCBsb2NhdGlvbiBvZiBhIHN0cmluZyBpbiBhIFNvdXJjZVNwYW4gKi9cbiAgcHJpdmF0ZSBnZXRTdGFydExvY2F0aW9uKG5hbWU6IHN0cmluZywgY29udGV4dDogUGFyc2VTb3VyY2VTcGFuKTogbnVtYmVyIHtcbiAgICBjb25zdCBsb2NhbFN0ciA9IGNvbnRleHQudG9TdHJpbmcoKTtcbiAgICBpZiAoIWxvY2FsU3RyLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEltcG9zc2libGUgc3RhdGU6IFwiJHtuYW1lfVwiIG5vdCBmb3VuZCBpbiBcIiR7bG9jYWxTdHJ9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHQuc3RhcnQub2Zmc2V0ICsgbG9jYWxTdHIuaW5kZXhPZihuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWaXNpdHMgYSBub2RlJ3MgZXhwcmVzc2lvbiBhbmQgYWRkcyBpdHMgaWRlbnRpZmllcnMsIGlmIGFueSwgdG8gdGhlIHZpc2l0b3IncyBzdGF0ZS5cbiAgICogT25seSBBU1RzIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIGV4cHJlc3Npb24gc291cmNlIGFuZCBpdHMgbG9jYXRpb24gYXJlIHZpc2l0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBub2RlIG5vZGUgd2hvc2UgZXhwcmVzc2lvbiB0byB2aXNpdFxuICAgKi9cbiAgcHJpdmF0ZSB2aXNpdEV4cHJlc3Npb24oYXN0OiBBU1QpIHtcbiAgICAvLyBPbmx5IGluY2x1ZGUgQVNUcyB0aGF0IGhhdmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlaXIgc291cmNlIGFuZCBhYnNvbHV0ZSBzb3VyY2Ugc3BhbnMuXG4gICAgaWYgKGFzdCBpbnN0YW5jZW9mIEFTVFdpdGhTb3VyY2UgJiYgYXN0LnNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgLy8gTWFrZSB0YXJnZXQgdG8gaWRlbnRpZmllciBtYXBwaW5nIGNsb3N1cmUgc3RhdGVmdWwgdG8gdGhpcyB2aXNpdG9yIGluc3RhbmNlLlxuICAgICAgY29uc3QgdGFyZ2V0VG9JZGVudGlmaWVyID0gdGhpcy50YXJnZXRUb0lkZW50aWZpZXIuYmluZCh0aGlzKTtcbiAgICAgIGNvbnN0IGFic29sdXRlT2Zmc2V0ID0gYXN0LnNvdXJjZVNwYW4uc3RhcnQ7XG4gICAgICBjb25zdCBpZGVudGlmaWVycyA9IEV4cHJlc3Npb25WaXNpdG9yLmdldElkZW50aWZpZXJzKFxuICAgICAgICAgIGFzdCwgYXN0LnNvdXJjZSwgYWJzb2x1dGVPZmZzZXQsIHRoaXMuYm91bmRUZW1wbGF0ZSwgdGFyZ2V0VG9JZGVudGlmaWVyKTtcbiAgICAgIGlkZW50aWZpZXJzLmZvckVhY2goaWQgPT4gdGhpcy5pZGVudGlmaWVycy5hZGQoaWQpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcmF2ZXJzZXMgYSB0ZW1wbGF0ZSBBU1QgYW5kIGJ1aWxkcyBpZGVudGlmaWVycyBkaXNjb3ZlcmVkIGluIGl0LlxuICpcbiAqIEBwYXJhbSBib3VuZFRlbXBsYXRlIGJvdW5kIHRlbXBsYXRlIHRhcmdldCwgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIHF1ZXJ5aW5nIGV4cHJlc3Npb24gdGFyZ2V0cy5cbiAqIEByZXR1cm4gaWRlbnRpZmllcnMgaW4gdGVtcGxhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRlbXBsYXRlSWRlbnRpZmllcnMoYm91bmRUZW1wbGF0ZTogQm91bmRUYXJnZXQ8Q29tcG9uZW50TWV0YT4pOlxuICAgIFNldDxUb3BMZXZlbElkZW50aWZpZXI+IHtcbiAgY29uc3QgdmlzaXRvciA9IG5ldyBUZW1wbGF0ZVZpc2l0b3IoYm91bmRUZW1wbGF0ZSk7XG4gIGlmIChib3VuZFRlbXBsYXRlLnRhcmdldC50ZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmlzaXRvci52aXNpdEFsbChib3VuZFRlbXBsYXRlLnRhcmdldC50ZW1wbGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHZpc2l0b3IuaWRlbnRpZmllcnM7XG59XG4iXX0=