const dbReq = require('./courseQueries');

function getCourses(uuid) {
    return new Promise(((resolve, reject) => {
        try {
            const respJSON = {};
            const promiseGet1stYr = dbReq.getAllTaken1Courses(uuid);
            const promiseGet2ndYr = dbReq.getAllTaken2Courses(uuid);
            const promiseGet3rdYr = dbReq.getAllTaken3Courses(uuid);
            const promiseGet4thYr = dbReq.getAllTaken4Courses(uuid);
            promiseGet1stYr.then((queryResult) => {
                const firstYrList = [];
                queryResult.rows.forEach((row) => {
                    firstYrList.push(row.course_code);
                });
                respJSON.firstYear = firstYrList;
            }).catch((queryError) => {
                console.log(queryError);
                reject(queryError);
            });

            promiseGet2ndYr.then((queryResult) => {
                const secondYrList = [];
                queryResult.rows.forEach((row) => {
                    secondYrList.push(row.course_code);
                });
                respJSON.seconYear = secondYrList;
            }).catch((queryError) => {
                console.log(queryError);
                reject(queryError);
            });

            promiseGet3rdYr.then((queryResult) => {
                const thirdYrList = [];
                queryResult.rows.forEach((row) => {
                    thirdYrList.push(row.course_code);
                });
                respJSON.thirdYear = thirdYrList;
            }).catch((queryError) => {
                console.log(queryError);
                reject(queryError);
            });

            promiseGet4thYr.then((queryResult) => {
                const fourthYrList = [];
                queryResult.rows.forEach((row) => {
                    fourthYrList.push(row.course_code);
                });
                respJSON.fourYear = fourthYrList;
            }).catch((queryError) => {
                console.log(queryError);
                reject(queryError);
            });

            Promise.all([promiseGet1stYr, promiseGet2ndYr, promiseGet3rdYr, promiseGet4thYr])
                .then(() => {
                    resolve(respJSON);
                });
        } catch (e) {
            reject(e);
        }
    }));
}
module.exports = { getCourses };
