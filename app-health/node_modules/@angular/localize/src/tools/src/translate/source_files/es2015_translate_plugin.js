(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/source_files/es2015_translate_plugin", ["require", "exports", "@angular/localize/src/tools/src/translate/source_files/source_file_utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var source_file_utils_1 = require("@angular/localize/src/tools/src/translate/source_files/source_file_utils");
    function makeEs2015TranslatePlugin(diagnostics, translations, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.missingTranslation, missingTranslation = _c === void 0 ? 'error' : _c, _d = _b.localizeName, localizeName = _d === void 0 ? '$localize' : _d;
        return {
            visitor: {
                TaggedTemplateExpression: function (path) {
                    try {
                        var tag = path.get('tag');
                        if (source_file_utils_1.isLocalize(tag, localizeName)) {
                            var messageParts = source_file_utils_1.unwrapMessagePartsFromTemplateLiteral(path.node.quasi.quasis);
                            var translated = source_file_utils_1.translate(diagnostics, translations, messageParts, path.node.quasi.expressions, missingTranslation);
                            path.replaceWith(source_file_utils_1.buildLocalizeReplacement(translated[0], translated[1]));
                        }
                    }
                    catch (e) {
                        if (source_file_utils_1.isBabelParseError(e)) {
                            // If we get a BabelParseError here then something went wrong with Babel itself
                            // since there must be something wrong with the structure of the AST generated
                            // by Babel parsing a TaggedTemplateExpression.
                            throw source_file_utils_1.buildCodeFrameError(path, e);
                        }
                    }
                }
            }
        };
    }
    exports.makeEs2015TranslatePlugin = makeEs2015TranslatePlugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdG9vbHMvc3JjL3RyYW5zbGF0ZS9zb3VyY2VfZmlsZXMvZXMyMDE1X3RyYW5zbGF0ZV9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFXQSw4R0FBMkw7SUFFM0wsU0FBZ0IseUJBQXlCLENBQ3JDLFdBQXdCLEVBQUUsWUFBZ0QsRUFDMUUsRUFBdUY7WUFBdkYsNEJBQXVGLEVBQXRGLDBCQUE0QixFQUE1QixpREFBNEIsRUFBRSxvQkFBMEIsRUFBMUIsK0NBQTBCO1FBRTNELE9BQU87WUFDTCxPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQXhCLFVBQXlCLElBQXdDO29CQUMvRCxJQUFJO3dCQUNGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzVCLElBQUksOEJBQVUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLEVBQUU7NEJBQ2pDLElBQU0sWUFBWSxHQUFHLHlEQUFxQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUNuRixJQUFNLFVBQVUsR0FBRyw2QkFBUyxDQUN4QixXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQ3BFLGtCQUFrQixDQUFDLENBQUM7NEJBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsNENBQXdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzFFO3FCQUNGO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLElBQUkscUNBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ3hCLCtFQUErRTs0QkFDL0UsOEVBQThFOzRCQUM5RSwrQ0FBK0M7NEJBQy9DLE1BQU0sdUNBQW1CLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNwQztxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQTNCRCw4REEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge8m1UGFyc2VkVHJhbnNsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2xvY2FsaXplJztcbmltcG9ydCB7Tm9kZVBhdGgsIFBsdWdpbk9ian0gZnJvbSAnQGJhYmVsL2NvcmUnO1xuaW1wb3J0IHtUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb259IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5pbXBvcnQge0RpYWdub3N0aWNzfSBmcm9tICcuLi8uLi9kaWFnbm9zdGljcyc7XG5pbXBvcnQge1RyYW5zbGF0ZVBsdWdpbk9wdGlvbnMsIGJ1aWxkQ29kZUZyYW1lRXJyb3IsIGJ1aWxkTG9jYWxpemVSZXBsYWNlbWVudCwgaXNCYWJlbFBhcnNlRXJyb3IsIGlzTG9jYWxpemUsIHRyYW5zbGF0ZSwgdW53cmFwTWVzc2FnZVBhcnRzRnJvbVRlbXBsYXRlTGl0ZXJhbH0gZnJvbSAnLi9zb3VyY2VfZmlsZV91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRXMyMDE1VHJhbnNsYXRlUGx1Z2luKFxuICAgIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCDJtVBhcnNlZFRyYW5zbGF0aW9uPixcbiAgICB7bWlzc2luZ1RyYW5zbGF0aW9uID0gJ2Vycm9yJywgbG9jYWxpemVOYW1lID0gJyRsb2NhbGl6ZSd9OiBUcmFuc2xhdGVQbHVnaW5PcHRpb25zID0ge30pOlxuICAgIFBsdWdpbk9iaiB7XG4gIHJldHVybiB7XG4gICAgdmlzaXRvcjoge1xuICAgICAgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uKHBhdGg6IE5vZGVQYXRoPFRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbj4pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB0YWcgPSBwYXRoLmdldCgndGFnJyk7XG4gICAgICAgICAgaWYgKGlzTG9jYWxpemUodGFnLCBsb2NhbGl6ZU5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlUGFydHMgPSB1bndyYXBNZXNzYWdlUGFydHNGcm9tVGVtcGxhdGVMaXRlcmFsKHBhdGgubm9kZS5xdWFzaS5xdWFzaXMpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlZCA9IHRyYW5zbGF0ZShcbiAgICAgICAgICAgICAgICBkaWFnbm9zdGljcywgdHJhbnNsYXRpb25zLCBtZXNzYWdlUGFydHMsIHBhdGgubm9kZS5xdWFzaS5leHByZXNzaW9ucyxcbiAgICAgICAgICAgICAgICBtaXNzaW5nVHJhbnNsYXRpb24pO1xuICAgICAgICAgICAgcGF0aC5yZXBsYWNlV2l0aChidWlsZExvY2FsaXplUmVwbGFjZW1lbnQodHJhbnNsYXRlZFswXSwgdHJhbnNsYXRlZFsxXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChpc0JhYmVsUGFyc2VFcnJvcihlKSkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZ2V0IGEgQmFiZWxQYXJzZUVycm9yIGhlcmUgdGhlbiBzb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIEJhYmVsIGl0c2VsZlxuICAgICAgICAgICAgLy8gc2luY2UgdGhlcmUgbXVzdCBiZSBzb21ldGhpbmcgd3Jvbmcgd2l0aCB0aGUgc3RydWN0dXJlIG9mIHRoZSBBU1QgZ2VuZXJhdGVkXG4gICAgICAgICAgICAvLyBieSBCYWJlbCBwYXJzaW5nIGEgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uLlxuICAgICAgICAgICAgdGhyb3cgYnVpbGRDb2RlRnJhbWVFcnJvcihwYXRoLCBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=