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
        define("@angular/compiler-cli/src/ngtsc/annotations/src/metadata", ["require", "exports", "@angular/compiler", "typescript", "@angular/compiler-cli/src/ngtsc/annotations/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var compiler_1 = require("@angular/compiler");
    var ts = require("typescript");
    var util_1 = require("@angular/compiler-cli/src/ngtsc/annotations/src/util");
    /**
     * Given a class declaration, generate a call to `setClassMetadata` with the Angular metadata
     * present on the class or its member fields.
     *
     * If no such metadata is present, this function returns `null`. Otherwise, the call is returned
     * as a `Statement` for inclusion along with the class.
     */
    function generateSetClassMetadataCall(clazz, reflection, defaultImportRecorder, isCore) {
        if (!reflection.isClass(clazz)) {
            return null;
        }
        var id = ts.updateIdentifier(clazz.name);
        // Reflect over the class decorators. If none are present, or those that are aren't from
        // Angular, then return null. Otherwise, turn them into metadata.
        var classDecorators = reflection.getDecoratorsOfDeclaration(clazz);
        if (classDecorators === null) {
            return null;
        }
        var ngClassDecorators = classDecorators.filter(function (dec) { return isAngularDecorator(dec, isCore); }).map(decoratorToMetadata);
        if (ngClassDecorators.length === 0) {
            return null;
        }
        var metaDecorators = ts.createArrayLiteral(ngClassDecorators);
        // Convert the constructor parameters to metadata, passing null if none are present.
        var metaCtorParameters = new compiler_1.LiteralExpr(null);
        var classCtorParameters = reflection.getConstructorParameters(clazz);
        if (classCtorParameters !== null) {
            var ctorParameters = classCtorParameters.map(function (param) { return ctorParameterToMetadata(param, defaultImportRecorder, isCore); });
            metaCtorParameters = new compiler_1.FunctionExpr([], [
                new compiler_1.ReturnStatement(new compiler_1.LiteralArrayExpr(ctorParameters)),
            ]);
        }
        // Do the same for property decorators.
        var metaPropDecorators = ts.createNull();
        var decoratedMembers = reflection.getMembersOfClass(clazz)
            .filter(function (member) { return !member.isStatic && member.decorators !== null; })
            .map(function (member) { return classMemberToMetadata(member.name, member.decorators, isCore); });
        if (decoratedMembers.length > 0) {
            metaPropDecorators = ts.createObjectLiteral(decoratedMembers);
        }
        // Generate a pure call to setClassMetadata with the class identifier and its metadata.
        var setClassMetadata = new compiler_1.ExternalExpr(compiler_1.Identifiers.setClassMetadata);
        var fnCall = new compiler_1.InvokeFunctionExpr(
        /* fn */ setClassMetadata, 
        /* args */
        [
            new compiler_1.WrappedNodeExpr(id),
            new compiler_1.WrappedNodeExpr(metaDecorators),
            metaCtorParameters,
            new compiler_1.WrappedNodeExpr(metaPropDecorators),
        ], 
        /* type */ undefined, 
        /* sourceSpan */ undefined, 
        /* pure */ true);
        return fnCall.toStmt();
    }
    exports.generateSetClassMetadataCall = generateSetClassMetadataCall;
    /**
     * Convert a reflected constructor parameter to metadata.
     */
    function ctorParameterToMetadata(param, defaultImportRecorder, isCore) {
        // Parameters sometimes have a type that can be referenced. If so, then use it, otherwise
        // its type is undefined.
        var type = param.typeValueReference !== null ?
            util_1.valueReferenceToExpression(param.typeValueReference, defaultImportRecorder) :
            new compiler_1.LiteralExpr(undefined);
        var mapEntries = [
            { key: 'type', value: type, quoted: false },
        ];
        // If the parameter has decorators, include the ones from Angular.
        if (param.decorators !== null) {
            var ngDecorators = param.decorators.filter(function (dec) { return isAngularDecorator(dec, isCore); }).map(decoratorToMetadata);
            var value = new compiler_1.WrappedNodeExpr(ts.createArrayLiteral(ngDecorators));
            mapEntries.push({ key: 'decorators', value: value, quoted: false });
        }
        return compiler_1.literalMap(mapEntries);
    }
    /**
     * Convert a reflected class member to metadata.
     */
    function classMemberToMetadata(name, decorators, isCore) {
        var ngDecorators = decorators.filter(function (dec) { return isAngularDecorator(dec, isCore); }).map(decoratorToMetadata);
        var decoratorMeta = ts.createArrayLiteral(ngDecorators);
        return ts.createPropertyAssignment(name, decoratorMeta);
    }
    /**
     * Convert a reflected decorator to metadata.
     */
    function decoratorToMetadata(decorator) {
        // Decorators have a type.
        var properties = [
            ts.createPropertyAssignment('type', ts.getMutableClone(decorator.identifier)),
        ];
        // Sometimes they have arguments.
        if (decorator.args !== null && decorator.args.length > 0) {
            var args = decorator.args.map(function (arg) { return ts.getMutableClone(arg); });
            properties.push(ts.createPropertyAssignment('args', ts.createArrayLiteral(args)));
        }
        return ts.createObjectLiteral(properties, true);
    }
    /**
     * Whether a given decorator should be treated as an Angular decorator.
     *
     * Either it's used in @angular/core, or it's imported from there.
     */
    function isAngularDecorator(decorator, isCore) {
        return isCore || (decorator.import !== null && decorator.import.from === '@angular/core');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2Fubm90YXRpb25zL3NyYy9tZXRhZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILDhDQUFrTTtJQUNsTSwrQkFBaUM7SUFLakMsNkVBQWtEO0lBR2xEOzs7Ozs7T0FNRztJQUNILFNBQWdCLDRCQUE0QixDQUN4QyxLQUFxQixFQUFFLFVBQTBCLEVBQUUscUJBQTRDLEVBQy9GLE1BQWU7UUFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0Msd0ZBQXdGO1FBQ3hGLGlFQUFpRTtRQUNqRSxJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckUsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFNLGlCQUFpQixHQUNuQixlQUFlLENBQUMsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsa0JBQWtCLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDNUYsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVoRSxvRkFBb0Y7UUFDcEYsSUFBSSxrQkFBa0IsR0FBZSxJQUFJLHNCQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkUsSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7WUFDaEMsSUFBTSxjQUFjLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUMxQyxVQUFBLEtBQUssSUFBSSxPQUFBLHVCQUF1QixDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxNQUFNLENBQUMsRUFBN0QsQ0FBNkQsQ0FBQyxDQUFDO1lBQzVFLGtCQUFrQixHQUFHLElBQUksdUJBQVksQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksMEJBQWUsQ0FBQyxJQUFJLDJCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQzFELENBQUMsQ0FBQztTQUNKO1FBRUQsdUNBQXVDO1FBQ3ZDLElBQUksa0JBQWtCLEdBQWtCLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4RCxJQUFNLGdCQUFnQixHQUNsQixVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDO2FBQzlCLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLElBQUksRUFBOUMsQ0FBOEMsQ0FBQzthQUNoRSxHQUFHLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFZLEVBQUUsTUFBTSxDQUFDLEVBQS9ELENBQStELENBQUMsQ0FBQztRQUN4RixJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0Isa0JBQWtCLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDL0Q7UUFFRCx1RkFBdUY7UUFDdkYsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHVCQUFZLENBQUMsc0JBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hFLElBQU0sTUFBTSxHQUFHLElBQUksNkJBQWtCO1FBQ2pDLFFBQVEsQ0FBQyxnQkFBZ0I7UUFDekIsVUFBVTtRQUNWO1lBQ0UsSUFBSSwwQkFBZSxDQUFDLEVBQUUsQ0FBQztZQUN2QixJQUFJLDBCQUFlLENBQUMsY0FBYyxDQUFDO1lBQ25DLGtCQUFrQjtZQUNsQixJQUFJLDBCQUFlLENBQUMsa0JBQWtCLENBQUM7U0FDeEM7UUFDRCxVQUFVLENBQUMsU0FBUztRQUNwQixnQkFBZ0IsQ0FBQyxTQUFTO1FBQzFCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBekRELG9FQXlEQztJQUVEOztPQUVHO0lBQ0gsU0FBUyx1QkFBdUIsQ0FDNUIsS0FBb0IsRUFBRSxxQkFBNEMsRUFDbEUsTUFBZTtRQUNqQix5RkFBeUY7UUFDekYseUJBQXlCO1FBQ3pCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUM1QyxpQ0FBMEIsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksc0JBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUvQixJQUFNLFVBQVUsR0FBc0Q7WUFDcEUsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztTQUMxQyxDQUFDO1FBRUYsa0VBQWtFO1FBQ2xFLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDN0IsSUFBTSxZQUFZLEdBQ2QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQS9CLENBQStCLENBQUMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM3RixJQUFNLEtBQUssR0FBRyxJQUFJLDBCQUFlLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDdkUsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSyxPQUFBLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FDNUQ7UUFDRCxPQUFPLHFCQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxxQkFBcUIsQ0FDMUIsSUFBWSxFQUFFLFVBQXVCLEVBQUUsTUFBZTtRQUN4RCxJQUFNLFlBQVksR0FDZCxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsa0JBQWtCLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdkYsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFELE9BQU8sRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLG1CQUFtQixDQUFDLFNBQW9CO1FBQy9DLDBCQUEwQjtRQUMxQixJQUFNLFVBQVUsR0FBa0M7WUFDaEQsRUFBRSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5RSxDQUFDO1FBQ0YsaUNBQWlDO1FBQ2pDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hELElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1lBQ2hFLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25GO1FBQ0QsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxTQUFvQixFQUFFLE1BQWU7UUFDL0QsT0FBTyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxlQUFlLENBQUMsQ0FBQztJQUM1RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V4cHJlc3Npb24sIEV4dGVybmFsRXhwciwgRnVuY3Rpb25FeHByLCBJZGVudGlmaWVycywgSW52b2tlRnVuY3Rpb25FeHByLCBMaXRlcmFsQXJyYXlFeHByLCBMaXRlcmFsRXhwciwgUmV0dXJuU3RhdGVtZW50LCBTdGF0ZW1lbnQsIFdyYXBwZWROb2RlRXhwciwgbGl0ZXJhbE1hcH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7RGVmYXVsdEltcG9ydFJlY29yZGVyfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7Q3RvclBhcmFtZXRlciwgRGVjb3JhdG9yLCBSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5cbmltcG9ydCB7dmFsdWVSZWZlcmVuY2VUb0V4cHJlc3Npb259IGZyb20gJy4vdXRpbCc7XG5cblxuLyoqXG4gKiBHaXZlbiBhIGNsYXNzIGRlY2xhcmF0aW9uLCBnZW5lcmF0ZSBhIGNhbGwgdG8gYHNldENsYXNzTWV0YWRhdGFgIHdpdGggdGhlIEFuZ3VsYXIgbWV0YWRhdGFcbiAqIHByZXNlbnQgb24gdGhlIGNsYXNzIG9yIGl0cyBtZW1iZXIgZmllbGRzLlxuICpcbiAqIElmIG5vIHN1Y2ggbWV0YWRhdGEgaXMgcHJlc2VudCwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGBudWxsYC4gT3RoZXJ3aXNlLCB0aGUgY2FsbCBpcyByZXR1cm5lZFxuICogYXMgYSBgU3RhdGVtZW50YCBmb3IgaW5jbHVzaW9uIGFsb25nIHdpdGggdGhlIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTZXRDbGFzc01ldGFkYXRhQ2FsbChcbiAgICBjbGF6ejogdHMuRGVjbGFyYXRpb24sIHJlZmxlY3Rpb246IFJlZmxlY3Rpb25Ib3N0LCBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlcixcbiAgICBpc0NvcmU6IGJvb2xlYW4pOiBTdGF0ZW1lbnR8bnVsbCB7XG4gIGlmICghcmVmbGVjdGlvbi5pc0NsYXNzKGNsYXp6KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGlkID0gdHMudXBkYXRlSWRlbnRpZmllcihjbGF6ei5uYW1lKTtcblxuICAvLyBSZWZsZWN0IG92ZXIgdGhlIGNsYXNzIGRlY29yYXRvcnMuIElmIG5vbmUgYXJlIHByZXNlbnQsIG9yIHRob3NlIHRoYXQgYXJlIGFyZW4ndCBmcm9tXG4gIC8vIEFuZ3VsYXIsIHRoZW4gcmV0dXJuIG51bGwuIE90aGVyd2lzZSwgdHVybiB0aGVtIGludG8gbWV0YWRhdGEuXG4gIGNvbnN0IGNsYXNzRGVjb3JhdG9ycyA9IHJlZmxlY3Rpb24uZ2V0RGVjb3JhdG9yc09mRGVjbGFyYXRpb24oY2xhenopO1xuICBpZiAoY2xhc3NEZWNvcmF0b3JzID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgbmdDbGFzc0RlY29yYXRvcnMgPVxuICAgICAgY2xhc3NEZWNvcmF0b3JzLmZpbHRlcihkZWMgPT4gaXNBbmd1bGFyRGVjb3JhdG9yKGRlYywgaXNDb3JlKSkubWFwKGRlY29yYXRvclRvTWV0YWRhdGEpO1xuICBpZiAobmdDbGFzc0RlY29yYXRvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgbWV0YURlY29yYXRvcnMgPSB0cy5jcmVhdGVBcnJheUxpdGVyYWwobmdDbGFzc0RlY29yYXRvcnMpO1xuXG4gIC8vIENvbnZlcnQgdGhlIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnMgdG8gbWV0YWRhdGEsIHBhc3NpbmcgbnVsbCBpZiBub25lIGFyZSBwcmVzZW50LlxuICBsZXQgbWV0YUN0b3JQYXJhbWV0ZXJzOiBFeHByZXNzaW9uID0gbmV3IExpdGVyYWxFeHByKG51bGwpO1xuICBjb25zdCBjbGFzc0N0b3JQYXJhbWV0ZXJzID0gcmVmbGVjdGlvbi5nZXRDb25zdHJ1Y3RvclBhcmFtZXRlcnMoY2xhenopO1xuICBpZiAoY2xhc3NDdG9yUGFyYW1ldGVycyAhPT0gbnVsbCkge1xuICAgIGNvbnN0IGN0b3JQYXJhbWV0ZXJzID0gY2xhc3NDdG9yUGFyYW1ldGVycy5tYXAoXG4gICAgICAgIHBhcmFtID0+IGN0b3JQYXJhbWV0ZXJUb01ldGFkYXRhKHBhcmFtLCBkZWZhdWx0SW1wb3J0UmVjb3JkZXIsIGlzQ29yZSkpO1xuICAgIG1ldGFDdG9yUGFyYW1ldGVycyA9IG5ldyBGdW5jdGlvbkV4cHIoW10sIFtcbiAgICAgIG5ldyBSZXR1cm5TdGF0ZW1lbnQobmV3IExpdGVyYWxBcnJheUV4cHIoY3RvclBhcmFtZXRlcnMpKSxcbiAgICBdKTtcbiAgfVxuXG4gIC8vIERvIHRoZSBzYW1lIGZvciBwcm9wZXJ0eSBkZWNvcmF0b3JzLlxuICBsZXQgbWV0YVByb3BEZWNvcmF0b3JzOiB0cy5FeHByZXNzaW9uID0gdHMuY3JlYXRlTnVsbCgpO1xuICBjb25zdCBkZWNvcmF0ZWRNZW1iZXJzID1cbiAgICAgIHJlZmxlY3Rpb24uZ2V0TWVtYmVyc09mQ2xhc3MoY2xhenopXG4gICAgICAgICAgLmZpbHRlcihtZW1iZXIgPT4gIW1lbWJlci5pc1N0YXRpYyAmJiBtZW1iZXIuZGVjb3JhdG9ycyAhPT0gbnVsbClcbiAgICAgICAgICAubWFwKG1lbWJlciA9PiBjbGFzc01lbWJlclRvTWV0YWRhdGEobWVtYmVyLm5hbWUsIG1lbWJlci5kZWNvcmF0b3JzICEsIGlzQ29yZSkpO1xuICBpZiAoZGVjb3JhdGVkTWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgbWV0YVByb3BEZWNvcmF0b3JzID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChkZWNvcmF0ZWRNZW1iZXJzKTtcbiAgfVxuXG4gIC8vIEdlbmVyYXRlIGEgcHVyZSBjYWxsIHRvIHNldENsYXNzTWV0YWRhdGEgd2l0aCB0aGUgY2xhc3MgaWRlbnRpZmllciBhbmQgaXRzIG1ldGFkYXRhLlxuICBjb25zdCBzZXRDbGFzc01ldGFkYXRhID0gbmV3IEV4dGVybmFsRXhwcihJZGVudGlmaWVycy5zZXRDbGFzc01ldGFkYXRhKTtcbiAgY29uc3QgZm5DYWxsID0gbmV3IEludm9rZUZ1bmN0aW9uRXhwcihcbiAgICAgIC8qIGZuICovIHNldENsYXNzTWV0YWRhdGEsXG4gICAgICAvKiBhcmdzICovXG4gICAgICBbXG4gICAgICAgIG5ldyBXcmFwcGVkTm9kZUV4cHIoaWQpLFxuICAgICAgICBuZXcgV3JhcHBlZE5vZGVFeHByKG1ldGFEZWNvcmF0b3JzKSxcbiAgICAgICAgbWV0YUN0b3JQYXJhbWV0ZXJzLFxuICAgICAgICBuZXcgV3JhcHBlZE5vZGVFeHByKG1ldGFQcm9wRGVjb3JhdG9ycyksXG4gICAgICBdLFxuICAgICAgLyogdHlwZSAqLyB1bmRlZmluZWQsXG4gICAgICAvKiBzb3VyY2VTcGFuICovIHVuZGVmaW5lZCxcbiAgICAgIC8qIHB1cmUgKi8gdHJ1ZSk7XG4gIHJldHVybiBmbkNhbGwudG9TdG10KCk7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJlZmxlY3RlZCBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgdG8gbWV0YWRhdGEuXG4gKi9cbmZ1bmN0aW9uIGN0b3JQYXJhbWV0ZXJUb01ldGFkYXRhKFxuICAgIHBhcmFtOiBDdG9yUGFyYW1ldGVyLCBkZWZhdWx0SW1wb3J0UmVjb3JkZXI6IERlZmF1bHRJbXBvcnRSZWNvcmRlcixcbiAgICBpc0NvcmU6IGJvb2xlYW4pOiBFeHByZXNzaW9uIHtcbiAgLy8gUGFyYW1ldGVycyBzb21ldGltZXMgaGF2ZSBhIHR5cGUgdGhhdCBjYW4gYmUgcmVmZXJlbmNlZC4gSWYgc28sIHRoZW4gdXNlIGl0LCBvdGhlcndpc2VcbiAgLy8gaXRzIHR5cGUgaXMgdW5kZWZpbmVkLlxuICBjb25zdCB0eXBlID0gcGFyYW0udHlwZVZhbHVlUmVmZXJlbmNlICE9PSBudWxsID9cbiAgICAgIHZhbHVlUmVmZXJlbmNlVG9FeHByZXNzaW9uKHBhcmFtLnR5cGVWYWx1ZVJlZmVyZW5jZSwgZGVmYXVsdEltcG9ydFJlY29yZGVyKSA6XG4gICAgICBuZXcgTGl0ZXJhbEV4cHIodW5kZWZpbmVkKTtcblxuICBjb25zdCBtYXBFbnRyaWVzOiB7a2V5OiBzdHJpbmcsIHZhbHVlOiBFeHByZXNzaW9uLCBxdW90ZWQ6IGZhbHNlfVtdID0gW1xuICAgIHtrZXk6ICd0eXBlJywgdmFsdWU6IHR5cGUsIHF1b3RlZDogZmFsc2V9LFxuICBdO1xuXG4gIC8vIElmIHRoZSBwYXJhbWV0ZXIgaGFzIGRlY29yYXRvcnMsIGluY2x1ZGUgdGhlIG9uZXMgZnJvbSBBbmd1bGFyLlxuICBpZiAocGFyYW0uZGVjb3JhdG9ycyAhPT0gbnVsbCkge1xuICAgIGNvbnN0IG5nRGVjb3JhdG9ycyA9XG4gICAgICAgIHBhcmFtLmRlY29yYXRvcnMuZmlsdGVyKGRlYyA9PiBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjLCBpc0NvcmUpKS5tYXAoZGVjb3JhdG9yVG9NZXRhZGF0YSk7XG4gICAgY29uc3QgdmFsdWUgPSBuZXcgV3JhcHBlZE5vZGVFeHByKHRzLmNyZWF0ZUFycmF5TGl0ZXJhbChuZ0RlY29yYXRvcnMpKTtcbiAgICBtYXBFbnRyaWVzLnB1c2goe2tleTogJ2RlY29yYXRvcnMnLCB2YWx1ZSwgcXVvdGVkOiBmYWxzZX0pO1xuICB9XG4gIHJldHVybiBsaXRlcmFsTWFwKG1hcEVudHJpZXMpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSByZWZsZWN0ZWQgY2xhc3MgbWVtYmVyIHRvIG1ldGFkYXRhLlxuICovXG5mdW5jdGlvbiBjbGFzc01lbWJlclRvTWV0YWRhdGEoXG4gICAgbmFtZTogc3RyaW5nLCBkZWNvcmF0b3JzOiBEZWNvcmF0b3JbXSwgaXNDb3JlOiBib29sZWFuKTogdHMuUHJvcGVydHlBc3NpZ25tZW50IHtcbiAgY29uc3QgbmdEZWNvcmF0b3JzID1cbiAgICAgIGRlY29yYXRvcnMuZmlsdGVyKGRlYyA9PiBpc0FuZ3VsYXJEZWNvcmF0b3IoZGVjLCBpc0NvcmUpKS5tYXAoZGVjb3JhdG9yVG9NZXRhZGF0YSk7XG4gIGNvbnN0IGRlY29yYXRvck1ldGEgPSB0cy5jcmVhdGVBcnJheUxpdGVyYWwobmdEZWNvcmF0b3JzKTtcbiAgcmV0dXJuIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChuYW1lLCBkZWNvcmF0b3JNZXRhKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcmVmbGVjdGVkIGRlY29yYXRvciB0byBtZXRhZGF0YS5cbiAqL1xuZnVuY3Rpb24gZGVjb3JhdG9yVG9NZXRhZGF0YShkZWNvcmF0b3I6IERlY29yYXRvcik6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uIHtcbiAgLy8gRGVjb3JhdG9ycyBoYXZlIGEgdHlwZS5cbiAgY29uc3QgcHJvcGVydGllczogdHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlW10gPSBbXG4gICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCd0eXBlJywgdHMuZ2V0TXV0YWJsZUNsb25lKGRlY29yYXRvci5pZGVudGlmaWVyKSksXG4gIF07XG4gIC8vIFNvbWV0aW1lcyB0aGV5IGhhdmUgYXJndW1lbnRzLlxuICBpZiAoZGVjb3JhdG9yLmFyZ3MgIT09IG51bGwgJiYgZGVjb3JhdG9yLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGFyZ3MgPSBkZWNvcmF0b3IuYXJncy5tYXAoYXJnID0+IHRzLmdldE11dGFibGVDbG9uZShhcmcpKTtcbiAgICBwcm9wZXJ0aWVzLnB1c2godHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdhcmdzJywgdHMuY3JlYXRlQXJyYXlMaXRlcmFsKGFyZ3MpKSk7XG4gIH1cbiAgcmV0dXJuIHRzLmNyZWF0ZU9iamVjdExpdGVyYWwocHJvcGVydGllcywgdHJ1ZSk7XG59XG5cbi8qKlxuICogV2hldGhlciBhIGdpdmVuIGRlY29yYXRvciBzaG91bGQgYmUgdHJlYXRlZCBhcyBhbiBBbmd1bGFyIGRlY29yYXRvci5cbiAqXG4gKiBFaXRoZXIgaXQncyB1c2VkIGluIEBhbmd1bGFyL2NvcmUsIG9yIGl0J3MgaW1wb3J0ZWQgZnJvbSB0aGVyZS5cbiAqL1xuZnVuY3Rpb24gaXNBbmd1bGFyRGVjb3JhdG9yKGRlY29yYXRvcjogRGVjb3JhdG9yLCBpc0NvcmU6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQ29yZSB8fCAoZGVjb3JhdG9yLmltcG9ydCAhPT0gbnVsbCAmJiBkZWNvcmF0b3IuaW1wb3J0LmZyb20gPT09ICdAYW5ndWxhci9jb3JlJyk7XG59XG4iXX0=