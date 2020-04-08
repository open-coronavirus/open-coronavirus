"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const change_1 = require("./change");
/* tslint:disable */
function insertImport(source, fileToEdit, symbolName, fileName, isDefault = false) {
    const rootNode = source;
    const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);
    // get nodes that map to import statements from the file fileName
    const relevantImports = allImports.filter(node => {
        // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
        const importFiles = node.getChildren()
            .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
            .map(n => n.text);
        return importFiles.filter(file => file === fileName).length === 1;
    });
    if (relevantImports.length > 0) {
        let importsAsterisk = false;
        // imports from import file
        const imports = [];
        relevantImports.forEach(n => {
            Array.prototype.push.apply(imports, findNodes(n, ts.SyntaxKind.Identifier));
            if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                importsAsterisk = true;
            }
        });
        // if imports * from fileName, don't add symbolName
        if (importsAsterisk) {
            return new change_1.NoopChange();
        }
        const importTextNodes = imports.filter(n => n.text === symbolName);
        // insert import if it's not there
        if (importTextNodes.length === 0) {
            const fallbackPos = findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
                findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();
            return insertAfterLastOccurrence(imports, `, ${symbolName}`, fileToEdit, fallbackPos);
        }
        return new change_1.NoopChange();
    }
    // no such import declaration exists
    const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
        .filter((n) => n.getText() === 'use strict');
    let fallbackPos = 0;
    if (useStrict.length > 0) {
        fallbackPos = useStrict[0].end;
    }
    const open = isDefault ? '' : '{ ';
    const close = isDefault ? '' : ' }';
    // if there are no imports or 'use strict' statement, insert import at beginning of file
    const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
    const separator = insertAtBeginning ? '' : ';\n';
    const toInsert = `${separator}import ${open}${symbolName}${close}` +
        ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;
    return insertAfterLastOccurrence(allImports, toInsert, fileToEdit, fallbackPos, ts.SyntaxKind.StringLiteral);
}
exports.insertImport = insertImport;
//Safe
function findNodes(node, kind, max = Infinity, recursive = false) {
    if (!node || max == 0) {
        return [];
    }
    const arr = [];
    if (node.kind === kind) {
        arr.push(node);
        max--;
    }
    if (max > 0 && (recursive || node.kind !== kind)) {
        for (const child of node.getChildren()) {
            findNodes(child, kind, max).forEach(node => {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });
            if (max <= 0) {
                break;
            }
        }
    }
    return arr;
}
exports.findNodes = findNodes;
function getSourceNodes(sourceFile) {
    const nodes = [sourceFile];
    const result = [];
    while (nodes.length > 0) {
        const node = nodes.shift();
        if (node) {
            result.push(node);
            if (node.getChildCount(sourceFile) >= 0) {
                nodes.unshift(...node.getChildren());
            }
        }
    }
    return result;
}
exports.getSourceNodes = getSourceNodes;
function findNode(node, kind, text) {
    if (node.kind === kind && node.getText() === text) {
        // throw new Error(node.getText());
        return node;
    }
    let foundNode = null;
    ts.forEachChild(node, childNode => {
        foundNode = foundNode || findNode(childNode, kind, text);
    });
    return foundNode;
}
exports.findNode = findNode;
function nodesByPosition(first, second) {
    return first.getStart() - second.getStart();
}
function insertAfterLastOccurrence(nodes, toInsert, file, fallbackPos, syntaxKind) {
    let lastItem;
    for (const node of nodes) {
        if (!lastItem || lastItem.getStart() < node.getStart()) {
            lastItem = node;
        }
    }
    if (syntaxKind && lastItem) {
        lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
    }
    if (!lastItem && fallbackPos == undefined) {
        throw new Error(`tried to insert ${toInsert} as first occurence with no fallback position`);
    }
    const lastItemPosition = lastItem ? lastItem.getEnd() : fallbackPos;
    return new change_1.InsertChange(file, lastItemPosition, toInsert);
}
exports.insertAfterLastOccurrence = insertAfterLastOccurrence;
function getContentOfKeyLiteral(_source, node) {
    if (node.kind == ts.SyntaxKind.Identifier) {
        return node.text;
    }
    else if (node.kind == ts.SyntaxKind.StringLiteral) {
        return node.text;
    }
    else {
        return null;
    }
}
exports.getContentOfKeyLiteral = getContentOfKeyLiteral;
function _angularImportsFromNode(node, _sourceFile) {
    const ms = node.moduleSpecifier;
    let modulePath;
    switch (ms.kind) {
        case ts.SyntaxKind.StringLiteral:
            modulePath = ms.text;
            break;
        default:
            return {};
    }
    if (!modulePath.startsWith('@angular/')) {
        return {};
    }
    if (node.importClause) {
        if (node.importClause.name) {
            // This is of the form `import Name from 'path'`. Ignore.
            return {};
        }
        else if (node.importClause.namedBindings) {
            const nb = node.importClause.namedBindings;
            if (nb.kind == ts.SyntaxKind.NamespaceImport) {
                // This is of the form `import * as name from 'path'`. Return `name.`.
                return {
                    [(nb).name.text + '.']: modulePath,
                };
            }
            else {
                // This is of the form `import {a,b,c} from 'path'`
                const namedImports = nb;
                return namedImports.elements
                    .map((is) => is.propertyName ? is.propertyName.text : is.name.text)
                    .reduce((acc, curr) => {
                    acc[curr] = modulePath;
                    return acc;
                }, {});
            }
        }
        return {};
    }
    else {
        // This is of the form `import 'path';`. Nothing to do.
        return {};
    }
}
function getDecoratorMetadata(source, identifier, module) {
    const angularImports = findNodes(source, ts.SyntaxKind.ImportDeclaration)
        .map((node) => _angularImportsFromNode(node, source))
        .reduce((acc, current) => {
        for (const key of Object.keys(current)) {
            acc[key] = current[key];
        }
        return acc;
    }, {});
    return getSourceNodes(source)
        .filter(node => {
        return node.kind == ts.SyntaxKind.Decorator
            && node.expression.kind == ts.SyntaxKind.CallExpression;
    })
        .map(node => node.expression)
        .filter(expr => {
        if (expr.expression.kind == ts.SyntaxKind.Identifier) {
            const id = expr.expression;
            return id.text == identifier && angularImports[id.text] === module;
        }
        else if (expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
            // This covers foo.NgModule when importing * as foo.
            const paExpr = expr.expression;
            // If the left expression is not an identifier, just give up at that point.
            if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }
            const id = paExpr.name.text;
            const moduleId = paExpr.expression.text;
            return id === identifier && (angularImports[moduleId + '.'] === module);
        }
        return false;
    })
        .filter(expr => expr.arguments[0]
        && expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression)
        .map(expr => expr.arguments[0]);
}
exports.getDecoratorMetadata = getDecoratorMetadata;
function findClassDeclarationParent(node) {
    if (ts.isClassDeclaration(node)) {
        return node;
    }
    return node.parent && findClassDeclarationParent(node.parent);
}
function getFirstNgModuleName(source) {
    // First, find the @NgModule decorators.
    const ngModulesMetadata = getDecoratorMetadata(source, 'NgModule', '@angular/core');
    if (ngModulesMetadata.length === 0) {
        return undefined;
    }
    // Then walk parent pointers up the AST, looking for the ClassDeclaration parent of the NgModule
    // metadata.
    const moduleClass = findClassDeclarationParent(ngModulesMetadata[0]);
    if (!moduleClass || !moduleClass.name) {
        return undefined;
    }
    // Get the class name of the module ClassDeclaration.
    return moduleClass.name.text;
}
exports.getFirstNgModuleName = getFirstNgModuleName;
function getMetadataField(node, metadataField) {
    return node.properties
        .filter(prop => ts.isPropertyAssignment(prop))
        // Filter out every fields that's not "metadataField". Also handles string literals
        // (but not expressions).
        .filter(({ name }) => {
        return (ts.isIdentifier(name) || ts.isStringLiteral(name))
            && name.getText() === metadataField;
    });
}
exports.getMetadataField = getMetadataField;
function addSymbolToNgModuleMetadata(source, ngModulePath, metadataField, symbolName, importPath = null) {
    const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
    let node = nodes[0]; // tslint:disable-line:no-any
    // Find the decorator declaration.
    if (!node) {
        return [];
    }
    // Get all the children property assignment of object literals.
    const matchingProperties = getMetadataField(node, metadataField);
    // Get the last node of the array literal.
    if (!matchingProperties) {
        return [];
    }
    if (matchingProperties.length == 0) {
        // We haven't found the field in the metadata declaration. Insert a new field.
        const expr = node;
        let position;
        let toInsert;
        if (expr.properties.length == 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${metadataField}: [${symbolName}]\n`;
        }
        else {
            node = expr.properties[expr.properties.length - 1];
            position = node.getEnd();
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            const matches = text.match(/^\r?\n\s*/);
            if (matches && matches.length > 0) {
                toInsert = `,${matches[0]}${metadataField}: [${symbolName}]`;
            }
            else {
                toInsert = `, ${metadataField}: [${symbolName}]`;
            }
        }
        if (importPath !== null) {
            return [
                new change_1.InsertChange(ngModulePath, position, toInsert),
                insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
            ];
        }
        else {
            return [new change_1.InsertChange(ngModulePath, position, toInsert)];
        }
    }
    const assignment = matchingProperties[0];
    // If it's not an array, nothing we can do really.
    if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return [];
    }
    const arrLiteral = assignment.initializer;
    if (arrLiteral.elements.length == 0) {
        // Forward the property.
        node = arrLiteral;
    }
    else {
        node = arrLiteral.elements;
    }
    if (!node) {
        // tslint:disable-next-line: no-console
        console.error('No app module found. Please add your new class to your component.');
        return [];
    }
    if (Array.isArray(node)) {
        const nodeArray = node;
        const symbolsArray = nodeArray.map(node => node.getText());
        if (symbolsArray.includes(symbolName)) {
            return [];
        }
        node = node[node.length - 1];
    }
    let toInsert;
    let position = node.getEnd();
    if (node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
        // We haven't found the field in the metadata declaration. Insert a new
        // field.
        const expr = node;
        if (expr.properties.length == 0) {
            position = expr.getEnd() - 1;
            toInsert = `  ${symbolName}\n`;
        }
        else {
            // Get the indentation of the last element, if any.
            const text = node.getFullText(source);
            if (text.match(/^\r?\r?\n/)) {
                toInsert = `,${text.match(/^\r?\n\s*/)[0]}${symbolName}`;
            }
            else {
                toInsert = `, ${symbolName}`;
            }
        }
    }
    else if (node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
        // We found the field but it's empty. Insert it just before the `]`.
        position--;
        toInsert = `${symbolName}`;
    }
    else {
        // Get the indentation of the last element, if any.
        const text = node.getFullText(source);
        if (text.match(/^\r?\n/)) {
            toInsert = `,${text.match(/^\r?\n(\r?)\s*/)[0]}${symbolName}`;
        }
        else {
            toInsert = `, ${symbolName}`;
        }
    }
    if (importPath !== null) {
        return [
            new change_1.InsertChange(ngModulePath, position, toInsert),
            insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
        ];
    }
    return [new change_1.InsertChange(ngModulePath, position, toInsert)];
}
exports.addSymbolToNgModuleMetadata = addSymbolToNgModuleMetadata;
function addDeclarationToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'declarations', classifiedName, importPath);
}
exports.addDeclarationToModule = addDeclarationToModule;
function addImportToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'imports', classifiedName, importPath);
}
exports.addImportToModule = addImportToModule;
function addProviderToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'providers', classifiedName, importPath);
}
exports.addProviderToModule = addProviderToModule;
function addExportToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'exports', classifiedName, importPath);
}
exports.addExportToModule = addExportToModule;
function addBootstrapToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'bootstrap', classifiedName, importPath);
}
exports.addBootstrapToModule = addBootstrapToModule;
function addEntryComponentToModule(source, modulePath, classifiedName, importPath) {
    return addSymbolToNgModuleMetadata(source, modulePath, 'entryComponents', classifiedName, importPath);
}
exports.addEntryComponentToModule = addEntryComponentToModule;
function isImported(source, classifiedName, importPath) {
    const allNodes = getSourceNodes(source);
    const matchingNodes = allNodes
        .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
        .filter((imp) => imp.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral)
        .filter((imp) => {
        return imp.moduleSpecifier.text === importPath;
    })
        .filter((imp) => {
        if (!imp.importClause) {
            return false;
        }
        const nodes = findNodes(imp.importClause, ts.SyntaxKind.ImportSpecifier)
            .filter(n => n.getText() === classifiedName);
        return nodes.length > 0;
    });
    return matchingNodes.length > 0;
}
exports.isImported = isImported;
function getEnvironmentExportName(source) {
    // Initial value is `null` as we don't know yet if the user
    // has imported `environment` into the root module or not.
    let environmentExportName = null;
    const allNodes = getSourceNodes(source);
    allNodes
        .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
        .filter((declaration) => declaration.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral &&
        declaration.importClause !== undefined)
        .map((declaration) => 
    // If `importClause` property is defined then the first
    // child will be `NamedImports` object (or `namedBindings`).
    declaration.importClause.getChildAt(0))
        // Find those `NamedImports` object that contains `environment` keyword
        // in its text. E.g. `{ environment as env }`.
        .filter((namedImports) => namedImports.getText().includes('environment'))
        .forEach((namedImports) => {
        for (const specifier of namedImports.elements) {
            // `propertyName` is defined if the specifier
            // has an aliased import.
            const name = specifier.propertyName || specifier.name;
            // Find specifier that contains `environment` keyword in its text.
            // Whether it's `environment` or `environment as env`.
            if (name.text.includes('environment')) {
                environmentExportName = specifier.name.text;
            }
        }
    });
    return environmentExportName;
}
exports.getEnvironmentExportName = getEnvironmentExportName;
function getRouterModuleDeclaration(source) {
    const result = getDecoratorMetadata(source, 'NgModule', '@angular/core');
    const node = result[0];
    const matchingProperties = getMetadataField(node, 'imports');
    if (!matchingProperties) {
        return;
    }
    const assignment = matchingProperties[0];
    if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return;
    }
    const arrLiteral = assignment.initializer;
    return arrLiteral.elements
        .filter(el => el.kind === ts.SyntaxKind.CallExpression)
        .find(el => el.getText().startsWith('RouterModule'));
}
exports.getRouterModuleDeclaration = getRouterModuleDeclaration;
function addRouteDeclarationToModule(source, fileToAdd, routeLiteral) {
    const routerModuleExpr = getRouterModuleDeclaration(source);
    if (!routerModuleExpr) {
        throw new Error(`Couldn't find a route declaration in ${fileToAdd}.`);
    }
    const scopeConfigMethodArgs = routerModuleExpr.arguments;
    if (!scopeConfigMethodArgs.length) {
        const { line } = source.getLineAndCharacterOfPosition(routerModuleExpr.getStart());
        throw new Error(`The router module method doesn't have arguments ` +
            `at line ${line} in ${fileToAdd}`);
    }
    let routesArr;
    const routesArg = scopeConfigMethodArgs[0];
    // Check if the route declarations array is
    // an inlined argument of RouterModule or a standalone variable
    if (ts.isArrayLiteralExpression(routesArg)) {
        routesArr = routesArg;
    }
    else {
        const routesVarName = routesArg.getText();
        let routesVar;
        if (routesArg.kind === ts.SyntaxKind.Identifier) {
            routesVar = source.statements
                .filter((s) => s.kind === ts.SyntaxKind.VariableStatement)
                .find((v) => {
                return v.declarationList.declarations[0].name.getText() === routesVarName;
            });
        }
        if (!routesVar) {
            const { line } = source.getLineAndCharacterOfPosition(routesArg.getStart());
            throw new Error(`No route declaration array was found that corresponds ` +
                `to router module at line ${line} in ${fileToAdd}`);
        }
        routesArr = findNodes(routesVar, ts.SyntaxKind.ArrayLiteralExpression, 1)[0];
    }
    const occurrencesCount = routesArr.elements.length;
    const text = routesArr.getFullText(source);
    let route = routeLiteral;
    let insertPos = routesArr.elements.pos;
    if (occurrencesCount > 0) {
        const lastRouteLiteral = [...routesArr.elements].pop();
        const lastRouteIsWildcard = ts.isObjectLiteralExpression(lastRouteLiteral)
            && lastRouteLiteral
                .properties
                .some(n => (ts.isPropertyAssignment(n)
                && ts.isIdentifier(n.name)
                && n.name.text === 'path'
                && ts.isStringLiteral(n.initializer)
                && n.initializer.text === '**'));
        const indentation = text.match(/\r?\n(\r?)\s*/) || [];
        const routeText = `${indentation[0] || ' '}${routeLiteral}`;
        // Add the new route before the wildcard route
        // otherwise we'll always redirect to the wildcard route
        if (lastRouteIsWildcard) {
            insertPos = lastRouteLiteral.pos;
            route = `${routeText},`;
        }
        else {
            insertPos = lastRouteLiteral.end;
            route = `,${routeText}`;
        }
    }
    return new change_1.InsertChange(fileToAdd, insertPos, route);
}
exports.addRouteDeclarationToModule = addRouteDeclarationToModule;
