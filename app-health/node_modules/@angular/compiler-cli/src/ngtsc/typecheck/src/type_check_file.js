(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_file", ["require", "exports", "tslib", "typescript", "@angular/compiler-cli/src/ngtsc/file_system", "@angular/compiler-cli/src/ngtsc/imports", "@angular/compiler-cli/src/ngtsc/translator", "@angular/compiler-cli/src/ngtsc/typecheck/src/environment", "@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block"], factory);
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
    var ts = require("typescript");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    var imports_1 = require("@angular/compiler-cli/src/ngtsc/imports");
    var translator_1 = require("@angular/compiler-cli/src/ngtsc/translator");
    var environment_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/environment");
    var type_check_block_1 = require("@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block");
    /**
     * An `Environment` representing the single type-checking file into which most (if not all) Type
     * Check Blocks (TCBs) will be generated.
     *
     * The `TypeCheckFile` hosts multiple TCBs and allows the sharing of declarations (e.g. type
     * constructors) between them. Rather than return such declarations via `getPreludeStatements()`, it
     * hoists them to the top of the generated `ts.SourceFile`.
     */
    var TypeCheckFile = /** @class */ (function (_super) {
        tslib_1.__extends(TypeCheckFile, _super);
        function TypeCheckFile(fileName, config, refEmitter) {
            var _this = _super.call(this, config, new translator_1.ImportManager(new imports_1.NoopImportRewriter(), 'i'), refEmitter, ts.createSourceFile(fileName, '', ts.ScriptTarget.Latest, true)) || this;
            _this.fileName = fileName;
            _this.nextTcbId = 1;
            _this.tcbStatements = [];
            return _this;
        }
        TypeCheckFile.prototype.addTypeCheckBlock = function (ref, meta) {
            var fnId = ts.createIdentifier("_tcb" + this.nextTcbId++);
            var fn = type_check_block_1.generateTypeCheckBlock(this, ref, fnId, meta);
            this.tcbStatements.push(fn);
        };
        TypeCheckFile.prototype.render = function () {
            var e_1, _a, e_2, _b, e_3, _c;
            var source = this.importManager.getAllImports(this.fileName)
                .map(function (i) { return "import * as " + i.qualifier + " from '" + i.specifier + "';"; })
                .join('\n') +
                '\n\n';
            var printer = ts.createPrinter();
            source += '\n';
            try {
                for (var _d = tslib_1.__values(this.pipeInstStatements), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var stmt = _e.value;
                    source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _f = tslib_1.__values(this.typeCtorStatements), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var stmt = _g.value;
                    source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            source += '\n';
            try {
                for (var _h = tslib_1.__values(this.tcbStatements), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var stmt = _j.value;
                    source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
            // Ensure the template type-checking file is an ES module. Otherwise, it's interpreted as some
            // kind of global namespace in TS, which forces a full re-typecheck of the user's program that
            // is somehow more expensive than the initial parse.
            source += '\nexport const IS_A_MODULE = true;\n';
            return ts.createSourceFile(this.fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        };
        TypeCheckFile.prototype.getPreludeStatements = function () { return []; };
        return TypeCheckFile;
    }(environment_1.Environment));
    exports.TypeCheckFile = TypeCheckFile;
    function typeCheckFilePath(rootDirs) {
        var shortest = rootDirs.concat([]).sort(function (a, b) { return a.length - b.length; })[0];
        return file_system_1.join(shortest, '__ng_typecheck__.ts');
    }
    exports.typeCheckFilePath = typeCheckFilePath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9jaGVja19maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy90eXBlY2hlY2svc3JjL3R5cGVfY2hlY2tfZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQTs7Ozs7O09BTUc7SUFDSCwrQkFBaUM7SUFFakMsMkVBQXVEO0lBQ3ZELG1FQUE4RTtJQUU5RSx5RUFBK0M7SUFHL0MseUZBQTBDO0lBQzFDLG1HQUEwRDtJQUUxRDs7Ozs7OztPQU9HO0lBQ0g7UUFBbUMseUNBQVc7UUFJNUMsdUJBQW9CLFFBQWdCLEVBQUUsTUFBMEIsRUFBRSxVQUE0QjtZQUE5RixZQUNFLGtCQUNJLE1BQU0sRUFBRSxJQUFJLDBCQUFhLENBQUMsSUFBSSw0QkFBa0IsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFDcEUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FDckU7WUFKbUIsY0FBUSxHQUFSLFFBQVEsQ0FBUTtZQUg1QixlQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsbUJBQWEsR0FBbUIsRUFBRSxDQUFDOztRQU0zQyxDQUFDO1FBRUQseUNBQWlCLEdBQWpCLFVBQ0ksR0FBcUQsRUFBRSxJQUE0QjtZQUNyRixJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBTyxJQUFJLENBQUMsU0FBUyxFQUFJLENBQUMsQ0FBQztZQUM1RCxJQUFNLEVBQUUsR0FBRyx5Q0FBc0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsOEJBQU0sR0FBTjs7WUFDRSxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxpQkFBZSxDQUFDLENBQUMsU0FBUyxlQUFVLENBQUMsQ0FBQyxTQUFTLE9BQUksRUFBbkQsQ0FBbUQsQ0FBQztpQkFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDaEMsTUFBTSxDQUFDO1lBQ1gsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ25DLE1BQU0sSUFBSSxJQUFJLENBQUM7O2dCQUNmLEtBQW1CLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXZDLElBQU0sSUFBSSxXQUFBO29CQUNiLE1BQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNyRjs7Ozs7Ozs7OztnQkFDRCxLQUFtQixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLGtCQUFrQixDQUFBLGdCQUFBLDRCQUFFO29CQUF2QyxJQUFNLElBQUksV0FBQTtvQkFDYixNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDckY7Ozs7Ozs7OztZQUNELE1BQU0sSUFBSSxJQUFJLENBQUM7O2dCQUNmLEtBQW1CLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsYUFBYSxDQUFBLGdCQUFBLDRCQUFFO29CQUFsQyxJQUFNLElBQUksV0FBQTtvQkFDYixNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDckY7Ozs7Ozs7OztZQUVELDhGQUE4RjtZQUM5Riw4RkFBOEY7WUFDOUYsb0RBQW9EO1lBQ3BELE1BQU0sSUFBSSxzQ0FBc0MsQ0FBQztZQUVqRCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDdEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUVELDRDQUFvQixHQUFwQixjQUF5QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkQsb0JBQUM7SUFBRCxDQUFDLEFBN0NELENBQW1DLHlCQUFXLEdBNkM3QztJQTdDWSxzQ0FBYTtJQStDMUIsU0FBZ0IsaUJBQWlCLENBQUMsUUFBMEI7UUFDMUQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsT0FBTyxrQkFBSSxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFIRCw4Q0FHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0Fic29sdXRlRnNQYXRoLCBqb2lufSBmcm9tICcuLi8uLi9maWxlX3N5c3RlbSc7XG5pbXBvcnQge05vb3BJbXBvcnRSZXdyaXRlciwgUmVmZXJlbmNlLCBSZWZlcmVuY2VFbWl0dGVyfSBmcm9tICcuLi8uLi9pbXBvcnRzJztcbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge0ltcG9ydE1hbmFnZXJ9IGZyb20gJy4uLy4uL3RyYW5zbGF0b3InO1xuXG5pbXBvcnQge1R5cGVDaGVja0Jsb2NrTWV0YWRhdGEsIFR5cGVDaGVja2luZ0NvbmZpZ30gZnJvbSAnLi9hcGknO1xuaW1wb3J0IHtFbnZpcm9ubWVudH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQge2dlbmVyYXRlVHlwZUNoZWNrQmxvY2t9IGZyb20gJy4vdHlwZV9jaGVja19ibG9jayc7XG5cbi8qKlxuICogQW4gYEVudmlyb25tZW50YCByZXByZXNlbnRpbmcgdGhlIHNpbmdsZSB0eXBlLWNoZWNraW5nIGZpbGUgaW50byB3aGljaCBtb3N0IChpZiBub3QgYWxsKSBUeXBlXG4gKiBDaGVjayBCbG9ja3MgKFRDQnMpIHdpbGwgYmUgZ2VuZXJhdGVkLlxuICpcbiAqIFRoZSBgVHlwZUNoZWNrRmlsZWAgaG9zdHMgbXVsdGlwbGUgVENCcyBhbmQgYWxsb3dzIHRoZSBzaGFyaW5nIG9mIGRlY2xhcmF0aW9ucyAoZS5nLiB0eXBlXG4gKiBjb25zdHJ1Y3RvcnMpIGJldHdlZW4gdGhlbS4gUmF0aGVyIHRoYW4gcmV0dXJuIHN1Y2ggZGVjbGFyYXRpb25zIHZpYSBgZ2V0UHJlbHVkZVN0YXRlbWVudHMoKWAsIGl0XG4gKiBob2lzdHMgdGhlbSB0byB0aGUgdG9wIG9mIHRoZSBnZW5lcmF0ZWQgYHRzLlNvdXJjZUZpbGVgLlxuICovXG5leHBvcnQgY2xhc3MgVHlwZUNoZWNrRmlsZSBleHRlbmRzIEVudmlyb25tZW50IHtcbiAgcHJpdmF0ZSBuZXh0VGNiSWQgPSAxO1xuICBwcml2YXRlIHRjYlN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nLCBjb25maWc6IFR5cGVDaGVja2luZ0NvbmZpZywgcmVmRW1pdHRlcjogUmVmZXJlbmNlRW1pdHRlcikge1xuICAgIHN1cGVyKFxuICAgICAgICBjb25maWcsIG5ldyBJbXBvcnRNYW5hZ2VyKG5ldyBOb29wSW1wb3J0UmV3cml0ZXIoKSwgJ2knKSwgcmVmRW1pdHRlcixcbiAgICAgICAgdHMuY3JlYXRlU291cmNlRmlsZShmaWxlTmFtZSwgJycsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpKTtcbiAgfVxuXG4gIGFkZFR5cGVDaGVja0Jsb2NrKFxuICAgICAgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbjx0cy5DbGFzc0RlY2xhcmF0aW9uPj4sIG1ldGE6IFR5cGVDaGVja0Jsb2NrTWV0YWRhdGEpOiB2b2lkIHtcbiAgICBjb25zdCBmbklkID0gdHMuY3JlYXRlSWRlbnRpZmllcihgX3RjYiR7dGhpcy5uZXh0VGNiSWQrK31gKTtcbiAgICBjb25zdCBmbiA9IGdlbmVyYXRlVHlwZUNoZWNrQmxvY2sodGhpcywgcmVmLCBmbklkLCBtZXRhKTtcbiAgICB0aGlzLnRjYlN0YXRlbWVudHMucHVzaChmbik7XG4gIH1cblxuICByZW5kZXIoKTogdHMuU291cmNlRmlsZSB7XG4gICAgbGV0IHNvdXJjZTogc3RyaW5nID0gdGhpcy5pbXBvcnRNYW5hZ2VyLmdldEFsbEltcG9ydHModGhpcy5maWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpID0+IGBpbXBvcnQgKiBhcyAke2kucXVhbGlmaWVyfSBmcm9tICcke2kuc3BlY2lmaWVyfSc7YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpICtcbiAgICAgICAgJ1xcblxcbic7XG4gICAgY29uc3QgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcbiAgICBzb3VyY2UgKz0gJ1xcbic7XG4gICAgZm9yIChjb25zdCBzdG10IG9mIHRoaXMucGlwZUluc3RTdGF0ZW1lbnRzKSB7XG4gICAgICBzb3VyY2UgKz0gcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHN0bXQsIHRoaXMuY29udGV4dEZpbGUpICsgJ1xcbic7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc3RtdCBvZiB0aGlzLnR5cGVDdG9yU3RhdGVtZW50cykge1xuICAgICAgc291cmNlICs9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBzdG10LCB0aGlzLmNvbnRleHRGaWxlKSArICdcXG4nO1xuICAgIH1cbiAgICBzb3VyY2UgKz0gJ1xcbic7XG4gICAgZm9yIChjb25zdCBzdG10IG9mIHRoaXMudGNiU3RhdGVtZW50cykge1xuICAgICAgc291cmNlICs9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBzdG10LCB0aGlzLmNvbnRleHRGaWxlKSArICdcXG4nO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGUgdGVtcGxhdGUgdHlwZS1jaGVja2luZyBmaWxlIGlzIGFuIEVTIG1vZHVsZS4gT3RoZXJ3aXNlLCBpdCdzIGludGVycHJldGVkIGFzIHNvbWVcbiAgICAvLyBraW5kIG9mIGdsb2JhbCBuYW1lc3BhY2UgaW4gVFMsIHdoaWNoIGZvcmNlcyBhIGZ1bGwgcmUtdHlwZWNoZWNrIG9mIHRoZSB1c2VyJ3MgcHJvZ3JhbSB0aGF0XG4gICAgLy8gaXMgc29tZWhvdyBtb3JlIGV4cGVuc2l2ZSB0aGFuIHRoZSBpbml0aWFsIHBhcnNlLlxuICAgIHNvdXJjZSArPSAnXFxuZXhwb3J0IGNvbnN0IElTX0FfTU9EVUxFID0gdHJ1ZTtcXG4nO1xuXG4gICAgcmV0dXJuIHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICAgIHRoaXMuZmlsZU5hbWUsIHNvdXJjZSwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgdHJ1ZSwgdHMuU2NyaXB0S2luZC5UUyk7XG4gIH1cblxuICBnZXRQcmVsdWRlU3RhdGVtZW50cygpOiB0cy5TdGF0ZW1lbnRbXSB7IHJldHVybiBbXTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZUNoZWNrRmlsZVBhdGgocm9vdERpcnM6IEFic29sdXRlRnNQYXRoW10pOiBBYnNvbHV0ZUZzUGF0aCB7XG4gIGNvbnN0IHNob3J0ZXN0ID0gcm9vdERpcnMuY29uY2F0KFtdKS5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCAtIGIubGVuZ3RoKVswXTtcbiAgcmV0dXJuIGpvaW4oc2hvcnRlc3QsICdfX25nX3R5cGVjaGVja19fLnRzJyk7XG59XG4iXX0=