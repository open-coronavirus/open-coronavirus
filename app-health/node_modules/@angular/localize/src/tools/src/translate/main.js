#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/localize/src/tools/src/translate/main", ["require", "exports", "glob", "path", "yargs", "@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler", "@angular/localize/src/tools/src/translate/output_path", "@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler", "@angular/localize/src/tools/src/translate/translation_files/translation_loader", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser", "@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser", "@angular/localize/src/tools/src/translate/translator", "@angular/localize/src/tools/src/diagnostics"], factory);
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
    var glob = require("glob");
    var path_1 = require("path");
    var yargs = require("yargs");
    var asset_translation_handler_1 = require("@angular/localize/src/tools/src/translate/asset_files/asset_translation_handler");
    var output_path_1 = require("@angular/localize/src/tools/src/translate/output_path");
    var source_file_translation_handler_1 = require("@angular/localize/src/tools/src/translate/source_files/source_file_translation_handler");
    var translation_loader_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_loader");
    var simple_json_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser");
    var xliff1_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff1_translation_parser");
    var xliff2_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser");
    var xtb_translation_parser_1 = require("@angular/localize/src/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser");
    var translator_1 = require("@angular/localize/src/tools/src/translate/translator");
    var diagnostics_1 = require("@angular/localize/src/tools/src/diagnostics");
    if (require.main === module) {
        var args = process.argv.slice(2);
        var options = yargs
            .option('r', {
            alias: 'root',
            required: true,
            describe: 'The root path of the files to translate, either absolute or relative to the current working directory. E.g. `dist/en`.',
        })
            .option('s', {
            alias: 'source',
            required: true,
            describe: 'A glob pattern indicating what files to translate, relative to the `root` path. E.g. `bundles/**/*`.',
        })
            .option('l', {
            alias: 'source-locale',
            describe: 'The source locale of the application. If this is provided then a copy of the application will be created with no translation but just the `$localize` calls stripped out.',
        })
            .option('t', {
            alias: 'translations',
            required: true,
            array: true,
            describe: 'A list of paths to the translation files to load, either absolute or relative to the current working directory.\n' +
                'E.g. "-t src/locale/messages.en.xlf src/locale/messages.fr.xlf src/locale/messages.de.xlf".',
        })
            .option('target-locales', {
            array: true,
            describe: 'A list of target locales for the translation files, which will override any target locale parsed from the translation file.\n' +
                'E.g. "-t en fr de".',
        })
            .option('o', {
            alias: 'outputPath',
            required: true,
            describe: 'A output path pattern to where the translated files will be written. The marker `{{LOCALE}}` will be replaced with the target locale. E.g. `dist/{{LOCALE}}`.'
        })
            .option('m', {
            alias: 'missingTranslation',
            describe: 'How to handle missing translations.',
            choices: ['error', 'warning', 'ignore'],
            default: 'warning',
        })
            .help()
            .parse(args);
        var sourceRootPath = options['r'];
        var sourceFilePaths = glob.sync(options['s'], { absolute: true, cwd: sourceRootPath, nodir: true });
        var translationFilePaths = options['t'];
        var outputPathFn = output_path_1.getOutputPathFn(options['o']);
        var diagnostics = new diagnostics_1.Diagnostics();
        var missingTranslation = options['m'];
        var sourceLocale = options['l'];
        var translationFileLocales = options['target-locales'] || [];
        translateFiles({ sourceRootPath: sourceRootPath, sourceFilePaths: sourceFilePaths, translationFilePaths: translationFilePaths, translationFileLocales: translationFileLocales,
            outputPathFn: outputPathFn, diagnostics: diagnostics, missingTranslation: missingTranslation, sourceLocale: sourceLocale });
        diagnostics.messages.forEach(function (m) { return console.warn(m.type + ": " + m.message); });
        process.exit(diagnostics.hasErrors ? 1 : 0);
    }
    function translateFiles(_a) {
        var sourceRootPath = _a.sourceRootPath, sourceFilePaths = _a.sourceFilePaths, translationFilePaths = _a.translationFilePaths, translationFileLocales = _a.translationFileLocales, outputPathFn = _a.outputPathFn, diagnostics = _a.diagnostics, missingTranslation = _a.missingTranslation, sourceLocale = _a.sourceLocale;
        var translationLoader = new translation_loader_1.TranslationLoader([
            new xliff2_translation_parser_1.Xliff2TranslationParser(),
            new xliff1_translation_parser_1.Xliff1TranslationParser(),
            new xtb_translation_parser_1.XtbTranslationParser(),
            new simple_json_translation_parser_1.SimpleJsonTranslationParser(),
        ], diagnostics);
        var resourceProcessor = new translator_1.Translator([
            new source_file_translation_handler_1.SourceFileTranslationHandler({ missingTranslation: missingTranslation }),
            new asset_translation_handler_1.AssetTranslationHandler(),
        ], diagnostics);
        var translations = translationLoader.loadBundles(translationFilePaths, translationFileLocales);
        sourceRootPath = path_1.resolve(sourceRootPath);
        resourceProcessor.translateFiles(sourceFilePaths, sourceRootPath, outputPathFn, translations, sourceLocale);
    }
    exports.translateFiles = translateFiles;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xvY2FsaXplL3NyYy90b29scy9zcmMvdHJhbnNsYXRlL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ0E7Ozs7OztPQU1HO0lBQ0gsMkJBQTZCO0lBQzdCLDZCQUE2QjtJQUM3Qiw2QkFBK0I7SUFFL0IsNkhBQWdGO0lBQ2hGLHFGQUE0RDtJQUM1RCwwSUFBNEY7SUFFNUYscUhBQXlFO0lBQ3pFLGlLQUFtSDtJQUNuSCx1SkFBMEc7SUFDMUcsdUpBQTBHO0lBQzFHLGlKQUFvRztJQUNwRyxtRkFBd0M7SUFDeEMsMkVBQTJDO0lBRTNDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDM0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQ1QsS0FBSzthQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUNKLHdIQUF3SDtTQUM3SCxDQUFDO2FBQ0QsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQ0osc0dBQXNHO1NBQzNHLENBQUM7YUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLGVBQWU7WUFDdEIsUUFBUSxFQUNKLDJLQUEySztTQUNoTCxDQUFDO2FBRUQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNYLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsS0FBSyxFQUFFLElBQUk7WUFDWCxRQUFRLEVBQ0osbUhBQW1IO2dCQUNuSCw2RkFBNkY7U0FDbEcsQ0FBQzthQUVE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QUFjLENBQUMsQ0FBQztRQUN6QyxpQkFBaUIsQ0FBQyxjQUFjLENBQzVCLGVBQWUsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBdkJELHdDQXVCQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge0Fzc2V0VHJhbnNsYXRpb25IYW5kbGVyfSBmcm9tICcuL2Fzc2V0X2ZpbGVzL2Fzc2V0X3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtnZXRPdXRwdXRQYXRoRm4sIE91dHB1dFBhdGhGbn0gZnJvbSAnLi9vdXRwdXRfcGF0aCc7XG5pbXBvcnQge1NvdXJjZUZpbGVUcmFuc2xhdGlvbkhhbmRsZXJ9IGZyb20gJy4vc291cmNlX2ZpbGVzL3NvdXJjZV9maWxlX3RyYW5zbGF0aW9uX2hhbmRsZXInO1xuaW1wb3J0IHtNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneX0gZnJvbSAnLi9zb3VyY2VfZmlsZXMvc291cmNlX2ZpbGVfdXRpbHMnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbkxvYWRlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9sb2FkZXInO1xuaW1wb3J0IHtTaW1wbGVKc29uVHJhbnNsYXRpb25QYXJzZXJ9IGZyb20gJy4vdHJhbnNsYXRpb25fZmlsZXMvdHJhbnNsYXRpb25fcGFyc2Vycy9zaW1wbGVfanNvbl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjFUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMV90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYbGlmZjJUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3hsaWZmMl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtYdGJUcmFuc2xhdGlvblBhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGlvbl9maWxlcy90cmFuc2xhdGlvbl9wYXJzZXJzL3h0Yl90cmFuc2xhdGlvbl9wYXJzZXInO1xuaW1wb3J0IHtUcmFuc2xhdG9yfSBmcm9tICcuL3RyYW5zbGF0b3InO1xuaW1wb3J0IHtEaWFnbm9zdGljc30gZnJvbSAnLi4vZGlhZ25vc3RpY3MnO1xuXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgY29uc3QgYXJncyA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTtcbiAgY29uc3Qgb3B0aW9ucyA9XG4gICAgICB5YXJnc1xuICAgICAgICAgIC5vcHRpb24oJ3InLCB7XG4gICAgICAgICAgICBhbGlhczogJ3Jvb3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnVGhlIHJvb3QgcGF0aCBvZiB0aGUgZmlsZXMgdG8gdHJhbnNsYXRlLCBlaXRoZXIgYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEUuZy4gYGRpc3QvZW5gLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAub3B0aW9uKCdzJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTpcbiAgICAgICAgICAgICAgICAnQSBnbG9iIHBhdHRlcm4gaW5kaWNhdGluZyB3aGF0IGZpbGVzIHRvIHRyYW5zbGF0ZSwgcmVsYXRpdmUgdG8gdGhlIGByb290YCBwYXRoLiBFLmcuIGBidW5kbGVzLyoqLypgLicsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5vcHRpb24oJ2wnLCB7XG4gICAgICAgICAgICBhbGlhczogJ3NvdXJjZS1sb2NhbGUnLFxuICAgICAgICAgICAgZGVzY3JpYmU6XG4gICAgICAgICAgICAgICAgJ1RoZSBzb3VyY2UgbG9jYWxlIG9mIHRoZSBhcHBsaWNhdGlvbi4gSWYgdGhpcyBpcyBwcm92aWRlZCB0aGVuIGEgY29weSBvZiB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBjcmVhdGVkIHdpdGggbm8gdHJhbnNsYXRpb24gYnV0IGp1c3QgdGhlIGAkbG9jYWxpemVgIGNhbGxzIHN0cmlwcGVkIG91dC4nLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCd0Jywge1xuICAgICAgICAgICAgYWxpYXM6ICd0cmFuc2xhdGlvbnMnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBhcnJheTogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGxpc3Qgb2YgcGF0aHMgdG8gdGhlIHRyYW5zbGF0aW9uIGZpbGVzIHRvIGxvYWQsIGVpdGhlciBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBcIi10IHNyYy9sb2NhbGUvbWVzc2FnZXMuZW4ueGxmIHNyYy9sb2NhbGUvbWVzc2FnZXMuZnIueGxmIHNyYy9sb2NhbGUvbWVzc2FnZXMuZGUueGxmXCIuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbigndGFyZ2V0LWxvY2FsZXMnLCB7XG4gICAgICAgICAgICBhcnJheTogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIGxpc3Qgb2YgdGFyZ2V0IGxvY2FsZXMgZm9yIHRoZSB0cmFuc2xhdGlvbiBmaWxlcywgd2hpY2ggd2lsbCBvdmVycmlkZSBhbnkgdGFyZ2V0IGxvY2FsZSBwYXJzZWQgZnJvbSB0aGUgdHJhbnNsYXRpb24gZmlsZS5cXG4nICtcbiAgICAgICAgICAgICAgICAnRS5nLiBcIi10IGVuIGZyIGRlXCIuJyxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgLm9wdGlvbignbycsIHtcbiAgICAgICAgICAgIGFsaWFzOiAnb3V0cHV0UGF0aCcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGRlc2NyaWJlOlxuICAgICAgICAgICAgICAgICdBIG91dHB1dCBwYXRoIHBhdHRlcm4gdG8gd2hlcmUgdGhlIHRyYW5zbGF0ZWQgZmlsZXMgd2lsbCBiZSB3cml0dGVuLiBUaGUgbWFya2VyIGB7e0xPQ0FMRX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHRhcmdldCBsb2NhbGUuIEUuZy4gYGRpc3Qve3tMT0NBTEV9fWAuJ1xuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAub3B0aW9uKCdtJywge1xuICAgICAgICAgICAgYWxpYXM6ICdtaXNzaW5nVHJhbnNsYXRpb24nLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdIb3cgdG8gaGFuZGxlIG1pc3NpbmcgdHJhbnNsYXRpb25zLicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaWdub3JlJ10sXG4gICAgICAgICAgICBkZWZhdWx0OiAnd2FybmluZycsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC5oZWxwKClcbiAgICAgICAgICAucGFyc2UoYXJncyk7XG5cbiAgY29uc3Qgc291cmNlUm9vdFBhdGggPSBvcHRpb25zWydyJ107XG4gIGNvbnN0IHNvdXJjZUZpbGVQYXRocyA9XG4gICAgICBnbG9iLnN5bmMob3B0aW9uc1sncyddLCB7YWJzb2x1dGU6IHRydWUsIGN3ZDogc291cmNlUm9vdFBhdGgsIG5vZGlyOiB0cnVlfSk7XG4gIGNvbnN0IHRyYW5zbGF0aW9uRmlsZVBhdGhzOiBzdHJpbmdbXSA9IG9wdGlvbnNbJ3QnXTtcbiAgY29uc3Qgb3V0cHV0UGF0aEZuID0gZ2V0T3V0cHV0UGF0aEZuKG9wdGlvbnNbJ28nXSk7XG4gIGNvbnN0IGRpYWdub3N0aWNzID0gbmV3IERpYWdub3N0aWNzKCk7XG4gIGNvbnN0IG1pc3NpbmdUcmFuc2xhdGlvbjogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kgPSBvcHRpb25zWydtJ107XG4gIGNvbnN0IHNvdXJjZUxvY2FsZTogc3RyaW5nfHVuZGVmaW5lZCA9IG9wdGlvbnNbJ2wnXTtcbiAgY29uc3QgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogc3RyaW5nW10gPSBvcHRpb25zWyd0YXJnZXQtbG9jYWxlcyddIHx8IFtdO1xuXG4gIHRyYW5zbGF0ZUZpbGVzKHtzb3VyY2VSb290UGF0aCwgc291cmNlRmlsZVBhdGhzLCB0cmFuc2xhdGlvbkZpbGVQYXRocywgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyxcbiAgICAgICAgICAgICAgICAgIG91dHB1dFBhdGhGbiwgZGlhZ25vc3RpY3MsIG1pc3NpbmdUcmFuc2xhdGlvbiwgc291cmNlTG9jYWxlfSk7XG5cbiAgZGlhZ25vc3RpY3MubWVzc2FnZXMuZm9yRWFjaChtID0+IGNvbnNvbGUud2FybihgJHttLnR5cGV9OiAke20ubWVzc2FnZX1gKSk7XG4gIHByb2Nlc3MuZXhpdChkaWFnbm9zdGljcy5oYXNFcnJvcnMgPyAxIDogMCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRlRmlsZXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSByb290IHBhdGggb2YgdGhlIGZpbGVzIHRvIHRyYW5zbGF0ZSwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmdcbiAgICogZGlyZWN0b3J5LiBFLmcuIGBkaXN0L2VuYFxuICAgKi9cbiAgc291cmNlUm9vdFBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBmaWxlcyB0byB0cmFuc2xhdGUsIHJlbGF0aXZlIHRvIHRoZSBgcm9vdGAgcGF0aC5cbiAgICovXG4gIHNvdXJjZUZpbGVQYXRoczogc3RyaW5nW107XG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBwYXRocyB0byB0aGUgdHJhbnNsYXRpb24gZmlsZXMgdG8gbG9hZCwgZWl0aGVyIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50XG4gICAqIHdvcmtpbmcgZGlyZWN0b3J5LlxuICAgKi9cbiAgdHJhbnNsYXRpb25GaWxlUGF0aHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogQSBjb2xsZWN0aW9uIG9mIHRoZSB0YXJnZXQgbG9jYWxlcyBmb3IgdGhlIHRyYW5zbGF0aW9uIGZpbGVzLlxuICAgKi9cbiAgdHJhbnNsYXRpb25GaWxlTG9jYWxlczogKHN0cmluZ3x1bmRlZmluZWQpW107XG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgdGhlIG91dHB1dCBwYXRoIG9mIHdoZXJlIHRoZSB0cmFuc2xhdGVkIGZpbGVzIHdpbGwgYmUgd3JpdHRlbi5cbiAgICogVGhlIG1hcmtlciBge3tMT0NBTEV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSB0YXJnZXQgbG9jYWxlLiBFLmcuIGBkaXN0L3t7TE9DQUxFfX1gLlxuICAgKi9cbiAgb3V0cHV0UGF0aEZuOiBPdXRwdXRQYXRoRm47XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgdGhhdCB3aWxsIHJlY2VpdmUgYW55IGRpYWdub3N0aWNzIG1lc3NhZ2VzIGR1ZSB0byB0aGUgcHJvY2Vzc2luZy5cbiAgICovXG4gIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljcztcbiAgLyoqXG4gICAqIEhvdyB0byBoYW5kbGUgbWlzc2luZyB0cmFuc2xhdGlvbnMuXG4gICAqL1xuICBtaXNzaW5nVHJhbnNsYXRpb246IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5O1xuICAvKipcbiAgICogVGhlIGxvY2FsZSBvZiB0aGUgc291cmNlIGZpbGVzLlxuICAgKiBJZiB0aGlzIGlzIHByb3ZpZGVkIHRoZW4gYSBjb3B5IG9mIHRoZSBhcHBsaWNhdGlvbiB3aWxsIGJlIGNyZWF0ZWQgd2l0aCBubyB0cmFuc2xhdGlvbiBidXQganVzdFxuICAgKiB0aGUgYCRsb2NhbGl6ZWAgY2FsbHMgc3RyaXBwZWQgb3V0LlxuICAgKi9cbiAgc291cmNlTG9jYWxlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlRmlsZXMoe3NvdXJjZVJvb3RQYXRoLCBzb3VyY2VGaWxlUGF0aHMsIHRyYW5zbGF0aW9uRmlsZVBhdGhzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGlvbkZpbGVMb2NhbGVzLCBvdXRwdXRQYXRoRm4sIGRpYWdub3N0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nVHJhbnNsYXRpb24sIHNvdXJjZUxvY2FsZX06IFRyYW5zbGF0ZUZpbGVzT3B0aW9ucykge1xuICBjb25zdCB0cmFuc2xhdGlvbkxvYWRlciA9IG5ldyBUcmFuc2xhdGlvbkxvYWRlcihcbiAgICAgIFtcbiAgICAgICAgbmV3IFhsaWZmMlRyYW5zbGF0aW9uUGFyc2VyKCksXG4gICAgICAgIG5ldyBYbGlmZjFUcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgICBuZXcgWHRiVHJhbnNsYXRpb25QYXJzZXIoKSxcbiAgICAgICAgbmV3IFNpbXBsZUpzb25UcmFuc2xhdGlvblBhcnNlcigpLFxuICAgICAgXSxcbiAgICAgIGRpYWdub3N0aWNzKTtcblxuICBjb25zdCByZXNvdXJjZVByb2Nlc3NvciA9IG5ldyBUcmFuc2xhdG9yKFxuICAgICAgW1xuICAgICAgICBuZXcgU291cmNlRmlsZVRyYW5zbGF0aW9uSGFuZGxlcih7bWlzc2luZ1RyYW5zbGF0aW9ufSksXG4gICAgICAgIG5ldyBBc3NldFRyYW5zbGF0aW9uSGFuZGxlcigpLFxuICAgICAgXSxcbiAgICAgIGRpYWdub3N0aWNzKTtcblxuICBjb25zdCB0cmFuc2xhdGlvbnMgPSB0cmFuc2xhdGlvbkxvYWRlci5sb2FkQnVuZGxlcyh0cmFuc2xhdGlvbkZpbGVQYXRocywgdHJhbnNsYXRpb25GaWxlTG9jYWxlcyk7XG4gIHNvdXJjZVJvb3RQYXRoID0gcmVzb2x2ZShzb3VyY2VSb290UGF0aCk7XG4gIHJlc291cmNlUHJvY2Vzc29yLnRyYW5zbGF0ZUZpbGVzKFxuICAgICAgc291cmNlRmlsZVBhdGhzLCBzb3VyY2VSb290UGF0aCwgb3V0cHV0UGF0aEZuLCB0cmFuc2xhdGlvbnMsIHNvdXJjZUxvY2FsZSk7XG59XG4iXX0=