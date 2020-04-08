"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const architect_1 = require("@angular-devkit/architect");
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const fs = require("fs");
const path = require("path");
const service_worker_1 = require("../angular-cli-files/utilities/service-worker");
async function _renderUniversal(options, context, browserResult, serverResult) {
    const browserIndexOutputPath = path.join(browserResult.outputPath || '', 'index.html');
    const indexHtml = fs.readFileSync(browserIndexOutputPath, 'utf8');
    const serverBundlePath = await _getServerModuleBundlePath(options, context, serverResult);
    const root = context.workspaceRoot;
    // Initialize zone.js
    const zonePackage = require.resolve('zone.js', { paths: [root] });
    await Promise.resolve().then(() => require(zonePackage));
    // Load platform server module renderer
    const platformServerPackage = require.resolve('@angular/platform-server', { paths: [root] });
    const renderModuleFactory = await Promise.resolve().then(() => require(platformServerPackage)).then((m) => m.renderModuleFactory);
    const AppServerModuleNgFactory = require(serverBundlePath).AppServerModuleNgFactory;
    const outputIndexPath = options.outputIndexPath
        ? path.join(root, options.outputIndexPath)
        : browserIndexOutputPath;
    // Render to HTML and overwrite the client index file.
    const html = await renderModuleFactory(AppServerModuleNgFactory, {
        document: indexHtml,
        url: options.route,
    });
    fs.writeFileSync(outputIndexPath, html);
    const browserTarget = architect_1.targetFromTargetString(options.browserTarget);
    const rawBrowserOptions = await context.getTargetOptions(browserTarget);
    const browserBuilderName = await context.getBuilderNameForTarget(browserTarget);
    const browserOptions = await context.validateOptions(rawBrowserOptions, browserBuilderName);
    if (browserOptions.serviceWorker) {
        const host = new node_1.NodeJsSyncHost();
        // Create workspace.
        const registry = new core_1.schema.CoreSchemaRegistry();
        registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
        const workspace = await core_1.experimental.workspace.Workspace.fromPath(host, core_1.normalize(context.workspaceRoot), registry);
        const projectName = context.target ? context.target.project : workspace.getDefaultProjectName();
        if (!projectName) {
            throw new Error('Must either have a target from the context or a default project.');
        }
        const projectRoot = core_1.resolve(workspace.root, core_1.normalize(workspace.getProject(projectName).root));
        await service_worker_1.augmentAppWithServiceWorker(host, core_1.normalize(root), projectRoot, core_1.join(core_1.normalize(root), browserOptions.outputPath), browserOptions.baseHref || '/', browserOptions.ngswConfigPath);
    }
    return browserResult;
}
async function _getServerModuleBundlePath(options, context, serverResult) {
    if (options.appModuleBundle) {
        return path.join(context.workspaceRoot, options.appModuleBundle);
    }
    else {
        const outputPath = serverResult.outputPath || '/';
        const files = fs.readdirSync(outputPath, 'utf8');
        const re = /^main\.(?:[a-zA-Z0-9]{20}\.)?(?:bundle\.)?js$/;
        const maybeMain = files.filter(x => re.test(x))[0];
        if (!maybeMain) {
            throw new Error('Could not find the main bundle.');
        }
        else {
            return path.join(outputPath, maybeMain);
        }
    }
}
async function _appShellBuilder(options, context) {
    const browserTarget = architect_1.targetFromTargetString(options.browserTarget);
    const serverTarget = architect_1.targetFromTargetString(options.serverTarget);
    // Never run the browser target in watch mode.
    // If service worker is needed, it will be added in _renderUniversal();
    const browserTargetRun = await context.scheduleTarget(browserTarget, {
        watch: false,
        serviceWorker: false,
    });
    const serverTargetRun = await context.scheduleTarget(serverTarget, {});
    try {
        const [browserResult, serverResult] = await Promise.all([
            browserTargetRun.result,
            serverTargetRun.result,
        ]);
        if (browserResult.success === false || browserResult.outputPath === undefined) {
            return browserResult;
        }
        else if (serverResult.success === false) {
            return serverResult;
        }
        return await _renderUniversal(options, context, browserResult, serverResult);
    }
    catch (err) {
        return { success: false, error: err.message };
    }
    finally {
        // Just be good citizens and stop those jobs.
        await Promise.all([
            browserTargetRun.stop(),
            serverTargetRun.stop(),
        ]);
    }
}
exports.default = architect_1.createBuilder(_appShellBuilder);
