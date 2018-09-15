import { spawnSync } from "child_process";
import * as vscode from 'vscode';
import { ConfigManager } from "./configuration";
import * as path from 'path';

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
        let result = runCppLint(filename, workspaces, false);
        return result;
    } else {
        return "";
    }
}

export function runOnWorkspace() {
    let workspaces: string[] = [];
    for (let folder of vscode.workspace.workspaceFolders) {
        workspaces = workspaces.concat(folder.uri.fsPath)
    }
    let result = runCppLint(null, workspaces, true);
    return result;
}

export function runCppLint(filename: string, workspaces: string[], enableworkspace: boolean) {
    let config = ConfigManager.getInstance().getConfig();
    let cpplint = config["cpplintPath"];
    let linelength = "--linelength=" + config['lineLength'];
    let param: string[] = ['--output=eclipse', linelength];

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
        let out = [];
        for (let workspace of workspaces) {
            out.push("Scan workspace: " + workspace);
            let workspaceparam = param;
            if (config['repository'].length != 0) {
                let repo: string = "--repository=" + config["repository"].replace("${workspaceFolder}", workspace);
                repo = repo.replace("${workspaceFolderBasename}", path.basename(workspace));

                workspaceparam.push(repo);
            }

            if (config['root'].length != 0) {
                let root: string = "--root=" + config["root"].replace("${workspaceFolder}", workspace);
                root = root.replace("${workspaceFolderBasename}", path.basename(workspace));

                workspaceparam.push(root);
            }
            workspaceparam = workspaceparam.concat(["--recursive", workspace]);

            let output = lint(cpplint, workspaceparam);
            out = output;
        }
        return out.join('\n');

    } else {
        let workspace = ""
        if (workspaces != null) {
            workspace = workspaces[0];
        }

        if (config['repository'].length != 0) {
            let repo: string = "--repository=" + config["repository"].replace("${workspaceFolder}", workspace);
            repo = repo.replace("${workspaceFolderBasename}", path.basename(workspace));

            param.push(repo);
        }

        if (config['root'].length != 0) {
            let root: string = "--root=" + config["root"].replace("${workspaceFolder}", workspace);
            root = root.replace("${workspaceFolderBasename}", path.basename(workspace));

            param.push(root);
        }

        param.push(filename);
        let output = lint(cpplint, param);
        let end = 'CppLint ended: ' + new Date().toString();
        let out = output;
        return out.join('\n');
    }
}

function lint(exec: string, params: string[]) {
    let result = spawnSync(exec, params)
    let stdout = result.stdout;
    let stderr = result.stderr;
    let out = [result.stdout, result.stderr]
    return out;
}
