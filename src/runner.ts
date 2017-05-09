import { spawnSync } from "child_process";
import * as vscode from 'vscode';

export function runOnFile(filename:string, workspace:string, config: {[key:string]: any}){
    let result = runCppLint(filename, workspace, config);
    return result;
}

export function runOnWorkspace(filename:string, workspace:string, config: {[key:string]: any}){
    let result = runWholeCppLint(filename, workspace, config);
    return result;
}

function runCppLint(filename:string, workspace:string, config: {[key:string]: any}) {
    let start = 'CppLint started: ' + new Date().toString();
    let cpplint = config["cpplintPath"];
    let param:string[] = ['--output=vs7', filename]
    let result = spawnSync(cpplint, param, {'cwd': workspace})
    let stdout = '' + result.stdout;
    let stderr = '' + result.stderr;
    let end = 'CppLint ended: ' + new Date().toString();
    let out = [start, stdout, stderr, end].join('\n');
    return out;
}

function runWholeCppLint(filename:string, workspace:string, config: {[key:string]: any}) {
    let start = 'CppLint started: ' + new Date().toString();
    let cpplint = config["cpplintPath"];
    let param = ['--output=vs7', "--recursive", "."]
    let result = spawnSync(cpplint, param, {'cwd': workspace})
    let stdout = '' + result.stdout;
    let stderr = '' + result.stderr;
    let end = 'CppLint ended: ' + new Date().toString();
    let out = [start, stdout, stderr, end].join('\n');
    return out;
}