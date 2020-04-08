/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc/src/host/esm5_host" />
import * as ts from 'typescript';
import { ClassDeclaration, ClassMember, ClassSymbol, CtorParameter, Declaration, Decorator, FunctionDefinition } from '../../../src/ngtsc/reflection';
import { Esm2015ReflectionHost, ParamInfo } from './esm2015_host';
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
export declare class Esm5ReflectionHost extends Esm2015ReflectionHost {
    /**
     * Determines whether the given declaration, which should be a "class", has a base "class".
     *
     * In ES5 code, we need to determine if the IIFE wrapper takes a `_super` parameter .
     *
     * @param clazz a `ClassDeclaration` representing the class over which to reflect.
     */
    hasBaseClass(clazz: ClassDeclaration): boolean;
    getBaseClassExpression(clazz: ClassDeclaration): ts.Expression | null;
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
    getClassDeclaration(node: ts.Node): ClassDeclaration | undefined;
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
    getDeclarationOfIdentifier(id: ts.Identifier): Declaration | null;
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
    getDefinitionOfFunction(node: ts.Node): FunctionDefinition | null;
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
    getMembersOfClass(clazz: ClassDeclaration): ClassMember[];
    /** Gets all decorators of the given class symbol. */
    getDecoratorsOfSymbol(symbol: ClassSymbol): Decorator[] | null;
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
    protected getInnerFunctionDeclarationFromClassDeclaration(node: ts.Node): ts.FunctionDeclaration | undefined;
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
    protected getInnerFunctionSymbolFromClassDeclaration(clazz: ClassDeclaration): ClassSymbol | undefined;
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
    protected getConstructorParameterDeclarations(classSymbol: ClassSymbol): ts.ParameterDeclaration[] | null;
    /**
     * Get the parameter decorators of a class constructor.
     *
     * @param classSymbol the symbol of the class (i.e. the outer variable declaration) whose
     * parameter info we want to get.
     * @param parameterNodes the array of TypeScript parameter nodes for this class's constructor.
     * @returns an array of constructor parameter info objects.
     */
    protected getConstructorParamInfo(classSymbol: ClassSymbol, parameterNodes: ts.ParameterDeclaration[]): CtorParameter[];
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
    protected getParamInfoFromStaticProperty(paramDecoratorsProperty: ts.Symbol): ParamInfo[] | null;
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
    protected reflectMembers(symbol: ts.Symbol, decorators?: Decorator[], isStatic?: boolean): ClassMember[] | null;
    /**
     * Find statements related to the given class that may contain calls to a helper.
     *
     * In ESM5 code the helper calls are hidden inside the class's IIFE.
     *
     * @param classSymbol the class whose helper calls we are interested in. We expect this symbol
     * to reference the inner identifier inside the IIFE.
     * @returns an array of statements that may contain helper calls.
     */
    protected getStatementsForClass(classSymbol: ClassSymbol): ts.Statement[];
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
    protected getStaticProperty(symbol: ClassSymbol, propertyName: ts.__String): ts.Symbol | undefined;
}
export declare function getIifeBody(declaration: ts.Declaration): ts.Block | undefined;
