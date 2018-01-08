/**
 * LINTER.TS
 * ---------
 * Parses cpplint output and adds linting hints to files.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { runOnFile } from './runner';
import { runOnWorkspace } from './runner';


function getCorrectFileName(p: string): string {
    if (!fs.existsSync(p)) {
        p = path.join(vscode.workspace.rootPath, p);
        if (!fs.existsSync(p)) {
            return null;
        }
    }
    return p;
}

function cpplintSeverityToDiagnosticSeverity(severity: string): vscode.DiagnosticSeverity {
    switch (severity) {
        case 'error':
            return vscode.DiagnosticSeverity.Error;
        case 'warning':
            return vscode.DiagnosticSeverity.Warning;
        default:
            return vscode.DiagnosticSeverity.Information;
    }
}

export function analysisResult(diagnosticCollection: vscode.DiagnosticCollection, result:string) {
    diagnosticCollection.clear();

    // 1 = path, 2 = line, 3 = severity, 4 = message
    let regex = /^(.*)\(([0-9]+)\):\s*(\w+):(.*\s+\[.*\])\s+\[([0-9]+)\]/gm;
    let regexArray: RegExpExecArray;
    let fileData: {[key:string]:RegExpExecArray[]} = {};
    while (regexArray = regex.exec(result)) {
        if (regexArray[1] === undefined || regexArray[2] === undefined 
            || regexArray[3] === undefined || regexArray[4] === undefined
            || regexArray[5] === undefined ) {
            continue;
        }

        let fileName = getCorrectFileName(regexArray[1]);
        if (!(fileName in fileData)) {
            fileData[fileName] = [];
        }
        fileData[fileName].push(regexArray);
    }

    for (let fileName in fileData) {
        vscode.workspace.openTextDocument(fileName).then((doc: vscode.TextDocument) => {
            let diagnostics: vscode.Diagnostic[] = [];
            for (let index = 0; index < fileData[fileName].length; index++) {
                let array = fileData[fileName][index];
                let line = Number(array[2]);
                let severity = array[3];
                let message = array[4];

                if (line > 0) {
                    line--;
                }

                let l = doc.lineAt(line);
                let r = new vscode.Range(line, 0, line, l.text.length);
                let d = new vscode.Diagnostic(r, `(${severity}) ${message}`, cpplintSeverityToDiagnosticSeverity(severity));
                d.source = 'cpplint';
                diagnostics.push(d);
            }
            diagnosticCollection.set(doc.uri, diagnostics);
        });
    }
}

export function Lint(diagnosticCollection: vscode.DiagnosticCollection, config: {[key:string]:any}, enableworkspace:boolean) {
    let cpplintOutput;
    if (enableworkspace) {
        let workspaces:string[] = [];
        for(let folder of vscode.workspace.workspaceFolders) {
            workspaces = workspaces.concat(folder.uri.fsPath)
        }
        cpplintOutput = runOnWorkspace(workspaces, config);
    } else {
        let activedoc = vscode.window.activeTextEditor.document;
        let filename = activedoc.fileName;
        let workspacefolder = vscode.workspace.getWorkspaceFolder(activedoc.uri)
        let workspaces = null;
        if(workspacefolder != undefined) {
            workspaces = [workspacefolder.uri.fsPath]
        }
        cpplintOutput = runOnFile(filename, workspaces, config);
    }
    analysisResult(diagnosticCollection, cpplintOutput)
}