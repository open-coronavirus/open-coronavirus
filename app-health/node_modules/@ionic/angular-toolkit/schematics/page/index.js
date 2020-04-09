"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const find_module_1 = require("@schematics/angular/utility/find-module");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const project_1 = require("@schematics/angular/utility/project");
const validation_1 = require("@schematics/angular/utility/validation");
const ts = require("typescript");
const util_1 = require("../util");
const ast_util_1 = require("../util/ast-util");
const change_1 = require("../util/change");
function findRoutingModuleFromOptions(host, options) {
    if (options.hasOwnProperty('skipImport') && options.skipImport) {
        return undefined;
    }
    if (!options.module) {
        const pathToCheck = (options.path || '')
            + (options.flat ? '' : '/' + core_1.strings.dasherize(options.name));
        return core_1.normalize(findRoutingModule(host, pathToCheck));
    }
    else {
        const modulePath = core_1.normalize('/' + (options.path) + '/' + options.module);
        const moduleBaseName = core_1.normalize(modulePath).split('/').pop();
        if (host.exists(modulePath)) {
            return core_1.normalize(modulePath);
        }
        else if (host.exists(modulePath + '.ts')) {
            return core_1.normalize(modulePath + '.ts');
        }
        else if (host.exists(modulePath + '.module.ts')) {
            return core_1.normalize(modulePath + '.module.ts');
        }
        else if (host.exists(modulePath + '/' + moduleBaseName + '.module.ts')) {
            return core_1.normalize(modulePath + '/' + moduleBaseName + '.module.ts');
        }
        else {
            throw new Error('Specified module does not exist');
        }
    }
}
function findRoutingModule(host, generateDir) {
    let dir = host.getDir('/' + generateDir);
    const routingModuleRe = /-routing\.module\.ts/;
    while (dir) {
        const matches = dir.subfiles.filter(p => routingModuleRe.test(p));
        if (matches.length === 1) {
            return core_1.join(dir.path, matches[0]);
        }
        else if (matches.length > 1) {
            throw new Error('More than one module matches. Use skip-import option to skip importing '
                + 'the component into the closest module.');
        }
        dir = dir.parent;
    }
    throw new Error('Could not find an NgModule. Use the skip-import '
        + 'option to skip importing in NgModule.');
}
function addRouteToNgModule(options) {
    const { module } = options;
    if (!module) {
        throw new schematics_1.SchematicsException('module option is required.');
    }
    return host => {
        const text = host.read(module);
        if (!text) {
            throw new schematics_1.SchematicsException(`File ${module} does not exist.`);
        }
        const sourceText = text.toString('utf8');
        const source = ts.createSourceFile(module, sourceText, ts.ScriptTarget.Latest, true);
        const pagePath = (`/${options.path}/` +
            (options.flat ? '' : `${core_1.strings.dasherize(options.name)}/`) +
            `${core_1.strings.dasherize(options.name)}.module`);
        const relativePath = find_module_1.buildRelativePath(module, pagePath);
        const routePath = core_1.strings.dasherize(options.routePath ? options.routePath : options.name);
        const ngModuleName = `${core_1.strings.classify(options.name)}PageModule`;
        const changes = addRouteToRoutesArray(source, module, routePath, relativePath, ngModuleName);
        const recorder = host.beginUpdate(module);
        for (const change of changes) {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
function addRouteToRoutesArray(source, ngModulePath, routePath, routeLoadChildren, ngModuleName) {
    const keywords = ast_util_1.findNodes(source, ts.SyntaxKind.VariableStatement);
    for (const keyword of keywords) {
        if (ts.isVariableStatement(keyword)) {
            const [declaration] = keyword.declarationList.declarations;
            if (ts.isVariableDeclaration(declaration) && declaration.initializer && declaration.name.getText() === 'routes') {
                const node = declaration.initializer.getChildAt(1);
                const lastRouteNode = node.getLastToken();
                if (!lastRouteNode) {
                    return [];
                }
                const changes = [];
                let trailingCommaFound = false;
                if (lastRouteNode.kind === ts.SyntaxKind.CommaToken) {
                    trailingCommaFound = true;
                }
                else {
                    changes.push(new change_1.InsertChange(ngModulePath, lastRouteNode.getEnd(), ','));
                }
                changes.push(new change_1.InsertChange(ngModulePath, lastRouteNode.getEnd() + 1, `  {\n    path: '${routePath}',\n    loadChildren: () => import('${routeLoadChildren}').then( m => m.${ngModuleName})\n  }${trailingCommaFound ? ',' : ''}\n`));
                return changes;
            }
        }
    }
    return [];
}
function default_1(options) {
    return (host, context) => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        const project = project_1.getProject(host, options.project);
        if (options.path === undefined) {
            options.path = project_1.buildDefaultPath(project);
        }
        options.module = findRoutingModuleFromOptions(host, options);
        const parsedPath = parse_name_1.parseName(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector ? options.selector : util_1.buildSelector(options, project.prefix);
        validation_1.validateName(options.name);
        validation_1.validateHtmlSelector(options.selector);
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            options.spec ? schematics_1.noop() : schematics_1.filter(p => !p.endsWith('.spec.ts')),
            schematics_1.template(Object.assign(Object.assign(Object.assign({}, core_1.strings), { 'if-flat': (s) => options.flat ? '' : s }), options)),
            schematics_1.move(parsedPath.path),
        ]);
        return schematics_1.chain([
            schematics_1.branchAndMerge(schematics_1.chain([
                addRouteToNgModule(options),
                schematics_1.mergeWith(templateSource),
            ])),
        ])(host, context);
    };
}
exports.default = default_1;
