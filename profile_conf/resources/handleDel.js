const dbReq = require('./courseQueries');

function delCourse(uuid, courseCode) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseRelationCheck = dbReq.checkRelationExists(uuid, courseCode);
            promiseRelationCheck.then((checkRelationResult) => {
                // if relation doesn't pre-exist then request is bad
                if (checkRelationResult.rows[0] === undefined) {
                    resolve(406);
                // else relation exists and we delete
                } else {
                    const promiseDelCourse = dbReq.deleteCompletedCourse(uuid, courseCode);
                    promiseDelCourse.then(() => {
                        resolve('SUCCESS');
                    }).catch((queryError) => {
                        console.log(queryError);
                        reject(queryError);
                    });
                }
            }).catch((checkRelationError) => {
                console.log(checkRelationError);
                reject(checkRelationError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

module.exports = { delCourse };
