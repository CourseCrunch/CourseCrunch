const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
//const Promise = require('promise');
require('dotenv').config();
const Pool = require('pg').Pool;
const UserDB = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT
});

function checkUserExists(email){
	return new Promise(function(resolve, reject){
		try{
			var promise_query_email = UserDB.query('SELECT 1 FROM CC_CREDENTIALS WHERE EMAIL = $1', [email]);
			promise_query_email.then(function(query_result) {
				resolve(query_result);
			}, function(query_error) {
				reject(query_error);
			});
		} catch(e){
			reject(e);
		}
	});
}

function validatePW(uuid, password){
	return new Promise(function(resolve, reject){
		try{
			var promise_query_hash = UserDB.query('SELECT HASH FROM CC_CREDENTIALS WHERE ID = $1', [uuid]);
			promise_query_hash.then(function(query_result) {
				var pw_hash = query_result.rows[0].hash;
        				var promise_compare_hash = bcrypt.compare(password, pw_hash);
					promise_compare_hash.then(function(comparison_result) {
						if(comparison_result) {
							resolve("Valid");
						} else {
							resolve("Invalid");
						}
					}, function(comparison_error) {
						reject(comparison_error);
					});
			}, function(query_error) {
				reject(query_error);
			});
		} catch(e){
			reject(e);
		}
	});
}

function updateUser_fname(uuid, fname){
	return new Promise(function(resolve, reject){
		try{
			var promise_query_update = UserDB.query('UPDATE CC_USER_INFO SET FNAME = $1 WHERE ID = $2', [fname, uuid]);
			promise_query_update.then(function(query_result) {
				resolve("First Name Changed!");
			}, function(query_error) {
				reject(query_error);
			});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_lname(uuid, lname){
	return new Promise(function(resolve, reject){
		try{
			var promise_query_update = UserDB.query('UPDATE CC_USER_INFO SET LNAME = $1 WHERE ID = $2', [lname, uuid]);
			promise_query_update.then(function(query_result) {
				resolve("Last Name Changed");
			}, function(query_error) {
				reject(query_error);
			});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_program(uuid, program){
	return new Promise(function(resolve, reject){
		try{
			var promise_query_update = UserDB.query('UPDATE CC_USER_INFO SET PROGRAM = $1 WHERE ID = $2', [program, uuid]);
			promise_query_update.then(function(query_result) {
				resolve("Program Changed");
			}, function(query_error) {
				reject(query_error);
			});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_email(uuid, email){
	return new Promise(function(resolve, reject){
		try{
			var promise_query_update = UserDB.query('UPDATE CC_CREDENTIALS SET EMAIL = $1 WHERE ID = $2', [email, uuid]);
			promise_query_update.then(function(query_result) {
				resolve("Email Changed");
			}, function(query_error) {
				reject(query_error);
			});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_pass(uuid, password){
	return new Promise(function(resolve, reject){
		try{
			var promise_hash_password = bcrypt.hash(password, 10);
			promise_hash_password.then(function(hash_result) {
				var promise_query_update = UserDB.query('UPDATE CC_CREDENTIALS SET HASH = $1 WHERE ID = $2', [hash_result, uuid]);
				promise_query_update.then(function(query_result) {
					resolve("Password Changed");
				}, function(query_error) {
					reject(query_error);
				});
			}, function(hash_error) {
				reject(hash_error);
			});
		} catch (e){
			reject(e);
		}
	});
}


module.exports = {
	checkUserExists,
	validatePW,
	updateUser_fname,
	updateUser_lname,
	updateUser_program,
	updateUser_email,
	updateUser_pass
}
