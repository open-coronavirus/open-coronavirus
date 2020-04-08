"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/utils");
const core_1 = require("@angular-devkit/core");
const fs_1 = require("fs");
const path_1 = require("path");
function validateBuilderConfig(builderOptions) {
    // if we're mocking cordova.js, don't build cordova bundle
    const newOptions = Object.assign({}, builderOptions);
    if (newOptions.cordovaMock) {
        newOptions.cordovaAssets = true;
    }
    if (builderOptions.cordovaAssets && !builderOptions.platform) {
        throw new Error('The `--platform` option is required with `--cordova-assets`');
    }
    return newOptions;
}
exports.validateBuilderConfig = validateBuilderConfig;
function prepareBrowserConfig(options, browserOptions) {
    const optionsStarter = Object.assign({}, browserOptions);
    const cordovaBasePath = core_1.normalize(options.cordovaBasePath ? options.cordovaBasePath : '.');
    if (typeof options.sourceMap !== 'undefined') {
        optionsStarter.sourceMap = options.sourceMap;
    }
    // We always need to output the build to `www` because it is a hard
    // requirement of Cordova.
    if ('outputPath' in options) {
        optionsStarter.outputPath = core_1.join(cordovaBasePath, core_1.normalize('www'));
    }
    // Cordova CLI will error if `www` is missing. The Angular CLI deletes it
    // by default. Let's keep it around.
    if ('deleteOutputPath' in options) {
        optionsStarter.deleteOutputPath = false;
    }
    // Initialize an empty script array to make sure assets are pushed even when
    // scripts is not configured in angular.json
    if (!optionsStarter.scripts) {
        optionsStarter.scripts = [];
    }
    if (options.consolelogs) {
        // Write the config to a file, and then include that in the bundle so it loads on window
        const configPath = core_1.getSystemPath(core_1.join(core_1.normalize(__dirname), '../../assets', core_1.normalize('consolelog-config.js')));
        fs_1.writeFileSync(configPath, `window.Ionic = window.Ionic || {}; Ionic.ConsoleLogServerConfig = { wsPort: ${options.consolelogsPort} }`);
        optionsStarter.scripts.push({
            input: configPath,
            bundleName: 'consolelogs',
            lazy: false,
        });
        optionsStarter.scripts.push({
            input: core_1.getSystemPath(core_1.join(core_1.normalize(__dirname), '../../assets', core_1.normalize('consolelogs.js'))),
            bundleName: 'consolelogs',
            lazy: false,
        });
    }
    if (options.cordovaMock) {
        if (browserOptions.scripts) {
            browserOptions.scripts.push({
                input: core_1.getSystemPath(core_1.join(core_1.normalize(__dirname), '../../assets', core_1.normalize('cordova.js'))),
                bundleName: 'cordova',
                lazy: false,
            });
        }
    }
    else if (options.cordovaAssets) {
        const platformWWWPath = core_1.join(cordovaBasePath, core_1.normalize(`platforms/${options.platform}/platform_www`));
        // Add Cordova www assets that were generated whenever platform(s) and
        // plugin(s) are added. This includes `cordova.js`,
        // `cordova_plugins.js`, and all plugin JS.
        if (optionsStarter.assets) {
            optionsStarter.assets.push({
                glob: '**/*',
                input: core_1.getSystemPath(platformWWWPath),
                output: './',
            });
        }
        // Register `cordova.js` as a global script so it is included in
        // `index.html`.
        if (optionsStarter.scripts) {
            optionsStarter.scripts.push({
                input: core_1.getSystemPath(core_1.join(platformWWWPath, core_1.normalize('cordova.js'))),
                bundleName: 'cordova',
                lazy: false,
            });
        }
    }
    return optionsStarter;
}
exports.prepareBrowserConfig = prepareBrowserConfig;
function prepareServerConfig(options, root) {
    const scripts = [];
    const assets = [];
    const cordovaBasePath = core_1.normalize(options.cordovaBasePath ? options.cordovaBasePath : '.');
    if (options.consolelogs) {
        // Write the config to a file, and then include that in the bundle so it loads on window
        const configPath = core_1.getSystemPath(core_1.join(core_1.normalize(__dirname), '../../assets', core_1.normalize('consolelog-config.js')));
        fs_1.writeFileSync(configPath, `window.Ionic = window.Ionic || {}; Ionic.ConsoleLogServerConfig = { wsPort: ${options.consolelogsPort} }`);
        scripts.push({ input: configPath, bundleName: 'consolelogs', lazy: false });
        scripts.push({
            input: core_1.getSystemPath(core_1.join(core_1.normalize(__dirname), '../../assets', core_1.normalize('consolelogs.js'))),
            bundleName: 'consolelogs',
            lazy: false,
        });
    }
    if (options.cordovaMock) {
        scripts.push({
            input: core_1.getSystemPath(core_1.join(core_1.normalize(__dirname), '../../assets', core_1.normalize('cordova.js'))),
            bundleName: 'cordova',
            lazy: false,
        });
    }
    else if (options.cordovaAssets) {
        const platformWWWPath = core_1.join(cordovaBasePath, core_1.normalize(`platforms/${options.platform}/platform_www`));
        assets.push({
            glob: '**/*',
            input: core_1.getSystemPath(platformWWWPath),
            output: './',
        });
        scripts.push({
            input: core_1.getSystemPath(core_1.join(platformWWWPath, core_1.normalize('cordova.js'))),
            bundleName: 'cordova',
            lazy: false,
        });
    }
    const globalScriptsByBundleName = utils_1.normalizeExtraEntryPoints(scripts, 'scripts').reduce((prev, curr) => {
        const { bundleName, inject, input } = curr;
        const resolvedPath = path_1.resolve(root, input);
        const existingEntry = prev.find(el => el.bundleName === bundleName);
        if (existingEntry) {
            existingEntry.paths.push(resolvedPath);
        }
        else {
            prev.push({
                bundleName,
                inject,
                paths: [resolvedPath],
            });
        }
        return prev;
    }, []);
    const copyWebpackPluginPatterns = assets.map((asset) => {
        // Resolve input paths relative to workspace root and add slash at the end.
        asset.input = path_1.resolve(root, asset.input).replace(/\\/g, '/');
        asset.input = asset.input.endsWith('/') ? asset.input : asset.input + '/';
        asset.output = asset.output.endsWith('/')
            ? asset.output
            : asset.output + '/';
        return {
            context: asset.input,
            // Now we remove starting slash to make Webpack place it from the output root.
            to: asset.output.replace(/^\//, ''),
            ignore: asset.ignore,
            from: {
                glob: asset.glob,
                dot: true,
            },
        };
    });
    return { globalScriptsByBundleName, copyWebpackPluginPatterns };
}
exports.prepareServerConfig = prepareServerConfig;
