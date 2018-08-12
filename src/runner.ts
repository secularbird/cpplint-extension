import { exec } from "child_process";
import * as vscode from 'vscode';
import { ConfigManager } from "./configuration";
import { analysisResult } from './lint';


export function runOnFile() {
    if (vscode.window.activeTextEditor == undefined) {
        return  ""
    }
    let activedoc = vscode.window.activeTextEditor.document;
    let filename = activedoc.fileName;
    let workspacefolder = vscode.workspace.getWorkspaceFolder(activedoc.uri)
    let workspaces = null;
    if (workspacefolder != undefined) {
        workspaces = [workspacefolder.uri.fsPath]
    }

    if (ConfigManager.getInstance().isSupportLanguage(activedoc.languageId)) {
        runCppLint(filename, workspaces, false)
    }
}

export function runOnWorkspace() {
    let workspaces: string[] = [];
    for (let folder of vscode.workspace.workspaceFolders) {
        workspaces = workspaces.concat(folder.uri.fsPath)
    }
    runCppLint(null, workspaces, true)
}

export function runCppLint(filename: string, workspaces: string[], enableworkspace: boolean) {
    let config = ConfigManager.getInstance().getConfig();
    let cpplint = config["cpplintPath"];
    let linelength = "--linelength=" + config['lineLength'];
    let param: string[] = ['--output=vs7', linelength];

    if (config['excludes'].length != 0) {
        config['excludes'].forEach(element => {
            if (element[0] == "/") {
                param.push("--exclude=" + element);
            } else {
                workspaces.forEach(workspace => {
                    param.push("--exclude=" + workspace + "/" + element)
                });
            }
        });
    }

    if (config['filters'].length != 0) {
        param.push("--filter=" + config["filters"].join(','))
    }

    if (config["extensions"].length != 0) {
        param.push("--extensions=" + config["extensions"].join(','))
    }

    if (config["headers"].length != 0) {
        param.push("--headers=" + config["headers"].join(','))
    }

    param.push("--verbose=" + config['verbose']);

    if (enableworkspace) {
        for (let workspace of workspaces) {
            let workspaceparam = param;
            if (config['repository'].length != 0) {
                workspaceparam.push("--repository=" + config["repository"].replace("${workspaceFloder}", workspace));
            }

            if (config['root'].length != 0) {
                workspaceparam.push("--root=" + config["root"].replace("${workspaceFolder}", workspace));
            }
            workspaceparam = workspaceparam.concat(["--recursive", workspace]);

            lint(cpplint, workspaceparam);
        }
    } else {
        let workspace = ""
        if (workspaces != null) {
            workspace = workspaces[0];
        }

        if (config['repository'].length != 0) {
            param.push("--repository=" + config["repository"].replace("${workspaceFolder}", workspace));
        }

        if (config['root'].length != 0) {
            param.push("--root=" + config["root"].replace("${workspaceFolder}", workspace));
        }

        param.push(filename);
        lint(cpplint, param);
    }
}

let lintstats = null

function lint(executable: string, params: string[]) {
    let param_string = params.join(" ")

    if(lintstats != null){
        lintstats.kill()
    }

    lintstats = exec(executable + ' ' + param_string, (error, stdout, stderr) => {
        let cpplintOutput = [stdout, stderr].join('\n')
        analysisResult(cpplintOutput)
    })

}