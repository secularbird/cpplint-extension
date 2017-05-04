'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as an from './runner';
import { Lint } from './lint';
import { platform } from 'os';
import { join } from 'path';
import { each, isNull } from 'lodash';
import { existsSync } from 'fs';

let disposables: Set<any>;
let config: {[key:string]:any};
let outputChannel: vscode.OutputChannel;
let statusItem: vscode.StatusBarItem;

let diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('cpplint');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    disposables = new Set();
    outputChannel = vscode.window.createOutputChannel('CppLint');
    disposables.add(outputChannel);
    // outputChannel.appendLine('CppLint is running.');
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cpplint" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('cpplint.runAnalysis', runAnalysis);

    context.subscriptions.push(disposable);

    checkConfiguration()
    vscode.workspace.onDidSaveTextDocument((() => doLint()).bind(this));
    vscode.workspace.onDidOpenTextDocument((() => doLint()).bind(this));
}

function runAnalysis() : Promise<void> {
    var edit = vscode.window.activeTextEditor;
    if (!edit) {
        return;
    }
    let filename = vscode.window.activeTextEditor.document.fileName;
    let workspace = vscode.workspace.rootPath;
    let result = an.runOnFile(filename, workspace);

    outputChannel.show();
    outputChannel.clear();
    outputChannel.appendLine(result);

    // vscode.window.showInformationMessage(edit.document.uri.fsPath)
    return Promise.resolve()
}

// this method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage("Cpplint deactivated")
}

function doLint() {
    Lint(diagnosticCollection, config);
}

function findCpplintPath(settings: vscode.WorkspaceConfiguration) {
    let cpplintPath = settings.get('cpplintPath', null);

    if (isNull(cpplintPath)) {
        let p = platform();
        if (p === 'win32') {
            // TODO: add win32 and win64 cpplint path
        }
        else if (p === 'linux' || p === 'darwin') {
            let attempts = [ '/usr/local/bin/cpplint' ];
            for (let index = 0; index < attempts.length; index++) {
                if (existsSync(attempts[index])) {
                    cpplintPath = attempts[index];
                    break;
                }
            }
        }
    }

    return cpplintPath;
}

function checkConfiguration() {
    config = {};
    let settings = vscode.workspace.getConfiguration('cpplint');

    if (settings) {
        var cpplintPath = findCpplintPath(settings);

        if (!existsSync(cpplintPath)) {
            vscode.window.showErrorMessage('Cpplint: Could not find cpplint executable');
        }

        config['cpplintPath'] = cpplintPath;
    }
}