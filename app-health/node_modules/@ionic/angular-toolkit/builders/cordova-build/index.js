"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const utils_1 = require("../utils");
async function buildCordova(options, context) {
    context.reportStatus(`running cordova build...`);
    // Get angular browser build target
    const browserTargetSpec = architect_1.targetFromTargetString(options.browserTarget);
    // Get browser build options
    const browserBuildTargetOptions = await context.getTargetOptions(browserTargetSpec);
    const formattedOptions = utils_1.validateBuilderConfig(options);
    const newOptions = utils_1.prepareBrowserConfig(formattedOptions, browserBuildTargetOptions);
    const browserBuild = await context.scheduleTarget(browserTargetSpec, newOptions);
    return browserBuild.result;
}
exports.buildCordova = buildCordova;
exports.default = architect_1.createBuilder(buildCordova);
