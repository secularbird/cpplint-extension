'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as an from './runner';
import { Lint } from './lint';
import { analysisResult } from './lint'
import * as configuration from './configuration'
import { ConfigManager } from './configuration';

let outputChannel: vscode.OutputChannel;
let statusItem: vscode.StatusBarItem;
let timer: NodeJS.Timer;

let diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('cpplint');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('CppLint');
    // outputChannel.appendLine('CppLint is running.');
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cpplint" is now active!');

    loadConfigure();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let single = vscode.commands.registerCommand('cpplint.runAnalysis', runAnalysis);
    context.subscriptions.push(single);

    let whole = vscode.commands.registerCommand('cpplint.runWholeAnalysis', runWholeAnalysis);
    context.subscriptions.push(whole);

    vscode.workspace.onDidChangeConfiguration((()=>loadConfigure()).bind(this));
}

function runAnalysis(): Promise<void> {
    var edit = vscode.window.activeTextEditor;
    if (edit == undefined) {
        return Promise.reject("no edit opened");
    }

    outputChannel.show();
    outputChannel.clear();

    let start = 'CppLint started: ' + new Date().toString();
    outputChannel.appendLine(start);

    let result = an.runOnFile();
    outputChannel.appendLine(result);

    let end = 'CppLint ended: ' + new Date().toString();
    outputChannel.appendLine(end);

    // vscode.window.showInformationMessage(edit.document.uri.fsPath)
    return Promise.resolve()
}

function runWholeAnalysis(): Promise<void> {
    outputChannel.show();
    outputChannel.clear();

    let start = 'CppLint started: ' + new Date().toString();
    outputChannel.appendLine(start);

    let result = an.runOnWorkspace();
    outputChannel.appendLine(result);

    let end = 'CppLint ended: ' + new Date().toString();
    outputChannel.appendLine(end);

    // vscode.window.showInformationMessage(edit.document.uri.fsPath)
    return Promise.resolve()
}

// this method is called when your extension is deactivated
export function deactivate() {
    clearTimeout(timer)
    vscode.window.showInformationMessage("Cpplint deactivated")
}

function doLint() {
    if (vscode.window.activeTextEditor) {
        let language = vscode.window.activeTextEditor.document.languageId
        if (ConfigManager.getInstance().isSupportLanguage(language)) {
            if (ConfigManager.getInstance().isSingleMode()) {
                Lint(diagnosticCollection, false);
            } else {
                Lint(diagnosticCollection, true);
            }
        }
    }
    clearTimeout(timer)
}

function startLint() {
    timer = global.setTimeout(doLint, 1.5 * 1000);
}

function startLint2() {
    timer = global.setTimeout(doLint, 500);
}

function loadConfigure() {
    ConfigManager.getInstance().initialize();
    if (ConfigManager.getInstance().isSingleMode()) {
        startLint2();
        vscode.window.onDidChangeActiveTextEditor((() => startLint2()).bind(this));
        vscode.workspace.onDidSaveTextDocument((() => startLint2()).bind(this));
    } else {
        // start timer to do workspace lint
        startLint();
        vscode.workspace.onDidSaveTextDocument((() => startLint()).bind(this));
    }
}
