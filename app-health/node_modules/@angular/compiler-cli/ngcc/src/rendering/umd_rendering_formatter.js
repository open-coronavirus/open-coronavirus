(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/umd_rendering_formatter", ["require", "exports", "tslib", "canonical-path", "typescript", "@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter", "@angular/compiler-cli/ngcc/src/rendering/utils"], factory);
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
    var canonical_path_1 = require("canonical-path");
    var ts = require("typescript");
    var esm5_rendering_formatter_1 = require("@angular/compiler-cli/ngcc/src/rendering/esm5_rendering_formatter");
    var utils_1 = require("@angular/compiler-cli/ngcc/src/rendering/utils");
    /**
     * A RenderingFormatter that works with UMD files, instead of `import` and `export` statements
     * the module is an IIFE with a factory function call with dependencies, which are defined in a
     * wrapper function for AMD, CommonJS and global module formats.
     */
    var UmdRenderingFormatter = /** @class */ (function (_super) {
        tslib_1.__extends(UmdRenderingFormatter, _super);
        function UmdRenderingFormatter(umdHost, isCore) {
            var _this = _super.call(this, umdHost, isCore) || this;
            _this.umdHost = umdHost;
            return _this;
        }
        /**
         *  Add the imports to the UMD module IIFE.
         */
        UmdRenderingFormatter.prototype.addImports = function (output, imports, file) {
            // Assume there is only one UMD module in the file
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var wrapperFunction = umdModule.wrapperFn;
            // We need to add new `require()` calls for each import in the CommonJS initializer
            renderCommonJsDependencies(output, wrapperFunction, imports);
            renderAmdDependencies(output, wrapperFunction, imports);
            renderGlobalDependencies(output, wrapperFunction, imports);
            renderFactoryParameters(output, wrapperFunction, imports);
        };
        /**
         * Add the exports to the bottom of the UMD module factory function.
         */
        UmdRenderingFormatter.prototype.addExports = function (output, entryPointBasePath, exports, importManager, file) {
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var factoryFunction = umdModule.factoryFn;
            var lastStatement = factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
            var insertionPoint = lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
            exports.forEach(function (e) {
                var basePath = utils_1.stripExtension(e.from);
                var relativePath = './' + canonical_path_1.relative(canonical_path_1.dirname(entryPointBasePath), basePath);
                var namedImport = entryPointBasePath !== basePath ?
                    importManager.generateNamedImport(relativePath, e.identifier) :
                    { symbol: e.identifier, moduleImport: null };
                var importNamespace = namedImport.moduleImport ? namedImport.moduleImport + "." : '';
                var exportStr = "\nexports." + e.identifier + " = " + importNamespace + namedImport.symbol + ";";
                output.appendRight(insertionPoint, exportStr);
            });
        };
        /**
         * Add the constants to the top of the UMD factory function.
         */
        UmdRenderingFormatter.prototype.addConstants = function (output, constants, file) {
            if (constants === '') {
                return;
            }
            var umdModule = this.umdHost.getUmdModule(file);
            if (!umdModule) {
                return;
            }
            var factoryFunction = umdModule.factoryFn;
            var firstStatement = factoryFunction.body.statements[0];
            var insertionPoint = firstStatement ? firstStatement.getStart() : factoryFunction.body.getStart() + 1;
            output.appendLeft(insertionPoint, '\n' + constants + '\n');
        };
        return UmdRenderingFormatter;
    }(esm5_rendering_formatter_1.Esm5RenderingFormatter));
    exports.UmdRenderingFormatter = UmdRenderingFormatter;
    /**
     * Add dependencies to the CommonJS part of the UMD wrapper function.
     */
    function renderCommonJsDependencies(output, wrapperFunction, imports) {
        var conditional = find(wrapperFunction.body.statements[0], isCommonJSConditional);
        if (!conditional) {
            return;
        }
        var factoryCall = conditional.whenTrue;
        var injectionPoint = factoryCall.getEnd() -
            1; // Backup one char to account for the closing parenthesis on the call
        imports.forEach(function (i) { return output.appendLeft(injectionPoint, ",require('" + i.specifier + "')"); });
    }
    /**
     * Add dependencies to the AMD part of the UMD wrapper function.
     */
    function renderAmdDependencies(output, wrapperFunction, imports) {
        var conditional = find(wrapperFunction.body.statements[0], isAmdConditional);
        if (!conditional) {
            return;
        }
        var dependencyArray = conditional.whenTrue.arguments[1];
        if (!dependencyArray || !ts.isArrayLiteralExpression(dependencyArray)) {
            return;
        }
        var injectionPoint = dependencyArray.getEnd() -
            1; // Backup one char to account for the closing square bracket on the array
        imports.forEach(function (i) { return output.appendLeft(injectionPoint, ",'" + i.specifier + "'"); });
    }
    /**
     * Add dependencies to the global part of the UMD wrapper function.
     */
    function renderGlobalDependencies(output, wrapperFunction, imports) {
        var globalFactoryCall = find(wrapperFunction.body.statements[0], isGlobalFactoryCall);
        if (!globalFactoryCall) {
            return;
        }
        // Backup one char to account for the closing parenthesis after the argument list of the call.
        var injectionPoint = globalFactoryCall.getEnd() - 1;
        imports.forEach(function (i) { return output.appendLeft(injectionPoint, ",global." + getGlobalIdentifier(i)); });
    }
    /**
     * Add dependency parameters to the UMD factory function.
     */
    function renderFactoryParameters(output, wrapperFunction, imports) {
        var wrapperCall = wrapperFunction.parent;
        var secondArgument = wrapperCall.arguments[1];
        if (!secondArgument) {
            return;
        }
        // Be resilient to the factory being inside parentheses
        var factoryFunction = ts.isParenthesizedExpression(secondArgument) ? secondArgument.expression : secondArgument;
        if (!ts.isFunctionExpression(factoryFunction)) {
            return;
        }
        var parameters = factoryFunction.parameters;
        var injectionPoint = parameters[parameters.length - 1].getEnd();
        imports.forEach(function (i) { return output.appendLeft(injectionPoint, "," + i.qualifier); });
    }
    /**
     * Is this node the CommonJS conditional expression in the UMD wrapper?
     */
    function isCommonJSConditional(value) {
        if (!ts.isConditionalExpression(value)) {
            return false;
        }
        if (!ts.isBinaryExpression(value.condition) ||
            value.condition.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken) {
            return false;
        }
        if (!oneOfBinaryConditions(value.condition, function (exp) { return isTypeOf(exp, 'exports', 'module'); })) {
            return false;
        }
        if (!ts.isCallExpression(value.whenTrue) || !ts.isIdentifier(value.whenTrue.expression)) {
            return false;
        }
        return value.whenTrue.expression.text === 'factory';
    }
    /**
     * Is this node the AMD conditional expression in the UMD wrapper?
     */
    function isAmdConditional(value) {
        if (!ts.isConditionalExpression(value)) {
            return false;
        }
        if (!ts.isBinaryExpression(value.condition) ||
            value.condition.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken) {
            return false;
        }
        if (!oneOfBinaryConditions(value.condition, function (exp) { return isTypeOf(exp, 'define'); })) {
            return false;
        }
        if (!ts.isCallExpression(value.whenTrue) || !ts.isIdentifier(value.whenTrue.expression)) {
            return false;
        }
        return value.whenTrue.expression.text === 'define';
    }
    /**
     * Is this node the call to setup the global dependencies in the UMD wrapper?
     */
    function isGlobalFactoryCall(value) {
        if (ts.isCallExpression(value) && !!value.parent) {
            // Be resilient to the value being inside parentheses
            var expression = ts.isParenthesizedExpression(value.parent) ? value.parent : value;
            return !!expression.parent && ts.isConditionalExpression(expression.parent) &&
                expression.parent.whenFalse === expression;
        }
        else {
            return false;
        }
    }
    function getGlobalIdentifier(i) {
        return i.specifier.replace('@angular/', 'ng.').replace(/^\//, '');
    }
    function find(node, test) {
        return test(node) ? node : node.forEachChild(function (child) { return find(child, test); });
    }
    function oneOfBinaryConditions(node, test) {
        return test(node.left) || test(node.right);
    }
    function isTypeOf(node) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        return ts.isBinaryExpression(node) && ts.isTypeOfExpression(node.left) &&
            ts.isIdentifier(node.left.expression) && types.indexOf(node.left.expression.text) !== -1;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW1kX3JlbmRlcmluZ19mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcmVuZGVyaW5nL3VtZF9yZW5kZXJpbmdfZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILGlEQUFpRDtJQUNqRCwrQkFBaUM7SUFLakMsOEdBQWtFO0lBQ2xFLHdFQUF1QztJQUt2Qzs7OztPQUlHO0lBQ0g7UUFBMkMsaURBQXNCO1FBQy9ELCtCQUFzQixPQUEwQixFQUFFLE1BQWU7WUFBakUsWUFBcUUsa0JBQU0sT0FBTyxFQUFFLE1BQU0sQ0FBQyxTQUFHO1lBQXhFLGFBQU8sR0FBUCxPQUFPLENBQW1COztRQUE2QyxDQUFDO1FBRTlGOztXQUVHO1FBQ0gsMENBQVUsR0FBVixVQUFXLE1BQW1CLEVBQUUsT0FBaUIsRUFBRSxJQUFtQjtZQUNwRSxrREFBa0Q7WUFDbEQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDZCxPQUFPO2FBQ1I7WUFFRCxJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBRTVDLG1GQUFtRjtZQUNuRiwwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdELHFCQUFxQixDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEQsd0JBQXdCLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzRCx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRDs7V0FFRztRQUNILDBDQUFVLEdBQVYs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Q0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQUMsQ0FBUztRQUNwQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxTQUFTLElBQUksQ0FBSSxJQUFhLEVBQUUsSUFBNEM7UUFDMUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLElBQUksQ0FBSSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsU0FBUyxxQkFBcUIsQ0FDMUIsSUFBeUIsRUFBRSxJQUE0QztRQUN6RSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsU0FBUyxRQUFRLENBQUMsSUFBbUI7UUFBRSxlQUFrQjthQUFsQixVQUFrQixFQUFsQixxQkFBa0IsRUFBbEIsSUFBa0I7WUFBbEIsOEJBQWtCOztRQUN2RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsRSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtkaXJuYW1lLCByZWxhdGl2ZX0gZnJvbSAnY2Fub25pY2FsLXBhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgTWFnaWNTdHJpbmcgZnJvbSAnbWFnaWMtc3RyaW5nJztcbmltcG9ydCB7SW1wb3J0LCBJbXBvcnRNYW5hZ2VyfSBmcm9tICcuLi8uLi8uLi9zcmMvbmd0c2MvdHJhbnNsYXRvcic7XG5pbXBvcnQge0V4cG9ydEluZm99IGZyb20gJy4uL2FuYWx5c2lzL3ByaXZhdGVfZGVjbGFyYXRpb25zX2FuYWx5emVyJztcbmltcG9ydCB7VW1kUmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvdW1kX2hvc3QnO1xuaW1wb3J0IHtFc201UmVuZGVyaW5nRm9ybWF0dGVyfSBmcm9tICcuL2VzbTVfcmVuZGVyaW5nX2Zvcm1hdHRlcic7XG5pbXBvcnQge3N0cmlwRXh0ZW5zaW9ufSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBDb21tb25Kc0NvbmRpdGlvbmFsID0gdHMuQ29uZGl0aW9uYWxFeHByZXNzaW9uICYge3doZW5UcnVlOiB0cy5DYWxsRXhwcmVzc2lvbn07XG50eXBlIEFtZENvbmRpdGlvbmFsID0gdHMuQ29uZGl0aW9uYWxFeHByZXNzaW9uICYge3doZW5UcnVlOiB0cy5DYWxsRXhwcmVzc2lvbn07XG5cbi8qKlxuICogQSBSZW5kZXJpbmdGb3JtYXR0ZXIgdGhhdCB3b3JrcyB3aXRoIFVNRCBmaWxlcywgaW5zdGVhZCBvZiBgaW1wb3J0YCBhbmQgYGV4cG9ydGAgc3RhdGVtZW50c1xuICogdGhlIG1vZHVsZSBpcyBhbiBJSUZFIHdpdGggYSBmYWN0b3J5IGZ1bmN0aW9uIGNhbGwgd2l0aCBkZXBlbmRlbmNpZXMsIHdoaWNoIGFyZSBkZWZpbmVkIGluIGFcbiAqIHdyYXBwZXIgZnVuY3Rpb24gZm9yIEFNRCwgQ29tbW9uSlMgYW5kIGdsb2JhbCBtb2R1bGUgZm9ybWF0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFVtZFJlbmRlcmluZ0Zvcm1hdHRlciBleHRlbmRzIEVzbTVSZW5kZXJpbmdGb3JtYXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdW1kSG9zdDogVW1kUmVmbGVjdGlvbkhvc3QsIGlzQ29yZTogYm9vbGVhbikgeyBzdXBlcih1bWRIb3N0LCBpc0NvcmUpOyB9XG5cbiAgLyoqXG4gICAqICBBZGQgdGhlIGltcG9ydHMgdG8gdGhlIFVNRCBtb2R1bGUgSUlGRS5cbiAgICovXG4gIGFkZEltcG9ydHMob3V0cHV0OiBNYWdpY1N0cmluZywgaW1wb3J0czogSW1wb3J0W10sIGZpbGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICAvLyBBc3N1bWUgdGhlcmUgaXMgb25seSBvbmUgVU1EIG1vZHVsZSBpbiB0aGUgZmlsZVxuICAgIGNvbnN0IHVtZE1vZHVsZSA9IHRoaXMudW1kSG9zdC5nZXRVbWRNb2R1bGUoZmlsZSk7XG4gICAgaWYgKCF1bWRNb2R1bGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3cmFwcGVyRnVuY3Rpb24gPSB1bWRNb2R1bGUud3JhcHBlckZuO1xuXG4gICAgLy8gV2UgbmVlZCB0byBhZGQgbmV3IGByZXF1aXJlKClgIGNhbGxzIGZvciBlYWNoIGltcG9ydCBpbiB0aGUgQ29tbW9uSlMgaW5pdGlhbGl6ZXJcbiAgICByZW5kZXJDb21tb25Kc0RlcGVuZGVuY2llcyhvdXRwdXQsIHdyYXBwZXJGdW5jdGlvbiwgaW1wb3J0cyk7XG4gICAgcmVuZGVyQW1kRGVwZW5kZW5jaWVzKG91dHB1dCwgd3JhcHBlckZ1bmN0aW9uLCBpbXBvcnRzKTtcbiAgICByZW5kZXJHbG9iYWxEZXBlbmRlbmNpZXMob3V0cHV0LCB3cmFwcGVyRnVuY3Rpb24sIGltcG9ydHMpO1xuICAgIHJlbmRlckZhY3RvcnlQYXJhbWV0ZXJzKG91dHB1dCwgd3JhcHBlckZ1bmN0aW9uLCBpbXBvcnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGV4cG9ydHMgdG8gdGhlIGJvdHRvbSBvZiB0aGUgVU1EIG1vZHVsZSBmYWN0b3J5IGZ1bmN0aW9uLlxuICAgKi9cbiAgYWRkRXhwb3J0cyhcbiAgICAgIG91dHB1dDogTWFnaWNTdHJpbmcsIGVudHJ5UG9pbnRCYXNlUGF0aDogc3RyaW5nLCBleHBvcnRzOiBFeHBvcnRJbmZvW10sXG4gICAgICBpbXBvcnRNYW5hZ2VyOiBJbXBvcnRNYW5hZ2VyLCBmaWxlOiB0cy5Tb3VyY2VGaWxlKTogdm9pZCB7XG4gICAgY29uc3QgdW1kTW9kdWxlID0gdGhpcy51bWRIb3N0LmdldFVtZE1vZHVsZShmaWxlKTtcbiAgICBpZiAoIXVtZE1vZHVsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmYWN0b3J5RnVuY3Rpb24gPSB1bWRNb2R1bGUuZmFjdG9yeUZuO1xuICAgIGNvbnN0IGxhc3RTdGF0ZW1lbnQgPVxuICAgICAgICBmYWN0b3J5RnVuY3Rpb24uYm9keS5zdGF0ZW1lbnRzW2ZhY3RvcnlGdW5jdGlvbi5ib2R5LnN0YXRlbWVudHMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgaW5zZXJ0aW9uUG9pbnQgPVxuICAgICAgICBsYXN0U3RhdGVtZW50ID8gbGFzdFN0YXRlbWVudC5nZXRFbmQoKSA6IGZhY3RvcnlGdW5jdGlvbi5ib2R5LmdldEVuZCgpIC0gMTtcbiAgICBleHBvcnRzLmZvckVhY2goZSA9PiB7XG4gICAgICBjb25zdCBiYXNlUGF0aCA9IHN0cmlwRXh0ZW5zaW9uKGUuZnJvbSk7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSAnLi8nICsgcmVsYXRpdmUoZGlybmFtZShlbnRyeVBvaW50QmFzZVBhdGgpLCBiYXNlUGF0aCk7XG4gICAgICBjb25zdCBuYW1lZEltcG9ydCA9IGVudHJ5UG9pbnRCYXNlUGF0aCAhPT0gYmFzZVBhdGggP1xuICAgICAgICAgIGltcG9ydE1hbmFnZXIuZ2VuZXJhdGVOYW1lZEltcG9ydChyZWxhdGl2ZVBhdGgsIGUuaWRlbnRpZmllcikgOlxuICAgICAgICAgIHtzeW1ib2w6IGUuaWRlbnRpZmllciwgbW9kdWxlSW1wb3J0OiBudWxsfTtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWVzcGFjZSA9IG5hbWVkSW1wb3J0Lm1vZHVsZUltcG9ydCA/IGAke25hbWVkSW1wb3J0Lm1vZHVsZUltcG9ydH0uYCA6ICcnO1xuICAgICAgY29uc3QgZXhwb3J0U3RyID0gYFxcbmV4cG9ydHMuJHtlLmlkZW50aWZpZXJ9ID0gJHtpbXBvcnROYW1lc3BhY2V9JHtuYW1lZEltcG9ydC5zeW1ib2x9O2A7XG4gICAgICBvdXRwdXQuYXBwZW5kUmlnaHQoaW5zZXJ0aW9uUG9pbnQsIGV4cG9ydFN0cik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBjb25zdGFudHMgdG8gdGhlIHRvcCBvZiB0aGUgVU1EIGZhY3RvcnkgZnVuY3Rpb24uXG4gICAqL1xuICBhZGRDb25zdGFudHMob3V0cHV0OiBNYWdpY1N0cmluZywgY29uc3RhbnRzOiBzdHJpbmcsIGZpbGU6IHRzLlNvdXJjZUZpbGUpOiB2b2lkIHtcbiAgICBpZiAoY29uc3RhbnRzID09PSAnJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB1bWRNb2R1bGUgPSB0aGlzLnVtZEhvc3QuZ2V0VW1kTW9kdWxlKGZpbGUpO1xuICAgIGlmICghdW1kTW9kdWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZhY3RvcnlGdW5jdGlvbiA9IHVtZE1vZHVsZS5mYWN0b3J5Rm47XG4gICAgY29uc3QgZmlyc3RTdGF0ZW1lbnQgPSBmYWN0b3J5RnVuY3Rpb24uYm9keS5zdGF0ZW1lbnRzWzBdO1xuICAgIGNvbnN0IGluc2VydGlvblBvaW50ID1cbiAgICAgICAgZmlyc3RTdGF0ZW1lbnQgPyBmaXJzdFN0YXRlbWVudC5nZXRTdGFydCgpIDogZmFjdG9yeUZ1bmN0aW9uLmJvZHkuZ2V0U3RhcnQoKSArIDE7XG4gICAgb3V0cHV0LmFwcGVuZExlZnQoaW5zZXJ0aW9uUG9pbnQsICdcXG4nICsgY29uc3RhbnRzICsgJ1xcbicpO1xuICB9XG59XG5cbi8qKlxuICogQWRkIGRlcGVuZGVuY2llcyB0byB0aGUgQ29tbW9uSlMgcGFydCBvZiB0aGUgVU1EIHdyYXBwZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckNvbW1vbkpzRGVwZW5kZW5jaWVzKFxuICAgIG91dHB1dDogTWFnaWNTdHJpbmcsIHdyYXBwZXJGdW5jdGlvbjogdHMuRnVuY3Rpb25FeHByZXNzaW9uLCBpbXBvcnRzOiBJbXBvcnRbXSkge1xuICBjb25zdCBjb25kaXRpb25hbCA9IGZpbmQod3JhcHBlckZ1bmN0aW9uLmJvZHkuc3RhdGVtZW50c1swXSwgaXNDb21tb25KU0NvbmRpdGlvbmFsKTtcbiAgaWYgKCFjb25kaXRpb25hbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBmYWN0b3J5Q2FsbCA9IGNvbmRpdGlvbmFsLndoZW5UcnVlO1xuICBjb25zdCBpbmplY3Rpb25Qb2ludCA9IGZhY3RvcnlDYWxsLmdldEVuZCgpIC1cbiAgICAgIDE7ICAvLyBCYWNrdXAgb25lIGNoYXIgdG8gYWNjb3VudCBmb3IgdGhlIGNsb3NpbmcgcGFyZW50aGVzaXMgb24gdGhlIGNhbGxcbiAgaW1wb3J0cy5mb3JFYWNoKGkgPT4gb3V0cHV0LmFwcGVuZExlZnQoaW5qZWN0aW9uUG9pbnQsIGAscmVxdWlyZSgnJHtpLnNwZWNpZmllcn0nKWApKTtcbn1cblxuLyoqXG4gKiBBZGQgZGVwZW5kZW5jaWVzIHRvIHRoZSBBTUQgcGFydCBvZiB0aGUgVU1EIHdyYXBwZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckFtZERlcGVuZGVuY2llcyhcbiAgICBvdXRwdXQ6IE1hZ2ljU3RyaW5nLCB3cmFwcGVyRnVuY3Rpb246IHRzLkZ1bmN0aW9uRXhwcmVzc2lvbiwgaW1wb3J0czogSW1wb3J0W10pIHtcbiAgY29uc3QgY29uZGl0aW9uYWwgPSBmaW5kKHdyYXBwZXJGdW5jdGlvbi5ib2R5LnN0YXRlbWVudHNbMF0sIGlzQW1kQ29uZGl0aW9uYWwpO1xuICBpZiAoIWNvbmRpdGlvbmFsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRlcGVuZGVuY3lBcnJheSA9IGNvbmRpdGlvbmFsLndoZW5UcnVlLmFyZ3VtZW50c1sxXTtcbiAgaWYgKCFkZXBlbmRlbmN5QXJyYXkgfHwgIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihkZXBlbmRlbmN5QXJyYXkpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGluamVjdGlvblBvaW50ID0gZGVwZW5kZW5jeUFycmF5LmdldEVuZCgpIC1cbiAgICAgIDE7ICAvLyBCYWNrdXAgb25lIGNoYXIgdG8gYWNjb3VudCBmb3IgdGhlIGNsb3Npbmcgc3F1YXJlIGJyYWNrZXQgb24gdGhlIGFycmF5XG4gIGltcG9ydHMuZm9yRWFjaChpID0+IG91dHB1dC5hcHBlbmRMZWZ0KGluamVjdGlvblBvaW50LCBgLCcke2kuc3BlY2lmaWVyfSdgKSk7XG59XG5cbi8qKlxuICogQWRkIGRlcGVuZGVuY2llcyB0byB0aGUgZ2xvYmFsIHBhcnQgb2YgdGhlIFVNRCB3cmFwcGVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiByZW5kZXJHbG9iYWxEZXBlbmRlbmNpZXMoXG4gICAgb3V0cHV0OiBNYWdpY1N0cmluZywgd3JhcHBlckZ1bmN0aW9uOiB0cy5GdW5jdGlvbkV4cHJlc3Npb24sIGltcG9ydHM6IEltcG9ydFtdKSB7XG4gIGNvbnN0IGdsb2JhbEZhY3RvcnlDYWxsID0gZmluZCh3cmFwcGVyRnVuY3Rpb24uYm9keS5zdGF0ZW1lbnRzWzBdLCBpc0dsb2JhbEZhY3RvcnlDYWxsKTtcbiAgaWYgKCFnbG9iYWxGYWN0b3J5Q2FsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBCYWNrdXAgb25lIGNoYXIgdG8gYWNjb3VudCBmb3IgdGhlIGNsb3NpbmcgcGFyZW50aGVzaXMgYWZ0ZXIgdGhlIGFyZ3VtZW50IGxpc3Qgb2YgdGhlIGNhbGwuXG4gIGNvbnN0IGluamVjdGlvblBvaW50ID0gZ2xvYmFsRmFjdG9yeUNhbGwuZ2V0RW5kKCkgLSAxO1xuICBpbXBvcnRzLmZvckVhY2goaSA9PiBvdXRwdXQuYXBwZW5kTGVmdChpbmplY3Rpb25Qb2ludCwgYCxnbG9iYWwuJHtnZXRHbG9iYWxJZGVudGlmaWVyKGkpfWApKTtcbn1cblxuLyoqXG4gKiBBZGQgZGVwZW5kZW5jeSBwYXJhbWV0ZXJzIHRvIHRoZSBVTUQgZmFjdG9yeSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyRmFjdG9yeVBhcmFtZXRlcnMoXG4gICAgb3V0cHV0OiBNYWdpY1N0cmluZywgd3JhcHBlckZ1bmN0aW9uOiB0cy5GdW5jdGlvbkV4cHJlc3Npb24sIGltcG9ydHM6IEltcG9ydFtdKSB7XG4gIGNvbnN0IHdyYXBwZXJDYWxsID0gd3JhcHBlckZ1bmN0aW9uLnBhcmVudCBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgY29uc3Qgc2Vjb25kQXJndW1lbnQgPSB3cmFwcGVyQ2FsbC5hcmd1bWVudHNbMV07XG4gIGlmICghc2Vjb25kQXJndW1lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCZSByZXNpbGllbnQgdG8gdGhlIGZhY3RvcnkgYmVpbmcgaW5zaWRlIHBhcmVudGhlc2VzXG4gIGNvbnN0IGZhY3RvcnlGdW5jdGlvbiA9XG4gICAgICB0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKHNlY29uZEFyZ3VtZW50KSA/IHNlY29uZEFyZ3VtZW50LmV4cHJlc3Npb24gOiBzZWNvbmRBcmd1bWVudDtcbiAgaWYgKCF0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihmYWN0b3J5RnVuY3Rpb24pKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSBmYWN0b3J5RnVuY3Rpb24ucGFyYW1ldGVycztcbiAgY29uc3QgaW5qZWN0aW9uUG9pbnQgPSBwYXJhbWV0ZXJzW3BhcmFtZXRlcnMubGVuZ3RoIC0gMV0uZ2V0RW5kKCk7XG4gIGltcG9ydHMuZm9yRWFjaChpID0+IG91dHB1dC5hcHBlbmRMZWZ0KGluamVjdGlvblBvaW50LCBgLCR7aS5xdWFsaWZpZXJ9YCkpO1xufVxuXG4vKipcbiAqIElzIHRoaXMgbm9kZSB0aGUgQ29tbW9uSlMgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiBpbiB0aGUgVU1EIHdyYXBwZXI/XG4gKi9cbmZ1bmN0aW9uIGlzQ29tbW9uSlNDb25kaXRpb25hbCh2YWx1ZTogdHMuTm9kZSk6IHZhbHVlIGlzIENvbW1vbkpzQ29uZGl0aW9uYWwge1xuICBpZiAoIXRzLmlzQ29uZGl0aW9uYWxFeHByZXNzaW9uKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIXRzLmlzQmluYXJ5RXhwcmVzc2lvbih2YWx1ZS5jb25kaXRpb24pIHx8XG4gICAgICB2YWx1ZS5jb25kaXRpb24ub3BlcmF0b3JUb2tlbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkFtcGVyc2FuZEFtcGVyc2FuZFRva2VuKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghb25lT2ZCaW5hcnlDb25kaXRpb25zKHZhbHVlLmNvbmRpdGlvbiwgKGV4cCkgPT4gaXNUeXBlT2YoZXhwLCAnZXhwb3J0cycsICdtb2R1bGUnKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCF0cy5pc0NhbGxFeHByZXNzaW9uKHZhbHVlLndoZW5UcnVlKSB8fCAhdHMuaXNJZGVudGlmaWVyKHZhbHVlLndoZW5UcnVlLmV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWx1ZS53aGVuVHJ1ZS5leHByZXNzaW9uLnRleHQgPT09ICdmYWN0b3J5Jztcbn1cblxuLyoqXG4gKiBJcyB0aGlzIG5vZGUgdGhlIEFNRCBjb25kaXRpb25hbCBleHByZXNzaW9uIGluIHRoZSBVTUQgd3JhcHBlcj9cbiAqL1xuZnVuY3Rpb24gaXNBbWRDb25kaXRpb25hbCh2YWx1ZTogdHMuTm9kZSk6IHZhbHVlIGlzIEFtZENvbmRpdGlvbmFsIHtcbiAgaWYgKCF0cy5pc0NvbmRpdGlvbmFsRXhwcmVzc2lvbih2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCF0cy5pc0JpbmFyeUV4cHJlc3Npb24odmFsdWUuY29uZGl0aW9uKSB8fFxuICAgICAgdmFsdWUuY29uZGl0aW9uLm9wZXJhdG9yVG9rZW4ua2luZCAhPT0gdHMuU3ludGF4S2luZC5BbXBlcnNhbmRBbXBlcnNhbmRUb2tlbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIW9uZU9mQmluYXJ5Q29uZGl0aW9ucyh2YWx1ZS5jb25kaXRpb24sIChleHApID0+IGlzVHlwZU9mKGV4cCwgJ2RlZmluZScpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24odmFsdWUud2hlblRydWUpIHx8ICF0cy5pc0lkZW50aWZpZXIodmFsdWUud2hlblRydWUuZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHZhbHVlLndoZW5UcnVlLmV4cHJlc3Npb24udGV4dCA9PT0gJ2RlZmluZSc7XG59XG5cbi8qKlxuICogSXMgdGhpcyBub2RlIHRoZSBjYWxsIHRvIHNldHVwIHRoZSBnbG9iYWwgZGVwZW5kZW5jaWVzIGluIHRoZSBVTUQgd3JhcHBlcj9cbiAqL1xuZnVuY3Rpb24gaXNHbG9iYWxGYWN0b3J5Q2FsbCh2YWx1ZTogdHMuTm9kZSk6IHZhbHVlIGlzIHRzLkNhbGxFeHByZXNzaW9uIHtcbiAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24odmFsdWUpICYmICEhdmFsdWUucGFyZW50KSB7XG4gICAgLy8gQmUgcmVzaWxpZW50IHRvIHRoZSB2YWx1ZSBiZWluZyBpbnNpZGUgcGFyZW50aGVzZXNcbiAgICBjb25zdCBleHByZXNzaW9uID0gdHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbih2YWx1ZS5wYXJlbnQpID8gdmFsdWUucGFyZW50IDogdmFsdWU7XG4gICAgcmV0dXJuICEhZXhwcmVzc2lvbi5wYXJlbnQgJiYgdHMuaXNDb25kaXRpb25hbEV4cHJlc3Npb24oZXhwcmVzc2lvbi5wYXJlbnQpICYmXG4gICAgICAgIGV4cHJlc3Npb24ucGFyZW50LndoZW5GYWxzZSA9PT0gZXhwcmVzc2lvbjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0R2xvYmFsSWRlbnRpZmllcihpOiBJbXBvcnQpIHtcbiAgcmV0dXJuIGkuc3BlY2lmaWVyLnJlcGxhY2UoJ0Bhbmd1bGFyLycsICduZy4nKS5yZXBsYWNlKC9eXFwvLywgJycpO1xufVxuXG5mdW5jdGlvbiBmaW5kPFQ+KG5vZGU6IHRzLk5vZGUsIHRlc3Q6IChub2RlOiB0cy5Ob2RlKSA9PiBub2RlIGlzIHRzLk5vZGUgJiBUKTogVHx1bmRlZmluZWQge1xuICByZXR1cm4gdGVzdChub2RlKSA/IG5vZGUgOiBub2RlLmZvckVhY2hDaGlsZChjaGlsZCA9PiBmaW5kPFQ+KGNoaWxkLCB0ZXN0KSk7XG59XG5cbmZ1bmN0aW9uIG9uZU9mQmluYXJ5Q29uZGl0aW9ucyhcbiAgICBub2RlOiB0cy5CaW5hcnlFeHByZXNzaW9uLCB0ZXN0OiAoZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbikgPT4gYm9vbGVhbikge1xuICByZXR1cm4gdGVzdChub2RlLmxlZnQpIHx8IHRlc3Qobm9kZS5yaWdodCk7XG59XG5cbmZ1bmN0aW9uIGlzVHlwZU9mKG5vZGU6IHRzLkV4cHJlc3Npb24sIC4uLnR5cGVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHMuaXNCaW5hcnlFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzVHlwZU9mRXhwcmVzc2lvbihub2RlLmxlZnQpICYmXG4gICAgICB0cy5pc0lkZW50aWZpZXIobm9kZS5sZWZ0LmV4cHJlc3Npb24pICYmIHR5cGVzLmluZGV4T2Yobm9kZS5sZWZ0LmV4cHJlc3Npb24udGV4dCkgIT09IC0xO1xufVxuIl19