(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/migrations/undecorated_parent_migration", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/diagnostics", "@angular/compiler-cli/ngcc/src/utils", "@angular/compiler-cli/ngcc/src/migrations/utils"], factory);
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
    var diagnostics_1 = require("@angular/compiler-cli/src/ngtsc/diagnostics");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/utils");
    var utils_2 = require("@angular/compiler-cli/ngcc/src/migrations/utils");
    /**
     * Ensure that the parents of directives and components that have no constructor are also decorated
     * as a `Directive`.
     *
     * Example:
     *
     * ```
     * export class BasePlain {
     *   constructor(private vcr: ViewContainerRef) {}
     * }
     *
     * @Directive({selector: '[blah]'})
     * export class DerivedDir extends BasePlain {}
     * ```
     *
     * When compiling `DerivedDir` which extends the undecorated `BasePlain` class, the compiler needs
     * to generate an `ngDirectiveDef` for `DerivedDir`. In particular, it needs to generate a factory
     * function that creates instances of `DerivedDir`.
     *
     * As `DerivedDir` has no constructor, the factory function for `DerivedDir` must delegate to the
     * factory function for `BasePlain`. But for this to work, `BasePlain` must have a factory function,
     * itself.
     *
     * This migration adds a `Directive` decorator to such undecorated parent classes, to ensure that
     * the compiler will create the necessary factory function.
     *
     * The resulting code looks like:
     *
     * ```
     * @Directive()
     * export class BasePlain {
     *   constructor(private vcr: ViewContainerRef) {}
     * }
     *
     * @Directive({selector: '[blah]'})
     * export class DerivedDir extends BasePlain {}
     * ```
     */
    var UndecoratedParentMigration = /** @class */ (function () {
        function UndecoratedParentMigration() {
        }
        UndecoratedParentMigration.prototype.apply = function (clazz, host) {
            // Only interested in `clazz` if it is a `Component` or a `Directive`,
            // and it has no constructor of its own.
            if (!utils_2.hasDirectiveDecorator(host, clazz) || utils_2.hasConstructor(host, clazz)) {
                return null;
            }
            // Only interested in `clazz` if it inherits from a base class.
            var baseClassExpr = host.reflectionHost.getBaseClassExpression(clazz);
            if (baseClassExpr === null) {
                return null;
            }
            if (!ts.isIdentifier(baseClassExpr)) {
                return diagnostics_1.makeDiagnostic(diagnostics_1.ErrorCode.NGCC_MIGRATION_EXTERNAL_BASE_CLASS, baseClassExpr, clazz.name.text + " class has a dynamic base class " + baseClassExpr.getText() + ", so it is not possible to migrate.");
                return null;
            }
            var baseClazz = host.reflectionHost.getDeclarationOfIdentifier(baseClassExpr).node;
            if (!utils_2.isClassDeclaration(baseClazz)) {
                return null;
            }
            // Only interested in this base class if it doesn't have a `Directive` or `Component` decorator.
            if (utils_2.hasDirectiveDecorator(host, baseClazz)) {
                return null;
            }
            var importInfo = host.reflectionHost.getImportOfIdentifier(baseClassExpr);
            if (importInfo !== null && !utils_1.isRelativePath(importInfo.from)) {
                return diagnostics_1.makeDiagnostic(diagnostics_1.ErrorCode.NGCC_MIGRATION_EXTERNAL_BASE_CLASS, baseClassExpr, 'The base class was imported from an external entry-point so we cannot add a directive to it.');
            }
            host.injectSyntheticDecorator(baseClazz, utils_2.createDirectiveDecorator(baseClazz));
            return null;
        };
        return UndecoratedParentMigration;
    }());
    exports.UndecoratedParentMigration = UndecoratedParentMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5kZWNvcmF0ZWRfcGFyZW50X21pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9uZ2NjL3NyYy9taWdyYXRpb25zL3VuZGVjb3JhdGVkX3BhcmVudF9taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFDakMsMkVBQXlFO0lBRXpFLDhEQUF3QztJQUV4Qyx5RUFBNEc7SUFFNUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FxQ0c7SUFDSDtRQUFBO1FBMENBLENBQUM7UUF6Q0MsMENBQUssR0FBTCxVQUFNLEtBQXVCLEVBQUUsSUFBbUI7WUFDaEQsc0VBQXNFO1lBQ3RFLHdDQUF3QztZQUN4QyxJQUFJLENBQUMsNkJBQXFCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLHNCQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUN0RSxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsK0RBQStEO1lBQy9ELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEUsSUFBSSxhQUFhLEtBQUssSUFBSSxFQUFFO2dCQUMxQixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ25DLE9BQU8sNEJBQWMsQ0FDakIsdUJBQVMsQ0FBQyxrQ0FBa0MsRUFBRSxhQUFhLEVBQ3hELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSx3Q0FBbUMsYUFBYSxDQUFDLE9BQU8sRUFBRSx3Q0FBcUMsQ0FBQyxDQUFDO2dCQUN2SCxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQyxhQUFhLENBQUcsQ0FBQyxJQUFJLENBQUM7WUFDdkYsSUFBSSxDQUFDLDBCQUFrQixDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNsQyxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsZ0dBQWdHO1lBQ2hHLElBQUksNkJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO2dCQUMxQyxPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1RSxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksQ0FBQyxzQkFBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0QsT0FBTyw0QkFBYyxDQUNqQix1QkFBUyxDQUFDLGtDQUFrQyxFQUFFLGFBQWEsRUFDM0QsOEZBQThGLENBQUMsQ0FBQzthQUNyRztZQUVELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsZ0NBQXdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUU5RSxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDSCxpQ0FBQztJQUFELENBQUMsQUExQ0QsSUEwQ0M7SUExQ1ksZ0VBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0Vycm9yQ29kZSwgbWFrZURpYWdub3N0aWN9IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9kaWFnbm9zdGljcyc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9yZWZsZWN0aW9uJztcbmltcG9ydCB7aXNSZWxhdGl2ZVBhdGh9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7TWlncmF0aW9uLCBNaWdyYXRpb25Ib3N0fSBmcm9tICcuL21pZ3JhdGlvbic7XG5pbXBvcnQge2NyZWF0ZURpcmVjdGl2ZURlY29yYXRvciwgaGFzQ29uc3RydWN0b3IsIGhhc0RpcmVjdGl2ZURlY29yYXRvciwgaXNDbGFzc0RlY2xhcmF0aW9ufSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBFbnN1cmUgdGhhdCB0aGUgcGFyZW50cyBvZiBkaXJlY3RpdmVzIGFuZCBjb21wb25lbnRzIHRoYXQgaGF2ZSBubyBjb25zdHJ1Y3RvciBhcmUgYWxzbyBkZWNvcmF0ZWRcbiAqIGFzIGEgYERpcmVjdGl2ZWAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGV4cG9ydCBjbGFzcyBCYXNlUGxhaW4ge1xuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZikge31cbiAqIH1cbiAqXG4gKiBARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tibGFoXSd9KVxuICogZXhwb3J0IGNsYXNzIERlcml2ZWREaXIgZXh0ZW5kcyBCYXNlUGxhaW4ge31cbiAqIGBgYFxuICpcbiAqIFdoZW4gY29tcGlsaW5nIGBEZXJpdmVkRGlyYCB3aGljaCBleHRlbmRzIHRoZSB1bmRlY29yYXRlZCBgQmFzZVBsYWluYCBjbGFzcywgdGhlIGNvbXBpbGVyIG5lZWRzXG4gKiB0byBnZW5lcmF0ZSBhbiBgbmdEaXJlY3RpdmVEZWZgIGZvciBgRGVyaXZlZERpcmAuIEluIHBhcnRpY3VsYXIsIGl0IG5lZWRzIHRvIGdlbmVyYXRlIGEgZmFjdG9yeVxuICogZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGluc3RhbmNlcyBvZiBgRGVyaXZlZERpcmAuXG4gKlxuICogQXMgYERlcml2ZWREaXJgIGhhcyBubyBjb25zdHJ1Y3RvciwgdGhlIGZhY3RvcnkgZnVuY3Rpb24gZm9yIGBEZXJpdmVkRGlyYCBtdXN0IGRlbGVnYXRlIHRvIHRoZVxuICogZmFjdG9yeSBmdW5jdGlvbiBmb3IgYEJhc2VQbGFpbmAuIEJ1dCBmb3IgdGhpcyB0byB3b3JrLCBgQmFzZVBsYWluYCBtdXN0IGhhdmUgYSBmYWN0b3J5IGZ1bmN0aW9uLFxuICogaXRzZWxmLlxuICpcbiAqIFRoaXMgbWlncmF0aW9uIGFkZHMgYSBgRGlyZWN0aXZlYCBkZWNvcmF0b3IgdG8gc3VjaCB1bmRlY29yYXRlZCBwYXJlbnQgY2xhc3NlcywgdG8gZW5zdXJlIHRoYXRcbiAqIHRoZSBjb21waWxlciB3aWxsIGNyZWF0ZSB0aGUgbmVjZXNzYXJ5IGZhY3RvcnkgZnVuY3Rpb24uXG4gKlxuICogVGhlIHJlc3VsdGluZyBjb2RlIGxvb2tzIGxpa2U6XG4gKlxuICogYGBgXG4gKiBARGlyZWN0aXZlKClcbiAqIGV4cG9ydCBjbGFzcyBCYXNlUGxhaW4ge1xuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZikge31cbiAqIH1cbiAqXG4gKiBARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tibGFoXSd9KVxuICogZXhwb3J0IGNsYXNzIERlcml2ZWREaXIgZXh0ZW5kcyBCYXNlUGxhaW4ge31cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgVW5kZWNvcmF0ZWRQYXJlbnRNaWdyYXRpb24gaW1wbGVtZW50cyBNaWdyYXRpb24ge1xuICBhcHBseShjbGF6ejogQ2xhc3NEZWNsYXJhdGlvbiwgaG9zdDogTWlncmF0aW9uSG9zdCk6IHRzLkRpYWdub3N0aWN8bnVsbCB7XG4gICAgLy8gT25seSBpbnRlcmVzdGVkIGluIGBjbGF6emAgaWYgaXQgaXMgYSBgQ29tcG9uZW50YCBvciBhIGBEaXJlY3RpdmVgLFxuICAgIC8vIGFuZCBpdCBoYXMgbm8gY29uc3RydWN0b3Igb2YgaXRzIG93bi5cbiAgICBpZiAoIWhhc0RpcmVjdGl2ZURlY29yYXRvcihob3N0LCBjbGF6eikgfHwgaGFzQ29uc3RydWN0b3IoaG9zdCwgY2xhenopKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGludGVyZXN0ZWQgaW4gYGNsYXp6YCBpZiBpdCBpbmhlcml0cyBmcm9tIGEgYmFzZSBjbGFzcy5cbiAgICBjb25zdCBiYXNlQ2xhc3NFeHByID0gaG9zdC5yZWZsZWN0aW9uSG9zdC5nZXRCYXNlQ2xhc3NFeHByZXNzaW9uKGNsYXp6KTtcbiAgICBpZiAoYmFzZUNsYXNzRXhwciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCF0cy5pc0lkZW50aWZpZXIoYmFzZUNsYXNzRXhwcikpIHtcbiAgICAgIHJldHVybiBtYWtlRGlhZ25vc3RpYyhcbiAgICAgICAgICBFcnJvckNvZGUuTkdDQ19NSUdSQVRJT05fRVhURVJOQUxfQkFTRV9DTEFTUywgYmFzZUNsYXNzRXhwcixcbiAgICAgICAgICBgJHtjbGF6ei5uYW1lLnRleHR9IGNsYXNzIGhhcyBhIGR5bmFtaWMgYmFzZSBjbGFzcyAke2Jhc2VDbGFzc0V4cHIuZ2V0VGV4dCgpfSwgc28gaXQgaXMgbm90IHBvc3NpYmxlIHRvIG1pZ3JhdGUuYCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlQ2xhenogPSBob3N0LnJlZmxlY3Rpb25Ib3N0LmdldERlY2xhcmF0aW9uT2ZJZGVudGlmaWVyKGJhc2VDbGFzc0V4cHIpICEubm9kZTtcbiAgICBpZiAoIWlzQ2xhc3NEZWNsYXJhdGlvbihiYXNlQ2xhenopKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGludGVyZXN0ZWQgaW4gdGhpcyBiYXNlIGNsYXNzIGlmIGl0IGRvZXNuJ3QgaGF2ZSBhIGBEaXJlY3RpdmVgIG9yIGBDb21wb25lbnRgIGRlY29yYXRvci5cbiAgICBpZiAoaGFzRGlyZWN0aXZlRGVjb3JhdG9yKGhvc3QsIGJhc2VDbGF6eikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydEluZm8gPSBob3N0LnJlZmxlY3Rpb25Ib3N0LmdldEltcG9ydE9mSWRlbnRpZmllcihiYXNlQ2xhc3NFeHByKTtcbiAgICBpZiAoaW1wb3J0SW5mbyAhPT0gbnVsbCAmJiAhaXNSZWxhdGl2ZVBhdGgoaW1wb3J0SW5mby5mcm9tKSkge1xuICAgICAgcmV0dXJuIG1ha2VEaWFnbm9zdGljKFxuICAgICAgICAgIEVycm9yQ29kZS5OR0NDX01JR1JBVElPTl9FWFRFUk5BTF9CQVNFX0NMQVNTLCBiYXNlQ2xhc3NFeHByLFxuICAgICAgICAgICdUaGUgYmFzZSBjbGFzcyB3YXMgaW1wb3J0ZWQgZnJvbSBhbiBleHRlcm5hbCBlbnRyeS1wb2ludCBzbyB3ZSBjYW5ub3QgYWRkIGEgZGlyZWN0aXZlIHRvIGl0LicpO1xuICAgIH1cblxuICAgIGhvc3QuaW5qZWN0U3ludGhldGljRGVjb3JhdG9yKGJhc2VDbGF6eiwgY3JlYXRlRGlyZWN0aXZlRGVjb3JhdG9yKGJhc2VDbGF6eikpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==