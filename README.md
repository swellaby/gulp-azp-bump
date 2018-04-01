# gulp-vsts-bump
Gulp plugin to bump the version of VSTS tasks  (still in preview, may be broken!)  
[![npmjs version Badge][npmjs-version-badge]][npmjs-pkg-url]
[![Circle CI Badge][circle-ci-badge]][circle-ci-url]
[![Coverage Status][coveralls-badge]][coveralls-url]  

## About
Gulp plugin that supports bumping the versions of VSTS tasks. The VSTS tasks manifest files maintain the version as an Object which differs from the traditional semver string used to represent the version found in other files (like package.json). 

VSTS task manifest example:
```json
{

}
```

This plugin should only be used for bumping VSTS task manifest files. For bumping any other standard version string in any other type file (like in a package.json file) you should *not* use this plugin, and you should use something like [gulp-bump][gulp-bump-pkg-url] instead.

## Usage
#### Simple Usage (bumps patch version by default)
```js
const gulp = require('gulp');
const vstsBump = require('gulp-vsts-bump');

gulp.task('tasks:bump', function () {
    return gulp.src(['./tasks/**/task.json'])
        .pipe(vstsBump())
        .pipe(gulp.dest('./'));
});
```

#### Specific Bump Type
```js
const gulp = require('gulp');
const vstsBump = require('gulp-vsts-bump');

gulp.task('tasks:bump', function () {
    return gulp.src(['./tasks/**/task.json'])
        .pipe(vstsBump({ type: 'minor' }))
        .pipe(gulp.dest('./'));
});
```

[npmjs-version-badge]: https://img.shields.io/npm/v/gulp-vsts-bump.svg
[npmjs-pkg-url]: https://www.npmjs.com/package/guulp-vsts-bump
[circle-ci-badge]: https://circleci.com/gh/swellaby/gulp-vsts-bump.svg?style=svg
[circle-ci-url]: https://circleci.com/gh/swellaby/gulp-vsts-bump
[gulp-bump-pkg-url]: https://www.npmjs.com/package/gulp-bump
[coveralls-badge]: https://coveralls.io/repos/github/swellaby/gulp-vsts-bump/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/swellaby/gulp-vsts-bump?branch=master
