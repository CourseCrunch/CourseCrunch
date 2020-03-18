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
                // schools[keys[i]][schemaIndex].find({}).select({ First_Name: 1, Last_Name: 1 }),
                schools[keys[i]][schemaIndex].aggregate([
                    { $group: { _id: { First_Name: '$First_Name', Last_Name: '$Last_Name' } } },
                    {
                        $project: {
                            _id: 0, First_Name: '$_id.First_Name', Last_Name: '$_id.Last_Name', Full_Name: { $concat: ['$_id.First_Name', ' ', '$_id.Last_Name'] },
                        },
                    },
                ]),
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

// getFuse().then(() => 'built course eval fuse');
fuzzySearch('utm', 'Lee Bailey').then((r) => console.log(r[0]));

module.exports = {
    getFuse,
    fuzzySearch,
    getSchools,
};