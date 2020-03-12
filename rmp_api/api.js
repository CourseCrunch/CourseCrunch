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

let fuseGlobal = null;

function getFuse() {
    if (fuseGlobal == null) {
        return mongo.Instruct.find().then((res) => {
            fuseGlobal = new Fuse(res, options);
            return fuseGlobal;
        }).catch(() => null);
    }
    return Promise.resolve(fuseGlobal);
}

function fuzzySearch(instructorName) {
    return getFuse().then((f) => f.search(instructorName)).catch(() => null);
}

//cache.updateInstructorCache();
fuzzySearch('Bailey Lee').then((r) => console.log(r[0]));

module.exports = {
    findInstructor: queryInstructor,
    findAllInstructors: cache.queryAllInstructors,
    allSchools: cache.getSchools,
    init: cache.updateInstructorCache,
    searchInstructor: fuzzySearch,
};
