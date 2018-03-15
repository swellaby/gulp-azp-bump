'use strict';

const patchReleaseType = 'patch';
module.exports.patchReleaseType = patchReleaseType;
module.exports.minorReleaseType = 'minor';
module.exports.majorReleaseType = 'major';
module.exports.defaultReleaseType = patchReleaseType;
module.exports.pluginName = 'gulp-vsts-bump';

const description = 'test';
const id = 'asdf876asdfkasd';
const taskName = 'test-task';
const majorStr = '0';
const majorVal = 0;
const minorStr = '8';
const minorVal = 8;
const patchStr = '2';
const patchVal = 2;

// module.exports.

const validSampleOneTaskContents = {
    decription: description,
    id: id,
    name: taskName,
    version: {
        Major: majorStr,
        Minor: minorStr,
        Patch: patchStr
    }
};
const filePath = './src/foo.js';
const sampleTaskFile = {
    contents: JSON.stringify(validSampleOneTaskContents),
    isNull: () => false,
    isStream: () => false,
    path: filePath
};

module.exports.filePath = filePath;
module.exports.validSampleOneTaskContents = validSampleOneTaskContents;
module.exports.validSampleOneTaskFile = sampleTaskFile;