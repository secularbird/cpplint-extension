# cpplint README

This extension utilizes the cpplint checker to provide C and C++ code style checker within Visual Studio Code.

[![Build Status](https://travis-ci.org/secularbird/cpplint-extension.svg?branch=master)](https://travis-ci.org/secularbird/cpplint-extension)

## Features

* check coding style of cpp and c, when open and save source file

![feature](https://github.com/secularbird/cpplint-extension/raw/master/feature.png)

## Requirements

### Install cpplint

#### Install from source

https://github.com/cpplint/cpplint

#### Mac & Linux

```bash
sudo pip install cpplint
```

#### Windows

* install anaconda
download link: https://repo.continuum.io/archive/Anaconda2-5.0.0-Windows-x86_64.exe

* install cpplint
open the anaconda Prompt, run the following command
```batch
pip install cpplint
```

#### Check the install result

##### Linux

```text
ls -l /usr/local/bin/cpplint
-rwxr-xr-x 1 root root 381 May  3 08:19 /usr/local/bin/cpplint
```

##### Mac

```bash
ls -l /opt/local/Library/Frameworks/Python.framework/Versions/2.7/bin/cpplint
-rwxr-xr-x  1 root  wheel  468 Apr 30 22:57 /opt/local/Library/Frameworks/Python.framework/Versions/2.7/bin/cpplint
```

or

```bash
ls -l /opt/local/Library/Frameworks/Python.framework/Versions/3.5/bin/cpplint
-rwxr-xr-x  1 root  wheel  267 Apr 30 22:03 /opt/local/Library/Frameworks/Python.framework/Versions/3.5/bin/cpplint
```

##### Windows

``` bath
dir c:\ProgramData\Anaconda2\Scripts\cpplint.exe
```

## Extension Settings

* `cpplint.cpplintPath`: set cpplint executable path, path on windows should like `c:\\ProgramData\\Anaconda2\\Scripts\\cpplint.exe`
* `cpplint.lintMode`: set cpplint mode, avialable value are single and workspace
* `cpplint.lineLength`: set line length strict, default is 80 characters
* `cpplint.excludes`: set exclude rules, which is related path and shell globbing is preforming, abosluted path is supported right now
* `cpplint.filters`: set filters, only error messages whose category names pass the filters will be printed
* `cpplint.root`: set the root directory used for deriving header guard CPP variables
* `cpplint.repository`: set top level directory of the repository, used to derive the header guard CPP variable
* `cpplint.extensions`: set the allowed file extensions that cpplint will check
* `cpplint.languages`: set the allowed vscode language identifiers that cpplint will check *(Currently only on single file mode)*
* `cpplint.headers`: set the allowed header extensions that cpplint will consider to be header files
* `cpplint.verbose`: verbose level, errors with lower verbosity levels have lower confidence and are more likely to be false positives

## Known Issues

Any issues please contact: [cpplint](https://github.com/secularbird/cpplint-extension/issues)
