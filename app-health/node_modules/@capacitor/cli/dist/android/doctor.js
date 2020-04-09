"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const common_1 = require("../common");
const fs_2 = require("../util/fs");
const path_1 = require("path");
async function doctorAndroid(config) {
    try {
        await common_1.check(config, [
            checkAndroidInstalled,
            checkGradlew,
            checkAppSrcDirs
        ]);
        common_1.logSuccess('Android looking great! 👌');
    }
    catch (e) {
        common_1.logFatal(e);
    }
    return Promise.resolve();
}
exports.doctorAndroid = doctorAndroid;
async function checkAppSrcDirs(config) {
    const appDir = path_1.join(config.android.platformDir, 'app');
    if (!await fs_2.existsAsync(appDir)) {
        return `"app" directory is missing in: ${config.android.platformDir}`;
    }
    const appSrcDir = path_1.join(appDir, 'src');
    if (!await fs_2.existsAsync(appSrcDir)) {
        return `"src" directory is missing in: ${appDir}`;
    }
    const appSrcMainDir = path_1.join(appSrcDir, 'main');
    if (!await fs_2.existsAsync(appSrcMainDir)) {
        return `"main" directory is missing in: ${appSrcDir}`;
    }
    const appSrcMainAssetsDir = path_1.join(appSrcMainDir, 'assets');
    if (!await fs_2.existsAsync(appSrcMainAssetsDir)) {
        return `"assets" directory is missing in: ${appSrcMainDir}`;
    }
    const appSrcMainAssetsWwwDir = path_1.join(appSrcMainAssetsDir, 'public');
    if (!await fs_2.existsAsync(appSrcMainAssetsWwwDir)) {
        return `"public" directory is missing in: ${appSrcMainAssetsDir}`;
    }
    const appSrcMainAssetsWwwIndexHtmlDir = path_1.join(appSrcMainAssetsWwwDir, 'index.html');
    if (!await fs_2.existsAsync(appSrcMainAssetsWwwIndexHtmlDir)) {
        return `"index.html" directory is missing in: ${appSrcMainAssetsWwwDir}`;
    }
    return checkAndroidManifestFile(config, appSrcMainDir);
}
async function checkAndroidManifestFile(config, appSrcMainDir) {
    const manifestFileName = 'AndroidManifest.xml';
    const manifestFilePath = path_1.join(appSrcMainDir, manifestFileName);
    if (!await fs_2.existsAsync(manifestFilePath)) {
        return `"${manifestFileName}" is missing in: ${appSrcMainDir}`;
    }
    try {
        const xmlData = await common_1.readXML(manifestFilePath);
        return checkAndroidManifestData(config, appSrcMainDir, xmlData);
    }
    catch (e) {
        return e;
    }
}
async function checkAndroidManifestData(config, appSrcMainDir, xmlData) {
    const manifestNode = xmlData.manifest;
    if (!manifestNode) {
        return `Missing <manifest> xml node in: ${appSrcMainDir}`;
    }
    const packageId = manifestNode.$['package'];
    if (!packageId) {
        return `Missing <manifest package=""> attribute in: ${appSrcMainDir}`;
    }
    const applicationChildNodes = manifestNode.application;
    if (!Array.isArray(manifestNode.application)) {
        return `Missing <application> xml node as a child node to <manifest> in: ${appSrcMainDir}`;
    }
    let mainActivityClassPath = '';
    const mainApplicationNode = applicationChildNodes.find(applicationChildNode => {
        const activityChildNodes = applicationChildNode.activity;
        if (!Array.isArray(activityChildNodes)) {
            return false;
        }
        const mainActivityNode = activityChildNodes.find(activityChildNode => {
            const intentFilterChildNodes = activityChildNode['intent-filter'];
            if (!Array.isArray(intentFilterChildNodes)) {
                return false;
            }
            return intentFilterChildNodes.find(intentFilterChildNode => {
                const actionChildNodes = intentFilterChildNode.action;
                if (!Array.isArray(actionChildNodes)) {
                    return false;
                }
                const mainActionChildNode = actionChildNodes.find(actionChildNode => {
                    const androidName = actionChildNode.$['android:name'];
                    return androidName === 'android.intent.action.MAIN';
                });
                if (!mainActionChildNode) {
                    return false;
                }
                const categoryChildNodes = intentFilterChildNode.category;
                if (!Array.isArray(categoryChildNodes)) {
                    return false;
                }
                return categoryChildNodes.find(categoryChildNode => {
                    const androidName = categoryChildNode.$['android:name'];
                    return androidName === 'android.intent.category.LAUNCHER';
                });
            });
        });
        if (mainActivityNode) {
            mainActivityClassPath = mainActivityNode.$['android:name'];
        }
        return mainActivityNode;
    });
    if (!mainApplicationNode) {
        return `Missing main <activity> xml node in: ${appSrcMainDir}`;
    }
    if (!mainActivityClassPath) {
        return `Missing main <activity android:name=""> attribute for MainActivity class in: ${appSrcMainDir}`;
    }
    return checkPackage(config, appSrcMainDir, packageId, mainActivityClassPath);
}
async function checkPackage(config, appSrcMainDir, packageId, mainActivityClassPath) {
    if (mainActivityClassPath.indexOf(packageId) !== 0) {
        return `Main Acitivity "${mainActivityClassPath}" is not in manifest package "${packageId}". Please update the packages to be the same.`;
    }
    const appSrcMainJavaDir = path_1.join(appSrcMainDir, 'java');
    if (!await fs_2.existsAsync(appSrcMainJavaDir)) {
        return `"java" directory is missing in: ${appSrcMainDir}`;
    }
    let checkPath = appSrcMainJavaDir;
    const packageParts = packageId.split('.');
    for (var i = 0; i < packageParts.length; i++) {
        try {
            fs_1.accessSync(path_1.join(checkPath, packageParts[i]));
            checkPath = path_1.join(checkPath, packageParts[i]);
        }
        catch (e) {
            return `"${packageParts[i]}" is missing in "${checkPath}". Please create a directory structure matching the package id "${packageId}" within the directory "${appSrcMainJavaDir}".`;
        }
    }
    const mainActivityClassName = mainActivityClassPath.split('.').pop();
    const mainActivityClassFileName = `${mainActivityClassName}.java`;
    const mainActivityClassFilePath = path_1.join(checkPath, mainActivityClassFileName);
    if (!await fs_2.existsAsync(mainActivityClassFilePath)) {
        return `Main acitivity file "${mainActivityClassFileName}" is missing in: ${checkPath}`;
    }
    return checkBuildGradle(config, packageId);
}
async function checkBuildGradle(config, packageId) {
    const appDir = path_1.join(config.android.platformDir, 'app');
    const fileName = 'build.gradle';
    const filePath = path_1.join(appDir, fileName);
    if (!await fs_2.existsAsync(filePath)) {
        return `${fileName} file is missing in: ${appDir}`;
    }
    let fileContent = await fs_2.readFileAsync(filePath, 'utf8');
    fileContent = fileContent.replace(/'|"/g, '').replace(/\s+/g, ' ');
    const searchFor = `applicationId ${packageId}`;
    if (fileContent.indexOf(searchFor) === -1) {
        return `build.gradle file missing 'applicationId "${packageId}"' config in: ${filePath}`;
    }
    return null;
}
async function checkGradlew(config) {
    const fileName = 'gradlew';
    const filePath = path_1.join(config.android.platformDir, fileName);
    if (!await fs_2.existsAsync(filePath)) {
        return `"${fileName}" file is missing in: ${config.android.platformDir}`;
    }
    return null;
}
async function checkAndroidInstalled() {
    /*
    if (!await isInstalled('android')) {
      return 'Android is not installed. For information: https://developer.android.com/studio/index.html';
    }
    */
    return null;
}
