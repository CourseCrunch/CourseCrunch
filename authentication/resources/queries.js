const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
require('dotenv').config();
const Pool = require('pg').Pool;
const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT
});

const checkUserExists = (email, callBack) => {
	pool.query('SELECT 1 FROM CC_CREDENTIALS WHERE EMAIL = $1', [email], (error, results)  => {
		if (error) {
			console.log(error);
			return callBack('error');
		} else {
			return callBack(results.rows);
		}
	});
}

const createUser = (fname, lname, email, program, password, callBack) => {
	try{
		bcrypt.hash(password, 10, (bcrypt_err, hash) => {
			if(bcrypt_err){
				console.log(bcrypt_err);
				return callBack("error");
			} else {

				var uuid = uuidv4();
				pool.query('INSERT INTO CC_CREDENTIALS (ID, EMAIL, HASH) VALUES ($1, $2, $3)', 
					[uuid, email, hash], (cred_err, result) => {
						if(cred_err){
							console.log(cred_err);
							return callBack("error");
						} else {
							pool.query('INSERT INTO CC_USER_INFO (ID, ROLE, FNAME, LNAME, PROGRAM) VALUES ($1, $2, $3, $4, $5)',
							[uuid, 'USER', fname, lname, program], (info_err, resultt) => {
								if(info_err){
									console.log(info_err);
								} else {
									return callBack("User Registered!"); 
								}
							});
						}
					});
			}
		});
	} catch (e) {
		console.log(e);
	}
}

module.exports = {
	checkUserExists,
	createUser
}

