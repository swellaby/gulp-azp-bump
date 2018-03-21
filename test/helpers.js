'use strict';

const patchReleaseType = 'patch';
const minorReleaseType = 'minor';
const majorReleaseType = 'major';

const major = 0;
const minor = 8;
const patch = 2;
const majorStr = major.toString();
const minorStr = minor.toString();
const patchStr = patch.toString();

const createSampleTaskContents = ((major, minor, patch) => {
    return {
        decription: 'test',
        id: 'asdf876asdfkasd',
        name: 'test-task',
        version: {
            Major: major,
            Minor: minor,
            Patch: patch
        }
    };
});

const validSampleOneTaskContents = createSampleTaskContents(majorStr, minorStr, patchStr);
const invalidSampleOneTaskContents = createSampleTaskContents('abc', minorStr, patchStr);
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
    majorVersionStr: majorStr,
    minorVersionStr: minorStr,
    patchVersionStr: patchStr,
    initialVersion: major + '.' + minor + '.' + patch,
    bumpedVersion: major + '.' + minor + '.' + (patch + 1),
    filePath: filePath,
    validSampleOneTaskFile: buildTaskFile(validSampleOneTaskContents),
    invalidSampleOneTaskFile: buildTaskFile(invalidSampleOneTaskContents),
    createSampleTaskContents: createSampleTaskContents,
    validSampleOneTaskContents: validSampleOneTaskContents,
    invalidSampleOneTaskContents: invalidSampleOneTaskContents
};