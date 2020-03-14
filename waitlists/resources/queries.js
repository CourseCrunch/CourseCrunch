import { Pool } from 'pg';

require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

function getWaitlists() {
    const waitlists = {};
    return new Promise(((resolve, reject) => {
        try {
            pool.query('SELECT * FROM CC_USER_WAITLIST', []).then((results) => {
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

                    if (!Object.prototype.hasOwnProperty.call(waitlists[course][year].term)) {
                        waitlists[course][year][term] = [];
                    }

                    waitlists[course][year][term].push(userID);
                });
                resolve(waitlists);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

function getUserEmail(userID) {
    return new Promise(((resolve, reject) => {
        try {
            pool.query('SELECT EMAIL FROM CC_CREDENTIALS WHERE ID=$1', [userID]).then((results) => {
                if (results.length == 0) {
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
    try {
        pool.query('DELETE FROM CC_USER_WAITLIST WHERE ID = $1 AND courseCode = $2 AND year=$3 AND term=$4', [userID, courseCode, year, term]);
    } catch (e) {
        console.log(e);
    }
}


function addUser(userID, courseCode, year, term) {
    return new Promise(((resolve, reject) => {
        try {
            pool.query('INSERT INTO CC_USER_WAITLIST(ID, CourseCode, CCYear, Term) VALUES ($1, $2, $3, $4)', [userID, courseCode, year, term]);
        } catch (e) {
            reject(e);
        }
    }));
}

export default {
    getWaitlists,
    removeUser,
    addUser,
    getUserEmail,
};
