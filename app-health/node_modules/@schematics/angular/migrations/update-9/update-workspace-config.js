"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const json_utils_1 = require("../../utility/json-utils");
exports.ANY_COMPONENT_STYLE_BUDGET = {
    type: 'anyComponentStyle',
    maximumWarning: '6kb',
};
function UpdateWorkspaceConfig() {
    return (tree) => {
        let workspaceConfigPath = 'angular.json';
        let angularConfigContent = tree.read(workspaceConfigPath);
        if (!angularConfigContent) {
            workspaceConfigPath = '.angular.json';
            angularConfigContent = tree.read(workspaceConfigPath);
            if (!angularConfigContent) {
                return;
            }
        }
        const angularJson = core_1.parseJsonAst(angularConfigContent.toString(), core_1.JsonParseMode.Loose);
        if (angularJson.kind !== 'object') {
            return;
        }
        const projects = json_utils_1.findPropertyInAstObject(angularJson, 'projects');
        if (!projects || projects.kind !== 'object') {
            return;
        }
        // For all projects
        const recorder = tree.beginUpdate(workspaceConfigPath);
        for (const project of projects.properties) {
            const projectConfig = project.value;
            if (projectConfig.kind !== 'object') {
                break;
            }
            const architect = json_utils_1.findPropertyInAstObject(projectConfig, 'architect');
            if (!architect || architect.kind !== 'object') {
                break;
            }
            const buildTarget = json_utils_1.findPropertyInAstObject(architect, 'build');
            if (buildTarget && buildTarget.kind === 'object') {
                const builder = json_utils_1.findPropertyInAstObject(buildTarget, 'builder');
                // Projects who's build builder is not build-angular:browser
                if (builder && builder.kind === 'string' && builder.value === '@angular-devkit/build-angular:browser') {
                    updateStyleOrScriptOption('styles', recorder, buildTarget);
                    updateStyleOrScriptOption('scripts', recorder, buildTarget);
                    addAnyComponentStyleBudget(recorder, buildTarget);
                }
            }
            const testTarget = json_utils_1.findPropertyInAstObject(architect, 'test');
            if (testTarget && testTarget.kind === 'object') {
                const builder = json_utils_1.findPropertyInAstObject(testTarget, 'builder');
                // Projects who's build builder is not build-angular:browser
                if (builder && builder.kind === 'string' && builder.value === '@angular-devkit/build-angular:karma') {
                    updateStyleOrScriptOption('styles', recorder, testTarget);
                    updateStyleOrScriptOption('scripts', recorder, testTarget);
                }
            }
        }
        tree.commitUpdate(recorder);
        return tree;
    };
}
exports.UpdateWorkspaceConfig = UpdateWorkspaceConfig;
/**
 * Helper to retreive all the options in various configurations
 */
function getAllOptions(builderConfig, configurationsOnly = false) {
    const options = [];
    const configurations = json_utils_1.findPropertyInAstObject(builderConfig, 'configurations');
    if (configurations && configurations.kind === 'object') {
        options.push(...configurations.properties.map(x => x.value));
    }
    if (!configurationsOnly) {
        options.push(json_utils_1.findPropertyInAstObject(builderConfig, 'options'));
    }
    return options.filter(o => o && o.kind === 'object');
}
function updateStyleOrScriptOption(property, recorder, builderConfig) {
    const options = getAllOptions(builderConfig);
    for (const option of options) {
        const propertyOption = json_utils_1.findPropertyInAstObject(option, property);
        if (!propertyOption || propertyOption.kind !== 'array') {
            continue;
        }
        for (const node of propertyOption.elements) {
            if (!node || node.kind !== 'object') {
                // skip non complex objects
                continue;
            }
            const lazy = json_utils_1.findPropertyInAstObject(node, 'lazy');
            json_utils_1.removePropertyInAstObject(recorder, node, 'lazy');
            // if lazy was not true, it is redundant hence, don't add it
            if (lazy && lazy.kind === 'true') {
                json_utils_1.insertPropertyInAstObjectInOrder(recorder, node, 'inject', false, 0);
            }
        }
    }
}
function addAnyComponentStyleBudget(recorder, builderConfig) {
    const options = getAllOptions(builderConfig, true);
    for (const option of options) {
        const aotOption = json_utils_1.findPropertyInAstObject(option, 'aot');
        if (!aotOption || aotOption.kind !== 'true') {
            // AnyComponentStyle only works for AOT
            continue;
        }
        const budgetOption = json_utils_1.findPropertyInAstObject(option, 'budgets');
        if (!budgetOption) {
            // add
            json_utils_1.insertPropertyInAstObjectInOrder(recorder, option, 'budgets', [exports.ANY_COMPONENT_STYLE_BUDGET], 14);
            continue;
        }
        if (budgetOption.kind !== 'array') {
            continue;
        }
        // if 'anyComponentStyle' budget already exists don't add.
        const hasAnyComponentStyle = budgetOption.elements.some(node => {
            if (!node || node.kind !== 'object') {
                // skip non complex objects
                return false;
            }
            const budget = json_utils_1.findPropertyInAstObject(node, 'type');
            return !!budget && budget.kind === 'string' && budget.value === 'anyComponentStyle';
        });
        if (!hasAnyComponentStyle) {
            json_utils_1.appendValueInAstArray(recorder, budgetOption, exports.ANY_COMPONENT_STYLE_BUDGET, 16);
        }
    }
}
