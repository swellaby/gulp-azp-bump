'use strict';

const patchReleaseType = 'patch';
const minorReleaseType = 'minor';
const majorReleaseType = 'major';

const major = 0;
const minor = 8;
const patch = 2;

const validSampleOneTaskContents = {
    decription: 'test',
    id: 'asdf876asdfkasd',
    name: 'test-task',
    version: {
        Major: major.toString(),
        Minor: minor.toString(),
        Patch: patch.toString()
    }
};

const invalidSampleOneTaskContents = {
    id: 'a8979asdfiugiyuasdfkasd',
    version: {
        Major: 'abc',
        Minor: minor.toString(),
        Patch: patch.toString()
    }
};
const filePath = './src/foo.js';

const buildTaskFile = ((fileContents) => {
    return {
        contents: JSON.stringify(fileContents),
        isNull: () => false,
        isStream: () => false,
        path: filePath
    };
});

module.exports = {
    pluginName: 'gulp-vsts-bump',
    patchReleaseType: patchReleaseType,
    minorReleaseType: minorReleaseType,
    majorReleaseType: majorReleaseType,
    defaultReleaseType: patchReleaseType,
    majorVersion: major,
    minorVersion: minor,
    patchVersion: patch,
    initialVersion: major + '.' + minor + '.' + patch,
    bumpedVersion: major + '.' + minor + '.' + (patch + 1),
    filePath: filePath,
    validSampleOneTaskFile: buildTaskFile(validSampleOneTaskContents),
    invalidSampleOneTaskFile: buildTaskFile(invalidSampleOneTaskContents),
    validSampleOneTaskContents: validSampleOneTaskContents,
    invalidSampleOneTaskContents: invalidSampleOneTaskContents
};