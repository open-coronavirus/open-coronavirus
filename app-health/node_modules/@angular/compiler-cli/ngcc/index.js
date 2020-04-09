(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/ngcc/src/main", "@angular/compiler-cli/ngcc/src/packages/build_marker", "@angular/compiler-cli/ngcc/src/logging/console_logger"], factory);
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
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var main_1 = require("@angular/compiler-cli/ngcc/src/main");
    var build_marker_1 = require("@angular/compiler-cli/ngcc/src/packages/build_marker");
    var console_logger_1 = require("@angular/compiler-cli/ngcc/src/logging/console_logger");
    exports.ConsoleLogger = console_logger_1.ConsoleLogger;
    exports.LogLevel = console_logger_1.LogLevel;
    function hasBeenProcessed(packageJson, format) {
        // Recreate the file system on each call to reset the cache
        file_system_1.setFileSystem(new file_system_1.CachedFileSystem(new file_system_1.NodeJSFileSystem()));
        return build_marker_1.hasBeenProcessed(packageJson, format);
    }
    exports.hasBeenProcessed = hasBeenProcessed;
    function process() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Recreate the file system on each call to reset the cache
        file_system_1.setFileSystem(new file_system_1.CachedFileSystem(new file_system_1.NodeJSFileSystem()));
        return main_1.mainNgcc.apply(void 0, tslib_1.__spread(args));
    }
    exports.process = process;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwyRUFBMkY7SUFFM0YsNERBQW9DO0lBQ3BDLHFGQUFrRjtJQUdsRix3RkFBcUU7SUFBN0QseUNBQUEsYUFBYSxDQUFBO0lBQUUsb0NBQUEsUUFBUSxDQUFBO0lBSy9CLFNBQWdCLGdCQUFnQixDQUFDLFdBQW1CLEVBQUUsTUFBYztRQUNsRSwyREFBMkQ7UUFDM0QsMkJBQWEsQ0FBQyxJQUFJLDhCQUFnQixDQUFDLElBQUksOEJBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUQsT0FBTywrQkFBaUIsQ0FBQyxXQUFvQyxFQUFFLE1BQWdDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBSkQsNENBSUM7SUFFRCxTQUFnQixPQUFPO1FBQUMsY0FBb0M7YUFBcEMsVUFBb0MsRUFBcEMscUJBQW9DLEVBQXBDLElBQW9DO1lBQXBDLHlCQUFvQzs7UUFDMUQsMkRBQTJEO1FBQzNELDJCQUFhLENBQUMsSUFBSSw4QkFBZ0IsQ0FBQyxJQUFJLDhCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sZUFBUSxnQ0FBSSxJQUFJLEdBQUU7SUFDM0IsQ0FBQztJQUpELDBCQUlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtDYWNoZWRGaWxlU3lzdGVtLCBOb2RlSlNGaWxlU3lzdGVtLCBzZXRGaWxlU3lzdGVtfSBmcm9tICcuLi9zcmMvbmd0c2MvZmlsZV9zeXN0ZW0nO1xuXG5pbXBvcnQge21haW5OZ2NjfSBmcm9tICcuL3NyYy9tYWluJztcbmltcG9ydCB7aGFzQmVlblByb2Nlc3NlZCBhcyBfaGFzQmVlblByb2Nlc3NlZH0gZnJvbSAnLi9zcmMvcGFja2FnZXMvYnVpbGRfbWFya2VyJztcbmltcG9ydCB7RW50cnlQb2ludEpzb25Qcm9wZXJ0eSwgRW50cnlQb2ludFBhY2thZ2VKc29ufSBmcm9tICcuL3NyYy9wYWNrYWdlcy9lbnRyeV9wb2ludCc7XG5cbmV4cG9ydCB7Q29uc29sZUxvZ2dlciwgTG9nTGV2ZWx9IGZyb20gJy4vc3JjL2xvZ2dpbmcvY29uc29sZV9sb2dnZXInO1xuZXhwb3J0IHtMb2dnZXJ9IGZyb20gJy4vc3JjL2xvZ2dpbmcvbG9nZ2VyJztcbmV4cG9ydCB7TmdjY09wdGlvbnN9IGZyb20gJy4vc3JjL21haW4nO1xuZXhwb3J0IHtQYXRoTWFwcGluZ3N9IGZyb20gJy4vc3JjL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0JlZW5Qcm9jZXNzZWQocGFja2FnZUpzb246IG9iamVjdCwgZm9ybWF0OiBzdHJpbmcpIHtcbiAgLy8gUmVjcmVhdGUgdGhlIGZpbGUgc3lzdGVtIG9uIGVhY2ggY2FsbCB0byByZXNldCB0aGUgY2FjaGVcbiAgc2V0RmlsZVN5c3RlbShuZXcgQ2FjaGVkRmlsZVN5c3RlbShuZXcgTm9kZUpTRmlsZVN5c3RlbSgpKSk7XG4gIHJldHVybiBfaGFzQmVlblByb2Nlc3NlZChwYWNrYWdlSnNvbiBhcyBFbnRyeVBvaW50UGFja2FnZUpzb24sIGZvcm1hdCBhcyBFbnRyeVBvaW50SnNvblByb3BlcnR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3MoLi4uYXJnczogUGFyYW1ldGVyczx0eXBlb2YgbWFpbk5nY2M+KSB7XG4gIC8vIFJlY3JlYXRlIHRoZSBmaWxlIHN5c3RlbSBvbiBlYWNoIGNhbGwgdG8gcmVzZXQgdGhlIGNhY2hlXG4gIHNldEZpbGVTeXN0ZW0obmV3IENhY2hlZEZpbGVTeXN0ZW0obmV3IE5vZGVKU0ZpbGVTeXN0ZW0oKSkpO1xuICByZXR1cm4gbWFpbk5nY2MoLi4uYXJncyk7XG59XG4iXX0=