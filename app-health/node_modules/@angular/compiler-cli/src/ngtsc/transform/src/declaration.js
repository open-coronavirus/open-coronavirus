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
        define("@angular/compiler-cli/src/ngtsc/transform/src/declaration", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/src/ngtsc/transform/src/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ts = require("typescript");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var utils_1 = require("@angular/compiler-cli/src/ngtsc/transform/src/utils");
    function declarationTransformFactory(compilation) {
        return function (context) {
            return function (fileOrBundle) {
                if (ts.isBundle(fileOrBundle)) {
                    // Only attempt to transform source files.
                    return fileOrBundle;
                }
                return compilation.transformedDtsFor(fileOrBundle, context);
            };
        };
    }
    exports.declarationTransformFactory = declarationTransformFactory;
    /**
     * Processes .d.ts file text and adds static field declarations, with types.
     */
    var DtsFileTransformer = /** @class */ (function () {
        function DtsFileTransformer(importRewriter, importPrefix) {
            this.importRewriter = importRewriter;
            this.ivyFields = new Map();
            this.imports = new translator_1.ImportManager(importRewriter, importPrefix);
        }
        /**
         * Track that a static field was added to the code for a class.
         */
        DtsFileTransformer.prototype.recordStaticField = function (name, decls) { this.ivyFields.set(name, decls); };
        /**
         * Transform the declaration file and add any declarations which were recorded.
         */
        DtsFileTransformer.prototype.transform = function (file, context) {
            var _this = this;
            var visitor = function (node) {
                // This class declaration needs to have fields added to it.
                if (ts.isClassDeclaration(node) && node.name !== undefined &&
                    _this.ivyFields.has(node.name.text)) {
                    var decls = _this.ivyFields.get(node.name.text);
                    var newMembers = decls.map(function (decl) {
                        var modifiers = [ts.createModifier(ts.SyntaxKind.StaticKeyword)];
                        var typeRef = translator_1.translateType(decl.type, _this.imports);
                        return ts.createProperty(undefined, modifiers, decl.name, undefined, typeRef, undefined);
                    });
                    return ts.updateClassDeclaration(node, node.decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, tslib_1.__spread(node.members, newMembers));
                }
                // Otherwise return node as is.
                return ts.visitEachChild(node, visitor, context);
            };
            // Recursively scan through the AST and add all class members needed.
            var sf = ts.visitNode(file, visitor);
            // Add new imports for this file.
            return utils_1.addImports(this.imports, sf);
        };
        return DtsFileTransformer;
    }());
    exports.DtsFileTransformer = DtsFileTransformer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvZGVjbGFyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0lBRUgsK0JBQWlDO0lBR2pDLHlFQUE4RDtJQUk5RCw2RUFBbUM7SUFJbkMsU0FBZ0IsMkJBQTJCLENBQUMsV0FBMkI7UUFFckUsT0FBTyxVQUFDLE9BQWlDO1lBQ3ZDLE9BQU8sVUFBQyxZQUFZO2dCQUNsQixJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQzdCLDBDQUEwQztvQkFDMUMsT0FBTyxZQUFZLENBQUM7aUJBQ3JCO2dCQUNELE9BQU8sV0FBVyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDO0lBWEQsa0VBV0M7SUFFRDs7T0FFRztJQUNIO1FBSUUsNEJBQW9CLGNBQThCLEVBQUUsWUFBcUI7WUFBckQsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1lBSDFDLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztZQUlyRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksMEJBQWEsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVEOztXQUVHO1FBQ0gsOENBQWlCLEdBQWpCLFVBQWtCLElBQVksRUFBRSxLQUFzQixJQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEc7O1dBRUc7UUFDSCxzQ0FBUyxHQUFULFVBQVUsSUFBbUIsRUFBRSxPQUFpQztZQUFoRSxpQkEwQkM7WUF6QkMsSUFBTSxPQUFPLEdBQWUsVUFBQyxJQUFhO2dCQUN4QywyREFBMkQ7Z0JBQzNELElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztvQkFDdEQsS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdEMsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQztvQkFDbkQsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7d0JBQy9CLElBQU0sU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLElBQU0sT0FBTyxHQUFHLDBCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZELE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDM0YsQ0FBQyxDQUFDLENBQUM7b0JBRUgsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUNyRSxJQUFJLENBQUMsZUFBZSxtQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFLLFVBQVUsRUFBRSxDQUFDO2lCQUM3RDtnQkFFRCwrQkFBK0I7Z0JBQy9CLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQztZQUVGLHFFQUFxRTtZQUNyRSxJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUV2QyxpQ0FBaUM7WUFDakMsT0FBTyxrQkFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNILHlCQUFDO0lBQUQsQ0FBQyxBQTNDRCxJQTJDQztJQTNDWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0ltcG9ydFJld3JpdGVyfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7SW1wb3J0TWFuYWdlciwgdHJhbnNsYXRlVHlwZX0gZnJvbSAnLi4vLi4vdHJhbnNsYXRvcic7XG5cbmltcG9ydCB7Q29tcGlsZVJlc3VsdH0gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtJdnlDb21waWxhdGlvbn0gZnJvbSAnLi9jb21waWxhdGlvbic7XG5pbXBvcnQge2FkZEltcG9ydHN9IGZyb20gJy4vdXRpbHMnO1xuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY2xhcmF0aW9uVHJhbnNmb3JtRmFjdG9yeShjb21waWxhdGlvbjogSXZ5Q29tcGlsYXRpb24pOlxuICAgIHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5CdW5kbGV8dHMuU291cmNlRmlsZT4ge1xuICByZXR1cm4gKGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCkgPT4ge1xuICAgIHJldHVybiAoZmlsZU9yQnVuZGxlKSA9PiB7XG4gICAgICBpZiAodHMuaXNCdW5kbGUoZmlsZU9yQnVuZGxlKSkge1xuICAgICAgICAvLyBPbmx5IGF0dGVtcHQgdG8gdHJhbnNmb3JtIHNvdXJjZSBmaWxlcy5cbiAgICAgICAgcmV0dXJuIGZpbGVPckJ1bmRsZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21waWxhdGlvbi50cmFuc2Zvcm1lZER0c0ZvcihmaWxlT3JCdW5kbGUsIGNvbnRleHQpO1xuICAgIH07XG4gIH07XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIC5kLnRzIGZpbGUgdGV4dCBhbmQgYWRkcyBzdGF0aWMgZmllbGQgZGVjbGFyYXRpb25zLCB3aXRoIHR5cGVzLlxuICovXG5leHBvcnQgY2xhc3MgRHRzRmlsZVRyYW5zZm9ybWVyIHtcbiAgcHJpdmF0ZSBpdnlGaWVsZHMgPSBuZXcgTWFwPHN0cmluZywgQ29tcGlsZVJlc3VsdFtdPigpO1xuICBwcml2YXRlIGltcG9ydHM6IEltcG9ydE1hbmFnZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpbXBvcnRSZXdyaXRlcjogSW1wb3J0UmV3cml0ZXIsIGltcG9ydFByZWZpeD86IHN0cmluZykge1xuICAgIHRoaXMuaW1wb3J0cyA9IG5ldyBJbXBvcnRNYW5hZ2VyKGltcG9ydFJld3JpdGVyLCBpbXBvcnRQcmVmaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIHRoYXQgYSBzdGF0aWMgZmllbGQgd2FzIGFkZGVkIHRvIHRoZSBjb2RlIGZvciBhIGNsYXNzLlxuICAgKi9cbiAgcmVjb3JkU3RhdGljRmllbGQobmFtZTogc3RyaW5nLCBkZWNsczogQ29tcGlsZVJlc3VsdFtdKTogdm9pZCB7IHRoaXMuaXZ5RmllbGRzLnNldChuYW1lLCBkZWNscyk7IH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIHRoZSBkZWNsYXJhdGlvbiBmaWxlIGFuZCBhZGQgYW55IGRlY2xhcmF0aW9ucyB3aGljaCB3ZXJlIHJlY29yZGVkLlxuICAgKi9cbiAgdHJhbnNmb3JtKGZpbGU6IHRzLlNvdXJjZUZpbGUsIGNvbnRleHQ6IHRzLlRyYW5zZm9ybWF0aW9uQ29udGV4dCk6IHRzLlNvdXJjZUZpbGUge1xuICAgIGNvbnN0IHZpc2l0b3I6IHRzLlZpc2l0b3IgPSAobm9kZTogdHMuTm9kZSk6IHRzLlZpc2l0UmVzdWx0PHRzLk5vZGU+ID0+IHtcbiAgICAgIC8vIFRoaXMgY2xhc3MgZGVjbGFyYXRpb24gbmVlZHMgdG8gaGF2ZSBmaWVsZHMgYWRkZWQgdG8gaXQuXG4gICAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpICYmIG5vZGUubmFtZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgdGhpcy5pdnlGaWVsZHMuaGFzKG5vZGUubmFtZS50ZXh0KSkge1xuICAgICAgICBjb25zdCBkZWNscyA9IHRoaXMuaXZ5RmllbGRzLmdldChub2RlLm5hbWUudGV4dCkgITtcbiAgICAgICAgY29uc3QgbmV3TWVtYmVycyA9IGRlY2xzLm1hcChkZWNsID0+IHtcbiAgICAgICAgICBjb25zdCBtb2RpZmllcnMgPSBbdHMuY3JlYXRlTW9kaWZpZXIodHMuU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKV07XG4gICAgICAgICAgY29uc3QgdHlwZVJlZiA9IHRyYW5zbGF0ZVR5cGUoZGVjbC50eXBlLCB0aGlzLmltcG9ydHMpO1xuICAgICAgICAgIHJldHVybiB0cy5jcmVhdGVQcm9wZXJ0eSh1bmRlZmluZWQsIG1vZGlmaWVycywgZGVjbC5uYW1lLCB1bmRlZmluZWQsIHR5cGVSZWYsIHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cy51cGRhdGVDbGFzc0RlY2xhcmF0aW9uKFxuICAgICAgICAgICAgbm9kZSwgbm9kZS5kZWNvcmF0b3JzLCBub2RlLm1vZGlmaWVycywgbm9kZS5uYW1lLCBub2RlLnR5cGVQYXJhbWV0ZXJzLFxuICAgICAgICAgICAgbm9kZS5oZXJpdGFnZUNsYXVzZXMsIFsuLi5ub2RlLm1lbWJlcnMsIC4uLm5ld01lbWJlcnNdKTtcbiAgICAgIH1cblxuICAgICAgLy8gT3RoZXJ3aXNlIHJldHVybiBub2RlIGFzIGlzLlxuICAgICAgcmV0dXJuIHRzLnZpc2l0RWFjaENoaWxkKG5vZGUsIHZpc2l0b3IsIGNvbnRleHQpO1xuICAgIH07XG5cbiAgICAvLyBSZWN1cnNpdmVseSBzY2FuIHRocm91Z2ggdGhlIEFTVCBhbmQgYWRkIGFsbCBjbGFzcyBtZW1iZXJzIG5lZWRlZC5cbiAgICBjb25zdCBzZiA9IHRzLnZpc2l0Tm9kZShmaWxlLCB2aXNpdG9yKTtcblxuICAgIC8vIEFkZCBuZXcgaW1wb3J0cyBmb3IgdGhpcyBmaWxlLlxuICAgIHJldHVybiBhZGRJbXBvcnRzKHRoaXMuaW1wb3J0cywgc2YpO1xuICB9XG59XG4iXX0=