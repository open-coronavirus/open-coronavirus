"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-default-export
const convert_source_map_1 = __importDefault(require("convert-source-map"));
const istanbul_lib_instrument_1 = require("istanbul-lib-instrument");
const loader_utils_1 = __importDefault(require("loader-utils"));
const merge_source_map_1 = __importDefault(require("merge-source-map"));
const path_1 = __importDefault(require("path"));
const schema_utils_1 = __importDefault(require("schema-utils"));
const options_schema_json_1 = __importDefault(require("./options-schema.json"));
const options_js_1 = require("./options.js");
/**
 * Adds code coverage instrumentation using Istanbul.
 *
 * If the source code has an existing source map, then it is used to re-map the instrumented
 * code back to the original source.
 */
function default_1(source, sourceMap) {
    let options = loader_utils_1.default.getOptions(this);
    options = Object.assign(options_js_1.defaultOptions, options);
    schema_utils_1.default(options_schema_json_1.default, options, "Coverage Istanbul Loader");
    if (!sourceMap) {
        // Check for an inline source map
        const inlineSourceMap = convert_source_map_1.default.fromSource(source)
            || convert_source_map_1.default.fromMapFileSource(source, path_1.default.dirname(this.resourcePath));
        if (inlineSourceMap) {
            // Use the inline source map
            sourceMap = inlineSourceMap.sourcemap;
        }
    }
    // Instrument the code
    let instrumenter = istanbul_lib_instrument_1.createInstrumenter(options);
    instrumenter.instrument(source, this.resourcePath, done.bind(this), sourceMap);
    function done(error, instrumentedSource) {
        // Get the source map for the instrumented code
        let instrumentedSourceMap = instrumenter.lastSourceMap();
        if (sourceMap && instrumentedSourceMap) {
            // Re-map the source map to the original source code
            instrumentedSourceMap = merge_source_map_1.default(sourceMap, instrumentedSourceMap);
        }
        this.callback(error, instrumentedSource, instrumentedSourceMap);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map