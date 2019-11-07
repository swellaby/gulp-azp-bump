# gulp-azp-bump
Gulp plugin to bump the version of [Azure Pipelines][vsts-url] tasks. Note this is also available as a [standalone CLI/Lib][vsts-bump-url].

[![npmjs version Badge][npmjs-version-badge]][npmjs-pkg-url]
[![npmjs downloads Badge][npmjs-downloads-badge]][npmjs-pkg-url] [![License Badge][license-badge]][license-url]  

[![Circle CI Badge][circle-ci-badge]][circle-ci-url]
[![AppVeyor Status][appveyor-badge]][appveyor-url]
[![Test Results Badge][tests-badge]][appveyor-url]
[![Coverage Status][codecov-badge]][codecov-url]
[![Sonar Quality Gate][sonar-quality-gate-badge]][sonar-url] 

**Feature Completion Notice**

*Please note that we consider this package to be feature complete. We will continue to maintain and support this package by fixing any bugs discovered, updating dependency versions, etc. We will also consider PRs/Enhancement requests, but we do not have additional development activities planned at this time.*  

## About
Gulp plugin that supports bumping the versions of [Azure Pipelines][vsts-url] tasks. The [Azure Pipelines][vsts-url] task manifest files maintain the version as an Object which differs from the traditional semver string used to represent the version found in other files like package.json (note that the values of Major, Minor, Patch can be strings OR numbers).

[Azure Pipelines][vsts-url] task manifest example:
```json
{
    "id": "923e6d5c-0b14-462b-922e-813cbd2ef4cc",
    "name": "2018azp",
    "friendlyName": "Sample Task",
    "description": "azp",
    "author": "me",
    "version": {
        "Major": 0,
        "Minor": 1,
        "Patch": 1
    },
}
```

The [Azure Pipelines][vsts-url] task version cannot be bumped using other gulp plugins without writing a lot of extra code, so we wrote this plugin to provide simple support specifically for [Azure Pipelines][vsts-url] tasks.  

This plugin should only be used for bumping [Azure Pipelines][vsts-url] task manifest files. For bumping any other standard version string in any other type file (like in a package.json file) you should *not* use this plugin, and you should use something like [gulp-bump][gulp-bump-pkg-url] instead.

## Install
Install the package as a dev dependency:
```sh
npm i gulp-azp-bump --save-dev
```

## Usage
**Simple Usage (bumps patch version by default)**
```js
const gulp = require('gulp');
const azpBump = require('gulp-azp-bump');

gulp.task('tasks:bump', function () {
    return gulp.src(['./tasks/**/task.json'], { base: './' })
        .pipe(azpBump())
        .pipe(gulp.dest('./'));
});
```

**Specific Bump Type**
```js
const gulp = require('gulp');
const azpBump = require('gulp-azp-bump');

gulp.task('tasks:bump', function () {
    return gulp.src(['./tasks/**/task.json'], { base: './' })
        .pipe(azpBump({ type: 'minor' }))
        .pipe(gulp.dest('./'));
});
```

## Options
### **type**: string 
- *Default Value*: `'patch'`
- *Allowed Values*: `'major'`, `'minor'`, `'patch'`
- *Description*: Specifies the release type you want to bump. Technically any valid semver type (including prerelease, etc.) will be accepted, but you shouldn't use anything other than `major`, `minor`, or `patch` since that is all Azure Pipelines tasks can store. 

For example to bump the minor version value:  
```js
    .pipe(azpBump({ type: 'minor' }))
```  

Or the major version value:  
```js
    .pipe(azpBump({ type: 'major' }))
``` 

### **quiet**: boolean   
- *Default Value*: ```false```
- *Allowed Values*: ```true```, ```false```
- *Description*: Set this to ```true``` if you want to suppress the log output

Example:
```js
    .pipe(azpBump({ quiet: true }))
```  

### **versionPropertyType**: string  
- *Default Value*: ```'number'```
- *Allowed Values*: ```'number'```, ```'string'```
- *Description*: Specifies whether the emitted version property values should be numbers or strings. Some Azure Pipelines tasks specify the values for the version Major, Minor, and Patch properties as a number while others store it as a string (Azure Pipelines supports both apparently). By default the plugin will emit the bumped version values as numbers in the task.json file(s), but if you would prefer those values to be strings instead then set this property to ```'string'``` in the configuration options

Example:
```js
    .pipe(azpBump({ versionPropertyType: 'string' }))
``` 

If the initial version object in your task.json file looks like this:
```json
    "version": {
        "Major": 0,
        "Minor": 1,
        "Patch": 1
    },
```

If you run the plugin with the default options (bumps patch), then the emitted bumped version object will have the Patch version bumped and the values will be numbers:
```js
    .pipe(azpBump())
``` 
Emitted task.json version object:
```json
    "version": {
        "Major": 0,
        "Minor": 1,
        "Patch": 2
    },
```

If instead you specified ```'string'``` for the versionPropertyType, then the emitted bumped version object will have the Patch version bumped and the values will be strings: 
```js
    .pipe(azpBump({ versionPropertyType: 'string' }))
``` 
Emitted task.json version object:
```json
    "version": {
        "Major": "0",
        "Minor": "1",
        "Patch": "2"
    },
```

### **indent**: number OR string  
- *Default Value*: ```2```
- *Allowed Values*: Any positive whole number between ```1``` and ```10``` inclusive, or the tab character ```'\t'```
- *Description*: Controls the spacing indent value to use in the updated task.json file(s). If a number is specified, each level in the json file will be indented by that number of space characters. Alternatively, if the tab ```'\t'``` character is specified, then each level will be indented with a tab.

For example to indent by 4 spaces:  
```js
    .pipe(azpBump({ indent: 4 }))
```  

Or if you prefer a tab:  
```js
    .pipe(azpBump({ indent: '\t' }))
```

## License
MIT - see license details [here][license-url] 

## Contributing
Need to open an issue? Click the below links to create one:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

See the [Guidelines][contrib-dev-url] for more info about building and developing.

[npmjs-version-badge]: https://img.shields.io/npm/v/gulp-azp-bump.svg
[npmjs-downloads-badge]: https://img.shields.io/npm/dt/gulp-azp-bump.svg
[npmjs-pkg-url]: https://www.npmjs.com/package/gulp-azp-bump
[circle-ci-badge]: https://img.shields.io/circleci/project/github/swellaby/gulp-azp-bump.svg?label=linux%20build
[circle-ci-url]: https://circleci.com/gh/swellaby/gulp-azp-bump
[appveyor-badge]: https://img.shields.io/appveyor/ci/swellaby/gulp-vsts-bump.svg?label=windows%20build
[tests-badge]: https://img.shields.io/appveyor/tests/swellaby/gulp-vsts-bump.svg?label=unit%20tests
[appveyor-url]: https://ci.appveyor.com/project/swellaby/gulp-vsts-bump
[sonar-quality-gate-badge]: https://sonarcloud.io/api/project_badges/measure?project=swellaby%3Agulp-vsts-bump&metric=alert_status
[sonar-url]: https://sonarcloud.io/dashboard?id=swellaby%3Agulp-vsts-bump
[gulp-bump-pkg-url]: https://www.npmjs.com/package/gulp-bump
[codecov-badge]: https://img.shields.io/codecov/c/github/swellaby/gulp-vsts-bump.svg
[codecov-url]: https://codecov.io/gh/swellaby/gulp-vsts-bump
[coveralls-badge]: https://coveralls.io/repos/github/swellaby/gulp-vsts-bump/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/swellaby/gulp-vsts-bump?branch=master
[license-badge]: https://img.shields.io/github/license/swellaby/gulp-vsts-bump.svg
[license-url]: ./LICENSE
[vsts-task-manifest-url]: https://raw.githubusercontent.com/Microsoft/vsts-task-lib/master/tasks.schema.json
[create-bug-url]: https://github.com/swellaby/gulp-vsts-bump/issues/new?template=BUG_TEMPLATE.md&labels=bug,unreviewed&title=Bug:%20
[create-question-url]: https://github.com/swellaby/gulp-vsts-bump/issues/new?template=QUESTION_TEMPLATE.md&labels=question,unreviewed&title=Q:%20
[create-enhancement-url]: https://github.com/swellaby/gulp-vsts-bump/issues/new?template=ENHANCEMENT_TEMPLATE.md&labels=enhancement,unreviewed&title=E:%20
[contrib-dev-url]: ./.github/CONTRIBUTING.md#developing
[vsts-url]: https://www.visualstudio.com/team-services/
[vsts-bump-url]: https://www.npmjs.com/package/vsts-bump
