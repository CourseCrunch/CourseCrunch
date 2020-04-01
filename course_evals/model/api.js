const Fuse = require('fuse.js');
const UTM = require('./schemas/UTMEval');
const AANDS = require('./schemas/AANDSEval');
const ASANDE = require('./schemas/ASANDEEval');
const ASANDEGRAD = require('./schemas/ASANDEGRADEval');
const SW = require('./schemas/SWEval');
const INFO = require('./schemas/INFOEval');
const UTSC = require('./schemas/UTSCEval');


function getSchools() {
    return {
        utm: [UTM],
        utsg: [AANDS, ASANDE],
        grad: [ASANDEGRAD, SW, INFO],
        utsc: [UTSC],
        rotman: [],
    };
}

const options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.6,
    location: 0,
    tokenize: false,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        'Full_Name',
    ],
};

const fuseGlobal = {};
const promiseMap = {};
const promises = [];

function generatePromises() {
    const schools = getSchools();
    const keys = Object.keys(schools);
    for (let i = 0; i < keys.length; i += 1) {
        promiseMap[keys[i]] = [];
        for (let schemaIndex = 0; schemaIndex < schools[keys[i]].length; schemaIndex += 1) {
            promiseMap[keys[i]].push(
                schools[keys[i]][schemaIndex].find_names(),
            );
        }
        promises.push(
            Promise.all(promiseMap[keys[i]]).then((data) => {
                let final = [];
                for (let index = 0; index < data.length; index += 1) {
                    final = final.concat(data[index]);
                }
                return { school: keys[i], fuse: new Fuse(final, options) };
            }),
        );
    }
    return Promise.all(promises);
}

function getFuse() {
    if (Object.keys(fuseGlobal).length === 0) {
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

function getCourseRecommendations(school, courses, filteredCourse, limit) {
    // return new Promise((resolve, reject) => {
    //     mongoose.model(`${school}_evals`).aggregate([
    //         { $group: { _id: '$Code', Course_Workload: { $avg: { $toDecimal: '$Course_Workload' } }, Term: { $addToSet: { $concat: ['$Term', '$Year'] } } } },
    //         { $match: { $and: [{ _id: { $nin: filteredCourse } }, { Term: { $in: ['Winter2019'] } }, { _id: { $in: courses } }] } },
    //         { $sort: { Course_Workload: 1 } },
    //         { $limit: limit },
    //     ], (err, data) => {
    //         if (err) {
    //             reject('Errored');
    //         } else {
    //             resolve(data);
    //         }
    //     });
    // });
    const promisesArray = [];
    const schools = getSchools();
    schools[school].forEach((campusSchema) => {
        promisesArray.push(campusSchema.getReccomendations(courses, filteredCourse, limit));
    });
    return Promise.all(promisesArray).then((result) => {
        let final = [];
        if (result.length === 1) {
            return result[0];
        }
        result.forEach((array) => {
            final = final.concat(array);
        });
        return final;
    });
}

getFuse().then(() => console.log('built course eval fuse'));

// fuzzySearch('utsg', 'David Penny').then((r) => console.log(r[0]));

// UTM.find_by_name('Furkan', 'Alaca').then((res) => {
//     res.forEach((document) => {
//         console.log(document.convert());
//     });
// });

// UTM.prof_scores('Furkan', 'Alaca').then((res) => {
//     console.log(res);
// });

function getAll(schoolKey) {
    const schools = getSchools();
    const schoolPromises = [];
    const schemas = [];
    if (schoolKey === 'all') {
        Object.keys(schools).forEach((key) => {
            schools[key].forEach((school) => {
                schoolPromises.push(school.get_professors());
                schemas.push(school);
            });
        });
    } else {
        schools[schoolKey].forEach((school) => {
            schoolPromises.push(school.get_professors());
            schemas.push(school);
        });
    }

    return Promise.all(schoolPromises).then((data) => {
        const final = {};
        for (let index = 0; index < data.length; index += 1) {
            const schoolSchema = schemas[index];
            const schoolName = schoolSchema.schema_name();
            final[schoolName] = {};
            final[schoolName].name = schoolName;
            final[schoolName].results = data[index];
        }
        return final;
    });
}

module.exports = {
    getFuse,
    searchInstructor: fuzzySearch,
    getSchools,
    getCourseRecommendations,
    allInstructors: getAll,
};
