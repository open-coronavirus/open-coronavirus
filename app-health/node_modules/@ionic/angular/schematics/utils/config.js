"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const CONFIG_PATH = 'angular.json';
function readConfig(host) {
    const sourceText = host.read(CONFIG_PATH).toString('utf-8');
    return JSON.parse(sourceText);
}
exports.readConfig = readConfig;
function writeConfig(host, config) {
    host.overwrite(CONFIG_PATH, JSON.stringify(config, null, 2));
}
exports.writeConfig = writeConfig;
function isAngularBrowserProject(projectConfig) {
    if (projectConfig.projectType === 'application') {
        const buildConfig = projectConfig.architect.build;
        return buildConfig.builder === '@angular-devkit/build-angular:browser';
    }
    return false;
}
function getAngularAppName(config) {
    const projects = config.projects;
    const projectNames = Object.keys(projects);
    for (const projectName of projectNames) {
        const projectConfig = projects[projectName];
        if (isAngularBrowserProject(projectConfig)) {
            return projectName;
        }
    }
    return null;
}
exports.getAngularAppName = getAngularAppName;
function getAngularAppConfig(config) {
    const projects = config.projects;
    const projectNames = Object.keys(projects);
    for (const projectName of projectNames) {
        const projectConfig = projects[projectName];
        if (isAngularBrowserProject(projectConfig)) {
            return projectConfig;
        }
    }
    return null;
}
exports.getAngularAppConfig = getAngularAppConfig;
function addStyle(host, stylePath) {
    const config = readConfig(host);
    const appConfig = getAngularAppConfig(config);
    if (appConfig) {
        appConfig.architect.build.options.styles.push({
            input: stylePath
        });
        writeConfig(host, config);
    }
    else {
        throw new schematics_1.SchematicsException(`Cannot find valid app`);
    }
}
exports.addStyle = addStyle;
function addAsset(host, asset) {
    const config = readConfig(host);
    const appConfig = getAngularAppConfig(config);
    if (appConfig) {
        appConfig.architect.build.options.assets.push(asset);
        writeConfig(host, config);
    }
    else {
        throw new schematics_1.SchematicsException(`Cannot find valid app`);
    }
}
exports.addAsset = addAsset;
function addArchitectBuilder(host, builderName, builderOpts) {
    const config = readConfig(host);
    const appConfig = getAngularAppConfig(config);
    if (appConfig) {
        appConfig.architect[builderName] = builderOpts;
        writeConfig(host, config);
    }
    else {
        throw new schematics_1.SchematicsException(`Cannot find valid app`);
    }
}
exports.addArchitectBuilder = addArchitectBuilder;
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();
    return core_1.parseJson(content, core_1.JsonParseMode.Loose);
}
exports.getWorkspace = getWorkspace;
