(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/migrations/utils", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/reflection"], factory);
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
    var ts = require("typescript");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var reflection_1 = require("@angular/compiler-cli/src/ngtsc/reflection");
    function isClassDeclaration(clazz) {
        return reflection_1.isNamedClassDeclaration(clazz) || reflection_1.isNamedFunctionDeclaration(clazz) ||
            reflection_1.isNamedVariableDeclaration(clazz);
    }
    exports.isClassDeclaration = isClassDeclaration;
    /**
     * Returns true if the `clazz` is decorated as a `Directive` or `Component`.
     */
    function hasDirectiveDecorator(host, clazz) {
        return host.metadata.getDirectiveMetadata(new imports_1.Reference(clazz)) !== null;
    }
    exports.hasDirectiveDecorator = hasDirectiveDecorator;
    /**
     * Returns true if the `clazz` has its own constructor function.
     */
    function hasConstructor(host, clazz) {
        return host.reflectionHost.getConstructorParameters(clazz) !== null;
    }
    exports.hasConstructor = hasConstructor;
    /**
     * Create an empty `Directive` decorator that will be associated with the `clazz`.
     */
    function createDirectiveDecorator(clazz) {
        var selectorArg = ts.createObjectLiteral([
            // TODO: At the moment ngtsc does not accept a directive with no selector
            ts.createPropertyAssignment('selector', ts.createStringLiteral('NGCC_DUMMY')),
        ]);
        var decoratorType = ts.createIdentifier('Directive');
        var decoratorNode = ts.createObjectLiteral([
            ts.createPropertyAssignment('type', decoratorType),
            ts.createPropertyAssignment('args', ts.createArrayLiteral([selectorArg])),
        ]);
        setParentPointers(clazz.getSourceFile(), decoratorNode);
        return {
            name: 'Directive',
            identifier: decoratorType,
            import: { name: 'Directive', from: '@angular/core' },
            node: decoratorNode,
            args: [selectorArg],
        };
    }
    exports.createDirectiveDecorator = createDirectiveDecorator;
    /**
     * Ensure that a tree of AST nodes have their parents wired up.
     */
    function setParentPointers(parent, child) {
        child.parent = parent;
        ts.forEachChild(child, function (grandchild) { return setParentPointers(child, grandchild); });
    }
    exports.setParentPointers = setParentPointers;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvbWlncmF0aW9ucy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILCtCQUFpQztJQUNqQyxtRUFBcUQ7SUFDckQseUVBQTJKO0lBRzNKLFNBQWdCLGtCQUFrQixDQUFDLEtBQXFCO1FBQ3RELE9BQU8sb0NBQXVCLENBQUMsS0FBSyxDQUFDLElBQUksdUNBQTBCLENBQUMsS0FBSyxDQUFDO1lBQ3RFLHVDQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFIRCxnREFHQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IscUJBQXFCLENBQUMsSUFBbUIsRUFBRSxLQUF1QjtRQUNoRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsSUFBSSxtQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQzNFLENBQUM7SUFGRCxzREFFQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsY0FBYyxDQUFDLElBQW1CLEVBQUUsS0FBdUI7UUFDekUsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQztJQUN0RSxDQUFDO0lBRkQsd0NBRUM7SUFFRDs7T0FFRztJQUNILFNBQWdCLHdCQUF3QixDQUFDLEtBQXVCO1FBQzlELElBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUN6Qyx5RUFBeUU7WUFDekUsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDOUUsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUMzQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztZQUNsRCxFQUFFLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDMUUsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXhELE9BQU87WUFDTCxJQUFJLEVBQUUsV0FBVztZQUNqQixVQUFVLEVBQUUsYUFBYTtZQUN6QixNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUM7WUFDbEQsSUFBSSxFQUFFLGFBQWE7WUFDbkIsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDO1NBQ3BCLENBQUM7SUFDSixDQUFDO0lBcEJELDREQW9CQztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsTUFBZSxFQUFFLEtBQWM7UUFDL0QsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsVUFBQSxVQUFVLElBQUksT0FBQSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBSEQsOENBR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7UmVmZXJlbmNlfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvaW1wb3J0cyc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb24sIERlY29yYXRvciwgaXNOYW1lZENsYXNzRGVjbGFyYXRpb24sIGlzTmFtZWRGdW5jdGlvbkRlY2xhcmF0aW9uLCBpc05hbWVkVmFyaWFibGVEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL25ndHNjL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtNaWdyYXRpb25Ib3N0fSBmcm9tICcuL21pZ3JhdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NsYXNzRGVjbGFyYXRpb24oY2xheno6IHRzLkRlY2xhcmF0aW9uKTogY2xhenogaXMgQ2xhc3NEZWNsYXJhdGlvbiB7XG4gIHJldHVybiBpc05hbWVkQ2xhc3NEZWNsYXJhdGlvbihjbGF6eikgfHwgaXNOYW1lZEZ1bmN0aW9uRGVjbGFyYXRpb24oY2xhenopIHx8XG4gICAgICBpc05hbWVkVmFyaWFibGVEZWNsYXJhdGlvbihjbGF6eik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBgY2xhenpgIGlzIGRlY29yYXRlZCBhcyBhIGBEaXJlY3RpdmVgIG9yIGBDb21wb25lbnRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzRGlyZWN0aXZlRGVjb3JhdG9yKGhvc3Q6IE1pZ3JhdGlvbkhvc3QsIGNsYXp6OiBDbGFzc0RlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gIHJldHVybiBob3N0Lm1ldGFkYXRhLmdldERpcmVjdGl2ZU1ldGFkYXRhKG5ldyBSZWZlcmVuY2UoY2xhenopKSAhPT0gbnVsbDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGBjbGF6emAgaGFzIGl0cyBvd24gY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25zdHJ1Y3Rvcihob3N0OiBNaWdyYXRpb25Ib3N0LCBjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICByZXR1cm4gaG9zdC5yZWZsZWN0aW9uSG9zdC5nZXRDb25zdHJ1Y3RvclBhcmFtZXRlcnMoY2xhenopICE9PSBudWxsO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbXB0eSBgRGlyZWN0aXZlYCBkZWNvcmF0b3IgdGhhdCB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgYGNsYXp6YC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURpcmVjdGl2ZURlY29yYXRvcihjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbik6IERlY29yYXRvciB7XG4gIGNvbnN0IHNlbGVjdG9yQXJnID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChbXG4gICAgLy8gVE9ETzogQXQgdGhlIG1vbWVudCBuZ3RzYyBkb2VzIG5vdCBhY2NlcHQgYSBkaXJlY3RpdmUgd2l0aCBubyBzZWxlY3RvclxuICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgnc2VsZWN0b3InLCB0cy5jcmVhdGVTdHJpbmdMaXRlcmFsKCdOR0NDX0RVTU1ZJykpLFxuICBdKTtcbiAgY29uc3QgZGVjb3JhdG9yVHlwZSA9IHRzLmNyZWF0ZUlkZW50aWZpZXIoJ0RpcmVjdGl2ZScpO1xuICBjb25zdCBkZWNvcmF0b3JOb2RlID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChbXG4gICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCd0eXBlJywgZGVjb3JhdG9yVHlwZSksXG4gICAgdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KCdhcmdzJywgdHMuY3JlYXRlQXJyYXlMaXRlcmFsKFtzZWxlY3RvckFyZ10pKSxcbiAgXSk7XG5cbiAgc2V0UGFyZW50UG9pbnRlcnMoY2xhenouZ2V0U291cmNlRmlsZSgpLCBkZWNvcmF0b3JOb2RlKTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdEaXJlY3RpdmUnLFxuICAgIGlkZW50aWZpZXI6IGRlY29yYXRvclR5cGUsXG4gICAgaW1wb3J0OiB7bmFtZTogJ0RpcmVjdGl2ZScsIGZyb206ICdAYW5ndWxhci9jb3JlJ30sXG4gICAgbm9kZTogZGVjb3JhdG9yTm9kZSxcbiAgICBhcmdzOiBbc2VsZWN0b3JBcmddLFxuICB9O1xufVxuXG4vKipcbiAqIEVuc3VyZSB0aGF0IGEgdHJlZSBvZiBBU1Qgbm9kZXMgaGF2ZSB0aGVpciBwYXJlbnRzIHdpcmVkIHVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0UGFyZW50UG9pbnRlcnMocGFyZW50OiB0cy5Ob2RlLCBjaGlsZDogdHMuTm9kZSk6IHZvaWQge1xuICBjaGlsZC5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRzLmZvckVhY2hDaGlsZChjaGlsZCwgZ3JhbmRjaGlsZCA9PiBzZXRQYXJlbnRQb2ludGVycyhjaGlsZCwgZ3JhbmRjaGlsZCkpO1xufVxuIl19