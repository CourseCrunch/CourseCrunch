const axios = require('axios');
const util = require('util');
const mongo = require('./Instruct');

function getSchools() {
    return {
        utm: '4928',
        utsg: '1484',
        utsc: '4919',
        uoft: '12184',
        rotman: '5281',
    };
}

function numberOfInstructors(schoolId) {
    const queryStr = util.format(process.env.INSTRUCTCOUNT, schoolId);
    console.log(queryStr);
    const promise = axios.get(queryStr).then((res) => res.data.response.numFound).catch(() => null);
    return promise;
}

function queryAllInstructors(schoolId) {
    const promise = numberOfInstructors(schoolId).then((instructCount) => {
        const qs = util.format(process.env.Q_A_INSTRUCT, instructCount, schoolId);
        return axios.get(qs).then((res) => res.data.response.docs).catch(() => null);
    });
    return promise;
}

function updateInstructorCache() {
    const schools = getSchools();
    schools.keys().forEach((key) => {
        queryAllInstructors(schools[key]).then((res) => {
            for (let i = 0; i < res.length; i += 1) {
                const row = res[i];
                row.fullname = `${row.teacherfirstname_t} ${row.teacherlastname_t}`;
                row.school = key;
                const doc = mongo.Instruct(row);
                doc.save(() => null);
            }
        }).catch(() => null);
    });
}

module.exports = {
    getSchools,
    updateInstructorCache,
    queryAllInstructors,
};
