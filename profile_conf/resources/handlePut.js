const dbReq = require('./courseQueries');
const timetableApi = require('../../timetable_api/api');

function addCourse(uuid, courseCode) {
    return new Promise(((resolve, reject) => {
        try {
            // make sure that the course exists in DB
            const promiseCheckCourse = dbReq.checkCourseExists(courseCode);
            promiseCheckCourse.then((checkCourseResult) => {
                // if course doesn't exist check krish's api if our db needs to update
                if (checkCourseResult.rows[0] === undefined) {
                    const year = (new Date().getFullYear() - 1);
                    const promiseTimeTableFall = timetableApi
                        .queryCourse(courseCode.substring(0, courseCode.length - 2),
                            'fall', year.toString());
                    promiseTimeTableFall.then((res) => {
                        if (res === null) {
                            // const promiseTimeTableWinter = timetableApi
                            //     .queryCourse(courseCode.substring(0, courseCode.length - 2),
                            //         'winter', (year + 1).toString());
                            promiseTimeTableFall.then((res) => {
                                if (res === null) {
                                    resolve(406);
                                } else {
                                    const courseDesc = res.full_name.split('-')[1];
                                    const promiseInsCourse = dbReq.insertCourse(courseCode,
                                        courseDesc.substring(1, courseDesc.length - 6), 'UTM');
                                    promiseInsCourse.then(() => {
                                        const promiseAddCourse = dbReq.addCompletedCourse(uuid, courseCode);
                                        promiseAddCourse.then(() => {
                                            resolve('SUCCESS');
                                        }).catch((queryError) => {
                                            console.log(queryError);
                                            reject(queryError);
                                        });
                                    });
                                }
                            });
                        } else {
                            const courseDesc = res.full_name.split('-')[1];
                            const promiseInsCourse = dbReq.insertCourse(courseCode, courseDesc.substring(1, courseDesc.length - 6), 'UTM');
                            promiseInsCourse.then(() => {
                                const promiseAddCourse = dbReq.addCompletedCourse(uuid, courseCode);
                                promiseAddCourse.then(() => {
                                    resolve('SUCCESS');
                                }).catch((queryError) => {
                                    console.log(queryError);
                                    reject(queryError);
                                });
                            });
                        }
                    });
                // else course exists and we cehck if relation pre-exists
                } else {
                    const promiseRelationCheck = dbReq.checkRelationExists(uuid, courseCode);
                    promiseRelationCheck.then((checkRelationResult) => {
                        // if relation doesn't pre-exist add relation
                        if (checkRelationResult.rows[0] === undefined) {
                            const promiseAddCourse = dbReq.addCompletedCourse(uuid, courseCode);
                            promiseAddCourse.then(() => {
                                resolve('SUCCESS');
                            }).catch((queryError) => {
                                console.log(queryError);
                                reject(queryError);
                            });
                        // else relation already exists no action required
                        } else {
                            resolve('SUCCESS');
                        }
                    }).catch((checkRelationError) => {
                        console.log(checkRelationError);
                        reject(checkRelationError);
                    });
                }
            }).catch((checkCourseError) => {
                console.log(checkCourseError);
                reject(checkCourseError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

module.exports = { addCourse };
