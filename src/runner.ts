import { spawnSync } from "child_process";
import * as vscode from 'vscode';

export function runOnFile(filename:string, workspace:string, config: {[key:string]: any}){
    let result = runCppLint(filename, workspace, config, false);
    return result;
}

export function runOnWorkspace(filename:string, workspace:string, config: {[key:string]: any}){
    let result = runCppLint(filename, workspace, config, true);
    return result;
}

function runCppLint(filename:string, workspace:string, config: {[key:string]: any}, enableworkspace:boolean) {
    let start = 'CppLint started: ' + new Date().toString();
    let cpplint = config["cpplintPath"];
    let linelength = "--linelength=" + config['lineLength'];
    let param:string[] = ['--output=vs7', linelength];

    if (config['excludes'].length != 0) {
        config['excludes'].forEach(element => {
            param.push("--exclude=" + element)
        });
    }
    if (config['filters'].length != 0) {
        let filter:string = "";
        config['filters'].forEach(element => {
            if(filter == "") {
                filter = element;
            } else {
                filter = filter + "," + element
            }
        });
        filter = "--filter=" + filter;
        param.push(filter);
    }

    param.push("--verbose=" + config['verbose']);

    if (enableworkspace) {
        param = param.concat([ "--recursive", "."]);
    } else {
        param.push(filename);
    }
    let result = spawnSync(cpplint, param, {'cwd': workspace})
    let stdout = '' + result.stdout;
    let stderr = '' + result.stderr;
    let end = 'CppLint ended: ' + new Date().toString();
    let out = [start, stdout, stderr, end].join('\n');
    return out;
}