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
        define("@angular/compiler-cli/ngcc/src/host/esm5_host", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/reflection", "@angular/compiler-cli/src/ngtsc/util/src/typescript", "@angular/compiler-cli/ngcc/src/utils", "@angular/compiler-cli/ngcc/src/host/esm2015_host"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    var esm2015_host_1 = require("@angular/compiler-cli/ngcc/src/host/esm2015_host");
    /**
     * ESM5 packages contain ECMAScript IIFE functions that act like classes. For example:
     *
     * ```
     * var CommonModule = (function () {
     *  function CommonModule() {
     *  }
     *  CommonModule.decorators = [ ... ];
     * ```
     *
     * * "Classes" are decorated if they have a static property called `decorators`.
     * * Members are decorated if there is a matching key on a static property
     *   called `propDecorators`.
     * * Constructor parameters decorators are found on an object returned from
     *   a static method called `ctorParameters`.
     *
     */
    var Esm5ReflectionHost = /** @class */ (function (_super) {
        tslib_1.__extends(Esm5ReflectionHost, _super);
        function Esm5ReflectionHost() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Determines whether the given declaration, which should be a "class", has a base "class".
         *
         * In ES5 code, we need to determine if the IIFE wrapper takes a `_super` parameter .
         *
         * @param clazz a `ClassDeclaration` representing the class over which to reflect.
         */
        Esm5ReflectionHost.prototype.hasBaseClass = function (clazz) {
            if (_super.prototype.hasBaseClass.call(this, clazz))
                return true;
            var classDeclaration = this.getClassDeclaration(clazz);
            if (!classDeclaration)
                return false;
            var iifeBody = getIifeBody(classDeclaration);
            if (!iifeBody)
                return false;
            var iife = iifeBody.parent;
            if (!iife || !ts.isFunctionExpression(iife))
                return false;
            return iife.parameters.length === 1 && isSuperIdentifier(iife.parameters[0].name);
        };
        Esm5ReflectionHost.prototype.getBaseClassExpression = function (clazz) {
            var superBaseClassIdentifier = _super.prototype.getBaseClassExpression.call(this, clazz);
            if (superBaseClassIdentifier) {
                return superBaseClassIdentifier;
            }
            var classDeclaration = this.getClassDeclaration(clazz);
            if (!classDeclaration)
                return null;
            var iifeBody = getIifeBody(classDeclaration);
            if (!iifeBody)
                return null;
            var iife = iifeBody.parent;
            if (!iife || !ts.isFunctionExpression(iife))
                return null;
            if (iife.parameters.length !== 1 || !isSuperIdentifier(iife.parameters[0].name)) {
                return null;
            }
            if (!ts.isCallExpression(iife.parent)) {
                return null;
            }
            return iife.parent.arguments[0];
        };
        /**
         * Find the declaration of a class given a node that we think represents the class.
         *
         * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE,
         * whose value is assigned to a variable (which represents the class to the rest of the program).
         * So we might need to dig around to get hold of the "class" declaration.
         *
         * `node` might be one of:
         * - A class declaration (from a typings file).
         * - The declaration of the outer variable, which is assigned the result of the IIFE.
         * - The function declaration inside the IIFE, which is eventually returned and assigned to the
         *   outer variable.
         *
         * The returned declaration is either the class declaration (from the typings file) or the outer
         * variable declaration.
         *
         * @param node the node that represents the class whose declaration we are finding.
         * @returns the declaration of the class or `undefined` if it is not a "class".
         */
        Esm5ReflectionHost.prototype.getClassDeclaration = function (node) {
            var superDeclaration = _super.prototype.getClassDeclaration.call(this, node);
            if (superDeclaration)
                return superDeclaration;
            var outerClass = getClassDeclarationFromInnerFunctionDeclaration(node);
            if (outerClass)
                return outerClass;
            // At this point, `node` could be the outer variable declaration of an ES5 class.
            // If so, ensure that it has a `name` identifier and the correct structure.
            if (!reflection_1.isNamedVariableDeclaration(node) ||
                !this.getInnerFunctionDeclarationFromClassDeclaration(node)) {
                return undefined;
            }
            return node;
        };
        /**
         * Trace an identifier to its declaration, if possible.
         *
         * This method attempts to resolve the declaration of the given identifier, tracing back through
         * imports and re-exports until the original declaration statement is found. A `Declaration`
         * object is returned if the original declaration is found, or `null` is returned otherwise.
         *
         * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE.
         * If we are looking for the declaration of the identifier of the inner function expression, we
         * will get hold of the outer "class" variable declaration and return its identifier instead. See
         * `getClassDeclarationFromInnerFunctionDeclaration()` for more info.
         *
         * @param id a TypeScript `ts.Identifier` to trace back to a declaration.
         *
         * @returns metadata about the `Declaration` if the original declaration is found, or `null`
         * otherwise.
         */
        Esm5ReflectionHost.prototype.getDeclarationOfIdentifier = function (id) {
            // Get the identifier for the outer class node (if any).
            var outerClassNode = getClassDeclarationFromInnerFunctionDeclaration(id.parent);
            var declaration = _super.prototype.getDeclarationOfIdentifier.call(this, outerClassNode ? outerClassNode.name : id);
            if (!declaration || !ts.isVariableDeclaration(declaration.node) ||
                declaration.node.initializer !== undefined ||
                // VariableDeclaration => VariableDeclarationList => VariableStatement => IIFE Block
                !ts.isBlock(declaration.node.parent.parent.parent)) {
                return declaration;
            }
            // We might have an alias to another variable declaration.
            // Search the containing iife body for it.
            var block = declaration.node.parent.parent.parent;
            var aliasSymbol = this.checker.getSymbolAtLocation(declaration.node.name);
            for (var i = 0; i < block.statements.length; i++) {
                var statement = block.statements[i];
                // Looking for statement that looks like: `AliasedVariable = OriginalVariable;`
                if (esm2015_host_1.isAssignmentStatement(statement) && ts.isIdentifier(statement.expression.left) &&
                    ts.isIdentifier(statement.expression.right) &&
                    this.checker.getSymbolAtLocation(statement.expression.left) === aliasSymbol) {
                    return this.getDeclarationOfIdentifier(statement.expression.right);
                }
            }
            return declaration;
        };
        /**
         * Parse a function declaration to find the relevant metadata about it.
         *
         * In ESM5 we need to do special work with optional arguments to the function, since they get
         * their own initializer statement that needs to be parsed and then not included in the "body"
         * statements of the function.
         *
         * @param node the function declaration to parse.
         * @returns an object containing the node, statements and parameters of the function.
         */
        Esm5ReflectionHost.prototype.getDefinitionOfFunction = function (node) {
            if (!ts.isFunctionDeclaration(node) && !ts.isMethodDeclaration(node) &&
                !ts.isFunctionExpression(node) && !ts.isVariableDeclaration(node)) {
                return null;
            }
            var tsHelperFn = getTsHelperFn(node);
            if (tsHelperFn !== null) {
                return {
                    node: node,
                    body: null,
                    helper: tsHelperFn,
                    parameters: [],
                };
            }
            // If the node was not identified to be a TypeScript helper, a variable declaration at this
            // point cannot be resolved as a function.
            if (ts.isVariableDeclaration(node)) {
                return null;
            }
            var parameters = node.parameters.map(function (p) { return ({ name: utils_1.getNameText(p.name), node: p, initializer: null }); });
            var lookingForParamInitializers = true;
            var statements = node.body && node.body.statements.filter(function (s) {
                lookingForParamInitializers =
                    lookingForParamInitializers && reflectParamInitializer(s, parameters);
                // If we are no longer looking for parameter initializers then we include this statement
                return !lookingForParamInitializers;
            });
            return { node: node, body: statements || null, helper: null, parameters: parameters };
        };
        /**
         * Examine a declaration which should be of a class, and return metadata about the members of the
         * class.
         *
         * @param declaration a TypeScript `ts.Declaration` node representing the class over which to
         * reflect.
         *
         * @returns an array of `ClassMember` metadata representing the members of the class.
         *
         * @throws if `declaration` does not resolve to a class declaration.
         */
        Esm5ReflectionHost.prototype.getMembersOfClass = function (clazz) {
            // Do not follow ES5's resolution logic when the node resides in a .d.ts file.
            if (typescript_1.isFromDtsFile(clazz)) {
                return _super.prototype.getMembersOfClass.call(this, clazz);
            }
            // The necessary info is on the inner function declaration (inside the ES5 class IIFE).
            var innerFunctionSymbol = this.getInnerFunctionSymbolFromClassDeclaration(clazz);
            if (!innerFunctionSymbol) {
                throw new Error("Attempted to get members of a non-class: \"" + clazz.getText() + "\"");
            }
            return this.getMembersOfSymbol(innerFunctionSymbol);
        };
        /** Gets all decorators of the given class symbol. */
        Esm5ReflectionHost.prototype.getDecoratorsOfSymbol = function (symbol) {
            // The necessary info is on the inner function declaration (inside the ES5 class IIFE).
            var innerFunctionSymbol = this.getInnerFunctionSymbolFromClassDeclaration(symbol.valueDeclaration);
            if (!innerFunctionSymbol)
                return null;
            return _super.prototype.getDecoratorsOfSymbol.call(this, innerFunctionSymbol);
        };
        ///////////// Protected Helpers /////////////
        /**
         * Get the inner function declaration of an ES5-style class.
         *
         * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE
         * and returned to be assigned to a variable outside the IIFE, which is what the rest of the
         * program interacts with.
         *
         * Given the outer variable declaration, we want to get to the inner function declaration.
         *
         * @param node a node that could be the variable expression outside an ES5 class IIFE.
         * @param checker the TS program TypeChecker
         * @returns the inner function declaration or `undefined` if it is not a "class".
         */
        Esm5ReflectionHost.prototype.getInnerFunctionDeclarationFromClassDeclaration = function (node) {
            if (!ts.isVariableDeclaration(node))
                return undefined;
            // Extract the IIFE body (if any).
            var iifeBody = getIifeBody(node);
            if (!iifeBody)
                return undefined;
            // Extract the function declaration from inside the IIFE.
            var functionDeclaration = iifeBody.statements.find(ts.isFunctionDeclaration);
            if (!functionDeclaration)
                return undefined;
            // Extract the return identifier of the IIFE.
            var returnIdentifier = getReturnIdentifier(iifeBody);
            var returnIdentifierSymbol = returnIdentifier && this.checker.getSymbolAtLocation(returnIdentifier);
            if (!returnIdentifierSymbol)
                return undefined;
            // Verify that the inner function is returned.
            if (returnIdentifierSymbol.valueDeclaration !== functionDeclaration)
                return undefined;
            return functionDeclaration;
        };
        /**
         * Get the identifier symbol of the inner function declaration of an ES5-style class.
         *
         * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE
         * and returned to be assigned to a variable outside the IIFE, which is what the rest of the
         * program interacts with.
         *
         * Given the outer variable declaration, we want to get to the identifier symbol of the inner
         * function declaration.
         *
         * @param clazz a node that could be the variable expression outside an ES5 class IIFE.
         * @param checker the TS program TypeChecker
         * @returns the inner function declaration identifier symbol or `undefined` if it is not a "class"
         * or has no identifier.
         */
        Esm5ReflectionHost.prototype.getInnerFunctionSymbolFromClassDeclaration = function (clazz) {
            var innerFunctionDeclaration = this.getInnerFunctionDeclarationFromClassDeclaration(clazz);
            if (!innerFunctionDeclaration || !utils_1.hasNameIdentifier(innerFunctionDeclaration))
                return undefined;
            return this.checker.getSymbolAtLocation(innerFunctionDeclaration.name);
        };
        /**
         * Find the declarations of the constructor parameters of a class identified by its symbol.
         *
         * In ESM5, there is no "class" so the constructor that we want is actually the inner function
         * declaration inside the IIFE, whose return value is assigned to the outer variable declaration
         * (that represents the class to the rest of the program).
         *
         * @param classSymbol the symbol of the class (i.e. the outer variable declaration) whose
         * parameters we want to find.
         * @returns an array of `ts.ParameterDeclaration` objects representing each of the parameters in
         * the class's constructor or `null` if there is no constructor.
         */
        Esm5ReflectionHost.prototype.getConstructorParameterDeclarations = function (classSymbol) {
            var constructor = this.getInnerFunctionDeclarationFromClassDeclaration(classSymbol.valueDeclaration);
            if (!constructor)
                return null;
            if (constructor.parameters.length > 0) {
                return Array.from(constructor.parameters);
            }
            if (isSynthesizedConstructor(constructor)) {
                return null;
            }
            return [];
        };
        /**
         * Get the parameter decorators of a class constructor.
         *
         * @param classSymbol the symbol of the class (i.e. the outer variable declaration) whose
         * parameter info we want to get.
         * @param parameterNodes the array of TypeScript parameter nodes for this class's constructor.
         * @returns an array of constructor parameter info objects.
         */
        Esm5ReflectionHost.prototype.getConstructorParamInfo = function (classSymbol, parameterNodes) {
            // The necessary info is on the inner function declaration (inside the ES5 class IIFE).
            var innerFunctionSymbol = this.getInnerFunctionSymbolFromClassDeclaration(classSymbol.valueDeclaration);
            if (!innerFunctionSymbol)
                return [];
            return _super.prototype.getConstructorParamInfo.call(this, innerFunctionSymbol, parameterNodes);
        };
        /**
         * Get the parameter type and decorators for the constructor of a class,
         * where the information is stored on a static method of the class.
         *
         * In this case the decorators are stored in the body of a method
         * (`ctorParatemers`) attached to the constructor function.
         *
         * Note that unlike ESM2015 this is a function expression rather than an arrow
         * function:
         *
         * ```
         * SomeDirective.ctorParameters = function() { return [
         *   { type: ViewContainerRef, },
         *   { type: TemplateRef, },
         *   { type: IterableDiffers, },
         *   { type: undefined, decorators: [{ type: Inject, args: [INJECTED_TOKEN,] },] },
         * ]; };
         * ```
         *
         * @param paramDecoratorsProperty the property that holds the parameter info we want to get.
         * @returns an array of objects containing the type and decorators for each parameter.
         */
        Esm5ReflectionHost.prototype.getParamInfoFromStaticProperty = function (paramDecoratorsProperty) {
            var _this = this;
            var paramDecorators = esm2015_host_1.getPropertyValueFromSymbol(paramDecoratorsProperty);
            // The decorators array may be wrapped in a function. If so unwrap it.
            var returnStatement = getReturnStatement(paramDecorators);
            var expression = returnStatement ? returnStatement.expression : paramDecorators;
            if (expression && ts.isArrayLiteralExpression(expression)) {
                var elements = expression.elements;
                return elements.map(reflectArrayElement).map(function (paramInfo) {
                    var typeExpression = paramInfo && paramInfo.has('type') ? paramInfo.get('type') : null;
                    var decoratorInfo = paramInfo && paramInfo.has('decorators') ? paramInfo.get('decorators') : null;
                    var decorators = decoratorInfo && _this.reflectDecorators(decoratorInfo);
                    return { typeExpression: typeExpression, decorators: decorators };
                });
            }
            else if (paramDecorators !== undefined) {
                this.logger.warn('Invalid constructor parameter decorator in ' + paramDecorators.getSourceFile().fileName +
                    ':\n', paramDecorators.getText());
            }
            return null;
        };
        /**
         * Reflect over a symbol and extract the member information, combining it with the
         * provided decorator information, and whether it is a static member.
         *
         * If a class member uses accessors (e.g getters and/or setters) then it gets downleveled
         * in ES5 to a single `Object.defineProperty()` call. In that case we must parse this
         * call to extract the one or two ClassMember objects that represent the accessors.
         *
         * @param symbol the symbol for the member to reflect over.
         * @param decorators an array of decorators associated with the member.
         * @param isStatic true if this member is static, false if it is an instance property.
         * @returns the reflected member information, or null if the symbol is not a member.
         */
        Esm5ReflectionHost.prototype.reflectMembers = function (symbol, decorators, isStatic) {
            var node = symbol.valueDeclaration || symbol.declarations && symbol.declarations[0];
            var propertyDefinition = node && getPropertyDefinition(node);
            if (propertyDefinition) {
                var members_1 = [];
                if (propertyDefinition.setter) {
                    members_1.push({
                        node: node,
                        implementation: propertyDefinition.setter,
                        kind: reflection_1.ClassMemberKind.Setter,
                        type: null,
                        name: symbol.name,
                        nameNode: null,
                        value: null,
                        isStatic: isStatic || false,
                        decorators: decorators || [],
                    });
                    // Prevent attaching the decorators to a potential getter. In ES5, we can't tell where the
                    // decorators were originally attached to, however we only want to attach them to a single
                    // `ClassMember` as otherwise ngtsc would handle the same decorators twice.
                    decorators = undefined;
                }
                if (propertyDefinition.getter) {
                    members_1.push({
                        node: node,
                        implementation: propertyDefinition.getter,
                        kind: reflection_1.ClassMemberKind.Getter,
                        type: null,
                        name: symbol.name,
                        nameNode: null,
                        value: null,
                        isStatic: isStatic || false,
                        decorators: decorators || [],
                    });
                }
                return members_1;
            }
            var members = _super.prototype.reflectMembers.call(this, symbol, decorators, isStatic);
            members && members.forEach(function (member) {
                if (member && member.kind === reflection_1.ClassMemberKind.Method && member.isStatic && member.node &&
                    ts.isPropertyAccessExpression(member.node) && member.node.parent &&
                    ts.isBinaryExpression(member.node.parent) &&
                    ts.isFunctionExpression(member.node.parent.right)) {
                    // Recompute the implementation for this member:
                    // ES5 static methods are variable declarations so the declaration is actually the
                    // initializer of the variable assignment
                    member.implementation = member.node.parent.right;
                }
            });
            return members;
        };
        /**
         * Find statements related to the given class that may contain calls to a helper.
         *
         * In ESM5 code the helper calls are hidden inside the class's IIFE.
         *
         * @param classSymbol the class whose helper calls we are interested in. We expect this symbol
         * to reference the inner identifier inside the IIFE.
         * @returns an array of statements that may contain helper calls.
         */
        Esm5ReflectionHost.prototype.getStatementsForClass = function (classSymbol) {
            var classDeclarationParent = classSymbol.valueDeclaration.parent;
            return ts.isBlock(classDeclarationParent) ? Array.from(classDeclarationParent.statements) : [];
        };
        /**
         * Try to retrieve the symbol of a static property on a class.
         *
         * In ES5, a static property can either be set on the inner function declaration inside the class'
         * IIFE, or it can be set on the outer variable declaration. Therefore, the ES5 host checks both
         * places, first looking up the property on the inner symbol, and if the property is not found it
         * will fall back to looking up the property on the outer symbol.
         *
         * @param symbol the class whose property we are interested in.
         * @param propertyName the name of static property.
         * @returns the symbol if it is found or `undefined` if not.
         */
        Esm5ReflectionHost.prototype.getStaticProperty = function (symbol, propertyName) {
            // The symbol corresponds with the inner function declaration. First lets see if the static
            // property is set there.
            var prop = _super.prototype.getStaticProperty.call(this, symbol, propertyName);
            if (prop !== undefined) {
                return prop;
            }
            // Otherwise, obtain the outer variable declaration and resolve its symbol, in order to lookup
            // static properties there.
            var outerClass = getClassDeclarationFromInnerFunctionDeclaration(symbol.valueDeclaration);
            if (outerClass === undefined) {
                return undefined;
            }
            var outerSymbol = this.checker.getSymbolAtLocation(outerClass.name);
            if (outerSymbol === undefined || outerSymbol.valueDeclaration === undefined) {
                return undefined;
            }
            return _super.prototype.getStaticProperty.call(this, outerSymbol, propertyName);
        };
        return Esm5ReflectionHost;
    }(esm2015_host_1.Esm2015ReflectionHost));
    exports.Esm5ReflectionHost = Esm5ReflectionHost;
    /**
     * In ES5, getters and setters have been downleveled into call expressions of
     * `Object.defineProperty`, such as
     *
     * ```
     * Object.defineProperty(Clazz.prototype, "property", {
     *   get: function () {
     *       return 'value';
     *   },
     *   set: function (value) {
     *       this.value = value;
     *   },
     *   enumerable: true,
     *   configurable: true
     * });
     * ```
     *
     * This function inspects the given node to determine if it corresponds with such a call, and if so
     * extracts the `set` and `get` function expressions from the descriptor object, if they exist.
     *
     * @param node The node to obtain the property definition from.
     * @returns The property definition if the node corresponds with accessor, null otherwise.
     */
    function getPropertyDefinition(node) {
        if (!ts.isCallExpression(node))
            return null;
        var fn = node.expression;
        if (!ts.isPropertyAccessExpression(fn) || !ts.isIdentifier(fn.expression) ||
            fn.expression.text !== 'Object' || fn.name.text !== 'defineProperty')
            return null;
        var descriptor = node.arguments[2];
        if (!descriptor || !ts.isObjectLiteralExpression(descriptor))
            return null;
        return {
            setter: readPropertyFunctionExpression(descriptor, 'set'),
            getter: readPropertyFunctionExpression(descriptor, 'get'),
        };
    }
    function readPropertyFunctionExpression(object, name) {
        var property = object.properties.find(function (p) {
            return ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === name;
        });
        return property && ts.isFunctionExpression(property.initializer) && property.initializer || null;
    }
    /**
     * Get the actual (outer) declaration of a class.
     *
     * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE and
     * returned to be assigned to a variable outside the IIFE, which is what the rest of the program
     * interacts with.
     *
     * Given the inner function declaration, we want to get to the declaration of the outer variable
     * that represents the class.
     *
     * @param node a node that could be the function expression inside an ES5 class IIFE.
     * @returns the outer variable declaration or `undefined` if it is not a "class".
     */
    function getClassDeclarationFromInnerFunctionDeclaration(node) {
        if (ts.isFunctionDeclaration(node)) {
            // It might be the function expression inside the IIFE. We need to go 5 levels up...
            // 1. IIFE body.
            var outerNode = node.parent;
            if (!outerNode || !ts.isBlock(outerNode))
                return undefined;
            // 2. IIFE function expression.
            outerNode = outerNode.parent;
            if (!outerNode || !ts.isFunctionExpression(outerNode))
                return undefined;
            // 3. IIFE call expression.
            outerNode = outerNode.parent;
            if (!outerNode || !ts.isCallExpression(outerNode))
                return undefined;
            // 4. Parenthesis around IIFE.
            outerNode = outerNode.parent;
            if (!outerNode || !ts.isParenthesizedExpression(outerNode))
                return undefined;
            // 5. Outer variable declaration.
            outerNode = outerNode.parent;
            if (!outerNode || !ts.isVariableDeclaration(outerNode))
                return undefined;
            // Finally, ensure that the variable declaration has a `name` identifier.
            return utils_1.hasNameIdentifier(outerNode) ? outerNode : undefined;
        }
        return undefined;
    }
    function getIifeBody(declaration) {
        if (!ts.isVariableDeclaration(declaration) || !declaration.initializer ||
            !ts.isParenthesizedExpression(declaration.initializer)) {
            return undefined;
        }
        var call = declaration.initializer;
        return ts.isCallExpression(call.expression) &&
            ts.isFunctionExpression(call.expression.expression) ?
            call.expression.expression.body :
            undefined;
    }
    exports.getIifeBody = getIifeBody;
    function getReturnIdentifier(body) {
        var returnStatement = body.statements.find(ts.isReturnStatement);
        return returnStatement && returnStatement.expression &&
            ts.isIdentifier(returnStatement.expression) ?
            returnStatement.expression :
            undefined;
    }
    function getReturnStatement(declaration) {
        return declaration && ts.isFunctionExpression(declaration) ?
            declaration.body.statements.find(ts.isReturnStatement) :
            undefined;
    }
    function reflectArrayElement(element) {
        return ts.isObjectLiteralExpression(element) ? reflection_1.reflectObjectLiteral(element) : null;
    }
    /**
     * Inspects a function declaration to determine if it corresponds with a TypeScript helper function,
     * returning its kind if so or null if the declaration does not seem to correspond with such a
     * helper.
     */
    function getTsHelperFn(node) {
        var name = node.name !== undefined && ts.isIdentifier(node.name) && node.name.text;
        if (name === '__spread') {
            return reflection_1.TsHelperFn.Spread;
        }
        else {
            return null;
        }
    }
    /**
     * A constructor function may have been "synthesized" by TypeScript during JavaScript emit,
     * in the case no user-defined constructor exists and e.g. property initializers are used.
     * Those initializers need to be emitted into a constructor in JavaScript, so the TypeScript
     * compiler generates a synthetic constructor.
     *
     * We need to identify such constructors as ngcc needs to be able to tell if a class did
     * originally have a constructor in the TypeScript source. For ES5, we can not tell an
     * empty constructor apart from a synthesized constructor, but fortunately that does not
     * matter for the code generated by ngtsc.
     *
     * When a class has a superclass however, a synthesized constructor must not be considered
     * as a user-defined constructor as that prevents a base factory call from being created by
     * ngtsc, resulting in a factory function that does not inject the dependencies of the
     * superclass. Hence, we identify a default synthesized super call in the constructor body,
     * according to the structure that TypeScript's ES2015 to ES5 transformer generates in
     * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1082-L1098
     *
     * @param constructor a constructor function to test
     * @returns true if the constructor appears to have been synthesized
     */
    function isSynthesizedConstructor(constructor) {
        if (!constructor.body)
            return false;
        var firstStatement = constructor.body.statements[0];
        if (!firstStatement)
            return false;
        return isSynthesizedSuperThisAssignment(firstStatement) ||
            isSynthesizedSuperReturnStatement(firstStatement);
    }
    /**
     * Identifies a synthesized super call of the form:
     *
     * ```
     * var _this = _super !== null && _super.apply(this, arguments) || this;
     * ```
     *
     * @param statement a statement that may be a synthesized super call
     * @returns true if the statement looks like a synthesized super call
     */
    function isSynthesizedSuperThisAssignment(statement) {
        if (!ts.isVariableStatement(statement))
            return false;
        var variableDeclarations = statement.declarationList.declarations;
        if (variableDeclarations.length !== 1)
            return false;
        var variableDeclaration = variableDeclarations[0];
        if (!ts.isIdentifier(variableDeclaration.name) ||
            !variableDeclaration.name.text.startsWith('_this'))
            return false;
        var initializer = variableDeclaration.initializer;
        if (!initializer)
            return false;
        return isSynthesizedDefaultSuperCall(initializer);
    }
    /**
     * Identifies a synthesized super call of the form:
     *
     * ```
     * return _super !== null && _super.apply(this, arguments) || this;
     * ```
     *
     * @param statement a statement that may be a synthesized super call
     * @returns true if the statement looks like a synthesized super call
     */
    function isSynthesizedSuperReturnStatement(statement) {
        if (!ts.isReturnStatement(statement))
            return false;
        var expression = statement.expression;
        if (!expression)
            return false;
        return isSynthesizedDefaultSuperCall(expression);
    }
    /**
     * Tests whether the expression is of the form:
     *
     * ```
     * _super !== null && _super.apply(this, arguments) || this;
     * ```
     *
     * This structure is generated by TypeScript when transforming ES2015 to ES5, see
     * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1148-L1163
     *
     * @param expression an expression that may represent a default super call
     * @returns true if the expression corresponds with the above form
     */
    function isSynthesizedDefaultSuperCall(expression) {
        if (!isBinaryExpr(expression, ts.SyntaxKind.BarBarToken))
            return false;
        if (expression.right.kind !== ts.SyntaxKind.ThisKeyword)
            return false;
        var left = expression.left;
        if (!isBinaryExpr(left, ts.SyntaxKind.AmpersandAmpersandToken))
            return false;
        return isSuperNotNull(left.left) && isSuperApplyCall(left.right);
    }
    function isSuperNotNull(expression) {
        return isBinaryExpr(expression, ts.SyntaxKind.ExclamationEqualsEqualsToken) &&
            isSuperIdentifier(expression.left);
    }
    /**
     * Tests whether the expression is of the form
     *
     * ```
     * _super.apply(this, arguments)
     * ```
     *
     * @param expression an expression that may represent a default super call
     * @returns true if the expression corresponds with the above form
     */
    function isSuperApplyCall(expression) {
        if (!ts.isCallExpression(expression) || expression.arguments.length !== 2)
            return false;
        var targetFn = expression.expression;
        if (!ts.isPropertyAccessExpression(targetFn))
            return false;
        if (!isSuperIdentifier(targetFn.expression))
            return false;
        if (targetFn.name.text !== 'apply')
            return false;
        var thisArgument = expression.arguments[0];
        if (thisArgument.kind !== ts.SyntaxKind.ThisKeyword)
            return false;
        var argumentsArgument = expression.arguments[1];
        return ts.isIdentifier(argumentsArgument) && argumentsArgument.text === 'arguments';
    }
    function isBinaryExpr(expression, operator) {
        return ts.isBinaryExpression(expression) && expression.operatorToken.kind === operator;
    }
    function isSuperIdentifier(node) {
        // Verify that the identifier is prefixed with `_super`. We don't test for equivalence
        // as TypeScript may have suffixed the name, e.g. `_super_1` to avoid name conflicts.
        // Requiring only a prefix should be sufficiently accurate.
        return ts.isIdentifier(node) && node.text.startsWith('_super');
    }
    /**
     * Parse the statement to extract the ESM5 parameter initializer if there is one.
     * If one is found, add it to the appropriate parameter in the `parameters` collection.
     *
     * The form we are looking for is:
     *
     * ```
     * if (arg === void 0) { arg = initializer; }
     * ```
     *
     * @param statement a statement that may be initializing an optional parameter
     * @param parameters the collection of parameters that were found in the function definition
     * @returns true if the statement was a parameter initializer
     */
    function reflectParamInitializer(statement, parameters) {
        if (ts.isIfStatement(statement) && isUndefinedComparison(statement.expression) &&
            ts.isBlock(statement.thenStatement) && statement.thenStatement.statements.length === 1) {
            var ifStatementComparison = statement.expression; // (arg === void 0)
            var thenStatement = statement.thenStatement.statements[0]; // arg = initializer;
            if (esm2015_host_1.isAssignmentStatement(thenStatement)) {
                var comparisonName_1 = ifStatementComparison.left.text;
                var assignmentName = thenStatement.expression.left.text;
                if (comparisonName_1 === assignmentName) {
                    var parameter = parameters.find(function (p) { return p.name === comparisonName_1; });
                    if (parameter) {
                        parameter.initializer = thenStatement.expression.right;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function isUndefinedComparison(expression) {
        return ts.isBinaryExpression(expression) &&
            expression.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken &&
            ts.isVoidExpression(expression.right) && ts.isIdentifier(expression.left);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtNV9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL25nY2Mvc3JjL2hvc3QvZXNtNV9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUVqQyx5RUFBOE87SUFDOU8sa0ZBQXFFO0lBQ3JFLDhEQUF3RDtJQUV4RCxpRkFBbUg7SUFJbkg7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSDtRQUF3Qyw4Q0FBcUI7UUFBN0Q7O1FBcWVBLENBQUM7UUFwZUM7Ozs7OztXQU1HO1FBQ0gseUNBQVksR0FBWixVQUFhLEtBQXVCO1lBQ2xDLElBQUksaUJBQU0sWUFBWSxZQUFDLEtBQUssQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUUzQyxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsZ0JBQWdCO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBRXBDLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBRTVCLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFFMUQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRixDQUFDO1FBRUQsbURBQXNCLEdBQXRCLFVBQXVCLEtBQXVCO1lBQzVDLElBQU0s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RyxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLHFCQUFxQjtZQUNuRixJQUFJLG9DQUFxQixDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUN4QyxJQUFNLGdCQUFjLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdkQsSUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMxRCxJQUFJLGdCQUFjLEtBQUssY0FBYyxFQUFFO29CQUNyQyxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxnQkFBYyxFQUF6QixDQUF5QixDQUFDLENBQUM7b0JBQ2xFLElBQUksU0FBUyxFQUFFO3dCQUNiLFNBQVMsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7d0JBQ3ZELE9BQU8sSUFBSSxDQUFDO3FCQUNiO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVMscUJBQXFCLENBQUMsVUFBeUI7UUFFdEQsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO1lBQ3BDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCO1lBQ3ZFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbiwgQ2xhc3NNZW1iZXIsIENsYXNzTWVtYmVyS2luZCwgQ2xhc3NTeW1ib2wsIEN0b3JQYXJhbWV0ZXIsIERlY2xhcmF0aW9uLCBEZWNvcmF0b3IsIEZ1bmN0aW9uRGVmaW5pdGlvbiwgUGFyYW1ldGVyLCBUc0hlbHBlckZuLCBpc05hbWVkVmFyaWFibGVEZWNsYXJhdGlvbiwgcmVmbGVjdE9iamVjdExpdGVyYWx9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9yZWZsZWN0aW9uJztcbmltcG9ydCB7aXNGcm9tRHRzRmlsZX0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3V0aWwvc3JjL3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtnZXROYW1lVGV4dCwgaGFzTmFtZUlkZW50aWZpZXJ9IGZyb20gJy4uL3V0aWxzJztcblxuaW1wb3J0IHtFc20yMDE1UmVmbGVjdGlvbkhvc3QsIFBhcmFtSW5mbywgZ2V0UHJvcGVydHlWYWx1ZUZyb21TeW1ib2wsIGlzQXNzaWdubWVudFN0YXRlbWVudH0gZnJvbSAnLi9lc20yMDE1X2hvc3QnO1xuXG5cblxuLyoqXG4gKiBFU001IHBhY2thZ2VzIGNvbnRhaW4gRUNNQVNjcmlwdCBJSUZFIGZ1bmN0aW9ucyB0aGF0IGFjdCBsaWtlIGNsYXNzZXMuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogdmFyIENvbW1vbk1vZHVsZSA9IChmdW5jdGlvbiAoKSB7XG4gKiAgZnVuY3Rpb24gQ29tbW9uTW9kdWxlKCkge1xuICogIH1cbiAqICBDb21tb25Nb2R1bGUuZGVjb3JhdG9ycyA9IFsgLi4uIF07XG4gKiBgYGBcbiAqXG4gKiAqIFwiQ2xhc3Nlc1wiIGFyZSBkZWNvcmF0ZWQgaWYgdGhleSBoYXZlIGEgc3RhdGljIHByb3BlcnR5IGNhbGxlZCBgZGVjb3JhdG9yc2AuXG4gKiAqIE1lbWJlcnMgYXJlIGRlY29yYXRlZCBpZiB0aGVyZSBpcyBhIG1hdGNoaW5nIGtleSBvbiBhIHN0YXRpYyBwcm9wZXJ0eVxuICogICBjYWxsZWQgYHByb3BEZWNvcmF0b3JzYC5cbiAqICogQ29uc3RydWN0b3IgcGFyYW1ldGVycyBkZWNvcmF0b3JzIGFyZSBmb3VuZCBvbiBhbiBvYmplY3QgcmV0dXJuZWQgZnJvbVxuICogICBhIHN0YXRpYyBtZXRob2QgY2FsbGVkIGBjdG9yUGFyYW1ldGVyc2AuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgRXNtNVJlZmxlY3Rpb25Ib3N0IGV4dGVuZHMgRXNtMjAxNVJlZmxlY3Rpb25Ib3N0IHtcbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciB0aGUgZ2l2ZW4gZGVjbGFyYXRpb24sIHdoaWNoIHNob3VsZCBiZSBhIFwiY2xhc3NcIiwgaGFzIGEgYmFzZSBcImNsYXNzXCIuXG4gICAqXG4gICAqIEluIEVTNSBjb2RlLCB3ZSBuZWVkIHRvIGRldGVybWluZSBpZiB0aGUgSUlGRSB3cmFwcGVyIHRha2VzIGEgYF9zdXBlcmAgcGFyYW1ldGVyIC5cbiAgICpcbiAgICogQHBhcmFtIGNsYXp6IGEgYENsYXNzRGVjbGFyYXRpb25gIHJlcHJlc2VudGluZyB0aGUgY2xhc3Mgb3ZlciB3aGljaCB0byByZWZsZWN0LlxuICAgKi9cbiAgaGFzQmFzZUNsYXNzKGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKHN1cGVyLmhhc0Jhc2VDbGFzcyhjbGF6eikpIHJldHVybiB0cnVlO1xuXG4gICAgY29uc3QgY2xhc3NEZWNsYXJhdGlvbiA9IHRoaXMuZ2V0Q2xhc3NEZWNsYXJhdGlvbihjbGF6eik7XG4gICAgaWYgKCFjbGFzc0RlY2xhcmF0aW9uKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBpaWZlQm9keSA9IGdldElpZmVCb2R5KGNsYXNzRGVjbGFyYXRpb24pO1xuICAgIGlmICghaWlmZUJvZHkpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGlpZmUgPSBpaWZlQm9keS5wYXJlbnQ7XG4gICAgaWYgKCFpaWZlIHx8ICF0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihpaWZlKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIGlpZmUucGFyYW1ldGVycy5sZW5ndGggPT09IDEgJiYgaXNTdXBlcklkZW50aWZpZXIoaWlmZS5wYXJhbWV0ZXJzWzBdLm5hbWUpO1xuICB9XG5cbiAgZ2V0QmFzZUNsYXNzRXhwcmVzc2lvbihjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbik6IHRzLkV4cHJlc3Npb258bnVsbCB7XG4gICAgY29uc3Qgc3VwZXJCYXNlQ2xhc3NJZGVudGlmaWVyID0gc3VwZXIuZ2V0QmFzZUNsYXNzRXhwcmVzc2lvbihjbGF6eik7XG4gICAgaWYgKHN1cGVyQmFzZUNsYXNzSWRlbnRpZmllcikge1xuICAgICAgcmV0dXJuIHN1cGVyQmFzZUNsYXNzSWRlbnRpZmllcjtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc0RlY2xhcmF0aW9uID0gdGhpcy5nZXRDbGFzc0RlY2xhcmF0aW9uKGNsYXp6KTtcbiAgICBpZiAoIWNsYXNzRGVjbGFyYXRpb24pIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgaWlmZUJvZHkgPSBnZXRJaWZlQm9keShjbGFzc0RlY2xhcmF0aW9uKTtcbiAgICBpZiAoIWlpZmVCb2R5KSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGlpZmUgPSBpaWZlQm9keS5wYXJlbnQ7XG4gICAgaWYgKCFpaWZlIHx8ICF0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihpaWZlKSkgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoaWlmZS5wYXJhbWV0ZXJzLmxlbmd0aCAhPT0gMSB8fCAhaXNTdXBlcklkZW50aWZpZXIoaWlmZS5wYXJhbWV0ZXJzWzBdLm5hbWUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24oaWlmZS5wYXJlbnQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gaWlmZS5wYXJlbnQuYXJndW1lbnRzWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIGRlY2xhcmF0aW9uIG9mIGEgY2xhc3MgZ2l2ZW4gYSBub2RlIHRoYXQgd2UgdGhpbmsgcmVwcmVzZW50cyB0aGUgY2xhc3MuXG4gICAqXG4gICAqIEluIEVTNSwgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgY2xhc3MgaXMgYSBmdW5jdGlvbiBleHByZXNzaW9uIHRoYXQgaXMgaGlkZGVuIGluc2lkZSBhbiBJSUZFLFxuICAgKiB3aG9zZSB2YWx1ZSBpcyBhc3NpZ25lZCB0byBhIHZhcmlhYmxlICh3aGljaCByZXByZXNlbnRzIHRoZSBjbGFzcyB0byB0aGUgcmVzdCBvZiB0aGUgcHJvZ3JhbSkuXG4gICAqIFNvIHdlIG1pZ2h0IG5lZWQgdG8gZGlnIGFyb3VuZCB0byBnZXQgaG9sZCBvZiB0aGUgXCJjbGFzc1wiIGRlY2xhcmF0aW9uLlxuICAgKlxuICAgKiBgbm9kZWAgbWlnaHQgYmUgb25lIG9mOlxuICAgKiAtIEEgY2xhc3MgZGVjbGFyYXRpb24gKGZyb20gYSB0eXBpbmdzIGZpbGUpLlxuICAgKiAtIFRoZSBkZWNsYXJhdGlvbiBvZiB0aGUgb3V0ZXIgdmFyaWFibGUsIHdoaWNoIGlzIGFzc2lnbmVkIHRoZSByZXN1bHQgb2YgdGhlIElJRkUuXG4gICAqIC0gVGhlIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGluc2lkZSB0aGUgSUlGRSwgd2hpY2ggaXMgZXZlbnR1YWxseSByZXR1cm5lZCBhbmQgYXNzaWduZWQgdG8gdGhlXG4gICAqICAgb3V0ZXIgdmFyaWFibGUuXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBkZWNsYXJhdGlvbiBpcyBlaXRoZXIgdGhlIGNsYXNzIGRlY2xhcmF0aW9uIChmcm9tIHRoZSB0eXBpbmdzIGZpbGUpIG9yIHRoZSBvdXRlclxuICAgKiB2YXJpYWJsZSBkZWNsYXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG5vZGUgdGhlIG5vZGUgdGhhdCByZXByZXNlbnRzIHRoZSBjbGFzcyB3aG9zZSBkZWNsYXJhdGlvbiB3ZSBhcmUgZmluZGluZy5cbiAgICogQHJldHVybnMgdGhlIGRlY2xhcmF0aW9uIG9mIHRoZSBjbGFzcyBvciBgdW5kZWZpbmVkYCBpZiBpdCBpcyBub3QgYSBcImNsYXNzXCIuXG4gICAqL1xuICBnZXRDbGFzc0RlY2xhcmF0aW9uKG5vZGU6IHRzLk5vZGUpOiBDbGFzc0RlY2xhcmF0aW9ufHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc3VwZXJEZWNsYXJhdGlvbiA9IHN1cGVyLmdldENsYXNzRGVjbGFyYXRpb24obm9kZSk7XG4gICAgaWYgKHN1cGVyRGVjbGFyYXRpb24pIHJldHVybiBzdXBlckRlY2xhcmF0aW9uO1xuXG4gICAgY29uc3Qgb3V0ZXJDbGFzcyA9IGdldENsYXNzRGVjbGFyYXRpb25Gcm9tSW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpO1xuICAgIGlmIChvdXRlckNsYXNzKSByZXR1cm4gb3V0ZXJDbGFzcztcblxuICAgIC8vIEF0IHRoaXMgcG9pbnQsIGBub2RlYCBjb3VsZCBiZSB0aGUgb3V0ZXIgdmFyaWFibGUgZGVjbGFyYXRpb24gb2YgYW4gRVM1IGNsYXNzLlxuICAgIC8vIElmIHNvLCBlbnN1cmUgdGhhdCBpdCBoYXMgYSBgbmFtZWAgaWRlbnRpZmllciBhbmQgdGhlIGNvcnJlY3Qgc3RydWN0dXJlLlxuICAgIGlmICghaXNOYW1lZFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkgfHxcbiAgICAgICAgIXRoaXMuZ2V0SW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uRnJvbUNsYXNzRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2UgYW4gaWRlbnRpZmllciB0byBpdHMgZGVjbGFyYXRpb24sIGlmIHBvc3NpYmxlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBhdHRlbXB0cyB0byByZXNvbHZlIHRoZSBkZWNsYXJhdGlvbiBvZiB0aGUgZ2l2ZW4gaWRlbnRpZmllciwgdHJhY2luZyBiYWNrIHRocm91Z2hcbiAgICogaW1wb3J0cyBhbmQgcmUtZXhwb3J0cyB1bnRpbCB0aGUgb3JpZ2luYWwgZGVjbGFyYXRpb24gc3RhdGVtZW50IGlzIGZvdW5kLiBBIGBEZWNsYXJhdGlvbmBcbiAgICogb2JqZWN0IGlzIHJldHVybmVkIGlmIHRoZSBvcmlnaW5hbCBkZWNsYXJhdGlvbiBpcyBmb3VuZCwgb3IgYG51bGxgIGlzIHJldHVybmVkIG90aGVyd2lzZS5cbiAgICpcbiAgICogSW4gRVM1LCB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBjbGFzcyBpcyBhIGZ1bmN0aW9uIGV4cHJlc3Npb24gdGhhdCBpcyBoaWRkZW4gaW5zaWRlIGFuIElJRkUuXG4gICAqIElmIHdlIGFyZSBsb29raW5nIGZvciB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIGlkZW50aWZpZXIgb2YgdGhlIGlubmVyIGZ1bmN0aW9uIGV4cHJlc3Npb24sIHdlXG4gICAqIHdpbGwgZ2V0IGhvbGQgb2YgdGhlIG91dGVyIFwiY2xhc3NcIiB2YXJpYWJsZSBkZWNsYXJhdGlvbiBhbmQgcmV0dXJuIGl0cyBpZGVudGlmaWVyIGluc3RlYWQuIFNlZVxuICAgKiBgZ2V0Q2xhc3NEZWNsYXJhdGlvbkZyb21Jbm5lckZ1bmN0aW9uRGVjbGFyYXRpb24oKWAgZm9yIG1vcmUgaW5mby5cbiAgICpcbiAgICogQHBhcmFtIGlkIGEgVHlwZVNjcmlwdCBgdHMuSWRlbnRpZmllcmAgdG8gdHJhY2UgYmFjayB0byBhIGRlY2xhcmF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBtZXRhZGF0YSBhYm91dCB0aGUgYERlY2xhcmF0aW9uYCBpZiB0aGUgb3JpZ2luYWwgZGVjbGFyYXRpb24gaXMgZm91bmQsIG9yIGBudWxsYFxuICAgKiBvdGhlcndpc2UuXG4gICAqL1xuICBnZXREZWNsYXJhdGlvbk9mSWRlbnRpZmllcihpZDogdHMuSWRlbnRpZmllcik6IERlY2xhcmF0aW9ufG51bGwge1xuICAgIC8vIEdldCB0aGUgaWRlbnRpZmllciBmb3IgdGhlIG91dGVyIGNsYXNzIG5vZGUgKGlmIGFueSkuXG4gICAgY29uc3Qgb3V0ZXJDbGFzc05vZGUgPSBnZXRDbGFzc0RlY2xhcmF0aW9uRnJvbUlubmVyRnVuY3Rpb25EZWNsYXJhdGlvbihpZC5wYXJlbnQpO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gc3VwZXIuZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIob3V0ZXJDbGFzc05vZGUgPyBvdXRlckNsYXNzTm9kZS5uYW1lIDogaWQpO1xuXG4gICAgaWYgKCFkZWNsYXJhdGlvbiB8fCAhdHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uLm5vZGUpIHx8XG4gICAgICAgIGRlY2xhcmF0aW9uLm5vZGUuaW5pdGlhbGl6ZXIgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAvLyBWYXJpYWJsZURlY2xhcmF0aW9uID0+IFZhcmlhYmxlRGVjbGFyYXRpb25MaXN0ID0+IFZhcmlhYmxlU3RhdGVtZW50ID0+IElJRkUgQmxvY2tcbiAgICAgICAgIXRzLmlzQmxvY2soZGVjbGFyYXRpb24ubm9kZS5wYXJlbnQucGFyZW50LnBhcmVudCkpIHtcbiAgICAgIHJldHVybiBkZWNsYXJhdGlvbjtcbiAgICB9XG5cbiAgICAvLyBXZSBtaWdodCBoYXZlIGFuIGFsaWFzIHRvIGFub3RoZXIgdmFyaWFibGUgZGVjbGFyYXRpb24uXG4gICAgLy8gU2VhcmNoIHRoZSBjb250YWluaW5nIGlpZmUgYm9keSBmb3IgaXQuXG4gICAgY29uc3QgYmxvY2sgPSBkZWNsYXJhdGlvbi5ub2RlLnBhcmVudC5wYXJlbnQucGFyZW50O1xuICAgIGNvbnN0IGFsaWFzU3ltYm9sID0gdGhpcy5jaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oZGVjbGFyYXRpb24ubm9kZS5uYW1lKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrLnN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IGJsb2NrLnN0YXRlbWVudHNbaV07XG4gICAgICAvLyBMb29raW5nIGZvciBzdGF0ZW1lbnQgdGhhdCBsb29rcyBsaWtlOiBgQWxpYXNlZFZhcmlhYmxlID0gT3JpZ2luYWxWYXJpYWJsZTtgXG4gICAgICBpZiAoaXNBc3NpZ25tZW50U3RhdGVtZW50KHN0YXRlbWVudCkgJiYgdHMuaXNJZGVudGlmaWVyKHN0YXRlbWVudC5leHByZXNzaW9uLmxlZnQpICYmXG4gICAgICAgICAgdHMuaXNJZGVudGlmaWVyKHN0YXRlbWVudC5leHByZXNzaW9uLnJpZ2h0KSAmJlxuICAgICAgICAgIHRoaXMuY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKHN0YXRlbWVudC5leHByZXNzaW9uLmxlZnQpID09PSBhbGlhc1N5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREZWNsYXJhdGlvbk9mSWRlbnRpZmllcihzdGF0ZW1lbnQuZXhwcmVzc2lvbi5yaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY2xhcmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIGEgZnVuY3Rpb24gZGVjbGFyYXRpb24gdG8gZmluZCB0aGUgcmVsZXZhbnQgbWV0YWRhdGEgYWJvdXQgaXQuXG4gICAqXG4gICAqIEluIEVTTTUgd2UgbmVlZCB0byBkbyBzcGVjaWFsIHdvcmsgd2l0aCBvcHRpb25hbCBhcmd1bWVudHMgdG8gdGhlIGZ1bmN0aW9uLCBzaW5jZSB0aGV5IGdldFxuICAgKiB0aGVpciBvd24gaW5pdGlhbGl6ZXIgc3RhdGVtZW50IHRoYXQgbmVlZHMgdG8gYmUgcGFyc2VkIGFuZCB0aGVuIG5vdCBpbmNsdWRlZCBpbiB0aGUgXCJib2R5XCJcbiAgICogc3RhdGVtZW50cyBvZiB0aGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBub2RlIHRoZSBmdW5jdGlvbiBkZWNsYXJhdGlvbiB0byBwYXJzZS5cbiAgICogQHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5vZGUsIHN0YXRlbWVudHMgYW5kIHBhcmFtZXRlcnMgb2YgdGhlIGZ1bmN0aW9uLlxuICAgKi9cbiAgZ2V0RGVmaW5pdGlvbk9mRnVuY3Rpb24obm9kZTogdHMuTm9kZSk6IEZ1bmN0aW9uRGVmaW5pdGlvbnxudWxsIHtcbiAgICBpZiAoIXRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSAmJiAhdHMuaXNNZXRob2REZWNsYXJhdGlvbihub2RlKSAmJlxuICAgICAgICAhdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24obm9kZSkgJiYgIXRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdHNIZWxwZXJGbiA9IGdldFRzSGVscGVyRm4obm9kZSk7XG4gICAgaWYgKHRzSGVscGVyRm4gIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGUsXG4gICAgICAgIGJvZHk6IG51bGwsXG4gICAgICAgIGhlbHBlcjogdHNIZWxwZXJGbixcbiAgICAgICAgcGFyYW1ldGVyczogW10sXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBub2RlIHdhcyBub3QgaWRlbnRpZmllZCB0byBiZSBhIFR5cGVTY3JpcHQgaGVscGVyLCBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGF0IHRoaXNcbiAgICAvLyBwb2ludCBjYW5ub3QgYmUgcmVzb2x2ZWQgYXMgYSBmdW5jdGlvbi5cbiAgICBpZiAodHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbWV0ZXJzID1cbiAgICAgICAgbm9kZS5wYXJhbWV0ZXJzLm1hcChwID0+ICh7bmFtZTogZ2V0TmFtZVRleHQocC5uYW1lKSwgbm9kZTogcCwgaW5pdGlhbGl6ZXI6IG51bGx9KSk7XG4gICAgbGV0IGxvb2tpbmdGb3JQYXJhbUluaXRpYWxpemVycyA9IHRydWU7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gbm9kZS5ib2R5ICYmIG5vZGUuYm9keS5zdGF0ZW1lbnRzLmZpbHRlcihzID0+IHtcbiAgICAgIGxvb2tpbmdGb3JQYXJhbUluaXRpYWxpemVycyA9XG4gICAgICAgICAgbG9va2luZ0ZvclBhcmFtSW5pdGlhbGl6ZXJzICYmIHJlZmxlY3RQYXJhbUluaXRpYWxpemVyKHMsIHBhcmFtZXRlcnMpO1xuICAgICAgLy8gSWYgd2UgYXJlIG5vIGxvbmdlciBsb29raW5nIGZvciBwYXJhbWV0ZXIgaW5pdGlhbGl6ZXJzIHRoZW4gd2UgaW5jbHVkZSB0aGlzIHN0YXRlbWVudFxuICAgICAgcmV0dXJuICFsb29raW5nRm9yUGFyYW1Jbml0aWFsaXplcnM7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge25vZGUsIGJvZHk6IHN0YXRlbWVudHMgfHwgbnVsbCwgaGVscGVyOiBudWxsLCBwYXJhbWV0ZXJzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGFtaW5lIGEgZGVjbGFyYXRpb24gd2hpY2ggc2hvdWxkIGJlIG9mIGEgY2xhc3MsIGFuZCByZXR1cm4gbWV0YWRhdGEgYWJvdXQgdGhlIG1lbWJlcnMgb2YgdGhlXG4gICAqIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gZGVjbGFyYXRpb24gYSBUeXBlU2NyaXB0IGB0cy5EZWNsYXJhdGlvbmAgbm9kZSByZXByZXNlbnRpbmcgdGhlIGNsYXNzIG92ZXIgd2hpY2ggdG9cbiAgICogcmVmbGVjdC5cbiAgICpcbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2YgYENsYXNzTWVtYmVyYCBtZXRhZGF0YSByZXByZXNlbnRpbmcgdGhlIG1lbWJlcnMgb2YgdGhlIGNsYXNzLlxuICAgKlxuICAgKiBAdGhyb3dzIGlmIGBkZWNsYXJhdGlvbmAgZG9lcyBub3QgcmVzb2x2ZSB0byBhIGNsYXNzIGRlY2xhcmF0aW9uLlxuICAgKi9cbiAgZ2V0TWVtYmVyc09mQ2xhc3MoY2xheno6IENsYXNzRGVjbGFyYXRpb24pOiBDbGFzc01lbWJlcltdIHtcbiAgICAvLyBEbyBub3QgZm9sbG93IEVTNSdzIHJlc29sdXRpb24gbG9naWMgd2hlbiB0aGUgbm9kZSByZXNpZGVzIGluIGEgLmQudHMgZmlsZS5cbiAgICBpZiAoaXNGcm9tRHRzRmlsZShjbGF6eikpIHtcbiAgICAgIHJldHVybiBzdXBlci5nZXRNZW1iZXJzT2ZDbGFzcyhjbGF6eik7XG4gICAgfVxuXG4gICAgLy8gVGhlIG5lY2Vzc2FyeSBpbmZvIGlzIG9uIHRoZSBpbm5lciBmdW5jdGlvbiBkZWNsYXJhdGlvbiAoaW5zaWRlIHRoZSBFUzUgY2xhc3MgSUlGRSkuXG4gICAgY29uc3QgaW5uZXJGdW5jdGlvblN5bWJvbCA9IHRoaXMuZ2V0SW5uZXJGdW5jdGlvblN5bWJvbEZyb21DbGFzc0RlY2xhcmF0aW9uKGNsYXp6KTtcbiAgICBpZiAoIWlubmVyRnVuY3Rpb25TeW1ib2wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQXR0ZW1wdGVkIHRvIGdldCBtZW1iZXJzIG9mIGEgbm9uLWNsYXNzOiBcIiR7KGNsYXp6IGFzIENsYXNzRGVjbGFyYXRpb24pLmdldFRleHQoKX1cImApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldE1lbWJlcnNPZlN5bWJvbChpbm5lckZ1bmN0aW9uU3ltYm9sKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBkZWNvcmF0b3JzIG9mIHRoZSBnaXZlbiBjbGFzcyBzeW1ib2wuICovXG4gIGdldERlY29yYXRvcnNPZlN5bWJvbChzeW1ib2w6IENsYXNzU3ltYm9sKTogRGVjb3JhdG9yW118bnVsbCB7XG4gICAgLy8gVGhlIG5lY2Vzc2FyeSBpbmZvIGlzIG9uIHRoZSBpbm5lciBmdW5jdGlvbiBkZWNsYXJhdGlvbiAoaW5zaWRlIHRoZSBFUzUgY2xhc3MgSUlGRSkuXG4gICAgY29uc3QgaW5uZXJGdW5jdGlvblN5bWJvbCA9XG4gICAgICAgIHRoaXMuZ2V0SW5uZXJGdW5jdGlvblN5bWJvbEZyb21DbGFzc0RlY2xhcmF0aW9uKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKTtcbiAgICBpZiAoIWlubmVyRnVuY3Rpb25TeW1ib2wpIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHN1cGVyLmdldERlY29yYXRvcnNPZlN5bWJvbChpbm5lckZ1bmN0aW9uU3ltYm9sKTtcbiAgfVxuXG5cbiAgLy8vLy8vLy8vLy8vLyBQcm90ZWN0ZWQgSGVscGVycyAvLy8vLy8vLy8vLy8vXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaW5uZXIgZnVuY3Rpb24gZGVjbGFyYXRpb24gb2YgYW4gRVM1LXN0eWxlIGNsYXNzLlxuICAgKlxuICAgKiBJbiBFUzUsIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIGNsYXNzIGlzIGEgZnVuY3Rpb24gZXhwcmVzc2lvbiB0aGF0IGlzIGhpZGRlbiBpbnNpZGUgYW4gSUlGRVxuICAgKiBhbmQgcmV0dXJuZWQgdG8gYmUgYXNzaWduZWQgdG8gYSB2YXJpYWJsZSBvdXRzaWRlIHRoZSBJSUZFLCB3aGljaCBpcyB3aGF0IHRoZSByZXN0IG9mIHRoZVxuICAgKiBwcm9ncmFtIGludGVyYWN0cyB3aXRoLlxuICAgKlxuICAgKiBHaXZlbiB0aGUgb3V0ZXIgdmFyaWFibGUgZGVjbGFyYXRpb24sIHdlIHdhbnQgdG8gZ2V0IHRvIHRoZSBpbm5lciBmdW5jdGlvbiBkZWNsYXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG5vZGUgYSBub2RlIHRoYXQgY291bGQgYmUgdGhlIHZhcmlhYmxlIGV4cHJlc3Npb24gb3V0c2lkZSBhbiBFUzUgY2xhc3MgSUlGRS5cbiAgICogQHBhcmFtIGNoZWNrZXIgdGhlIFRTIHByb2dyYW0gVHlwZUNoZWNrZXJcbiAgICogQHJldHVybnMgdGhlIGlubmVyIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIG9yIGB1bmRlZmluZWRgIGlmIGl0IGlzIG5vdCBhIFwiY2xhc3NcIi5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRJbm5lckZ1bmN0aW9uRGVjbGFyYXRpb25Gcm9tQ2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5Ob2RlKTogdHMuRnVuY3Rpb25EZWNsYXJhdGlvblxuICAgICAgfHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAvLyBFeHRyYWN0IHRoZSBJSUZFIGJvZHkgKGlmIGFueSkuXG4gICAgY29uc3QgaWlmZUJvZHkgPSBnZXRJaWZlQm9keShub2RlKTtcbiAgICBpZiAoIWlpZmVCb2R5KSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgLy8gRXh0cmFjdCB0aGUgZnVuY3Rpb24gZGVjbGFyYXRpb24gZnJvbSBpbnNpZGUgdGhlIElJRkUuXG4gICAgY29uc3QgZnVuY3Rpb25EZWNsYXJhdGlvbiA9IGlpZmVCb2R5LnN0YXRlbWVudHMuZmluZCh0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24pO1xuICAgIGlmICghZnVuY3Rpb25EZWNsYXJhdGlvbikgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIC8vIEV4dHJhY3QgdGhlIHJldHVybiBpZGVudGlmaWVyIG9mIHRoZSBJSUZFLlxuICAgIGNvbnN0IHJldHVybklkZW50aWZpZXIgPSBnZXRSZXR1cm5JZGVudGlmaWVyKGlpZmVCb2R5KTtcbiAgICBjb25zdCByZXR1cm5JZGVudGlmaWVyU3ltYm9sID1cbiAgICAgICAgcmV0dXJuSWRlbnRpZmllciAmJiB0aGlzLmNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihyZXR1cm5JZGVudGlmaWVyKTtcbiAgICBpZiAoIXJldHVybklkZW50aWZpZXJTeW1ib2wpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAvLyBWZXJpZnkgdGhhdCB0aGUgaW5uZXIgZnVuY3Rpb24gaXMgcmV0dXJuZWQuXG4gICAgaWYgKHJldHVybklkZW50aWZpZXJTeW1ib2wudmFsdWVEZWNsYXJhdGlvbiAhPT0gZnVuY3Rpb25EZWNsYXJhdGlvbikgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBmdW5jdGlvbkRlY2xhcmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWRlbnRpZmllciBzeW1ib2wgb2YgdGhlIGlubmVyIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIG9mIGFuIEVTNS1zdHlsZSBjbGFzcy5cbiAgICpcbiAgICogSW4gRVM1LCB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBjbGFzcyBpcyBhIGZ1bmN0aW9uIGV4cHJlc3Npb24gdGhhdCBpcyBoaWRkZW4gaW5zaWRlIGFuIElJRkVcbiAgICogYW5kIHJldHVybmVkIHRvIGJlIGFzc2lnbmVkIHRvIGEgdmFyaWFibGUgb3V0c2lkZSB0aGUgSUlGRSwgd2hpY2ggaXMgd2hhdCB0aGUgcmVzdCBvZiB0aGVcbiAgICogcHJvZ3JhbSBpbnRlcmFjdHMgd2l0aC5cbiAgICpcbiAgICogR2l2ZW4gdGhlIG91dGVyIHZhcmlhYmxlIGRlY2xhcmF0aW9uLCB3ZSB3YW50IHRvIGdldCB0byB0aGUgaWRlbnRpZmllciBzeW1ib2wgb2YgdGhlIGlubmVyXG4gICAqIGZ1bmN0aW9uIGRlY2xhcmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhenogYSBub2RlIHRoYXQgY291bGQgYmUgdGhlIHZhcmlhYmxlIGV4cHJlc3Npb24gb3V0c2lkZSBhbiBFUzUgY2xhc3MgSUlGRS5cbiAgICogQHBhcmFtIGNoZWNrZXIgdGhlIFRTIHByb2dyYW0gVHlwZUNoZWNrZXJcbiAgICogQHJldHVybnMgdGhlIGlubmVyIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGlkZW50aWZpZXIgc3ltYm9sIG9yIGB1bmRlZmluZWRgIGlmIGl0IGlzIG5vdCBhIFwiY2xhc3NcIlxuICAgKiBvciBoYXMgbm8gaWRlbnRpZmllci5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRJbm5lckZ1bmN0aW9uU3ltYm9sRnJvbUNsYXNzRGVjbGFyYXRpb24oY2xheno6IENsYXNzRGVjbGFyYXRpb24pOiBDbGFzc1N5bWJvbFxuICAgICAgfHVuZGVmaW5lZCB7XG4gICAgY29uc3QgaW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uID0gdGhpcy5nZXRJbm5lckZ1bmN0aW9uRGVjbGFyYXRpb25Gcm9tQ2xhc3NEZWNsYXJhdGlvbihjbGF6eik7XG4gICAgaWYgKCFpbm5lckZ1bmN0aW9uRGVjbGFyYXRpb24gfHwgIWhhc05hbWVJZGVudGlmaWVyKGlubmVyRnVuY3Rpb25EZWNsYXJhdGlvbikpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gdGhpcy5jaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oaW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uLm5hbWUpIGFzIENsYXNzU3ltYm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIGRlY2xhcmF0aW9ucyBvZiB0aGUgY29uc3RydWN0b3IgcGFyYW1ldGVycyBvZiBhIGNsYXNzIGlkZW50aWZpZWQgYnkgaXRzIHN5bWJvbC5cbiAgICpcbiAgICogSW4gRVNNNSwgdGhlcmUgaXMgbm8gXCJjbGFzc1wiIHNvIHRoZSBjb25zdHJ1Y3RvciB0aGF0IHdlIHdhbnQgaXMgYWN0dWFsbHkgdGhlIGlubmVyIGZ1bmN0aW9uXG4gICAqIGRlY2xhcmF0aW9uIGluc2lkZSB0aGUgSUlGRSwgd2hvc2UgcmV0dXJuIHZhbHVlIGlzIGFzc2lnbmVkIHRvIHRoZSBvdXRlciB2YXJpYWJsZSBkZWNsYXJhdGlvblxuICAgKiAodGhhdCByZXByZXNlbnRzIHRoZSBjbGFzcyB0byB0aGUgcmVzdCBvZiB0aGUgcHJvZ3JhbSkuXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc1N5bWJvbCB0aGUgc3ltYm9sIG9mIHRoZSBjbGFzcyAoaS5lLiB0aGUgb3V0ZXIgdmFyaWFibGUgZGVjbGFyYXRpb24pIHdob3NlXG4gICAqIHBhcmFtZXRlcnMgd2Ugd2FudCB0byBmaW5kLlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgdHMuUGFyYW1ldGVyRGVjbGFyYXRpb25gIG9iamVjdHMgcmVwcmVzZW50aW5nIGVhY2ggb2YgdGhlIHBhcmFtZXRlcnMgaW5cbiAgICogdGhlIGNsYXNzJ3MgY29uc3RydWN0b3Igb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyRGVjbGFyYXRpb25zKGNsYXNzU3ltYm9sOiBDbGFzc1N5bWJvbCk6XG4gICAgICB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbltdfG51bGwge1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yID1cbiAgICAgICAgdGhpcy5nZXRJbm5lckZ1bmN0aW9uRGVjbGFyYXRpb25Gcm9tQ2xhc3NEZWNsYXJhdGlvbihjbGFzc1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uKTtcbiAgICBpZiAoIWNvbnN0cnVjdG9yKSByZXR1cm4gbnVsbDtcblxuICAgIGlmIChjb25zdHJ1Y3Rvci5wYXJhbWV0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGNvbnN0cnVjdG9yLnBhcmFtZXRlcnMpO1xuICAgIH1cblxuICAgIGlmIChpc1N5bnRoZXNpemVkQ29uc3RydWN0b3IoY29uc3RydWN0b3IpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwYXJhbWV0ZXIgZGVjb3JhdG9ycyBvZiBhIGNsYXNzIGNvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NTeW1ib2wgdGhlIHN5bWJvbCBvZiB0aGUgY2xhc3MgKGkuZS4gdGhlIG91dGVyIHZhcmlhYmxlIGRlY2xhcmF0aW9uKSB3aG9zZVxuICAgKiBwYXJhbWV0ZXIgaW5mbyB3ZSB3YW50IHRvIGdldC5cbiAgICogQHBhcmFtIHBhcmFtZXRlck5vZGVzIHRoZSBhcnJheSBvZiBUeXBlU2NyaXB0IHBhcmFtZXRlciBub2RlcyBmb3IgdGhpcyBjbGFzcydzIGNvbnN0cnVjdG9yLlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgaW5mbyBvYmplY3RzLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldENvbnN0cnVjdG9yUGFyYW1JbmZvKFxuICAgICAgY2xhc3NTeW1ib2w6IENsYXNzU3ltYm9sLCBwYXJhbWV0ZXJOb2RlczogdHMuUGFyYW1ldGVyRGVjbGFyYXRpb25bXSk6IEN0b3JQYXJhbWV0ZXJbXSB7XG4gICAgLy8gVGhlIG5lY2Vzc2FyeSBpbmZvIGlzIG9uIHRoZSBpbm5lciBmdW5jdGlvbiBkZWNsYXJhdGlvbiAoaW5zaWRlIHRoZSBFUzUgY2xhc3MgSUlGRSkuXG4gICAgY29uc3QgaW5uZXJGdW5jdGlvblN5bWJvbCA9XG4gICAgICAgIHRoaXMuZ2V0SW5uZXJGdW5jdGlvblN5bWJvbEZyb21DbGFzc0RlY2xhcmF0aW9uKGNsYXNzU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pO1xuICAgIGlmICghaW5uZXJGdW5jdGlvblN5bWJvbCkgcmV0dXJuIFtdO1xuXG4gICAgcmV0dXJuIHN1cGVyLmdldENvbnN0cnVjdG9yUGFyYW1JbmZvKGlubmVyRnVuY3Rpb25TeW1ib2wsIHBhcmFtZXRlck5vZGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHBhcmFtZXRlciB0eXBlIGFuZCBkZWNvcmF0b3JzIGZvciB0aGUgY29uc3RydWN0b3Igb2YgYSBjbGFzcyxcbiAgICogd2hlcmUgdGhlIGluZm9ybWF0aW9uIGlzIHN0b3JlZCBvbiBhIHN0YXRpYyBtZXRob2Qgb2YgdGhlIGNsYXNzLlxuICAgKlxuICAgKiBJbiB0aGlzIGNhc2UgdGhlIGRlY29yYXRvcnMgYXJlIHN0b3JlZCBpbiB0aGUgYm9keSBvZiBhIG1ldGhvZFxuICAgKiAoYGN0b3JQYXJhdGVtZXJzYCkgYXR0YWNoZWQgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdW5saWtlIEVTTTIwMTUgdGhpcyBpcyBhIGZ1bmN0aW9uIGV4cHJlc3Npb24gcmF0aGVyIHRoYW4gYW4gYXJyb3dcbiAgICogZnVuY3Rpb246XG4gICAqXG4gICAqIGBgYFxuICAgKiBTb21lRGlyZWN0aXZlLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24oKSB7IHJldHVybiBbXG4gICAqICAgeyB0eXBlOiBWaWV3Q29udGFpbmVyUmVmLCB9LFxuICAgKiAgIHsgdHlwZTogVGVtcGxhdGVSZWYsIH0sXG4gICAqICAgeyB0eXBlOiBJdGVyYWJsZURpZmZlcnMsIH0sXG4gICAqICAgeyB0eXBlOiB1bmRlZmluZWQsIGRlY29yYXRvcnM6IFt7IHR5cGU6IEluamVjdCwgYXJnczogW0lOSkVDVEVEX1RPS0VOLF0gfSxdIH0sXG4gICAqIF07IH07XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1EZWNvcmF0b3JzUHJvcGVydHkgdGhlIHByb3BlcnR5IHRoYXQgaG9sZHMgdGhlIHBhcmFtZXRlciBpbmZvIHdlIHdhbnQgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIHR5cGUgYW5kIGRlY29yYXRvcnMgZm9yIGVhY2ggcGFyYW1ldGVyLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFBhcmFtSW5mb0Zyb21TdGF0aWNQcm9wZXJ0eShwYXJhbURlY29yYXRvcnNQcm9wZXJ0eTogdHMuU3ltYm9sKTogUGFyYW1JbmZvW118bnVsbCB7XG4gICAgY29uc3QgcGFyYW1EZWNvcmF0b3JzID0gZ2V0UHJvcGVydHlWYWx1ZUZyb21TeW1ib2wocGFyYW1EZWNvcmF0b3JzUHJvcGVydHkpO1xuICAgIC8vIFRoZSBkZWNvcmF0b3JzIGFycmF5IG1heSBiZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24uIElmIHNvIHVud3JhcCBpdC5cbiAgICBjb25zdCByZXR1cm5TdGF0ZW1lbnQgPSBnZXRSZXR1cm5TdGF0ZW1lbnQocGFyYW1EZWNvcmF0b3JzKTtcbiAgICBjb25zdCBleHByZXNzaW9uID0gcmV0dXJuU3RhdGVtZW50ID8gcmV0dXJuU3RhdGVtZW50LmV4cHJlc3Npb24gOiBwYXJhbURlY29yYXRvcnM7XG4gICAgaWYgKGV4cHJlc3Npb24gJiYgdHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XG4gICAgICBjb25zdCBlbGVtZW50cyA9IGV4cHJlc3Npb24uZWxlbWVudHM7XG4gICAgICByZXR1cm4gZWxlbWVudHMubWFwKHJlZmxlY3RBcnJheUVsZW1lbnQpLm1hcChwYXJhbUluZm8gPT4ge1xuICAgICAgICBjb25zdCB0eXBlRXhwcmVzc2lvbiA9IHBhcmFtSW5mbyAmJiBwYXJhbUluZm8uaGFzKCd0eXBlJykgPyBwYXJhbUluZm8uZ2V0KCd0eXBlJykgISA6IG51bGw7XG4gICAgICAgIGNvbnN0IGRlY29yYXRvckluZm8gPVxuICAgICAgICAgICAgcGFyYW1JbmZvICYmIHBhcmFtSW5mby5oYXMoJ2RlY29yYXRvcnMnKSA/IHBhcmFtSW5mby5nZXQoJ2RlY29yYXRvcnMnKSAhIDogbnVsbDtcbiAgICAgICAgY29uc3QgZGVjb3JhdG9ycyA9IGRlY29yYXRvckluZm8gJiYgdGhpcy5yZWZsZWN0RGVjb3JhdG9ycyhkZWNvcmF0b3JJbmZvKTtcbiAgICAgICAgcmV0dXJuIHt0eXBlRXhwcmVzc2lvbiwgZGVjb3JhdG9yc307XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKFxuICAgICAgICAgICdJbnZhbGlkIGNvbnN0cnVjdG9yIHBhcmFtZXRlciBkZWNvcmF0b3IgaW4gJyArIHBhcmFtRGVjb3JhdG9ycy5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUgK1xuICAgICAgICAgICAgICAnOlxcbicsXG4gICAgICAgICAgcGFyYW1EZWNvcmF0b3JzLmdldFRleHQoKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZmxlY3Qgb3ZlciBhIHN5bWJvbCBhbmQgZXh0cmFjdCB0aGUgbWVtYmVyIGluZm9ybWF0aW9uLCBjb21iaW5pbmcgaXQgd2l0aCB0aGVcbiAgICogcHJvdmlkZWQgZGVjb3JhdG9yIGluZm9ybWF0aW9uLCBhbmQgd2hldGhlciBpdCBpcyBhIHN0YXRpYyBtZW1iZXIuXG4gICAqXG4gICAqIElmIGEgY2xhc3MgbWVtYmVyIHVzZXMgYWNjZXNzb3JzIChlLmcgZ2V0dGVycyBhbmQvb3Igc2V0dGVycykgdGhlbiBpdCBnZXRzIGRvd25sZXZlbGVkXG4gICAqIGluIEVTNSB0byBhIHNpbmdsZSBgT2JqZWN0LmRlZmluZVByb3BlcnR5KClgIGNhbGwuIEluIHRoYXQgY2FzZSB3ZSBtdXN0IHBhcnNlIHRoaXNcbiAgICogY2FsbCB0byBleHRyYWN0IHRoZSBvbmUgb3IgdHdvIENsYXNzTWVtYmVyIG9iamVjdHMgdGhhdCByZXByZXNlbnQgdGhlIGFjY2Vzc29ycy5cbiAgICpcbiAgICogQHBhcmFtIHN5bWJvbCB0aGUgc3ltYm9sIGZvciB0aGUgbWVtYmVyIHRvIHJlZmxlY3Qgb3Zlci5cbiAgICogQHBhcmFtIGRlY29yYXRvcnMgYW4gYXJyYXkgb2YgZGVjb3JhdG9ycyBhc3NvY2lhdGVkIHdpdGggdGhlIG1lbWJlci5cbiAgICogQHBhcmFtIGlzU3RhdGljIHRydWUgaWYgdGhpcyBtZW1iZXIgaXMgc3RhdGljLCBmYWxzZSBpZiBpdCBpcyBhbiBpbnN0YW5jZSBwcm9wZXJ0eS5cbiAgICogQHJldHVybnMgdGhlIHJlZmxlY3RlZCBtZW1iZXIgaW5mb3JtYXRpb24sIG9yIG51bGwgaWYgdGhlIHN5bWJvbCBpcyBub3QgYSBtZW1iZXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVmbGVjdE1lbWJlcnMoc3ltYm9sOiB0cy5TeW1ib2wsIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JbXSwgaXNTdGF0aWM/OiBib29sZWFuKTpcbiAgICAgIENsYXNzTWVtYmVyW118bnVsbCB7XG4gICAgY29uc3Qgbm9kZSA9IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnMgJiYgc3ltYm9sLmRlY2xhcmF0aW9uc1swXTtcbiAgICBjb25zdCBwcm9wZXJ0eURlZmluaXRpb24gPSBub2RlICYmIGdldFByb3BlcnR5RGVmaW5pdGlvbihub2RlKTtcbiAgICBpZiAocHJvcGVydHlEZWZpbml0aW9uKSB7XG4gICAgICBjb25zdCBtZW1iZXJzOiBDbGFzc01lbWJlcltdID0gW107XG4gICAgICBpZiAocHJvcGVydHlEZWZpbml0aW9uLnNldHRlcikge1xuICAgICAgICBtZW1iZXJzLnB1c2goe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgaW1wbGVtZW50YXRpb246IHByb3BlcnR5RGVmaW5pdGlvbi5zZXR0ZXIsXG4gICAgICAgICAga2luZDogQ2xhc3NNZW1iZXJLaW5kLlNldHRlcixcbiAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgIG5hbWU6IHN5bWJvbC5uYW1lLFxuICAgICAgICAgIG5hbWVOb2RlOiBudWxsLFxuICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgIGlzU3RhdGljOiBpc1N0YXRpYyB8fCBmYWxzZSxcbiAgICAgICAgICBkZWNvcmF0b3JzOiBkZWNvcmF0b3JzIHx8IFtdLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQcmV2ZW50IGF0dGFjaGluZyB0aGUgZGVjb3JhdG9ycyB0byBhIHBvdGVudGlhbCBnZXR0ZXIuIEluIEVTNSwgd2UgY2FuJ3QgdGVsbCB3aGVyZSB0aGVcbiAgICAgICAgLy8gZGVjb3JhdG9ycyB3ZXJlIG9yaWdpbmFsbHkgYXR0YWNoZWQgdG8sIGhvd2V2ZXIgd2Ugb25seSB3YW50IHRvIGF0dGFjaCB0aGVtIHRvIGEgc2luZ2xlXG4gICAgICAgIC8vIGBDbGFzc01lbWJlcmAgYXMgb3RoZXJ3aXNlIG5ndHNjIHdvdWxkIGhhbmRsZSB0aGUgc2FtZSBkZWNvcmF0b3JzIHR3aWNlLlxuICAgICAgICBkZWNvcmF0b3JzID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKHByb3BlcnR5RGVmaW5pdGlvbi5nZXR0ZXIpIHtcbiAgICAgICAgbWVtYmVycy5wdXNoKHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGltcGxlbWVudGF0aW9uOiBwcm9wZXJ0eURlZmluaXRpb24uZ2V0dGVyLFxuICAgICAgICAgIGtpbmQ6IENsYXNzTWVtYmVyS2luZC5HZXR0ZXIsXG4gICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICBuYW1lOiBzeW1ib2wubmFtZSxcbiAgICAgICAgICBuYW1lTm9kZTogbnVsbCxcbiAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICBpc1N0YXRpYzogaXNTdGF0aWMgfHwgZmFsc2UsXG4gICAgICAgICAgZGVjb3JhdG9yczogZGVjb3JhdG9ycyB8fCBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtYmVycztcbiAgICB9XG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3VwZXIucmVmbGVjdE1lbWJlcnMoc3ltYm9sLCBkZWNvcmF0b3JzLCBpc1N0YXRpYyk7XG4gICAgbWVtYmVycyAmJiBtZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcbiAgICAgIGlmIChtZW1iZXIgJiYgbWVtYmVyLmtpbmQgPT09IENsYXNzTWVtYmVyS2luZC5NZXRob2QgJiYgbWVtYmVyLmlzU3RhdGljICYmIG1lbWJlci5ub2RlICYmXG4gICAgICAgICAgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obWVtYmVyLm5vZGUpICYmIG1lbWJlci5ub2RlLnBhcmVudCAmJlxuICAgICAgICAgIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihtZW1iZXIubm9kZS5wYXJlbnQpICYmXG4gICAgICAgICAgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24obWVtYmVyLm5vZGUucGFyZW50LnJpZ2h0KSkge1xuICAgICAgICAvLyBSZWNvbXB1dGUgdGhlIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIG1lbWJlcjpcbiAgICAgICAgLy8gRVM1IHN0YXRpYyBtZXRob2RzIGFyZSB2YXJpYWJsZSBkZWNsYXJhdGlvbnMgc28gdGhlIGRlY2xhcmF0aW9uIGlzIGFjdHVhbGx5IHRoZVxuICAgICAgICAvLyBpbml0aWFsaXplciBvZiB0aGUgdmFyaWFibGUgYXNzaWdubWVudFxuICAgICAgICBtZW1iZXIuaW1wbGVtZW50YXRpb24gPSBtZW1iZXIubm9kZS5wYXJlbnQucmlnaHQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1lbWJlcnM7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBzdGF0ZW1lbnRzIHJlbGF0ZWQgdG8gdGhlIGdpdmVuIGNsYXNzIHRoYXQgbWF5IGNvbnRhaW4gY2FsbHMgdG8gYSBoZWxwZXIuXG4gICAqXG4gICAqIEluIEVTTTUgY29kZSB0aGUgaGVscGVyIGNhbGxzIGFyZSBoaWRkZW4gaW5zaWRlIHRoZSBjbGFzcydzIElJRkUuXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc1N5bWJvbCB0aGUgY2xhc3Mgd2hvc2UgaGVscGVyIGNhbGxzIHdlIGFyZSBpbnRlcmVzdGVkIGluLiBXZSBleHBlY3QgdGhpcyBzeW1ib2xcbiAgICogdG8gcmVmZXJlbmNlIHRoZSBpbm5lciBpZGVudGlmaWVyIGluc2lkZSB0aGUgSUlGRS5cbiAgICogQHJldHVybnMgYW4gYXJyYXkgb2Ygc3RhdGVtZW50cyB0aGF0IG1heSBjb250YWluIGhlbHBlciBjYWxscy5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRTdGF0ZW1lbnRzRm9yQ2xhc3MoY2xhc3NTeW1ib2w6IENsYXNzU3ltYm9sKTogdHMuU3RhdGVtZW50W10ge1xuICAgIGNvbnN0IGNsYXNzRGVjbGFyYXRpb25QYXJlbnQgPSBjbGFzc1N5bWJvbC52YWx1ZURlY2xhcmF0aW9uLnBhcmVudDtcbiAgICByZXR1cm4gdHMuaXNCbG9jayhjbGFzc0RlY2xhcmF0aW9uUGFyZW50KSA/IEFycmF5LmZyb20oY2xhc3NEZWNsYXJhdGlvblBhcmVudC5zdGF0ZW1lbnRzKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeSB0byByZXRyaWV2ZSB0aGUgc3ltYm9sIG9mIGEgc3RhdGljIHByb3BlcnR5IG9uIGEgY2xhc3MuXG4gICAqXG4gICAqIEluIEVTNSwgYSBzdGF0aWMgcHJvcGVydHkgY2FuIGVpdGhlciBiZSBzZXQgb24gdGhlIGlubmVyIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGluc2lkZSB0aGUgY2xhc3MnXG4gICAqIElJRkUsIG9yIGl0IGNhbiBiZSBzZXQgb24gdGhlIG91dGVyIHZhcmlhYmxlIGRlY2xhcmF0aW9uLiBUaGVyZWZvcmUsIHRoZSBFUzUgaG9zdCBjaGVja3MgYm90aFxuICAgKiBwbGFjZXMsIGZpcnN0IGxvb2tpbmcgdXAgdGhlIHByb3BlcnR5IG9uIHRoZSBpbm5lciBzeW1ib2wsIGFuZCBpZiB0aGUgcHJvcGVydHkgaXMgbm90IGZvdW5kIGl0XG4gICAqIHdpbGwgZmFsbCBiYWNrIHRvIGxvb2tpbmcgdXAgdGhlIHByb3BlcnR5IG9uIHRoZSBvdXRlciBzeW1ib2wuXG4gICAqXG4gICAqIEBwYXJhbSBzeW1ib2wgdGhlIGNsYXNzIHdob3NlIHByb3BlcnR5IHdlIGFyZSBpbnRlcmVzdGVkIGluLlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIHRoZSBuYW1lIG9mIHN0YXRpYyBwcm9wZXJ0eS5cbiAgICogQHJldHVybnMgdGhlIHN5bWJvbCBpZiBpdCBpcyBmb3VuZCBvciBgdW5kZWZpbmVkYCBpZiBub3QuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0U3RhdGljUHJvcGVydHkoc3ltYm9sOiBDbGFzc1N5bWJvbCwgcHJvcGVydHlOYW1lOiB0cy5fX1N0cmluZyk6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICAgIC8vIFRoZSBzeW1ib2wgY29ycmVzcG9uZHMgd2l0aCB0aGUgaW5uZXIgZnVuY3Rpb24gZGVjbGFyYXRpb24uIEZpcnN0IGxldHMgc2VlIGlmIHRoZSBzdGF0aWNcbiAgICAvLyBwcm9wZXJ0eSBpcyBzZXQgdGhlcmUuXG4gICAgY29uc3QgcHJvcCA9IHN1cGVyLmdldFN0YXRpY1Byb3BlcnR5KHN5bWJvbCwgcHJvcGVydHlOYW1lKTtcbiAgICBpZiAocHJvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvcDtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIG9idGFpbiB0aGUgb3V0ZXIgdmFyaWFibGUgZGVjbGFyYXRpb24gYW5kIHJlc29sdmUgaXRzIHN5bWJvbCwgaW4gb3JkZXIgdG8gbG9va3VwXG4gICAgLy8gc3RhdGljIHByb3BlcnRpZXMgdGhlcmUuXG4gICAgY29uc3Qgb3V0ZXJDbGFzcyA9IGdldENsYXNzRGVjbGFyYXRpb25Gcm9tSW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKTtcbiAgICBpZiAob3V0ZXJDbGFzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG91dGVyU3ltYm9sID0gdGhpcy5jaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24ob3V0ZXJDbGFzcy5uYW1lKTtcbiAgICBpZiAob3V0ZXJTeW1ib2wgPT09IHVuZGVmaW5lZCB8fCBvdXRlclN5bWJvbC52YWx1ZURlY2xhcmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLmdldFN0YXRpY1Byb3BlcnR5KG91dGVyU3ltYm9sIGFzIENsYXNzU3ltYm9sLCBwcm9wZXJ0eU5hbWUpO1xuICB9XG59XG5cbi8vLy8vLy8vLy8vLy8gSW50ZXJuYWwgSGVscGVycyAvLy8vLy8vLy8vLy8vXG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGV0YWlscyBhYm91dCBwcm9wZXJ0eSBkZWZpbml0aW9ucyB0aGF0IHdlcmUgc2V0IHVzaW5nIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgLlxuICovXG5pbnRlcmZhY2UgUHJvcGVydHlEZWZpbml0aW9uIHtcbiAgc2V0dGVyOiB0cy5GdW5jdGlvbkV4cHJlc3Npb258bnVsbDtcbiAgZ2V0dGVyOiB0cy5GdW5jdGlvbkV4cHJlc3Npb258bnVsbDtcbn1cblxuLyoqXG4gKiBJbiBFUzUsIGdldHRlcnMgYW5kIHNldHRlcnMgaGF2ZSBiZWVuIGRvd25sZXZlbGVkIGludG8gY2FsbCBleHByZXNzaW9ucyBvZlxuICogYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAsIHN1Y2ggYXNcbiAqXG4gKiBgYGBcbiAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDbGF6ei5wcm90b3R5cGUsIFwicHJvcGVydHlcIiwge1xuICogICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAqICAgICAgIHJldHVybiAndmFsdWUnO1xuICogICB9LFxuICogICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICogICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICogICB9LFxuICogICBlbnVtZXJhYmxlOiB0cnVlLFxuICogICBjb25maWd1cmFibGU6IHRydWVcbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpbnNwZWN0cyB0aGUgZ2l2ZW4gbm9kZSB0byBkZXRlcm1pbmUgaWYgaXQgY29ycmVzcG9uZHMgd2l0aCBzdWNoIGEgY2FsbCwgYW5kIGlmIHNvXG4gKiBleHRyYWN0cyB0aGUgYHNldGAgYW5kIGBnZXRgIGZ1bmN0aW9uIGV4cHJlc3Npb25zIGZyb20gdGhlIGRlc2NyaXB0b3Igb2JqZWN0LCBpZiB0aGV5IGV4aXN0LlxuICpcbiAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHRvIG9idGFpbiB0aGUgcHJvcGVydHkgZGVmaW5pdGlvbiBmcm9tLlxuICogQHJldHVybnMgVGhlIHByb3BlcnR5IGRlZmluaXRpb24gaWYgdGhlIG5vZGUgY29ycmVzcG9uZHMgd2l0aCBhY2Nlc3NvciwgbnVsbCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5RGVmaW5pdGlvbihub2RlOiB0cy5Ob2RlKTogUHJvcGVydHlEZWZpbml0aW9ufG51bGwge1xuICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGZuID0gbm9kZS5leHByZXNzaW9uO1xuICBpZiAoIXRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKGZuKSB8fCAhdHMuaXNJZGVudGlmaWVyKGZuLmV4cHJlc3Npb24pIHx8XG4gICAgICBmbi5leHByZXNzaW9uLnRleHQgIT09ICdPYmplY3QnIHx8IGZuLm5hbWUudGV4dCAhPT0gJ2RlZmluZVByb3BlcnR5JylcbiAgICByZXR1cm4gbnVsbDtcblxuICBjb25zdCBkZXNjcmlwdG9yID0gbm9kZS5hcmd1bWVudHNbMl07XG4gIGlmICghZGVzY3JpcHRvciB8fCAhdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihkZXNjcmlwdG9yKSkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIHtcbiAgICBzZXR0ZXI6IHJlYWRQcm9wZXJ0eUZ1bmN0aW9uRXhwcmVzc2lvbihkZXNjcmlwdG9yLCAnc2V0JyksXG4gICAgZ2V0dGVyOiByZWFkUHJvcGVydHlGdW5jdGlvbkV4cHJlc3Npb24oZGVzY3JpcHRvciwgJ2dldCcpLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZWFkUHJvcGVydHlGdW5jdGlvbkV4cHJlc3Npb24ob2JqZWN0OiB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbiwgbmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IHByb3BlcnR5ID0gb2JqZWN0LnByb3BlcnRpZXMuZmluZChcbiAgICAgIChwKTogcCBpcyB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQgPT5cbiAgICAgICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwKSAmJiB0cy5pc0lkZW50aWZpZXIocC5uYW1lKSAmJiBwLm5hbWUudGV4dCA9PT0gbmFtZSk7XG5cbiAgcmV0dXJuIHByb3BlcnR5ICYmIHRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKHByb3BlcnR5LmluaXRpYWxpemVyKSAmJiBwcm9wZXJ0eS5pbml0aWFsaXplciB8fCBudWxsO1xufVxuXG4vKipcbiAqIEdldCB0aGUgYWN0dWFsIChvdXRlcikgZGVjbGFyYXRpb24gb2YgYSBjbGFzcy5cbiAqXG4gKiBJbiBFUzUsIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBhIGNsYXNzIGlzIGEgZnVuY3Rpb24gZXhwcmVzc2lvbiB0aGF0IGlzIGhpZGRlbiBpbnNpZGUgYW4gSUlGRSBhbmRcbiAqIHJldHVybmVkIHRvIGJlIGFzc2lnbmVkIHRvIGEgdmFyaWFibGUgb3V0c2lkZSB0aGUgSUlGRSwgd2hpY2ggaXMgd2hhdCB0aGUgcmVzdCBvZiB0aGUgcHJvZ3JhbVxuICogaW50ZXJhY3RzIHdpdGguXG4gKlxuICogR2l2ZW4gdGhlIGlubmVyIGZ1bmN0aW9uIGRlY2xhcmF0aW9uLCB3ZSB3YW50IHRvIGdldCB0byB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIG91dGVyIHZhcmlhYmxlXG4gKiB0aGF0IHJlcHJlc2VudHMgdGhlIGNsYXNzLlxuICpcbiAqIEBwYXJhbSBub2RlIGEgbm9kZSB0aGF0IGNvdWxkIGJlIHRoZSBmdW5jdGlvbiBleHByZXNzaW9uIGluc2lkZSBhbiBFUzUgY2xhc3MgSUlGRS5cbiAqIEByZXR1cm5zIHRoZSBvdXRlciB2YXJpYWJsZSBkZWNsYXJhdGlvbiBvciBgdW5kZWZpbmVkYCBpZiBpdCBpcyBub3QgYSBcImNsYXNzXCIuXG4gKi9cbmZ1bmN0aW9uIGdldENsYXNzRGVjbGFyYXRpb25Gcm9tSW5uZXJGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGU6IHRzLk5vZGUpOlxuICAgIENsYXNzRGVjbGFyYXRpb248dHMuVmFyaWFibGVEZWNsYXJhdGlvbj58dW5kZWZpbmVkIHtcbiAgaWYgKHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSkge1xuICAgIC8vIEl0IG1pZ2h0IGJlIHRoZSBmdW5jdGlvbiBleHByZXNzaW9uIGluc2lkZSB0aGUgSUlGRS4gV2UgbmVlZCB0byBnbyA1IGxldmVscyB1cC4uLlxuXG4gICAgLy8gMS4gSUlGRSBib2R5LlxuICAgIGxldCBvdXRlck5vZGUgPSBub2RlLnBhcmVudDtcbiAgICBpZiAoIW91dGVyTm9kZSB8fCAhdHMuaXNCbG9jayhvdXRlck5vZGUpKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgLy8gMi4gSUlGRSBmdW5jdGlvbiBleHByZXNzaW9uLlxuICAgIG91dGVyTm9kZSA9IG91dGVyTm9kZS5wYXJlbnQ7XG4gICAgaWYgKCFvdXRlck5vZGUgfHwgIXRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKG91dGVyTm9kZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAvLyAzLiBJSUZFIGNhbGwgZXhwcmVzc2lvbi5cbiAgICBvdXRlck5vZGUgPSBvdXRlck5vZGUucGFyZW50O1xuICAgIGlmICghb3V0ZXJOb2RlIHx8ICF0cy5pc0NhbGxFeHByZXNzaW9uKG91dGVyTm9kZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAvLyA0LiBQYXJlbnRoZXNpcyBhcm91bmQgSUlGRS5cbiAgICBvdXRlck5vZGUgPSBvdXRlck5vZGUucGFyZW50O1xuICAgIGlmICghb3V0ZXJOb2RlIHx8ICF0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG91dGVyTm9kZSkpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAvLyA1LiBPdXRlciB2YXJpYWJsZSBkZWNsYXJhdGlvbi5cbiAgICBvdXRlck5vZGUgPSBvdXRlck5vZGUucGFyZW50O1xuICAgIGlmICghb3V0ZXJOb2RlIHx8ICF0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24ob3V0ZXJOb2RlKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIC8vIEZpbmFsbHksIGVuc3VyZSB0aGF0IHRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBoYXMgYSBgbmFtZWAgaWRlbnRpZmllci5cbiAgICByZXR1cm4gaGFzTmFtZUlkZW50aWZpZXIob3V0ZXJOb2RlKSA/IG91dGVyTm9kZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJaWZlQm9keShkZWNsYXJhdGlvbjogdHMuRGVjbGFyYXRpb24pOiB0cy5CbG9ja3x1bmRlZmluZWQge1xuICBpZiAoIXRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbikgfHwgIWRlY2xhcmF0aW9uLmluaXRpYWxpemVyIHx8XG4gICAgICAhdHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihkZWNsYXJhdGlvbi5pbml0aWFsaXplcikpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IGNhbGwgPSBkZWNsYXJhdGlvbi5pbml0aWFsaXplcjtcbiAgcmV0dXJuIHRzLmlzQ2FsbEV4cHJlc3Npb24oY2FsbC5leHByZXNzaW9uKSAmJlxuICAgICAgICAgIHRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKGNhbGwuZXhwcmVzc2lvbi5leHByZXNzaW9uKSA/XG4gICAgICBjYWxsLmV4cHJlc3Npb24uZXhwcmVzc2lvbi5ib2R5IDpcbiAgICAgIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZ2V0UmV0dXJuSWRlbnRpZmllcihib2R5OiB0cy5CbG9jayk6IHRzLklkZW50aWZpZXJ8dW5kZWZpbmVkIHtcbiAgY29uc3QgcmV0dXJuU3RhdGVtZW50ID0gYm9keS5zdGF0ZW1lbnRzLmZpbmQodHMuaXNSZXR1cm5TdGF0ZW1lbnQpO1xuICByZXR1cm4gcmV0dXJuU3RhdGVtZW50ICYmIHJldHVyblN0YXRlbWVudC5leHByZXNzaW9uICYmXG4gICAgICAgICAgdHMuaXNJZGVudGlmaWVyKHJldHVyblN0YXRlbWVudC5leHByZXNzaW9uKSA/XG4gICAgICByZXR1cm5TdGF0ZW1lbnQuZXhwcmVzc2lvbiA6XG4gICAgICB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGdldFJldHVyblN0YXRlbWVudChkZWNsYXJhdGlvbjogdHMuRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCk6IHRzLlJldHVyblN0YXRlbWVudHx1bmRlZmluZWQge1xuICByZXR1cm4gZGVjbGFyYXRpb24gJiYgdHMuaXNGdW5jdGlvbkV4cHJlc3Npb24oZGVjbGFyYXRpb24pID9cbiAgICAgIGRlY2xhcmF0aW9uLmJvZHkuc3RhdGVtZW50cy5maW5kKHRzLmlzUmV0dXJuU3RhdGVtZW50KSA6XG4gICAgICB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlZmxlY3RBcnJheUVsZW1lbnQoZWxlbWVudDogdHMuRXhwcmVzc2lvbikge1xuICByZXR1cm4gdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihlbGVtZW50KSA/IHJlZmxlY3RPYmplY3RMaXRlcmFsKGVsZW1lbnQpIDogbnVsbDtcbn1cblxuLyoqXG4gKiBJbnNwZWN0cyBhIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIHRvIGRldGVybWluZSBpZiBpdCBjb3JyZXNwb25kcyB3aXRoIGEgVHlwZVNjcmlwdCBoZWxwZXIgZnVuY3Rpb24sXG4gKiByZXR1cm5pbmcgaXRzIGtpbmQgaWYgc28gb3IgbnVsbCBpZiB0aGUgZGVjbGFyYXRpb24gZG9lcyBub3Qgc2VlbSB0byBjb3JyZXNwb25kIHdpdGggc3VjaCBhXG4gKiBoZWxwZXIuXG4gKi9cbmZ1bmN0aW9uIGdldFRzSGVscGVyRm4obm9kZTogdHMuTmFtZWREZWNsYXJhdGlvbik6IFRzSGVscGVyRm58bnVsbCB7XG4gIGNvbnN0IG5hbWUgPSBub2RlLm5hbWUgIT09IHVuZGVmaW5lZCAmJiB0cy5pc0lkZW50aWZpZXIobm9kZS5uYW1lKSAmJiBub2RlLm5hbWUudGV4dDtcblxuICBpZiAobmFtZSA9PT0gJ19fc3ByZWFkJykge1xuICAgIHJldHVybiBUc0hlbHBlckZuLlNwcmVhZDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29uc3RydWN0b3IgZnVuY3Rpb24gbWF5IGhhdmUgYmVlbiBcInN5bnRoZXNpemVkXCIgYnkgVHlwZVNjcmlwdCBkdXJpbmcgSmF2YVNjcmlwdCBlbWl0LFxuICogaW4gdGhlIGNhc2Ugbm8gdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGV4aXN0cyBhbmQgZS5nLiBwcm9wZXJ0eSBpbml0aWFsaXplcnMgYXJlIHVzZWQuXG4gKiBUaG9zZSBpbml0aWFsaXplcnMgbmVlZCB0byBiZSBlbWl0dGVkIGludG8gYSBjb25zdHJ1Y3RvciBpbiBKYXZhU2NyaXB0LCBzbyB0aGUgVHlwZVNjcmlwdFxuICogY29tcGlsZXIgZ2VuZXJhdGVzIGEgc3ludGhldGljIGNvbnN0cnVjdG9yLlxuICpcbiAqIFdlIG5lZWQgdG8gaWRlbnRpZnkgc3VjaCBjb25zdHJ1Y3RvcnMgYXMgbmdjYyBuZWVkcyB0byBiZSBhYmxlIHRvIHRlbGwgaWYgYSBjbGFzcyBkaWRcbiAqIG9yaWdpbmFsbHkgaGF2ZSBhIGNvbnN0cnVjdG9yIGluIHRoZSBUeXBlU2NyaXB0IHNvdXJjZS4gRm9yIEVTNSwgd2UgY2FuIG5vdCB0ZWxsIGFuXG4gKiBlbXB0eSBjb25zdHJ1Y3RvciBhcGFydCBmcm9tIGEgc3ludGhlc2l6ZWQgY29uc3RydWN0b3IsIGJ1dCBmb3J0dW5hdGVseSB0aGF0IGRvZXMgbm90XG4gKiBtYXR0ZXIgZm9yIHRoZSBjb2RlIGdlbmVyYXRlZCBieSBuZ3RzYy5cbiAqXG4gKiBXaGVuIGEgY2xhc3MgaGFzIGEgc3VwZXJjbGFzcyBob3dldmVyLCBhIHN5bnRoZXNpemVkIGNvbnN0cnVjdG9yIG11c3Qgbm90IGJlIGNvbnNpZGVyZWRcbiAqIGFzIGEgdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGFzIHRoYXQgcHJldmVudHMgYSBiYXNlIGZhY3RvcnkgY2FsbCBmcm9tIGJlaW5nIGNyZWF0ZWQgYnlcbiAqIG5ndHNjLCByZXN1bHRpbmcgaW4gYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgZG9lcyBub3QgaW5qZWN0IHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhlXG4gKiBzdXBlcmNsYXNzLiBIZW5jZSwgd2UgaWRlbnRpZnkgYSBkZWZhdWx0IHN5bnRoZXNpemVkIHN1cGVyIGNhbGwgaW4gdGhlIGNvbnN0cnVjdG9yIGJvZHksXG4gKiBhY2NvcmRpbmcgdG8gdGhlIHN0cnVjdHVyZSB0aGF0IFR5cGVTY3JpcHQncyBFUzIwMTUgdG8gRVM1IHRyYW5zZm9ybWVyIGdlbmVyYXRlcyBpblxuICogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvdjMuMi4yL3NyYy9jb21waWxlci90cmFuc2Zvcm1lcnMvZXMyMDE1LnRzI0wxMDgyLUwxMDk4XG4gKlxuICogQHBhcmFtIGNvbnN0cnVjdG9yIGEgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gdGVzdFxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29uc3RydWN0b3IgYXBwZWFycyB0byBoYXZlIGJlZW4gc3ludGhlc2l6ZWRcbiAqL1xuZnVuY3Rpb24gaXNTeW50aGVzaXplZENvbnN0cnVjdG9yKGNvbnN0cnVjdG9yOiB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gIGlmICghY29uc3RydWN0b3IuYm9keSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IGZpcnN0U3RhdGVtZW50ID0gY29uc3RydWN0b3IuYm9keS5zdGF0ZW1lbnRzWzBdO1xuICBpZiAoIWZpcnN0U3RhdGVtZW50KSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzU3ludGhlc2l6ZWRTdXBlclRoaXNBc3NpZ25tZW50KGZpcnN0U3RhdGVtZW50KSB8fFxuICAgICAgaXNTeW50aGVzaXplZFN1cGVyUmV0dXJuU3RhdGVtZW50KGZpcnN0U3RhdGVtZW50KTtcbn1cblxuLyoqXG4gKiBJZGVudGlmaWVzIGEgc3ludGhlc2l6ZWQgc3VwZXIgY2FsbCBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGBcbiAqIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHN0YXRlbWVudCBhIHN0YXRlbWVudCB0aGF0IG1heSBiZSBhIHN5bnRoZXNpemVkIHN1cGVyIGNhbGxcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHN0YXRlbWVudCBsb29rcyBsaWtlIGEgc3ludGhlc2l6ZWQgc3VwZXIgY2FsbFxuICovXG5mdW5jdGlvbiBpc1N5bnRoZXNpemVkU3VwZXJUaGlzQXNzaWdubWVudChzdGF0ZW1lbnQ6IHRzLlN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICBpZiAoIXRzLmlzVmFyaWFibGVTdGF0ZW1lbnQoc3RhdGVtZW50KSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb25zID0gc3RhdGVtZW50LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnM7XG4gIGlmICh2YXJpYWJsZURlY2xhcmF0aW9ucy5sZW5ndGggIT09IDEpIHJldHVybiBmYWxzZTtcblxuICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9uID0gdmFyaWFibGVEZWNsYXJhdGlvbnNbMF07XG4gIGlmICghdHMuaXNJZGVudGlmaWVyKHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZSkgfHxcbiAgICAgICF2YXJpYWJsZURlY2xhcmF0aW9uLm5hbWUudGV4dC5zdGFydHNXaXRoKCdfdGhpcycpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBjb25zdCBpbml0aWFsaXplciA9IHZhcmlhYmxlRGVjbGFyYXRpb24uaW5pdGlhbGl6ZXI7XG4gIGlmICghaW5pdGlhbGl6ZXIpIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gaXNTeW50aGVzaXplZERlZmF1bHRTdXBlckNhbGwoaW5pdGlhbGl6ZXIpO1xufVxuLyoqXG4gKiBJZGVudGlmaWVzIGEgc3ludGhlc2l6ZWQgc3VwZXIgY2FsbCBvZiB0aGUgZm9ybTpcbiAqXG4gKiBgYGBcbiAqIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzdGF0ZW1lbnQgYSBzdGF0ZW1lbnQgdGhhdCBtYXkgYmUgYSBzeW50aGVzaXplZCBzdXBlciBjYWxsXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzdGF0ZW1lbnQgbG9va3MgbGlrZSBhIHN5bnRoZXNpemVkIHN1cGVyIGNhbGxcbiAqL1xuZnVuY3Rpb24gaXNTeW50aGVzaXplZFN1cGVyUmV0dXJuU3RhdGVtZW50KHN0YXRlbWVudDogdHMuU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gIGlmICghdHMuaXNSZXR1cm5TdGF0ZW1lbnQoc3RhdGVtZW50KSkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IGV4cHJlc3Npb24gPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbjtcbiAgaWYgKCFleHByZXNzaW9uKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIGlzU3ludGhlc2l6ZWREZWZhdWx0U3VwZXJDYWxsKGV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgdGhlIGV4cHJlc3Npb24gaXMgb2YgdGhlIGZvcm06XG4gKlxuICogYGBgXG4gKiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAqIGBgYFxuICpcbiAqIFRoaXMgc3RydWN0dXJlIGlzIGdlbmVyYXRlZCBieSBUeXBlU2NyaXB0IHdoZW4gdHJhbnNmb3JtaW5nIEVTMjAxNSB0byBFUzUsIHNlZVxuICogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvdjMuMi4yL3NyYy9jb21waWxlci90cmFuc2Zvcm1lcnMvZXMyMDE1LnRzI0wxMTQ4LUwxMTYzXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gYW4gZXhwcmVzc2lvbiB0aGF0IG1heSByZXByZXNlbnQgYSBkZWZhdWx0IHN1cGVyIGNhbGxcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGV4cHJlc3Npb24gY29ycmVzcG9uZHMgd2l0aCB0aGUgYWJvdmUgZm9ybVxuICovXG5mdW5jdGlvbiBpc1N5bnRoZXNpemVkRGVmYXVsdFN1cGVyQ2FsbChleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gIGlmICghaXNCaW5hcnlFeHByKGV4cHJlc3Npb24sIHRzLlN5bnRheEtpbmQuQmFyQmFyVG9rZW4pKSByZXR1cm4gZmFsc2U7XG4gIGlmIChleHByZXNzaW9uLnJpZ2h0LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuVGhpc0tleXdvcmQpIHJldHVybiBmYWxzZTtcblxuICBjb25zdCBsZWZ0ID0gZXhwcmVzc2lvbi5sZWZ0O1xuICBpZiAoIWlzQmluYXJ5RXhwcihsZWZ0LCB0cy5TeW50YXhLaW5kLkFtcGVyc2FuZEFtcGVyc2FuZFRva2VuKSkgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiBpc1N1cGVyTm90TnVsbChsZWZ0LmxlZnQpICYmIGlzU3VwZXJBcHBseUNhbGwobGVmdC5yaWdodCk7XG59XG5cbmZ1bmN0aW9uIGlzU3VwZXJOb3ROdWxsKGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQmluYXJ5RXhwcihleHByZXNzaW9uLCB0cy5TeW50YXhLaW5kLkV4Y2xhbWF0aW9uRXF1YWxzRXF1YWxzVG9rZW4pICYmXG4gICAgICBpc1N1cGVySWRlbnRpZmllcihleHByZXNzaW9uLmxlZnQpO1xufVxuXG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgdGhlIGV4cHJlc3Npb24gaXMgb2YgdGhlIGZvcm1cbiAqXG4gKiBgYGBcbiAqIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBhbiBleHByZXNzaW9uIHRoYXQgbWF5IHJlcHJlc2VudCBhIGRlZmF1bHQgc3VwZXIgY2FsbFxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgZXhwcmVzc2lvbiBjb3JyZXNwb25kcyB3aXRoIHRoZSBhYm92ZSBmb3JtXG4gKi9cbmZ1bmN0aW9uIGlzU3VwZXJBcHBseUNhbGwoZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24oZXhwcmVzc2lvbikgfHwgZXhwcmVzc2lvbi5hcmd1bWVudHMubGVuZ3RoICE9PSAyKSByZXR1cm4gZmFsc2U7XG5cbiAgY29uc3QgdGFyZ2V0Rm4gPSBleHByZXNzaW9uLmV4cHJlc3Npb247XG4gIGlmICghdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24odGFyZ2V0Rm4pKSByZXR1cm4gZmFsc2U7XG4gIGlmICghaXNTdXBlcklkZW50aWZpZXIodGFyZ2V0Rm4uZXhwcmVzc2lvbikpIHJldHVybiBmYWxzZTtcbiAgaWYgKHRhcmdldEZuLm5hbWUudGV4dCAhPT0gJ2FwcGx5JykgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHRoaXNBcmd1bWVudCA9IGV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xuICBpZiAodGhpc0FyZ3VtZW50LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuVGhpc0tleXdvcmQpIHJldHVybiBmYWxzZTtcblxuICBjb25zdCBhcmd1bWVudHNBcmd1bWVudCA9IGV4cHJlc3Npb24uYXJndW1lbnRzWzFdO1xuICByZXR1cm4gdHMuaXNJZGVudGlmaWVyKGFyZ3VtZW50c0FyZ3VtZW50KSAmJiBhcmd1bWVudHNBcmd1bWVudC50ZXh0ID09PSAnYXJndW1lbnRzJztcbn1cblxuZnVuY3Rpb24gaXNCaW5hcnlFeHByKFxuICAgIGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24sIG9wZXJhdG9yOiB0cy5CaW5hcnlPcGVyYXRvcik6IGV4cHJlc3Npb24gaXMgdHMuQmluYXJ5RXhwcmVzc2lvbiB7XG4gIHJldHVybiB0cy5pc0JpbmFyeUV4cHJlc3Npb24oZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvbi5vcGVyYXRvclRva2VuLmtpbmQgPT09IG9wZXJhdG9yO1xufVxuXG5mdW5jdGlvbiBpc1N1cGVySWRlbnRpZmllcihub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG4gIC8vIFZlcmlmeSB0aGF0IHRoZSBpZGVudGlmaWVyIGlzIHByZWZpeGVkIHdpdGggYF9zdXBlcmAuIFdlIGRvbid0IHRlc3QgZm9yIGVxdWl2YWxlbmNlXG4gIC8vIGFzIFR5cGVTY3JpcHQgbWF5IGhhdmUgc3VmZml4ZWQgdGhlIG5hbWUsIGUuZy4gYF9zdXBlcl8xYCB0byBhdm9pZCBuYW1lIGNvbmZsaWN0cy5cbiAgLy8gUmVxdWlyaW5nIG9ubHkgYSBwcmVmaXggc2hvdWxkIGJlIHN1ZmZpY2llbnRseSBhY2N1cmF0ZS5cbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiBub2RlLnRleHQuc3RhcnRzV2l0aCgnX3N1cGVyJyk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIHN0YXRlbWVudCB0byBleHRyYWN0IHRoZSBFU001IHBhcmFtZXRlciBpbml0aWFsaXplciBpZiB0aGVyZSBpcyBvbmUuXG4gKiBJZiBvbmUgaXMgZm91bmQsIGFkZCBpdCB0byB0aGUgYXBwcm9wcmlhdGUgcGFyYW1ldGVyIGluIHRoZSBgcGFyYW1ldGVyc2AgY29sbGVjdGlvbi5cbiAqXG4gKiBUaGUgZm9ybSB3ZSBhcmUgbG9va2luZyBmb3IgaXM6XG4gKlxuICogYGBgXG4gKiBpZiAoYXJnID09PSB2b2lkIDApIHsgYXJnID0gaW5pdGlhbGl6ZXI7IH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzdGF0ZW1lbnQgYSBzdGF0ZW1lbnQgdGhhdCBtYXkgYmUgaW5pdGlhbGl6aW5nIGFuIG9wdGlvbmFsIHBhcmFtZXRlclxuICogQHBhcmFtIHBhcmFtZXRlcnMgdGhlIGNvbGxlY3Rpb24gb2YgcGFyYW1ldGVycyB0aGF0IHdlcmUgZm91bmQgaW4gdGhlIGZ1bmN0aW9uIGRlZmluaXRpb25cbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHN0YXRlbWVudCB3YXMgYSBwYXJhbWV0ZXIgaW5pdGlhbGl6ZXJcbiAqL1xuZnVuY3Rpb24gcmVmbGVjdFBhcmFtSW5pdGlhbGl6ZXIoc3RhdGVtZW50OiB0cy5TdGF0ZW1lbnQsIHBhcmFtZXRlcnM6IFBhcmFtZXRlcltdKSB7XG4gIGlmICh0cy5pc0lmU3RhdGVtZW50KHN0YXRlbWVudCkgJiYgaXNVbmRlZmluZWRDb21wYXJpc29uKHN0YXRlbWVudC5leHByZXNzaW9uKSAmJlxuICAgICAgdHMuaXNCbG9jayhzdGF0ZW1lbnQudGhlblN0YXRlbWVudCkgJiYgc3RhdGVtZW50LnRoZW5TdGF0ZW1lbnQuc3RhdGVtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCBpZlN0YXRlbWVudENvbXBhcmlzb24gPSBzdGF0ZW1lbnQuZXhwcmVzc2lvbjsgICAgICAgICAgIC8vIChhcmcgPT09IHZvaWQgMClcbiAgICBjb25zdCB0aGVuU3RhdGVtZW50ID0gc3RhdGVtZW50LnRoZW5TdGF0ZW1lbnQuc3RhdGVtZW50c1swXTsgIC8vIGFyZyA9IGluaXRpYWxpemVyO1xuICAgIGlmIChpc0Fzc2lnbm1lbnRTdGF0ZW1lbnQodGhlblN0YXRlbWVudCkpIHtcbiAgICAgIGNvbnN0IGNvbXBhcmlzb25OYW1lID0gaWZTdGF0ZW1lbnRDb21wYXJpc29uLmxlZnQudGV4dDtcbiAgICAgIGNvbnN0IGFzc2lnbm1lbnROYW1lID0gdGhlblN0YXRlbWVudC5leHByZXNzaW9uLmxlZnQudGV4dDtcbiAgICAgIGlmIChjb21wYXJpc29uTmFtZSA9PT0gYXNzaWdubWVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gcGFyYW1ldGVycy5maW5kKHAgPT4gcC5uYW1lID09PSBjb21wYXJpc29uTmFtZSk7XG4gICAgICAgIGlmIChwYXJhbWV0ZXIpIHtcbiAgICAgICAgICBwYXJhbWV0ZXIuaW5pdGlhbGl6ZXIgPSB0aGVuU3RhdGVtZW50LmV4cHJlc3Npb24ucmlnaHQ7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZENvbXBhcmlzb24oZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbik6IGV4cHJlc3Npb24gaXMgdHMuRXhwcmVzc2lvbiZcbiAgICB7bGVmdDogdHMuSWRlbnRpZmllciwgcmlnaHQ6IHRzLkV4cHJlc3Npb259IHtcbiAgcmV0dXJuIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uKSAmJlxuICAgICAgZXhwcmVzc2lvbi5vcGVyYXRvclRva2VuLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRXF1YWxzRXF1YWxzRXF1YWxzVG9rZW4gJiZcbiAgICAgIHRzLmlzVm9pZEV4cHJlc3Npb24oZXhwcmVzc2lvbi5yaWdodCkgJiYgdHMuaXNJZGVudGlmaWVyKGV4cHJlc3Npb24ubGVmdCk7XG59XG4iXX0=