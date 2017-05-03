import { spawnSync } from "child_process";

export function runOnFile(filename:string, workspace:string){
    let result = runCppLint(filename, workspace);
    return result;
}

function runCppLint(filename:string, workspace:string) {
    let start = 'CppLint started: ' + new Date().toString();
    let cpplint = "/opt/local/Library/Frameworks/Python.framework/Versions/2.7/bin/cpplint"
    let param: string[] = ['--output=vs7', filename]
    let result = spawnSync(cpplint, param, {'cwd': workspace})
    let stdout = '' + result.stdout;
    let stderr = '' + result.stderr;
    let end = 'CppLint ended: ' + new Date().toString();
    let out = [start, stdout, stderr, end].join('\n');
    return out;
}