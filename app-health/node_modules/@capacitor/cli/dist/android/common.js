"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const cordova_1 = require("../cordova");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("../util/fs");
const path_1 = require("path");
const plugin_1 = require("../plugin");
async function gradleClean(config) {
    await common_1.runCommand(`cd ${config.android.platformDir} && ./gradlew clean`);
}
exports.gradleClean = gradleClean;
function getAndroidPlugins(allPlugins) {
    const resolved = allPlugins.map(plugin => resolvePlugin(plugin));
    return resolved.filter(plugin => !!plugin);
}
exports.getAndroidPlugins = getAndroidPlugins;
function resolvePlugin(plugin) {
    const platform = 'android';
    if (plugin.manifest && plugin.manifest.android) {
        let pluginFilesPath = plugin.manifest.android.src ? plugin.manifest.android.src : platform;
        const absolutePath = path_1.join(plugin.rootPath, pluginFilesPath, plugin.id);
        // Android folder shouldn't have subfolders, but they used to, so search for them for compatibility reasons
        if (fs_1.existsSync(absolutePath)) {
            pluginFilesPath = path_1.join(platform, plugin.id);
        }
        plugin.android = {
            type: 0 /* Core */,
            path: fs_1.convertToUnixPath(pluginFilesPath)
        };
    }
    else if (plugin.xml) {
        plugin.android = {
            type: 1 /* Cordova */,
            path: 'src/' + platform
        };
        if (cordova_1.getIncompatibleCordovaPlugins(platform).includes(plugin.id) || !plugin_1.getPluginPlatform(plugin, platform)) {
            plugin.android.type = 2 /* Incompatible */;
        }
    }
    else {
        return null;
    }
    return plugin;
}
exports.resolvePlugin = resolvePlugin;
/**
 * Update an Android project with the desired app name and appId.
 * This is a little trickier for Android because the appId becomes
 * the package name.
 */
async function editProjectSettingsAndroid(config) {
    const appId = config.app.appId;
    const appName = config.app.appName;
    const manifestPath = path_1.resolve(config.app.rootDir, config.android.platformDir, 'app/src/main/AndroidManifest.xml');
    const buildGradlePath = path_1.resolve(config.app.rootDir, config.android.platformDir, 'app/build.gradle');
    let manifestContent = await fs_1.readFileAsync(manifestPath, 'utf8');
    manifestContent = manifestContent.replace(/com.getcapacitor.myapp/g, `${appId}`);
    await fs_1.writeFileAsync(manifestPath, manifestContent, 'utf8');
    const domainPath = appId.split('.').join('/');
    // Make the package source path to the new plugin Java file
    const newJavaPath = path_1.resolve(config.app.rootDir, config.android.platformDir, `app/src/main/java/${domainPath}`);
    if (!await fs_1.existsAsync(newJavaPath)) {
        await fs_extra_1.mkdirs(newJavaPath);
    }
    await fs_1.copyAsync(path_1.resolve(config.app.rootDir, config.android.platformDir, 'app/src/main/java/com/getcapacitor/myapp/MainActivity.java'), path_1.resolve(newJavaPath, 'MainActivity.java'));
    if (appId.split('.')[1] !== 'getcapacitor') {
        await fs_1.removeAsync(path_1.resolve(config.app.rootDir, config.android.platformDir, 'app/src/main/java/com/getcapacitor'));
    }
    // Remove our template 'com' folder if their ID doesn't have it
    if (appId.split('.')[0] !== 'com') {
        await fs_1.removeAsync(path_1.resolve(config.app.rootDir, config.android.platformDir, 'app/src/main/java/com/'));
    }
    // Update the package in the MainActivity java file
    const activityPath = path_1.resolve(config.app.rootDir, config.android.platformDir, newJavaPath, 'MainActivity.java');
    let activityContent = await fs_1.readFileAsync(activityPath, 'utf8');
    activityContent = activityContent.replace(/package ([^;]*)/, `package ${appId}`);
    await fs_1.writeFileAsync(activityPath, activityContent, 'utf8');
    // Update the applicationId in build.gradle
    let gradleContent = await fs_1.readFileAsync(buildGradlePath, 'utf8');
    gradleContent = gradleContent.replace(/applicationId "[^"]+"/, `applicationId "${appId}"`);
    await fs_1.writeFileAsync(buildGradlePath, gradleContent, 'utf8');
    // Update the settings in res/values/strings.xml
    const stringsPath = path_1.resolve(config.app.rootDir, config.android.platformDir, 'app/src/main/res/values/strings.xml');
    let stringsContent = await fs_1.readFileAsync(stringsPath, 'utf8');
    stringsContent = stringsContent.replace(/com.getcapacitor.myapp/g, appId);
    stringsContent = stringsContent.replace(/My App/g, appName.replace(/'/g, `\\'`));
    await fs_1.writeFileAsync(stringsPath, stringsContent);
}
exports.editProjectSettingsAndroid = editProjectSettingsAndroid;
