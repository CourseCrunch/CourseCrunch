const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const Promise = require('promise');
require('dotenv').config();
const Pool = require('pg').Pool;
const UserDB = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT
});

const SessionDB = new Pool({
	user: process.env.SSUSER,
	host: process.env.SSHOST,
	database: process.env.SSDATABASE,
	password: process.env.SSPASSWORD,
	port: process.env.SSPORT
});


function checkUserExists(email){
	return new Promise(function(resolve, reject){
		try{
			UserDB.query('SELECT 1 FROM CC_CREDENTIALS WHERE EMAIL = $1', [email], (error, results)  => {
				if (error){
					reject(error);
				} else{
					resolve(results.rows);
				}
			});
		} catch(e){
			reject(e);
		}
	});
}

function validatePW(uuid, password){
	return new Promise(function(resolve, reject){
		try{
			UserDB.query('SELECT HASH FROM CC_CREDENTIALS WHERE ID = $1', [uuid], (error, results) => {
				if (error) {
        				reject(error);
		        	} else{
        				var pw_hash = results.rows[0].hash;
        				bcrypt.compare(password, pw_hash, (valid_err, hash) => {
                				if (valid_err){
                    					reject(valid_err);
		                		} else if(!hash){
        		            			resolve("Invalid");
	                			} else if(hash){
        	            				resolve("Valid");
                				}
		            		});
        			}
	    		});
		} catch(e){
			reject(e);
		}
	});
}

function getUID(sessionid){
	return new Promise(function(resolve, reject){
		try{
			SessionDB.query('SELECT ID FROM CC_SESSION_INFO WHERE SESSION_ID = $1',
				[sessionid], (sess_err, result) => {
					if(sess_err){
						reject(sess_err);
					} else{
						resolve(result);
					}
				});
		} catch (e){
			reject(e);
		}
	});
}


function updateUser_fname(uuid, fname){
	return new Promise(function(resolve, reject){
		try{
			UserDB.query('UPDATE CC_USER_INFO SET FNAME = $1 WHERE ID = $2', 
				[fname, uuid], (info_err, result) => {
					if(info_err){
						reject(info_err);
					} else{
						resolve("First Name Changed!"); 
					}
				});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_lname(uuid, lname){
	return new Promise(function(resolve, reject){
		try{
			UserDB.query('UPDATE CC_USER_INFO SET LNAME = $1 WHERE ID = $2', 
				[lname, uuid], (info_err, result) => {
					if(info_err){
						reject(info_err);
					} else{
						resolve("Last Name Changed!"); 
					}
				});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_program(uuid, program){
	return new Promise(function(resolve, reject){
		try{
			UserDB.query('UPDATE CC_USER_INFO SET PROGRAM = $1 WHERE ID = $2', 
				[program, uuid], (info_err, result) => {
					if(info_err){
						reject(info_err);
					} else{
						resolve("Program Changed!"); 
					}
			});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_email(uuid, email){
	return new Promise(function(resolve, reject){
		try{
			UserDB.query('UPDATE CC_CREDENTIALS SET EMAIL = $1 WHERE ID = $2', 
				[email, uuid], (update_err, result) => {
					if(update_err){
						reject(update_err);
					} else{
						resolve("Email Changed!"); 
					}
				});
		} catch (e){
			reject(e);
		}
	});
}

function updateUser_pass(uuid, password){
	return new Promise(function(resolve, reject){
		try{
			bcrypt.hash(password, 10, (bcrypt_err, hash) => {
				if(bcrypt_err){
					reject(bcrypt_err);
				} else {
					UserDB.query('UPDATE CC_CREDENTIALS SET HASH = $1 WHERE ID = $2', 
						[hash, uuid], (update_err, result) => {
							if(update_err){
								reject(update_err);
							} else {
								resolve("Password Changed!"); 
							}
						});
				}
			});
		} catch (e){
			reject(e);
		}
	});
}


module.exports = {
	checkUserExists,
	validatePW,
	getUID,
	updateUser_fname,
	updateUser_lname,
	updateUser_program,
	updateUser_email,
	updateUser_pass
}
