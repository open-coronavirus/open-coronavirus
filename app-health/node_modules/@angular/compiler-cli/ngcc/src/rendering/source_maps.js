(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/ngcc/src/rendering/source_maps", ["require", "exports", "convert-source-map", "source-map", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
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
    var convert_source_map_1 = require("convert-source-map");
    var source_map_1 = require("source-map");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    /**
     * Get the map from the source (note whether it is inline or external)
     */
    function extractSourceMap(fs, logger, file) {
        var inline = convert_source_map_1.commentRegex.test(file.text);
        var external = convert_source_map_1.mapFileCommentRegex.exec(file.text);
        if (inline) {
            var inlineSourceMap = convert_source_map_1.fromSource(file.text);
            return {
                source: convert_source_map_1.removeComments(file.text).replace(/\n\n$/, '\n'),
                map: inlineSourceMap,
                isInline: true,
            };
        }
        else if (external) {
            var externalSourceMap = null;
            try {
                var fileName = external[1] || external[2];
                var filePath = file_system_1.resolve(file_system_1.dirname(file_system_1.absoluteFromSourceFile(file)), fileName);
                var mappingFile = fs.readFile(filePath);
                externalSourceMap = convert_source_map_1.fromJSON(mappingFile);
            }
            catch (e) {
                if (e.code === 'ENOENT') {
                    logger.warn("The external map file specified in the source code comment \"" + e.path + "\" was not found on the file system.");
                    var mapPath = file_system_1.absoluteFrom(file.fileName + '.map');
                    if (file_system_1.basename(e.path) !== file_system_1.basename(mapPath) && fs.exists(mapPath) &&
                        fs.stat(mapPath).isFile()) {
                        logger.warn("Guessing the map file name from the source file name: \"" + file_system_1.basename(mapPath) + "\"");
                        try {
                            externalSourceMap = convert_source_map_1.fromObject(JSON.parse(fs.readFile(mapPath)));
                        }
                        catch (e) {
                            logger.error(e);
                        }
                    }
                }
            }
            return {
                source: convert_source_map_1.removeMapFileComments(file.text).replace(/\n\n$/, '\n'),
                map: externalSourceMap,
                isInline: false,
            };
        }
        else {
            return { source: file.text, map: null, isInline: false };
        }
    }
    exports.extractSourceMap = extractSourceMap;
    /**
     * Merge the input and output source-maps, replacing the source-map comment in the output file
     * with an appropriate source-map comment pointing to the merged source-map.
     */
    function renderSourceAndMap(sourceFile, input, output) {
        var outputPath = file_system_1.absoluteFromSourceFile(sourceFile);
        var outputMapPath = file_system_1.absoluteFrom(outputPath + ".map");
        var relativeSourcePath = file_system_1.basename(outputPath);
        var relativeMapPath = relativeSourcePath + ".map";
        var outputMap = output.generateMap({
            source: outputPath,
            includeContent: true,
        });
        // we must set this after generation as magic string does "manipulation" on the path
        outputMap.file = relativeSourcePath;
        var mergedMap = mergeSourceMaps(input.map && input.map.toObject(), JSON.parse(outputMap.toString()));
        var result = [];
        if (input.isInline) {
            result.push({ path: outputPath, contents: output.toString() + "\n" + mergedMap.toComment() });
        }
        else {
            result.push({
                path: outputPath,
                contents: output.toString() + "\n" + convert_source_map_1.generateMapFileComment(relativeMapPath)
            });
            result.push({ path: outputMapPath, contents: mergedMap.toJSON() });
        }
        return result;
    }
    exports.renderSourceAndMap = renderSourceAndMap;
    /**
     * Merge the two specified source-maps into a single source-map that hides the intermediate
     * source-map.
     * E.g. Consider these mappings:
     *
     * ```
     * OLD_SRC -> OLD_MAP -> INTERMEDIATE_SRC -> NEW_MAP -> NEW_SRC
     * ```
     *
     * this will be replaced with:
     *
     * ```
     * OLD_SRC -> MERGED_MAP -> NEW_SRC
     * ```
     */
    function mergeSourceMaps(oldMap, newMap) {
        if (!oldMap) {
            return convert_source_map_1.fromObject(newMap);
        }
        var oldMapConsumer = new source_map_1.SourceMapConsumer(oldMap);
        var newMapConsumer = new source_map_1.SourceMapConsumer(newMap);
        var mergedMapGenerator = source_map_1.SourceMapGenerator.fromSourceMap(newMapConsumer);
        mergedMapGenerator.applySourceMap(oldMapConsumer);
        var merged = convert_source_map_1.fromJSON(mergedMapGenerator.toString());
        return merged;
    }
    exports.mergeSourceMaps = mergeSourceMaps;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvcmVuZGVyaW5nL3NvdXJjZV9tYXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUE7Ozs7OztPQU1HO0lBQ0gseURBQTBMO0lBRTFMLHlDQUErRTtJQUUvRSwyRUFBNEg7SUFVNUg7O09BRUc7SUFDSCxTQUFnQixnQkFBZ0IsQ0FDNUIsRUFBYyxFQUFFLE1BQWMsRUFBRSxJQUFtQjtRQUNyRCxJQUFNLE1BQU0sR0FBRyxpQ0FBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBTSxRQUFRLEdBQUcsd0NBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyRCxJQUFJLE1BQU0sRUFBRTtZQUNWLElBQU0sZUFBZSxHQUFHLCtCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLE9BQU87Z0JBQ0wsTUFBTSxFQUFFLG1DQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO2dCQUN4RCxHQUFHLEVBQUUsZUFBZTtnQkFDcEIsUUFBUSxFQUFFLElBQUk7YUFDZixDQUFDO1NBQ0g7YUFBTSxJQUFJLFFBQVEsRUFBRTtZQUNuQixJQUFJLGlCQUFpQixHQUE0QixJQUFJLENBQUM7WUFDdEQsSUFBSTtnQkFDRixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFNLFFBQVEsR0FBRyxxQkFBTyxDQUFDLHFCQUFPLENBQUMsb0NBQXNCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDMUUsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUMsaUJBQWlCLEdBQUcsNkJBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUMzQztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7b0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQ1Asa0VBQStELENBQUMsQ0FBQyxJQUFJLHlDQUFxQyxDQUFDLENBQUM7b0JBQ2hILElBQU0sT0FBTyxHQUFHLDBCQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFDckQsSUFBSSxzQkFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO3dCQUM1RCxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO3dCQUM3QixNQUFNLENBQUMsSUFBSSxDQUNQLDZEQUEwRCxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFHLENBQUMsQ0FBQzt3QkFDcEYsSUFBSTs0QkFDRixpQkFBaUIsR0FBRywrQkFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2xFO3dCQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2pCO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPO2dCQUNMLE1BQU0sRUFBRSwwQ0FBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7Z0JBQy9ELEdBQUcsRUFBRSxpQkFBaUI7Z0JBQ3RCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCLENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQztJQTVDRCw0Q0E0Q0M7SUFFRDs7O09BR0c7SUFDSCxTQUFnQixrQkFBa0IsQ0FDOUIsVUFBeUIsRUFBRSxLQUFvQixFQUFFLE1BQW1CO1FBQ3RFLElBQU0sVUFBVSxHQUFHLG9DQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELElBQU0sYUFBYSxHQUFHLDBCQUFZLENBQUksVUFBVSxTQUFNLENBQUMsQ0FBQztRQUN4RCxJQUFNLGtCQUFrQixHQUFHLHNCQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsSUFBTSxlQUFlLEdBQU0sa0JBQWtCLFNBQU0sQ0FBQztRQUVwRCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ25DLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLGNBQWMsRUFBRSxJQUFJO1NBR3JCLENBQUMsQ0FBQztRQUVILG9GQUFvRjtRQUNwRixTQUFTLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1FBRXBDLElBQU0sU0FBUyxHQUNYLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXpGLElBQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7UUFDakMsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBSyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQUssU0FBUyxDQUFDLFNBQVMsRUFBSSxFQUFDLENBQUMsQ0FBQztTQUM3RjthQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDVixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsUUFBUSxFQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBSywyQ0FBc0IsQ0FBQyxlQUFlLENBQUc7YUFDN0UsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLENBQUM7U0FDbEU7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBL0JELGdEQStCQztJQUdEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsU0FBZ0IsZUFBZSxDQUMzQixNQUEyQixFQUFFLE1BQW9CO1FBQ25ELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPLCtCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7UUFDRCxJQUFNLGNBQWMsR0FBRyxJQUFJLDhCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELElBQU0sY0FBYyxHQUFHLElBQUksOEJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsSUFBTSxrQkFBa0IsR0FBRywrQkFBa0IsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUUsa0JBQWtCLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2xELElBQU0sTUFBTSxHQUFHLDZCQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBWEQsMENBV0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1NvdXJjZU1hcENvbnZlcnRlciwgY29tbWVudFJlZ2V4LCBmcm9tSlNPTiwgZnJvbU9iamVjdCwgZnJvbVNvdXJjZSwgZ2VuZXJhdGVNYXBGaWxlQ29tbWVudCwgbWFwRmlsZUNvbW1lbnRSZWdleCwgcmVtb3ZlQ29tbWVudHMsIHJlbW92ZU1hcEZpbGVDb21tZW50c30gZnJvbSAnY29udmVydC1zb3VyY2UtbWFwJztcbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuaW1wb3J0IHtSYXdTb3VyY2VNYXAsIFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3J9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge3Jlc29sdmUsIEZpbGVTeXN0ZW0sIGFic29sdXRlRnJvbVNvdXJjZUZpbGUsIGRpcm5hbWUsIGJhc2VuYW1lLCBhYnNvbHV0ZUZyb219IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vbG9nZ2luZy9sb2dnZXInO1xuaW1wb3J0IHtGaWxlVG9Xcml0ZX0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlTWFwSW5mbyB7XG4gIHNvdXJjZTogc3RyaW5nO1xuICBtYXA6IFNvdXJjZU1hcENvbnZlcnRlcnxudWxsO1xuICBpc0lubGluZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG1hcCBmcm9tIHRoZSBzb3VyY2UgKG5vdGUgd2hldGhlciBpdCBpcyBpbmxpbmUgb3IgZXh0ZXJuYWwpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0U291cmNlTWFwKFxuICAgIGZzOiBGaWxlU3lzdGVtLCBsb2dnZXI6IExvZ2dlciwgZmlsZTogdHMuU291cmNlRmlsZSk6IFNvdXJjZU1hcEluZm8ge1xuICBjb25zdCBpbmxpbmUgPSBjb21tZW50UmVnZXgudGVzdChmaWxlLnRleHQpO1xuICBjb25zdCBleHRlcm5hbCA9IG1hcEZpbGVDb21tZW50UmVnZXguZXhlYyhmaWxlLnRleHQpO1xuXG4gIGlmIChpbmxpbmUpIHtcbiAgICBjb25zdCBpbmxpbmVTb3VyY2VNYXAgPSBmcm9tU291cmNlKGZpbGUudGV4dCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogcmVtb3ZlQ29tbWVudHMoZmlsZS50ZXh0KS5yZXBsYWNlKC9cXG5cXG4kLywgJ1xcbicpLFxuICAgICAgbWFwOiBpbmxpbmVTb3VyY2VNYXAsXG4gICAgICBpc0lubGluZTogdHJ1ZSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKGV4dGVybmFsKSB7XG4gICAgbGV0IGV4dGVybmFsU291cmNlTWFwOiBTb3VyY2VNYXBDb252ZXJ0ZXJ8bnVsbCA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gZXh0ZXJuYWxbMV0gfHwgZXh0ZXJuYWxbMl07XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHJlc29sdmUoZGlybmFtZShhYnNvbHV0ZUZyb21Tb3VyY2VGaWxlKGZpbGUpKSwgZmlsZU5hbWUpO1xuICAgICAgY29uc3QgbWFwcGluZ0ZpbGUgPSBmcy5yZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICBleHRlcm5hbFNvdXJjZU1hcCA9IGZyb21KU09OKG1hcHBpbmdGaWxlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICBsb2dnZXIud2FybihcbiAgICAgICAgICAgIGBUaGUgZXh0ZXJuYWwgbWFwIGZpbGUgc3BlY2lmaWVkIGluIHRoZSBzb3VyY2UgY29kZSBjb21tZW50IFwiJHtlLnBhdGh9XCIgd2FzIG5vdCBmb3VuZCBvbiB0aGUgZmlsZSBzeXN0ZW0uYCk7XG4gICAgICAgIGNvbnN0IG1hcFBhdGggPSBhYnNvbHV0ZUZyb20oZmlsZS5maWxlTmFtZSArICcubWFwJyk7XG4gICAgICAgIGlmIChiYXNlbmFtZShlLnBhdGgpICE9PSBiYXNlbmFtZShtYXBQYXRoKSAmJiBmcy5leGlzdHMobWFwUGF0aCkgJiZcbiAgICAgICAgICAgIGZzLnN0YXQobWFwUGF0aCkuaXNGaWxlKCkpIHtcbiAgICAgICAgICBsb2dnZXIud2FybihcbiAgICAgICAgICAgICAgYEd1ZXNzaW5nIHRoZSBtYXAgZmlsZSBuYW1lIGZyb20gdGhlIHNvdXJjZSBmaWxlIG5hbWU6IFwiJHtiYXNlbmFtZShtYXBQYXRoKX1cImApO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBleHRlcm5hbFNvdXJjZU1hcCA9IGZyb21PYmplY3QoSlNPTi5wYXJzZShmcy5yZWFkRmlsZShtYXBQYXRoKSkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogcmVtb3ZlTWFwRmlsZUNvbW1lbnRzKGZpbGUudGV4dCkucmVwbGFjZSgvXFxuXFxuJC8sICdcXG4nKSxcbiAgICAgIG1hcDogZXh0ZXJuYWxTb3VyY2VNYXAsXG4gICAgICBpc0lubGluZTogZmFsc2UsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge3NvdXJjZTogZmlsZS50ZXh0LCBtYXA6IG51bGwsIGlzSW5saW5lOiBmYWxzZX07XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSB0aGUgaW5wdXQgYW5kIG91dHB1dCBzb3VyY2UtbWFwcywgcmVwbGFjaW5nIHRoZSBzb3VyY2UtbWFwIGNvbW1lbnQgaW4gdGhlIG91dHB1dCBmaWxlXG4gKiB3aXRoIGFuIGFwcHJvcHJpYXRlIHNvdXJjZS1tYXAgY29tbWVudCBwb2ludGluZyB0byB0aGUgbWVyZ2VkIHNvdXJjZS1tYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTb3VyY2VBbmRNYXAoXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgaW5wdXQ6IFNvdXJjZU1hcEluZm8sIG91dHB1dDogTWFnaWNTdHJpbmcpOiBGaWxlVG9Xcml0ZVtdIHtcbiAgY29uc3Qgb3V0cHV0UGF0aCA9IGFic29sdXRlRnJvbVNvdXJjZUZpbGUoc291cmNlRmlsZSk7XG4gIGNvbnN0IG91dHB1dE1hcFBhdGggPSBhYnNvbHV0ZUZyb20oYCR7b3V0cHV0UGF0aH0ubWFwYCk7XG4gIGNvbnN0IHJlbGF0aXZlU291cmNlUGF0aCA9IGJhc2VuYW1lKG91dHB1dFBhdGgpO1xuICBjb25zdCByZWxhdGl2ZU1hcFBhdGggPSBgJHtyZWxhdGl2ZVNvdXJjZVBhdGh9Lm1hcGA7XG5cbiAgY29uc3Qgb3V0cHV0TWFwID0gb3V0cHV0LmdlbmVyYXRlTWFwKHtcbiAgICBzb3VyY2U6IG91dHB1dFBhdGgsXG4gICAgaW5jbHVkZUNvbnRlbnQ6IHRydWUsXG4gICAgLy8gaGlyZXM6IHRydWUgLy8gVE9ETzogVGhpcyByZXN1bHRzIGluIGFjY3VyYXRlIGJ1dCBodWdlIHNvdXJjZW1hcHMuIEluc3RlYWQgd2Ugc2hvdWxkIGZpeFxuICAgIC8vIHRoZSBtZXJnZSBhbGdvcml0aG0uXG4gIH0pO1xuXG4gIC8vIHdlIG11c3Qgc2V0IHRoaXMgYWZ0ZXIgZ2VuZXJhdGlvbiBhcyBtYWdpYyBzdHJpbmcgZG9lcyBcIm1hbmlwdWxhdGlvblwiIG9uIHRoZSBwYXRoXG4gIG91dHB1dE1hcC5maWxlID0gcmVsYXRpdmVTb3VyY2VQYXRoO1xuXG4gIGNvbnN0IG1lcmdlZE1hcCA9XG4gICAgICBtZXJnZVNvdXJjZU1hcHMoaW5wdXQubWFwICYmIGlucHV0Lm1hcC50b09iamVjdCgpLCBKU09OLnBhcnNlKG91dHB1dE1hcC50b1N0cmluZygpKSk7XG5cbiAgY29uc3QgcmVzdWx0OiBGaWxlVG9Xcml0ZVtdID0gW107XG4gIGlmIChpbnB1dC5pc0lubGluZSkge1xuICAgIHJlc3VsdC5wdXNoKHtwYXRoOiBvdXRwdXRQYXRoLCBjb250ZW50czogYCR7b3V0cHV0LnRvU3RyaW5nKCl9XFxuJHttZXJnZWRNYXAudG9Db21tZW50KCl9YH0pO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIHBhdGg6IG91dHB1dFBhdGgsXG4gICAgICBjb250ZW50czogYCR7b3V0cHV0LnRvU3RyaW5nKCl9XFxuJHtnZW5lcmF0ZU1hcEZpbGVDb21tZW50KHJlbGF0aXZlTWFwUGF0aCl9YFxuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKHtwYXRoOiBvdXRwdXRNYXBQYXRoLCBjb250ZW50czogbWVyZ2VkTWFwLnRvSlNPTigpfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKipcbiAqIE1lcmdlIHRoZSB0d28gc3BlY2lmaWVkIHNvdXJjZS1tYXBzIGludG8gYSBzaW5nbGUgc291cmNlLW1hcCB0aGF0IGhpZGVzIHRoZSBpbnRlcm1lZGlhdGVcbiAqIHNvdXJjZS1tYXAuXG4gKiBFLmcuIENvbnNpZGVyIHRoZXNlIG1hcHBpbmdzOlxuICpcbiAqIGBgYFxuICogT0xEX1NSQyAtPiBPTERfTUFQIC0+IElOVEVSTUVESUFURV9TUkMgLT4gTkVXX01BUCAtPiBORVdfU1JDXG4gKiBgYGBcbiAqXG4gKiB0aGlzIHdpbGwgYmUgcmVwbGFjZWQgd2l0aDpcbiAqXG4gKiBgYGBcbiAqIE9MRF9TUkMgLT4gTUVSR0VEX01BUCAtPiBORVdfU1JDXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlU291cmNlTWFwcyhcbiAgICBvbGRNYXA6IFJhd1NvdXJjZU1hcCB8IG51bGwsIG5ld01hcDogUmF3U291cmNlTWFwKTogU291cmNlTWFwQ29udmVydGVyIHtcbiAgaWYgKCFvbGRNYXApIHtcbiAgICByZXR1cm4gZnJvbU9iamVjdChuZXdNYXApO1xuICB9XG4gIGNvbnN0IG9sZE1hcENvbnN1bWVyID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG9sZE1hcCk7XG4gIGNvbnN0IG5ld01hcENvbnN1bWVyID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG5ld01hcCk7XG4gIGNvbnN0IG1lcmdlZE1hcEdlbmVyYXRvciA9IFNvdXJjZU1hcEdlbmVyYXRvci5mcm9tU291cmNlTWFwKG5ld01hcENvbnN1bWVyKTtcbiAgbWVyZ2VkTWFwR2VuZXJhdG9yLmFwcGx5U291cmNlTWFwKG9sZE1hcENvbnN1bWVyKTtcbiAgY29uc3QgbWVyZ2VkID0gZnJvbUpTT04obWVyZ2VkTWFwR2VuZXJhdG9yLnRvU3RyaW5nKCkpO1xuICByZXR1cm4gbWVyZ2VkO1xufVxuIl19