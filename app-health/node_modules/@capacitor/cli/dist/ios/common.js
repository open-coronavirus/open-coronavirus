"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const fs_1 = require("../util/fs");
const path_1 = require("path");
const cordova_1 = require("../cordova");
const plugin_1 = require("../plugin");
async function findXcodePath(config) {
    try {
        const files = await fs_1.readdirAsync(path_1.join(config.ios.platformDir, config.ios.nativeProjectName));
        const xcodeProject = files.find(file => file.endsWith('.xcworkspace'));
        if (xcodeProject) {
            return path_1.join(config.ios.platformDir, config.ios.nativeProjectName, xcodeProject);
        }
        return null;
    }
    catch (_a) {
        return null;
    }
}
exports.findXcodePath = findXcodePath;
async function checkCocoaPods(config) {
    config;
    if (!await common_1.isInstalled('pod') && config.cli.os === 'mac') {
        return 'cocoapods is not installed. For information: https://guides.cocoapods.org/using/getting-started.html#installation';
    }
    return null;
}
exports.checkCocoaPods = checkCocoaPods;
async function checkIOSProject(config) {
    const exists = config.platformDirExists('ios');
    if (exists === null) {
        return 'iOS was not created yet. Run `capacitor create ios`.';
    }
    return null;
}
exports.checkIOSProject = checkIOSProject;
function getIOSPlugins(allPlugins) {
    const resolved = allPlugins.map(plugin => resolvePlugin(plugin));
    return resolved.filter(plugin => !!plugin);
}
exports.getIOSPlugins = getIOSPlugins;
function resolvePlugin(plugin) {
    const platform = 'ios';
    if (plugin.manifest && plugin.manifest.ios) {
        plugin.ios = {
            name: plugin.name,
            type: 0 /* Core */,
            path: plugin.manifest.ios.src ? plugin.manifest.ios.src : platform
        };
    }
    else if (plugin.xml) {
        plugin.ios = {
            name: plugin.name,
            type: 1 /* Cordova */,
            path: 'src/' + platform
        };
        if (cordova_1.getIncompatibleCordovaPlugins(platform).includes(plugin.id) || !plugin_1.getPluginPlatform(plugin, platform)) {
            plugin.ios.type = 2 /* Incompatible */;
        }
    }
    else {
        return null;
    }
    return plugin;
}
exports.resolvePlugin = resolvePlugin;
/**
 * Update the native project files with the desired app id and app name
 */
async function editProjectSettingsIOS(config) {
    const appId = config.app.appId;
    const appName = config.app.appName;
    const pbxPath = path_1.resolve(config.app.rootDir, config.ios.platformDir, config.ios.nativeProjectName, 'App\.xcodeproj/project.pbxproj');
    const plistPath = path_1.resolve(config.app.rootDir, config.ios.platformDir, config.ios.nativeProjectName, 'App/Info.plist');
    let plistContent = await fs_1.readFileAsync(plistPath, 'utf8');
    plistContent = plistContent.replace(/<key>CFBundleDisplayName<\/key>[\s\S]?\s+<string>([^\<]*)<\/string>/, `<key>CFBundleDisplayName</key>\n        <string>${appName}</string>`);
    let pbxContent = await fs_1.readFileAsync(pbxPath, 'utf8');
    pbxContent = pbxContent.replace(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+)/g, `PRODUCT_BUNDLE_IDENTIFIER = ${appId}`);
    await fs_1.writeFileAsync(plistPath, plistContent, 'utf8');
    await fs_1.writeFileAsync(pbxPath, pbxContent, 'utf8');
}
exports.editProjectSettingsIOS = editProjectSettingsIOS;
