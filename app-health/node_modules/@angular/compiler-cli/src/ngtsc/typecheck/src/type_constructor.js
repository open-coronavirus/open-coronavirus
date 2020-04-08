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
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/type_constructor", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var ts_util_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util");
    function generateTypeCtorDeclarationFn(node, meta, nodeTypeRef, config) {
        if (requiresInlineTypeCtor(node)) {
            throw new Error(node.name.text + " requires an inline type constructor");
        }
        var rawTypeArgs = node.typeParameters !== undefined ? generateGenericArgs(node.typeParameters) : undefined;
        var rawType = ts.createTypeReferenceNode(nodeTypeRef, rawTypeArgs);
        var initParam = constructTypeCtorParameter(node, meta, rawType, config.checkQueries);
        var typeParameters = typeParametersWithDefaultTypes(node.typeParameters);
        if (meta.body) {
            var fnType = ts.createFunctionTypeNode(
            /* typeParameters */ typeParameters, 
            /* parameters */ [initParam], 
            /* type */ rawType);
            var decl = ts.createVariableDeclaration(
            /* name */ meta.fnName, 
            /* type */ fnType, 
            /* body */ ts.createNonNullExpression(ts.createNull()));
            var declList = ts.createVariableDeclarationList([decl], ts.NodeFlags.Const);
            return ts.createVariableStatement(
            /* modifiers */ undefined, 
            /* declarationList */ declList);
        }
        else {
            return ts.createFunctionDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ [ts.createModifier(ts.SyntaxKind.DeclareKeyword)], 
            /* asteriskToken */ undefined, 
            /* name */ meta.fnName, 
            /* typeParameters */ typeParameters, 
            /* parameters */ [initParam], 
            /* type */ rawType, 
            /* body */ undefined);
        }
    }
    exports.generateTypeCtorDeclarationFn = generateTypeCtorDeclarationFn;
    /**
     * Generate an inline type constructor for the given class and metadata.
     *
     * An inline type constructor is a specially shaped TypeScript static method, intended to be placed
     * within a directive class itself, that permits type inference of any generic type parameters of
     * the class from the types of expressions bound to inputs or outputs, and the types of elements
     * that match queries performed by the directive. It also catches any errors in the types of these
     * expressions. This method is never called at runtime, but is used in type-check blocks to
     * construct directive types.
     *
     * An inline type constructor for NgFor looks like:
     *
     * static ngTypeCtor<T>(init: Partial<Pick<NgForOf<T>, 'ngForOf'|'ngForTrackBy'|'ngForTemplate'>>):
     *   NgForOf<T>;
     *
     * A typical constructor would be:
     *
     * NgForOf.ngTypeCtor(init: {ngForOf: ['foo', 'bar']}); // Infers a type of NgForOf<string>.
     *
     * Inline type constructors are used when the type being created has bounded generic types which
     * make writing a declared type constructor (via `generateTypeCtorDeclarationFn`) difficult or
     * impossible.
     *
     * @param node the `ClassDeclaration<ts.ClassDeclaration>` for which a type constructor will be
     * generated.
     * @param meta additional metadata required to generate the type constructor.
     * @returns a `ts.MethodDeclaration` for the type constructor.
     */
    function generateInlineTypeCtor(node, meta, config) {
        // Build rawType, a `ts.TypeNode` of the class with its generic parameters passed through from
        // the definition without any type bounds. For example, if the class is
        // `FooDirective<T extends Bar>`, its rawType would be `FooDirective<T>`.
        var rawTypeArgs = node.typeParameters !== undefined ? generateGenericArgs(node.typeParameters) : undefined;
        var rawType = ts.createTypeReferenceNode(node.name, rawTypeArgs);
        var initParam = constructTypeCtorParameter(node, meta, rawType, config.checkQueries);
        // If this constructor is being generated into a .ts file, then it needs a fake body. The body
        // is set to a return of `null!`. If the type constructor is being generated into a .d.ts file,
        // it needs no body.
        var body = undefined;
        if (meta.body) {
            body = ts.createBlock([
                ts.createReturn(ts.createNonNullExpression(ts.createNull())),
            ]);
        }
        // Create the type constructor method declaration.
        return ts.createMethod(
        /* decorators */ undefined, 
        /* modifiers */ [ts.createModifier(ts.SyntaxKind.StaticKeyword)], 
        /* asteriskToken */ undefined, 
        /* name */ meta.fnName, 
        /* questionToken */ undefined, 
        /* typeParameters */ typeParametersWithDefaultTypes(node.typeParameters), 
        /* parameters */ [initParam], 
        /* type */ rawType, 
        /* body */ body);
    }
    exports.generateInlineTypeCtor = generateInlineTypeCtor;
    function constructTypeCtorParameter(node, meta, rawType, includeQueries) {
        // initType is the type of 'init', the single argument to the type constructor method.
        // If the Directive has any inputs, outputs, or queries, its initType will be:
        //
        // Partial<Pick<rawType, 'inputField'|'outputField'|'queryField'>>
        //
        // Pick here is used to select only those fields from which the generic type parameters of the
        // directive will be inferred. Partial is used because inputs are optional, so there may not be
        // bindings for each field.
        //
        // In the special case there are no inputs/outputs/etc, initType is set to {}.
        var initType;
        var keys = tslib_1.__spread(meta.fields.inputs, meta.fields.outputs);
        if (includeQueries) {
            keys.push.apply(keys, tslib_1.__spread(meta.fields.queries));
        }
        if (keys.length === 0) {
            // Special case - no inputs, outputs, or other fields which could influence the result type.
            initType = ts.createTypeLiteralNode([]);
        }
        else {
            // Construct a union of all the field names.
            var keyTypeUnion = ts.createUnionTypeNode(keys.map(function (key) { return ts.createLiteralTypeNode(ts.createStringLiteral(key)); }));
            // Construct the Pick<rawType, keyTypeUnion>.
            var pickType = ts.createTypeReferenceNode('Pick', [rawType, keyTypeUnion]);
            // Construct the Partial<pickType>.
            initType = ts.createTypeReferenceNode('Partial', [pickType]);
        }
        // Create the 'init' parameter itself.
        return ts.createParameter(
        /* decorators */ undefined, 
        /* modifiers */ undefined, 
        /* dotDotDotToken */ undefined, 
        /* name */ 'init', 
        /* questionToken */ undefined, 
        /* type */ initType, 
        /* initializer */ undefined);
    }
    function generateGenericArgs(params) {
        return params.map(function (param) { return ts.createTypeReferenceNode(param.name, undefined); });
    }
    function requiresInlineTypeCtor(node) {
        // The class requires an inline type constructor if it has constrained (bound) generics.
        return !ts_util_1.checkIfGenericTypesAreUnbound(node);
    }
    exports.requiresInlineTypeCtor = requiresInlineTypeCtor;
    /**
     * Add a default `= any` to type parameters that don't have a default value already.
     *
     * TypeScript uses the default type of a type parameter whenever inference of that parameter fails.
     * This can happen when inferring a complex type from 'any'. For example, if `NgFor`'s inference is
     * done with the TCB code:
     *
     * ```
     * class NgFor<T> {
     *   ngForOf: T[];
     * }
     *
     * declare function ctor<T>(o: Partial<Pick<NgFor<T>, 'ngForOf'>>): NgFor<T>;
     * ```
     *
     * An invocation looks like:
     *
     * ```
     * var _t1 = ctor({ngForOf: [1, 2]});
     * ```
     *
     * This correctly infers the type `NgFor<number>` for `_t1`, since `T` is inferred from the
     * assignment of type `number[]` to `ngForOf`'s type `T[]`. However, if `any` is passed instead:
     *
     * ```
     * var _t2 = ctor({ngForOf: [1, 2] as any});
     * ```
     *
     * then inference for `T` fails (it cannot be inferred from `T[] = any`). In this case, `T` takes
     * the type `{}`, and so `_t2` is inferred as `NgFor<{}>`. This is obviously wrong.
     *
     * Adding a default type to the generic declaration in the constructor solves this problem, as the
     * default type will be used in the event that inference fails.
     *
     * ```
     * declare function ctor<T = any>(o: Partial<Pick<NgFor<T>, 'ngForOf'>>): NgFor<T>;
     *
     * var _t3 = ctor({ngForOf: [1, 2] as any});
     * ```
     *
     * This correctly infers `T` as `any`, and therefore `_t3` as `NgFor<any>`.
     */
    function typeParametersWithDefaultTypes(params) {
        if (params === undefined) {
            return undefined;
        }
        return params.map(function (param) {
            if (param.default === undefined) {
                return ts.updateTypeParameterDeclaration(
                /* node */ param, 
                /* name */ param.name, 
                /* constraint */ param.constraint, 
                /* defaultType */ ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
            }
            else {
                return param;
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9jb25zdHJ1Y3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdHlwZWNoZWNrL3NyYy90eXBlX2NvbnN0cnVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILCtCQUFpQztJQUtqQyxpRkFBd0Q7SUFFeEQsU0FBZ0IsNkJBQTZCLENBQ3pDLElBQTJDLEVBQUUsSUFBc0IsRUFDbkUsV0FBNkMsRUFBRSxNQUEwQjtRQUMzRSxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLHlDQUFzQyxDQUFDLENBQUM7U0FDMUU7UUFFRCxJQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDN0YsSUFBTSxPQUFPLEdBQWdCLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbEYsSUFBTSxTQUFTLEdBQUcsMEJBQTBCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXZGLElBQU0sY0FBYyxHQUFHLDhCQUE4QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUzRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsc0JBQXNCO1lBQ3BDLG9CQUFvQixDQUFDLGNBQWM7WUFDbkMsZ0JBQWdCLENBQUEsQ0FBQyxTQUFTLENBQUM7WUFDM0IsVUFBVSxDQUFDLE9BQU8sQ0FBRyxDQUFDO1lBRTFCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyx5QkFBeUI7WUFDckMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ3RCLFVBQVUsQ0FBQyxNQUFNO1lBQ2pCLFVBQVUsQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlFLE9BQU8sRUFBRSxDQUFDLHVCQUF1QjtZQUM3QixlQUFlLENBQUMsU0FBUztZQUN6QixxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNyQzthQUFNO1lBQ0wsT0FBTyxFQUFFLENBQUMseUJBQXlCO1lBQy9CLGdCQUFnQixDQUFDLFNBQVM7WUFDMUIsZUFBZSxDQUFBLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2hFLG1CQUFtQixDQUFDLFNBQVM7WUFDN0IsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ3RCLG9CQUFvQixDQUFDLGNBQWM7WUFDbkMsZ0JBQWdCLENBQUEsQ0FBQyxTQUFTLENBQUM7WUFDM0IsVUFBVSxDQUFDLE9BQU87WUFDbEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQXhDRCxzRUF3Q0M7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMkJHO0lBQ0gsU0FBZ0Isc0JBQXNCLENBQ2xDLElBQTJDLEVBQUUsSUFBc0IsRUFDbkUsTUFBMEI7UUFDNUIsOEZBQThGO1FBQzlGLHVFQUF1RTtRQUN2RSx5RUFBeUU7UUFDekUsSUFBTSxXQUFXLEdBQ2IsSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzdGLElBQU0sT0FBTyxHQUFnQixFQUFFLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVoRixJQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdkYsOEZBQThGO1FBQzlGLCtGQUErRjtRQUMvRixvQkFBb0I7UUFDcEIsSUFBSSxJQUFJLEdBQXVCLFNBQVMsQ0FBQztRQUN6QyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztnQkFDcEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7YUFDN0QsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxrREFBa0Q7UUFDbEQsT0FBTyxFQUFFLENBQUMsWUFBWTtRQUNsQixnQkFBZ0IsQ0FBQyxTQUFTO1FBQzFCLGVBQWUsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvRCxtQkFBbUIsQ0FBQyxTQUFTO1FBQzdCLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTTtRQUN0QixtQkFBbUIsQ0FBQyxTQUFTO1FBQzdCLG9CQUFvQixDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDeEUsZ0JBQWdCLENBQUEsQ0FBQyxTQUFTLENBQUM7UUFDM0IsVUFBVSxDQUFDLE9BQU87UUFDbEIsVUFBVSxDQUFDLElBQUksQ0FBRyxDQUFDO0lBQ3pCLENBQUM7SUFqQ0Qsd0RBaUNDO0lBRUQsU0FBUywwQkFBMEIsQ0FDL0IsSUFBMkMsRUFBRSxJQUFzQixFQUFFLE9BQW9CLEVBQ3pGLGNBQXVCO1FBQ3pCLHNGQUFzRjtRQUN0Riw4RUFBOEU7UUFDOUUsRUFBRTtRQUNGLGtFQUFrRTtRQUNsRSxFQUFFO1FBQ0YsOEZBQThGO1FBQzlGLCtGQUErRjtRQUMvRiwyQkFBMkI7UUFDM0IsRUFBRTtRQUNGLDhFQUE4RTtRQUM5RSxJQUFJLFFBQXFCLENBQUM7UUFFMUIsSUFBTSxJQUFJLG9CQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDdkIsQ0FBQztRQUNGLElBQUksY0FBYyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxJQUFJLE9BQVQsSUFBSSxtQkFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRTtTQUNuQztRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDckIsNEZBQTRGO1lBQzVGLFFBQVEsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekM7YUFBTTtZQUNMLDRDQUE0QztZQUM1QyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQyxDQUFDO1lBRTVFLDZDQUE2QztZQUM3QyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFN0UsbUNBQW1DO1lBQ25DLFFBQVEsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUM5RDtRQUVELHNDQUFzQztRQUN0QyxPQUFPLEVBQUUsQ0FBQyxlQUFlO1FBQ3JCLGdCQUFnQixDQUFDLFNBQVM7UUFDMUIsZUFBZSxDQUFDLFNBQVM7UUFDekIsb0JBQW9CLENBQUMsU0FBUztRQUM5QixVQUFVLENBQUMsTUFBTTtRQUNqQixtQkFBbUIsQ0FBQyxTQUFTO1FBQzdCLFVBQVUsQ0FBQyxRQUFRO1FBQ25CLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxTQUFTLG1CQUFtQixDQUFDLE1BQWtEO1FBQzdFLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELFNBQWdCLHNCQUFzQixDQUFDLElBQTJDO1FBQ2hGLHdGQUF3RjtRQUN4RixPQUFPLENBQUMsdUNBQTZCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUhELHdEQUdDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUNHO0lBQ0gsU0FBUyw4QkFBOEIsQ0FDbkMsTUFBNkQ7UUFFL0QsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztZQUNyQixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUMvQixPQUFPLEVBQUUsQ0FBQyw4QkFBOEI7Z0JBQ3BDLFVBQVUsQ0FBQyxLQUFLO2dCQUNoQixVQUFVLENBQUMsS0FBSyxDQUFDLElBQUk7Z0JBQ3JCLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVO2dCQUNqQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2FBQzNFO2lCQUFNO2dCQUNMLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5pbXBvcnQge1R5cGVDaGVja2luZ0NvbmZpZywgVHlwZUN0b3JNZXRhZGF0YX0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtjaGVja0lmR2VuZXJpY1R5cGVzQXJlVW5ib3VuZH0gZnJvbSAnLi90c191dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVHlwZUN0b3JEZWNsYXJhdGlvbkZuKFxuICAgIG5vZGU6IENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4sIG1ldGE6IFR5cGVDdG9yTWV0YWRhdGEsXG4gICAgbm9kZVR5cGVSZWY6IHRzLklkZW50aWZpZXIgfCB0cy5RdWFsaWZpZWROYW1lLCBjb25maWc6IFR5cGVDaGVja2luZ0NvbmZpZyk6IHRzLlN0YXRlbWVudCB7XG4gIGlmIChyZXF1aXJlc0lubGluZVR5cGVDdG9yKG5vZGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke25vZGUubmFtZS50ZXh0fSByZXF1aXJlcyBhbiBpbmxpbmUgdHlwZSBjb25zdHJ1Y3RvcmApO1xuICB9XG5cbiAgY29uc3QgcmF3VHlwZUFyZ3MgPVxuICAgICAgbm9kZS50eXBlUGFyYW1ldGVycyAhPT0gdW5kZWZpbmVkID8gZ2VuZXJhdGVHZW5lcmljQXJncyhub2RlLnR5cGVQYXJhbWV0ZXJzKSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgcmF3VHlwZTogdHMuVHlwZU5vZGUgPSB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZShub2RlVHlwZVJlZiwgcmF3VHlwZUFyZ3MpO1xuXG4gIGNvbnN0IGluaXRQYXJhbSA9IGNvbnN0cnVjdFR5cGVDdG9yUGFyYW1ldGVyKG5vZGUsIG1ldGEsIHJhd1R5cGUsIGNvbmZpZy5jaGVja1F1ZXJpZXMpO1xuXG4gIGNvbnN0IHR5cGVQYXJhbWV0ZXJzID0gdHlwZVBhcmFtZXRlcnNXaXRoRGVmYXVsdFR5cGVzKG5vZGUudHlwZVBhcmFtZXRlcnMpO1xuXG4gIGlmIChtZXRhLmJvZHkpIHtcbiAgICBjb25zdCBmblR5cGUgPSB0cy5jcmVhdGVGdW5jdGlvblR5cGVOb2RlKFxuICAgICAgICAvKiB0eXBlUGFyYW1ldGVycyAqLyB0eXBlUGFyYW1ldGVycyxcbiAgICAgICAgLyogcGFyYW1ldGVycyAqL1tpbml0UGFyYW1dLFxuICAgICAgICAvKiB0eXBlICovIHJhd1R5cGUsICk7XG5cbiAgICBjb25zdCBkZWNsID0gdHMuY3JlYXRlVmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgLyogbmFtZSAqLyBtZXRhLmZuTmFtZSxcbiAgICAgICAgLyogdHlwZSAqLyBmblR5cGUsXG4gICAgICAgIC8qIGJvZHkgKi8gdHMuY3JlYXRlTm9uTnVsbEV4cHJlc3Npb24odHMuY3JlYXRlTnVsbCgpKSk7XG4gICAgY29uc3QgZGVjbExpc3QgPSB0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChbZGVjbF0sIHRzLk5vZGVGbGFncy5Db25zdCk7XG4gICAgcmV0dXJuIHRzLmNyZWF0ZVZhcmlhYmxlU3RhdGVtZW50KFxuICAgICAgICAvKiBtb2RpZmllcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAvKiBkZWNsYXJhdGlvbkxpc3QgKi8gZGVjbExpc3QpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cy5jcmVhdGVGdW5jdGlvbkRlY2xhcmF0aW9uKFxuICAgICAgICAvKiBkZWNvcmF0b3JzICovIHVuZGVmaW5lZCxcbiAgICAgICAgLyogbW9kaWZpZXJzICovW3RzLmNyZWF0ZU1vZGlmaWVyKHRzLlN5bnRheEtpbmQuRGVjbGFyZUtleXdvcmQpXSxcbiAgICAgICAgLyogYXN0ZXJpc2tUb2tlbiAqLyB1bmRlZmluZWQsXG4gICAgICAgIC8qIG5hbWUgKi8gbWV0YS5mbk5hbWUsXG4gICAgICAgIC8qIHR5cGVQYXJhbWV0ZXJzICovIHR5cGVQYXJhbWV0ZXJzLFxuICAgICAgICAvKiBwYXJhbWV0ZXJzICovW2luaXRQYXJhbV0sXG4gICAgICAgIC8qIHR5cGUgKi8gcmF3VHlwZSxcbiAgICAgICAgLyogYm9keSAqLyB1bmRlZmluZWQpO1xuICB9XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYW4gaW5saW5lIHR5cGUgY29uc3RydWN0b3IgZm9yIHRoZSBnaXZlbiBjbGFzcyBhbmQgbWV0YWRhdGEuXG4gKlxuICogQW4gaW5saW5lIHR5cGUgY29uc3RydWN0b3IgaXMgYSBzcGVjaWFsbHkgc2hhcGVkIFR5cGVTY3JpcHQgc3RhdGljIG1ldGhvZCwgaW50ZW5kZWQgdG8gYmUgcGxhY2VkXG4gKiB3aXRoaW4gYSBkaXJlY3RpdmUgY2xhc3MgaXRzZWxmLCB0aGF0IHBlcm1pdHMgdHlwZSBpbmZlcmVuY2Ugb2YgYW55IGdlbmVyaWMgdHlwZSBwYXJhbWV0ZXJzIG9mXG4gKiB0aGUgY2xhc3MgZnJvbSB0aGUgdHlwZXMgb2YgZXhwcmVzc2lvbnMgYm91bmQgdG8gaW5wdXRzIG9yIG91dHB1dHMsIGFuZCB0aGUgdHlwZXMgb2YgZWxlbWVudHNcbiAqIHRoYXQgbWF0Y2ggcXVlcmllcyBwZXJmb3JtZWQgYnkgdGhlIGRpcmVjdGl2ZS4gSXQgYWxzbyBjYXRjaGVzIGFueSBlcnJvcnMgaW4gdGhlIHR5cGVzIG9mIHRoZXNlXG4gKiBleHByZXNzaW9ucy4gVGhpcyBtZXRob2QgaXMgbmV2ZXIgY2FsbGVkIGF0IHJ1bnRpbWUsIGJ1dCBpcyB1c2VkIGluIHR5cGUtY2hlY2sgYmxvY2tzIHRvXG4gKiBjb25zdHJ1Y3QgZGlyZWN0aXZlIHR5cGVzLlxuICpcbiAqIEFuIGlubGluZSB0eXBlIGNvbnN0cnVjdG9yIGZvciBOZ0ZvciBsb29rcyBsaWtlOlxuICpcbiAqIHN0YXRpYyBuZ1R5cGVDdG9yPFQ+KGluaXQ6IFBhcnRpYWw8UGljazxOZ0Zvck9mPFQ+LCAnbmdGb3JPZid8J25nRm9yVHJhY2tCeSd8J25nRm9yVGVtcGxhdGUnPj4pOlxuICogICBOZ0Zvck9mPFQ+O1xuICpcbiAqIEEgdHlwaWNhbCBjb25zdHJ1Y3RvciB3b3VsZCBiZTpcbiAqXG4gKiBOZ0Zvck9mLm5nVHlwZUN0b3IoaW5pdDoge25nRm9yT2Y6IFsnZm9vJywgJ2JhciddfSk7IC8vIEluZmVycyBhIHR5cGUgb2YgTmdGb3JPZjxzdHJpbmc+LlxuICpcbiAqIElubGluZSB0eXBlIGNvbnN0cnVjdG9ycyBhcmUgdXNlZCB3aGVuIHRoZSB0eXBlIGJlaW5nIGNyZWF0ZWQgaGFzIGJvdW5kZWQgZ2VuZXJpYyB0eXBlcyB3aGljaFxuICogbWFrZSB3cml0aW5nIGEgZGVjbGFyZWQgdHlwZSBjb25zdHJ1Y3RvciAodmlhIGBnZW5lcmF0ZVR5cGVDdG9yRGVjbGFyYXRpb25GbmApIGRpZmZpY3VsdCBvclxuICogaW1wb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gbm9kZSB0aGUgYENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj5gIGZvciB3aGljaCBhIHR5cGUgY29uc3RydWN0b3Igd2lsbCBiZVxuICogZ2VuZXJhdGVkLlxuICogQHBhcmFtIG1ldGEgYWRkaXRpb25hbCBtZXRhZGF0YSByZXF1aXJlZCB0byBnZW5lcmF0ZSB0aGUgdHlwZSBjb25zdHJ1Y3Rvci5cbiAqIEByZXR1cm5zIGEgYHRzLk1ldGhvZERlY2xhcmF0aW9uYCBmb3IgdGhlIHR5cGUgY29uc3RydWN0b3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlubGluZVR5cGVDdG9yKFxuICAgIG5vZGU6IENsYXNzRGVjbGFyYXRpb248dHMuQ2xhc3NEZWNsYXJhdGlvbj4sIG1ldGE6IFR5cGVDdG9yTWV0YWRhdGEsXG4gICAgY29uZmlnOiBUeXBlQ2hlY2tpbmdDb25maWcpOiB0cy5NZXRob2REZWNsYXJhdGlvbiB7XG4gIC8vIEJ1aWxkIHJhd1R5cGUsIGEgYHRzLlR5cGVOb2RlYCBvZiB0aGUgY2xhc3Mgd2l0aCBpdHMgZ2VuZXJpYyBwYXJhbWV0ZXJzIHBhc3NlZCB0aHJvdWdoIGZyb21cbiAgLy8gdGhlIGRlZmluaXRpb24gd2l0aG91dCBhbnkgdHlwZSBib3VuZHMuIEZvciBleGFtcGxlLCBpZiB0aGUgY2xhc3MgaXNcbiAgLy8gYEZvb0RpcmVjdGl2ZTxUIGV4dGVuZHMgQmFyPmAsIGl0cyByYXdUeXBlIHdvdWxkIGJlIGBGb29EaXJlY3RpdmU8VD5gLlxuICBjb25zdCByYXdUeXBlQXJncyA9XG4gICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzICE9PSB1bmRlZmluZWQgPyBnZW5lcmF0ZUdlbmVyaWNBcmdzKG5vZGUudHlwZVBhcmFtZXRlcnMpIDogdW5kZWZpbmVkO1xuICBjb25zdCByYXdUeXBlOiB0cy5UeXBlTm9kZSA9IHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKG5vZGUubmFtZSwgcmF3VHlwZUFyZ3MpO1xuXG4gIGNvbnN0IGluaXRQYXJhbSA9IGNvbnN0cnVjdFR5cGVDdG9yUGFyYW1ldGVyKG5vZGUsIG1ldGEsIHJhd1R5cGUsIGNvbmZpZy5jaGVja1F1ZXJpZXMpO1xuXG4gIC8vIElmIHRoaXMgY29uc3RydWN0b3IgaXMgYmVpbmcgZ2VuZXJhdGVkIGludG8gYSAudHMgZmlsZSwgdGhlbiBpdCBuZWVkcyBhIGZha2UgYm9keS4gVGhlIGJvZHlcbiAgLy8gaXMgc2V0IHRvIGEgcmV0dXJuIG9mIGBudWxsIWAuIElmIHRoZSB0eXBlIGNvbnN0cnVjdG9yIGlzIGJlaW5nIGdlbmVyYXRlZCBpbnRvIGEgLmQudHMgZmlsZSxcbiAgLy8gaXQgbmVlZHMgbm8gYm9keS5cbiAgbGV0IGJvZHk6IHRzLkJsb2NrfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgaWYgKG1ldGEuYm9keSkge1xuICAgIGJvZHkgPSB0cy5jcmVhdGVCbG9jayhbXG4gICAgICB0cy5jcmVhdGVSZXR1cm4odHMuY3JlYXRlTm9uTnVsbEV4cHJlc3Npb24odHMuY3JlYXRlTnVsbCgpKSksXG4gICAgXSk7XG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIHR5cGUgY29uc3RydWN0b3IgbWV0aG9kIGRlY2xhcmF0aW9uLlxuICByZXR1cm4gdHMuY3JlYXRlTWV0aG9kKFxuICAgICAgLyogZGVjb3JhdG9ycyAqLyB1bmRlZmluZWQsXG4gICAgICAvKiBtb2RpZmllcnMgKi9bdHMuY3JlYXRlTW9kaWZpZXIodHMuU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKV0sXG4gICAgICAvKiBhc3Rlcmlza1Rva2VuICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIG5hbWUgKi8gbWV0YS5mbk5hbWUsXG4gICAgICAvKiBxdWVzdGlvblRva2VuICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIHR5cGVQYXJhbWV0ZXJzICovIHR5cGVQYXJhbWV0ZXJzV2l0aERlZmF1bHRUeXBlcyhub2RlLnR5cGVQYXJhbWV0ZXJzKSxcbiAgICAgIC8qIHBhcmFtZXRlcnMgKi9baW5pdFBhcmFtXSxcbiAgICAgIC8qIHR5cGUgKi8gcmF3VHlwZSxcbiAgICAgIC8qIGJvZHkgKi8gYm9keSwgKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0VHlwZUN0b3JQYXJhbWV0ZXIoXG4gICAgbm9kZTogQ2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPiwgbWV0YTogVHlwZUN0b3JNZXRhZGF0YSwgcmF3VHlwZTogdHMuVHlwZU5vZGUsXG4gICAgaW5jbHVkZVF1ZXJpZXM6IGJvb2xlYW4pOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvbiB7XG4gIC8vIGluaXRUeXBlIGlzIHRoZSB0eXBlIG9mICdpbml0JywgdGhlIHNpbmdsZSBhcmd1bWVudCB0byB0aGUgdHlwZSBjb25zdHJ1Y3RvciBtZXRob2QuXG4gIC8vIElmIHRoZSBEaXJlY3RpdmUgaGFzIGFueSBpbnB1dHMsIG91dHB1dHMsIG9yIHF1ZXJpZXMsIGl0cyBpbml0VHlwZSB3aWxsIGJlOlxuICAvL1xuICAvLyBQYXJ0aWFsPFBpY2s8cmF3VHlwZSwgJ2lucHV0RmllbGQnfCdvdXRwdXRGaWVsZCd8J3F1ZXJ5RmllbGQnPj5cbiAgLy9cbiAgLy8gUGljayBoZXJlIGlzIHVzZWQgdG8gc2VsZWN0IG9ubHkgdGhvc2UgZmllbGRzIGZyb20gd2hpY2ggdGhlIGdlbmVyaWMgdHlwZSBwYXJhbWV0ZXJzIG9mIHRoZVxuICAvLyBkaXJlY3RpdmUgd2lsbCBiZSBpbmZlcnJlZC4gUGFydGlhbCBpcyB1c2VkIGJlY2F1c2UgaW5wdXRzIGFyZSBvcHRpb25hbCwgc28gdGhlcmUgbWF5IG5vdCBiZVxuICAvLyBiaW5kaW5ncyBmb3IgZWFjaCBmaWVsZC5cbiAgLy9cbiAgLy8gSW4gdGhlIHNwZWNpYWwgY2FzZSB0aGVyZSBhcmUgbm8gaW5wdXRzL291dHB1dHMvZXRjLCBpbml0VHlwZSBpcyBzZXQgdG8ge30uXG4gIGxldCBpbml0VHlwZTogdHMuVHlwZU5vZGU7XG5cbiAgY29uc3Qga2V5czogc3RyaW5nW10gPSBbXG4gICAgLi4ubWV0YS5maWVsZHMuaW5wdXRzLFxuICAgIC4uLm1ldGEuZmllbGRzLm91dHB1dHMsXG4gIF07XG4gIGlmIChpbmNsdWRlUXVlcmllcykge1xuICAgIGtleXMucHVzaCguLi5tZXRhLmZpZWxkcy5xdWVyaWVzKTtcbiAgfVxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBTcGVjaWFsIGNhc2UgLSBubyBpbnB1dHMsIG91dHB1dHMsIG9yIG90aGVyIGZpZWxkcyB3aGljaCBjb3VsZCBpbmZsdWVuY2UgdGhlIHJlc3VsdCB0eXBlLlxuICAgIGluaXRUeXBlID0gdHMuY3JlYXRlVHlwZUxpdGVyYWxOb2RlKFtdKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDb25zdHJ1Y3QgYSB1bmlvbiBvZiBhbGwgdGhlIGZpZWxkIG5hbWVzLlxuICAgIGNvbnN0IGtleVR5cGVVbmlvbiA9IHRzLmNyZWF0ZVVuaW9uVHlwZU5vZGUoXG4gICAgICAgIGtleXMubWFwKGtleSA9PiB0cy5jcmVhdGVMaXRlcmFsVHlwZU5vZGUodHMuY3JlYXRlU3RyaW5nTGl0ZXJhbChrZXkpKSkpO1xuXG4gICAgLy8gQ29uc3RydWN0IHRoZSBQaWNrPHJhd1R5cGUsIGtleVR5cGVVbmlvbj4uXG4gICAgY29uc3QgcGlja1R5cGUgPSB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZSgnUGljaycsIFtyYXdUeXBlLCBrZXlUeXBlVW5pb25dKTtcblxuICAgIC8vIENvbnN0cnVjdCB0aGUgUGFydGlhbDxwaWNrVHlwZT4uXG4gICAgaW5pdFR5cGUgPSB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZSgnUGFydGlhbCcsIFtwaWNrVHlwZV0pO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSAnaW5pdCcgcGFyYW1ldGVyIGl0c2VsZi5cbiAgcmV0dXJuIHRzLmNyZWF0ZVBhcmFtZXRlcihcbiAgICAgIC8qIGRlY29yYXRvcnMgKi8gdW5kZWZpbmVkLFxuICAgICAgLyogbW9kaWZpZXJzICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIGRvdERvdERvdFRva2VuICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIG5hbWUgKi8gJ2luaXQnLFxuICAgICAgLyogcXVlc3Rpb25Ub2tlbiAqLyB1bmRlZmluZWQsXG4gICAgICAvKiB0eXBlICovIGluaXRUeXBlLFxuICAgICAgLyogaW5pdGlhbGl6ZXIgKi8gdW5kZWZpbmVkKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVHZW5lcmljQXJncyhwYXJhbXM6IFJlYWRvbmx5QXJyYXk8dHMuVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uPik6IHRzLlR5cGVOb2RlW10ge1xuICByZXR1cm4gcGFyYW1zLm1hcChwYXJhbSA9PiB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZShwYXJhbS5uYW1lLCB1bmRlZmluZWQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVzSW5saW5lVHlwZUN0b3Iobm9kZTogQ2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPik6IGJvb2xlYW4ge1xuICAvLyBUaGUgY2xhc3MgcmVxdWlyZXMgYW4gaW5saW5lIHR5cGUgY29uc3RydWN0b3IgaWYgaXQgaGFzIGNvbnN0cmFpbmVkIChib3VuZCkgZ2VuZXJpY3MuXG4gIHJldHVybiAhY2hlY2tJZkdlbmVyaWNUeXBlc0FyZVVuYm91bmQobm9kZSk7XG59XG5cbi8qKlxuICogQWRkIGEgZGVmYXVsdCBgPSBhbnlgIHRvIHR5cGUgcGFyYW1ldGVycyB0aGF0IGRvbid0IGhhdmUgYSBkZWZhdWx0IHZhbHVlIGFscmVhZHkuXG4gKlxuICogVHlwZVNjcmlwdCB1c2VzIHRoZSBkZWZhdWx0IHR5cGUgb2YgYSB0eXBlIHBhcmFtZXRlciB3aGVuZXZlciBpbmZlcmVuY2Ugb2YgdGhhdCBwYXJhbWV0ZXIgZmFpbHMuXG4gKiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBpbmZlcnJpbmcgYSBjb21wbGV4IHR5cGUgZnJvbSAnYW55Jy4gRm9yIGV4YW1wbGUsIGlmIGBOZ0ZvcmAncyBpbmZlcmVuY2UgaXNcbiAqIGRvbmUgd2l0aCB0aGUgVENCIGNvZGU6XG4gKlxuICogYGBgXG4gKiBjbGFzcyBOZ0ZvcjxUPiB7XG4gKiAgIG5nRm9yT2Y6IFRbXTtcbiAqIH1cbiAqXG4gKiBkZWNsYXJlIGZ1bmN0aW9uIGN0b3I8VD4obzogUGFydGlhbDxQaWNrPE5nRm9yPFQ+LCAnbmdGb3JPZic+Pik6IE5nRm9yPFQ+O1xuICogYGBgXG4gKlxuICogQW4gaW52b2NhdGlvbiBsb29rcyBsaWtlOlxuICpcbiAqIGBgYFxuICogdmFyIF90MSA9IGN0b3Ioe25nRm9yT2Y6IFsxLCAyXX0pO1xuICogYGBgXG4gKlxuICogVGhpcyBjb3JyZWN0bHkgaW5mZXJzIHRoZSB0eXBlIGBOZ0ZvcjxudW1iZXI+YCBmb3IgYF90MWAsIHNpbmNlIGBUYCBpcyBpbmZlcnJlZCBmcm9tIHRoZVxuICogYXNzaWdubWVudCBvZiB0eXBlIGBudW1iZXJbXWAgdG8gYG5nRm9yT2ZgJ3MgdHlwZSBgVFtdYC4gSG93ZXZlciwgaWYgYGFueWAgaXMgcGFzc2VkIGluc3RlYWQ6XG4gKlxuICogYGBgXG4gKiB2YXIgX3QyID0gY3Rvcih7bmdGb3JPZjogWzEsIDJdIGFzIGFueX0pO1xuICogYGBgXG4gKlxuICogdGhlbiBpbmZlcmVuY2UgZm9yIGBUYCBmYWlscyAoaXQgY2Fubm90IGJlIGluZmVycmVkIGZyb20gYFRbXSA9IGFueWApLiBJbiB0aGlzIGNhc2UsIGBUYCB0YWtlc1xuICogdGhlIHR5cGUgYHt9YCwgYW5kIHNvIGBfdDJgIGlzIGluZmVycmVkIGFzIGBOZ0Zvcjx7fT5gLiBUaGlzIGlzIG9idmlvdXNseSB3cm9uZy5cbiAqXG4gKiBBZGRpbmcgYSBkZWZhdWx0IHR5cGUgdG8gdGhlIGdlbmVyaWMgZGVjbGFyYXRpb24gaW4gdGhlIGNvbnN0cnVjdG9yIHNvbHZlcyB0aGlzIHByb2JsZW0sIGFzIHRoZVxuICogZGVmYXVsdCB0eXBlIHdpbGwgYmUgdXNlZCBpbiB0aGUgZXZlbnQgdGhhdCBpbmZlcmVuY2UgZmFpbHMuXG4gKlxuICogYGBgXG4gKiBkZWNsYXJlIGZ1bmN0aW9uIGN0b3I8VCA9IGFueT4obzogUGFydGlhbDxQaWNrPE5nRm9yPFQ+LCAnbmdGb3JPZic+Pik6IE5nRm9yPFQ+O1xuICpcbiAqIHZhciBfdDMgPSBjdG9yKHtuZ0Zvck9mOiBbMSwgMl0gYXMgYW55fSk7XG4gKiBgYGBcbiAqXG4gKiBUaGlzIGNvcnJlY3RseSBpbmZlcnMgYFRgIGFzIGBhbnlgLCBhbmQgdGhlcmVmb3JlIGBfdDNgIGFzIGBOZ0Zvcjxhbnk+YC5cbiAqL1xuZnVuY3Rpb24gdHlwZVBhcmFtZXRlcnNXaXRoRGVmYXVsdFR5cGVzKFxuICAgIHBhcmFtczogUmVhZG9ubHlBcnJheTx0cy5UeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24+fCB1bmRlZmluZWQpOiB0cy5UeXBlUGFyYW1ldGVyRGVjbGFyYXRpb25bXXxcbiAgICB1bmRlZmluZWQge1xuICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHBhcmFtcy5tYXAocGFyYW0gPT4ge1xuICAgIGlmIChwYXJhbS5kZWZhdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cy51cGRhdGVUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24oXG4gICAgICAgICAgLyogbm9kZSAqLyBwYXJhbSxcbiAgICAgICAgICAvKiBuYW1lICovIHBhcmFtLm5hbWUsXG4gICAgICAgICAgLyogY29uc3RyYWludCAqLyBwYXJhbS5jb25zdHJhaW50LFxuICAgICAgICAgIC8qIGRlZmF1bHRUeXBlICovIHRzLmNyZWF0ZUtleXdvcmRUeXBlTm9kZSh0cy5TeW50YXhLaW5kLkFueUtleXdvcmQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=