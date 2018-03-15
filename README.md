# gulp-vsts-bump
Gulp plugin to bump the version of VSTS tasks  
**** Still a work-in-progress, not ready for use***   

Note this plugin is focused specifically on bumping the versions of VSTS tasks, which are maintained as an Object in the task manifest files vs.the traditional string, semver representation of the version typically found.  

For bumping a standard version file (like in a package.json file) you should *not* use this, and you should use something like [gulp-bump](https://github.com/stevelacy/gulp-bump) instead.