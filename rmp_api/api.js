const axios = require('axios');
const Fuse = require('fuse.js');
const util = require('util');
const mongo = require('./Instruct');
const cache = require('./Cache');

function queryInstructor(iid) {
    const queryStr = util.format(process.env.Q_INSTRUCT, iid);
    return axios.get(queryStr).then((res) => {
        if (res.data.response.docs.length !== 0) return res.data.response.docs[0];
        return null;
    }).catch(() => null);
}

const options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.6,
    location: 0,
    tokenize: true,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        'fullname',
    ],
};

const fuseGlobal = {};
const promises = [];
function generatePromises() {
    const keys = Object.keys(cache.getSchools());
    for (let i = 0; i < keys.length; i += 1) {
        promises.push(mongo.Instruct.find({ school: keys[i] }).then(
            (res) => ({ school: keys[i], fuse: new Fuse(res, options) }),
        ).catch(() => null));
    }
    return Promise.all(promises);
}

function getFuse() {
    if (promises.length === 0) {
        return generatePromises().then((data) => {
            for (let i = 0; i < data.length; i += 1) {
                fuseGlobal[data[i].school] = data[i].fuse;
            }
            return fuseGlobal;
        });
    }
    return Promise.resolve(fuseGlobal);
}

function fuzzySearch(schoolName, instructorName) {
    return getFuse().then((f) => f[schoolName].search(instructorName));
}

// cache.updateInstructorCache();

// fuzzySearch('utm', 'Bailey Lee').then((r) => console.log(r[0]));

getFuse().then(() => console.log('build fuzzy search'));

module.exports = {
    findInstructor: queryInstructor,
    findAllInstructors: cache.queryAllInstructors,
    allSchools: cache.getSchools,
    init: cache.updateInstructorCache,
    searchInstructor: fuzzySearch,
};
