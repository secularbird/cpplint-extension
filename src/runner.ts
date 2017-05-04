import { spawnSync } from "child_process";
import * as vscode from 'vscode';

export function runOnFile(filename:string, workspace:string){
    let result = runCppLint(filename, workspace);
    return result;
}

function getCpplintPath()
{
    let settings = vscode.workspace.getConfiguration('cpplint');
    let cpplintPath = settings.get('cpplintPath', null);
    return cpplintPath;
}

function runCppLint(filename:string, workspace:string) {
    let start = 'CppLint started: ' + new Date().toString();
    let cpplint = getCpplintPath();
    let param: string[] = ['--output=vs7', filename]
    let result = spawnSync(cpplint, param, {'cwd': workspace})
    let stdout = '' + result.stdout;
    let stderr = '' + result.stderr;
    let end = 'CppLint ended: ' + new Date().toString();
    let out = [start, stdout, stderr, end].join('\n');
    return out;
}