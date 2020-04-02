const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
require('dotenv').config();
const { Pool } = require('pg');

const UserDB = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

function checkUserExists(email) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryEmail = UserDB.query('SELECT 1 FROM CC_CREDENTIALS WHERE EMAIL = $1', [email]);
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

function validatePW(email, password) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryHash = UserDB.query('SELECT HASH FROM CC_CREDENTIALS WHERE EMAIL = $1', [email]);
            promiseQueryHash.then((queryResult) => {
                const pwHash = queryResult.rows[0].hash;
                const promiseCompareHash = bcrypt.compare(password, pwHash);
                promiseCompareHash.then((comparisonResult) => {
                    if (comparisonResult) {
                        resolve('Valid');
                    } else {
                        resolve('Invalid');
                    }
                }).catch((comparisonError) => {
                    reject(comparisonError);
                });
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

// Naaz's get user ID from mail. It does use a promise so I'm not sorry.
function getUserIDFromMail(email) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseIDHash = UserDB.query('SELECT ID FROM CC_CREDENTIALS WHERE EMAIL = $1', [email]);
            promiseIDHash.then((queryResult) => {
                resolve(queryResult.rows[0].id);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

function createUser(fname, lname, email, program, password) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseHashPass = bcrypt.hash(password, 10);
            promiseHashPass.then((hash) => {
                const uuid = uuidv4();
                const promiseCreateUser = UserDB
                    .query('INSERT INTO CC_CREDENTIALS (ID, EMAIL, HASH) VALUES ($1, $2, $3)',
                        [uuid, email, hash]);
                promiseCreateUser.then(() => {
                    const promiseAddInfo = UserDB
                        .query('INSERT INTO CC_USER_INFO (ID, ROLE, FNAME, LNAME, PROGRAM)'
                            + 'VALUES ($1, $2, $3, $4, $5)', [uuid, 'USER', fname, lname, program]);
                    promiseAddInfo.then(() => {
                        resolve(uuid);
                    }).catch((addInfoError) => {
                        reject(addInfoError);
                    });
                }).catch((createUserError) => {
                    reject(createUserError);
                });
            }).catch((hashError) => {
                reject(hashError);
            });
        } catch (e) {
            console.log(e);
        }
    }));
}

module.exports = {
    checkUserExists,
    createUser,
    validatePW,
    getUserIDFromMail,
};
