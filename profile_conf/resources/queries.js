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

const pool1 = new Pool({
	user: process.env.SSUSER,
	host: process.env.SSHOST,
	database: process.env.SSDATABASE,
	password: process.env.SSPASSWORD,
	port: process.env.SSPORT
});


const checkUserExists = (email, callBack) => {
	try{
		pool.query('SELECT 1 FROM CC_CREDENTIALS WHERE EMAIL = $1', [email], (error, results)  => {
			if (error) {
				console.log(error);
				return callBack('error');
			} else {
				return callBack(results.rows);
			}
		});
	} catch(e) {
		console.log(e);
		return callBack('error');
	}
}

const validatePW = (uuid, password, callBack) => {
	try{
		pool.query('SELECT HASH FROM CC_CREDENTIALS WHERE ID = $1', [uuid], (error, results) => {
			if (error) {
        			console.log(error);
        			return callBack('error');
	        	}else {
        			var pw_hash = results.rows[0].hash;
        			bcrypt.compare(password, pw_hash, (valid_err, hash) => {
                			if (valid_err){
                    				console.log(valid_err);
                    				return callBack("error");
	                		}else if(!hash){
        	            			return callBack("Invalid");
                			}else if(hash){
                    				return callBack("Valid");
                			}
	            		});
        		}
	    	});
	} catch(e) {
		console.log(e);
		return callBack("error");
	}
}

const getUID = (sessionid, callBack) => {
	try{
		pool2.query('SELECT ID FROM CC_SESSION_INFO WHERE SESSION_ID = $1',
			[sessionid], (sess_err, result) => {
				if(sess_err){
					console.log(sess_err);
					return callBack("error");
				} else {
					return callBack(result);
				}
			});
	} catch (e) {
		console.log(e);
		return callBack("error");
	}
}


const updateUser_fname = (uuid, fname, callBack) => {
	try{
		pool.query('UPDATE CC_USER_INFO SET FNAME = $1 WHERE ID = $2', 
			[fname, uuid], (info_err, result) => {
				if(info_err){
					console.log(info_err);
					return callBack("error");
				} else {
					return callBack("First Name Changed!"); 
				}
			});
	} catch (e) {
		console.log(e);
		return callBack ("error");
	}
}

const updateUser_lname = (uuid, lname, callBack) => {
	try{
		pool.query('UPDATE CC_USER_INFO SET LNAME = $1 WHERE ID = $2', 
			[lname, uuid], (info_err, result) => {
				if(info_err){
					console.log(info_err);
					return callBack("error");
				} else {
					return callBack("Last Name Changed!"); 
				}
			});
	} catch (e) {
		console.log(e);
		return callBack ("error");
	}
}

const updateUser_program = (uuid, program, callBack) => {
	try{
		pool.query('UPDATE CC_USER_INFO SET PROGRAM = $1 WHERE ID = $2', 
			[program, uuid], (info_err, result) => {
				if(info_err){
					console.log(info_err);
					return callBack("error");
				} else {
					return callBack("Program Changed!"); 
				}
			});
	} catch (e) {
		console.log(e);
		return callBack ("error");
	}
}

const updateUser_email = (uuid, email, callBack) => {
	try{
		pool.query('UPDATE CC_CREDENTIALS SET EMAIL = $1 WHERE ID = $2', 
			[email, uuid], (update_err, result) => {
				if(update_err){
					console.log(update_err);
					return callBack("error");
				} else {
					return callBack("Email Changed!"); 
				}
			});
	} catch (e) {
		console.log(e);
		return callBack ("error");
	}
}

const updateUser_pass = (uuid, password, callBack) => {
	try{
		bcrypt.hash(password, 10, (bcrypt_err, hash) => {
			if(bcrypt_err){
				console.log(bcrypt_err);
				return callBack("error");
			} else {
				pool.query('UPDATE CC_CREDENTIALS SET HASH = $1 WHERE ID = $2', 
					[hash, uuid], (update_err, result) => {
						if(update_err){
							console.log(update_err);
							return callBack("error");
						} else {
							return callBack("Password Changed!"); 
						}
					});
			}
		});
	} catch (e) {
		console.log(e);
		return callBack ("error");
	}
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
