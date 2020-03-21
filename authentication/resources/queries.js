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

// Naaz's get user ID from mail. It doesn't use a promise so I'm sorry.
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

const createUser = (fname, lname, email, program, password, callBack) => {
    try {
        bcrypt.hash(password, 10, (bcryptErr, hash) => {
            if (bcryptErr) {
                console.log(bcryptErr);
                return callBack('error');
            }

            const uuid = uuidv4();
            UserDB.query('INSERT INTO CC_CREDENTIALS (ID, EMAIL, HASH) VALUES ($1, $2, $3)',
                [uuid, email, hash], (credErr, result) => {
                    if (credErr) {
                        console.log(credErr);
                        return callBack('error');
                    }
                    UserDB.query('INSERT INTO CC_USER_INFO (ID, ROLE, FNAME, LNAME, PROGRAM) VALUES ($1, $2, $3, $4, $5)',
                        [uuid, 'USER', fname, lname, program], (info_err, resultt) => {
                            if (info_err) {
                                console.log(info_err);
                            } else {
                                return callBack('User Registered!');
                            }
                        });
                });
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    checkUserExists,
    createUser,
    validatePW,
    getUserIDFromMail,
};
