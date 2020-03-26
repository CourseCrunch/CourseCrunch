const bcrypt = require('bcrypt');
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

function validatePW(uuid, password) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryHash = UserDB.query('SELECT HASH FROM CC_CREDENTIALS WHERE ID = $1', [uuid]);
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

function getUserInfo(uuid) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryInfo = UserDB.query('SELECT FNAME, LNAME, PROGRAM FROM CC_USER_INFO WHERE ID = $1', [uuid]);
            promiseQueryInfo.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

function getUserEmail(uuid) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryInfo = UserDB.query('SELECT EMAIL FROM CC_CREDENTIALS WHERE ID = $1', [uuid]);
            promiseQueryInfo.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}


function updateUser(query) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryUpdate = UserDB.query(query);
            promiseQueryUpdate.then(() => {
                resolve('Success!');
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

function updateUserEmail(uuid, email) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseQueryUpdate = UserDB.query('UPDATE CC_CREDENTIALS SET EMAIL = $1 WHERE ID = $2', [email, uuid]);
            promiseQueryUpdate.then((queryResult) => {
                resolve(queryResult);
            }).catch((queryError) => {
                reject(queryError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}

function updateUserPass(uuid, password) {
    return new Promise(((resolve, reject) => {
        try {
            const promiseHashPassword = bcrypt.hash(password, 10);
            promiseHashPassword.then((hashResult) => {
                const promiseQueryUpdate = UserDB.query('UPDATE CC_CREDENTIALS SET HASH = $1 WHERE ID = $2', [hashResult, uuid]);
                promiseQueryUpdate.then((queryResult) => {
                    resolve(queryResult);
                }).catch((queryError) => {
                    reject(queryError);
                });
            }).catch((hashError) => {
                reject(hashError);
            });
        } catch (e) {
            reject(e);
        }
    }));
}


module.exports = {
    checkUserExists,
    validatePW,
    getUserInfo,
    getUserEmail,
    updateUser,
    updateUserEmail,
    updateUserPass,
};
