import { spawnSync } from "child_process";
import * as vscode from 'vscode';

export function runOnFile(filename:string, workspaces:string[], config: {[key:string]: any}){
    let result = runCppLint(filename, workspaces, config, false);
    return result;
}

export function runOnWorkspace(workspaces:string[], config: {[key:string]: any}){
    let result = runCppLint(null, workspaces, config, true);
    return result;
}

function runCppLint(filename:string, workspaces:string[], config: {[key:string]: any}, enableworkspace:boolean) {
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
        let out = [start];
        for (let workspace of workspaces) {
            out.push("Scan workspace: " + workspace);
            let workspaceparam = param;
            if (config['repository'].length != 0) {
                workspaceparam.push("--repository=" + config["repository"].replace("${workspaceFloder}", workspace));
            }

            if (config['root'].length != 0) {
                workspaceparam.push("--root=" + config["root"].replace("${workspaceFolder}", workspace));
            }
            workspaceparam = workspaceparam.concat(["--recursive", workspace]);

            let output = lint(cpplint, workspaceparam)
            out = out.concat(output)
        }
        let end = 'CppLint ended: ' + new Date().toString();
        out.push(end);
        return out.join('\n');

    } else {
        if (config['repository'].length != 0) {
            if (workspaces != null) {
                let workspace = workspaces[0]
                param.push("--repository=" + config["repository"].replace("${workspaceFloder}", workspace));
            }
        }

        if (config['root'].length != 0) {
            if (workspaces != null) {
                let workspace = workspaces[0]
                param.push("--root=" + config["root"].replace("${workspaceFolder}", workspace));
            }
        }
        param.push(filename);
        let output = lint(cpplint, param)
        let end = 'CppLint ended: ' + new Date().toString();
        let out = [start].concat(output).concat(end)
        return out.join('\n');
    }
}

function lint(exec:string, params:string[]) {
    let result = spawnSync(exec, params)
    let stdout = result.stdout;
    let stderr = result.stderr;
    let out = [result.stdout, result.stderr]
    return out;
}