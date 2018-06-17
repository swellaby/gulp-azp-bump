# gulp-vsts-bump
Gulp plugin to bump the version of [VSTS][vsts-url] tasks  

[![npmjs version Badge][npmjs-version-badge]][npmjs-pkg-url]
[![npmjs downloads Badge][npmjs-downloads-badge]][npmjs-pkg-url] [![License Badge][license-badge]][license-url]  

[![Circle CI Badge][circle-ci-badge]][circle-ci-url]
[![AppVeyor Status][appveyor-badge]][appveyor-url]
[![Test Results Badge][tests-badge]][appveyor-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Sonar Quality Gate][sonar-quality-gate-badge]][sonar-url]  

## About
Gulp plugin that supports bumping the versions of [VSTS][vsts-url] tasks. The [VSTS][vsts-url] task manifest files maintain the version as an Object which differs from the traditional semver string used to represent the version found in other files like package.json (note that the values of Major, Minor, Patch can be strings OR numbers).

[VSTS][vsts-url] task manifest example:
```json
{
    "id": "923e6d5c-0b14-462b-922e-813cbd2ef4cc",
    "name": "2018vsts",
    "friendlyName": "Sample Task",
    "description": "vsts",
    "author": "me",
    "version": {
        "Major": 0,
        "Minor": 1,
        "Patch": 1
    },
}
```

The [VSTS][vsts-url] task version cannot be bumped using other gulp plugins without writing a lot of extra code, so we wrote this plugin to provide simple support specifically for [VSTS][vsts-url] tasks.  

This plugin should only be used for bumping [VSTS][vsts-url] task manifest files. For bumping any other standard version string in any other type file (like in a package.json file) you should *not* use this plugin, and you should use something like [gulp-bump][gulp-bump-pkg-url] instead.

## Install
Install the package as a dev dependency:
```sh
npm i gulp-vsts-bump --save-dev
```

## Usage
**Simple Usage (bumps patch version by default)**
```js
const gulp = require('gulp');
const vstsBump = require('gulp-vsts-bump');

gulp.task('tasks:bump', function () {
    return gulp.src(['./tasks/**/task.json'], { base: './' })
        .pipe(vstsBump())
        .pipe(gulp.dest('./'));
});
```

**Specific Bump Type**
```js
const gulp = require('gulp');
const vstsBump = require('gulp-vsts-bump');

gulp.task('tasks:bump', function () {
    return gulp.src(['./tasks/**/task.json'], { base: './' })
        .pipe(vstsBump({ type: 'minor' }))
        .pipe(gulp.dest('./'));
});
```

## Options
### **type**: string 
- *Default Value*: `'patch'`
- *Allowed Values*: `'major'`, `'minor'`, `'patch'`
- *Description*: Specifies the release type you want to bump. Technically any valid semver type (including prerelease, etc.) will be accepted, but you shouldn't use anything other than `major`, `minor`, or `patch` since that is all VSTS tasks can store. 

For example to bump the minor version value:  
```js
    .pipe(vstsBump({ type: 'minor' }))
```  

Or the major version value:  
```js
    .pipe(vstsBump({ type: 'major' }))
``` 

### **quiet**: boolean   
- *Default Value*: ```false```
- *Allowed Values*: ```true```, ```false```
- *Description*: Set this to ```true``` if you want to supress the log output

Example:
```js
    .pipe(vstsBump({ quiet: true }))
```  

### **versionPropertyType**: string  
- *Default Value*: ```'number'```
- *Allowed Values*: ```'number'```, ```'string'```
- *Description*: Specifies whether the emitted version property values should be numbers or strings. Some VSTS tasks specify the values for the version Major, Minor, and Patch properties as a number while others store it as a string (VSTS supports both apparently). By default the plugin will emit the bumped version values as numbers in the task.json file(s), but if you would prefer those values to be strings instead then set this property to ```'string'``` in the configuration options

Example:
```js
    .pipe(vstsBump({ versionPropertyType: 'string' }))
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
    .pipe(vstsBump())
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
    .pipe(vstsBump({ versionPropertyType: 'string' }))
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
    .pipe(vstsBump({ indent: 4 }))
```  

Or if you prefer a tab:  
```js
    .pipe(vstsBump({ indent: '\t' }))
```

## License
MIT - see license details [here][license-url] 

## Contributing
Need to open an issue? Click the below links to create one:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

See the [Guidelines][contrib-dev-url] for more info about building and developing.

[npmjs-version-badge]: https://img.shields.io/npm/v/gulp-vsts-bump.svg
[npmjs-downloads-badge]: https://img.shields.io/npm/dt/gulp-vsts-bump.svg
[npmjs-pkg-url]: https://www.npmjs.com/package/gulp-vsts-bump
[circle-ci-badge]: https://circleci.com/gh/swellaby/gulp-vsts-bump.svg?style=shield
[circle-ci-url]: https://circleci.com/gh/swellaby/gulp-vsts-bump
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/8574rkisuw157e8h?svg=true
[tests-badge]: https://img.shields.io/appveyor/tests/swellaby/gulp-vsts-bump.svg
[appveyor-url]: https://ci.appveyor.com/project/swellaby/gulp-vsts-bump
[sonar-quality-gate-badge]: https://sonarcloud.io/api/project_badges/measure?project=swellaby%3Agulp-vsts-bump&metric=alert_status
[sonar-url]: https://sonarcloud.io/dashboard?id=swellaby%3Agulp-vsts-bump
[gulp-bump-pkg-url]: https://www.npmjs.com/package/gulp-bump
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
