# cpplint README

This extension utilizes the cpplint checker to provide C and C++ code style checker within Visual Studio Code.

[![Build Status](https://travis-ci.org/secularbird/cpplint-extension.svg?branch=master)](https://travis-ci.org/secularbird/cpplint-extension)

## Features

* check coding style of cpp and c, when open and save source file

![feature](https://github.com/secularbird/cpplint-extension/raw/master/feature.png)


## Requirements

### Install cpplint

#### install from source
https://github.com/google/styleguide/tree/gh-pages/cpplint

#### Mac & linux:
```bash
sudo pip install cpplint
```

#### Check the install result
##### linux:
```text
ls -l /usr/local/bin/cpplint
-rwxr-xr-x 1 root root 381 May  3 08:19 /usr/local/bin/cpplint
```
##### Mac:
```
ls -l /opt/local/Library/Frameworks/Python.framework/Versions/2.7/bin/cpplint
-rwxr-xr-x  1 root  wheel  468 Apr 30 22:57 /opt/local/Library/Frameworks/Python.framework/Versions/2.7/bin/cpplint
```
or
```
ls -l /opt/local/Library/Frameworks/Python.framework/Versions/3.5/bin/cpplint
-rwxr-xr-x  1 root  wheel  267 Apr 30 22:03 /opt/local/Library/Frameworks/Python.framework/Versions/3.5/bin/cpplint
```

## Extension Settings

* `cpplint.cpplintPath`: set cpplint executable path
* `cpplint.lintMode`: set cpplint mode, avialable value are single and workspace

## Known Issues
Any issues please contact: [cpplint](https://github.com/secularbird/cpplint-extension/issues)