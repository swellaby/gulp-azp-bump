'use strict';

module.exports.patchReleaseType = 'patch';
module.exports.minorReleaseType = 'minor';
module.exports.majorReleaseType = 'major';

const description = 'test';
const id = 'asdf876asdfkasd';
const taskName = 'test-task';

const validSampleOneTaskContents = {
    decription: description,
    id: id,
    name: taskName,
    version: {
        Major: '0',
        Minor: '8',
        Patch: '2'
    }
};

console.log(validSampleOneTaskContents);

const sampleTaskFile = {
    contents: JSON.stringify(validSampleOneTaskContents),
    isNull: () => false,
    isStream: () => false
};

module.exports.validSampleOneTaskContents = validSampleOneTaskContents;
module.exports.validSampleOneTaskFile = sampleTaskFile;