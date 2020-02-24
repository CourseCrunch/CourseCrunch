var express = require('express');
var router = express.Router();
var app = express();
var dbReq = require('../resources/queries');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var validator = require('validator');

const emptyString = function(input) { if(input == 'undefined') {return ''} else {return input}}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
	extended: true
}));

router.use(cookieParser());

router.get('/',function(req, res, next) {
	res.json({info:'Temp Password changing page'});
});

router.put('/', function (req, res){
	try{

		const {oldPassword, newPassword} = req.body;

		const san_old_password = emptyString(validator.trim(validator.escape(oldPassword + '')));
		const san_new_password = emptyString(validator.trim(validator.escape(newPassword + '')));
		
		//TEMPORARY UNTIL PROPER SESSION AND SESSION SERVER IS SET UP FROM LOGIN
		const uuid = req.cookies.sessionid;

		/***************UNCOMMENT ME WHEN SESSION IS IMPLEMENTED
		//Gets user ID from the session db
		const uuid

		try{
			dbReq.getUID(req.cookies.sessionid, function(resp){
				if(resp == 'error'){
					res.status(500).send('Sorry an error occurred while processing your request');
				} else {
					uuid = resp;
				}
			});
		} catch(e) {
			res.status(500);
			console.log(e);
			**************************************************/

		//NOTE: all response messages are for debugging and TA presentation, will be removed once front end implemented!
		//verify correct password has been entered
		try {
			dbReq.validatePW(uuid, san_old_password, function(resp){
				if(resp == 'error'){
					res.status(500).send('Sorry an error occurred while processing your request');

				//If valid password, change to new password
				} else if(resp == 'Valid'){
							
					if (!(validator.isEmpty(san_new_password))){
						dbReq.updateUser_pass(uuid, san_new_password, function(resp){
							if(resp == 'error'){
								res.status(500).send('Sorry an error occurred while processing your request');
							}
						});
					}
					res.status(200).send('Password successfully changed!');
					
				} else {
					res.status(406).send('Invalid password');
				}
			});

		} catch(e) {
			res.status(500);
			console.log(e);
		}
		

	} catch(e) {
		throw(e)
	}
});

module.exports = router;
