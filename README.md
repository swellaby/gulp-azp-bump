# gulp-vsts-bump
Gulp plugin to bump the version of VSTS tasks    
[![npmjs version Badge][npmjs-version-badge]][npmjs-pkg-url]
[![Circle CI Badge][circle-ci-badge]][circle-ci-url]
[![Coverage Status][coveralls-badge]][coveralls-url]  

## About
This Gulp plugin is focused specifically on bumping the versions of VSTS tasks, which are maintained as an Object in the task manifest files vs.the traditional string, semver representation of the version typically found.  

For bumping any other standard version string in any other type file (like in a package.json file) you should *not* use this plugin, and you should use something like [gulp-bump][gulp-bump-pkg-url] instead.

## Usage

```js
const gulp = require('gulp');
const vstsBump = require('gulp-vsts-bump');
```

[npmjs-version-badge]: https://img.shields.io/npm/v/gulp-vsts-bump.svg
[npmjs-pkg-url]: https://www.npmjs.com/package/guulp-vsts-bump
[circle-ci-badge]: https://circleci.com/gh/swellaby/gulp-vsts-bump.svg?style=svg
[circle-ci-url]: https://circleci.com/gh/swellaby/gulp-vsts-bump
[gulp-bump-pkg-url]: https://www.npmjs.com/package/gulp-bump
[coveralls-badge]: https://coveralls.io/repos/github/swellaby/gulp-vsts-bump/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/swellaby/gulp-vsts-bump?branch=master
