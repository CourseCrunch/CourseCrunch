require('dotenv').config();
const { Pool } = require('pg');

const UserDB = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// check to see if user exists
function checkUserExists(id) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryEmail = UserDB.query('SELECT 1 FROM CC_CREDENTIALS WHERE ID = $1', [id]);
            promiseQueryEmail.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

// check to see if user added the course to their completed list
function checkRelationExists(id, course) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryExist = UserDB.query('SELECT 1 FROM CC_TAKEN_COURSE WHERE ID = $1 AND COURSE_CODE = $2', [id, course]);
            promiseQueryExist.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

// get all courses taken by user with id
function getAllTakenCourses(id) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryCourses = UserDB.query('SELECT COURSE_CODE FROM CC_TAKEN_COURSE WHERE ID = $1', [id]);
            promiseQueryCourses.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

// add id, course pair to cc_taken_course
function addCompletedCourse(id, course) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseInsertCourse = UserDB.query('INSERT INTO CC_TAKEN_COURSE VALUES ($1, $2)', [id, course]);
            promiseInsertCourse.then(() => {
                resolve('Deleted');
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

/*
//query naaz's DB for exclusions
function getExclusions(course) {
}
*/

// attempt to select from cc_taken_course where id = x and course_code in (exclusions)
function checkExclusions(id, exclusions) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryExclusions = UserDB.query('SELECT 1 FROM CC_TAKEN_COURSE WHERE ID = $1 AND COURSE_CODE IN ($2)', [id, exclusions]);
            promiseQueryExclusions.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

// delete id, course pair from cc_taken_course
function deleteCompletedCourse(id, course) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseDeleteCourse = UserDB.query('DELETE FROM CC_TAKEN_COURSE WHERE ID = $1 AND COURSE_CODE = $2', [id, course]);
            promiseDeleteCourse.then(() => {
                resolve('Deleted');
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}


module.exports = {
    checkUserExists,
    checkRelationExists,
    getAllTakenCourses,
    addCompletedCourse,
    // getExclusions,
    checkExclusions,
    deleteCompletedCourse,
};
