const pgDb = require('pg');

require('dotenv').config();

const pool = new pgDb.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

function getWaitlists() {
    return new Promise(((resolve, reject) => {
        try {
            pool.query('SELECT * FROM CC_USER_WAITLIST', []).then((results) => {
                const waitlists = {};
                results.rows.forEach((result) => {
                    const course = result.coursecode;
                    const year = result.ccyear;
                    const userID = result.id;
                    const { term } = result;
                    if (!Object.prototype.hasOwnProperty.call(waitlists, course)) {
                        waitlists[course] = {};
                    }

                    if (!Object.prototype.hasOwnProperty.call(waitlists[course], year)) {
                        waitlists[course][year] = {};
                    }

                    if (!Object.prototype.hasOwnProperty.call(waitlists[course][year], term)) {
                        waitlists[course][year][term] = [];
                    }

                    waitlists[course][year][term].push(userID);
                });
                resolve(waitlists);
            }).catch((e) => { console.log(e); });
        } catch (e) {
            reject(e);
        }
    }));
}

function getUserEmail(userID) {
    return new Promise(((resolve, reject) => {
        try {
            pool.query('SELECT EMAIL FROM CC_CREDENTIALS WHERE ID=$1', [userID]).then((results) => {
                if (results.length === 0) {
                    resolve(null);
                }
                resolve(results.rows[0].email);
            }).catch((e) => reject(e));
        } catch (e) {
            reject(e);
        }
    }));
}

function removeUser(userID, courseCode, year, term) {
    return new Promise(((resolve, reject) => {
        pool.query('DELETE FROM CC_USER_WAITLIST WHERE ID = $1 AND CourseCode = $2 AND CCYear=$3 AND Term=$4', [userID, courseCode, year, term]).then((results) => {
            resolve(results);
        }).catch((e) => { reject(e); });
    }));
}


function addUser(userID, courseCode, year, term) {
    return new Promise(((resolve, reject) => {
        pool.query('INSERT INTO CC_USER_WAITLIST(ID, CourseCode, CCYear, Term) VALUES ($1, $2, $3, $4)', [userID, courseCode, year, term]).then((results) => {
            resolve(results);
        }).catch((e) => { reject(e); });
    }));
}

function getWaitlistsForUser(userID) {
    return new Promise(((resolve, reject) => {
        pool.query('SELECT CCYear AS year, CourseCode AS course, Term AS term FROM CC_USER_WAITLIST WHERE ID=$1', [userID]).then((results) => {
            const waitlists = [];
            results.rows.forEach((result) => {
                const waitlist = {};
                waitlist.course = result.course;
                waitlist.year = result.year;
                waitlist.term = result.term;
                waitlists.push(waitlist);
            });
            resolve(waitlists);
        }).catch((e) => { reject(e); });
    }));
}

module.exports = {
    getWaitlists,
    removeUser,
    addUser,
    getUserEmail,
    getWaitlistsForUser,
};