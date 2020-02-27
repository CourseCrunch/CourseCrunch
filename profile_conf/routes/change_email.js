var express = require('express');
var router = express.Router();
var dbReq = require('../resources/queries');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var validator = require('validator');
var Promise = require('promise');

const emptyString = function(input) { if(input == 'undefined') {return ''} else {return input}}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
	extended: true
}));

router.use(cookieParser());

router.get('/',function(req, res, next) {
	res.json({info:'Temp Email changing page'});
});

router.patch('/', function (req, res){
	try{

		//retrieve info from request
		const {password, email} = req.body;

		//sanitize input
		const san_email = emptyString(validator.trim(validator.escape(validator.normalizeEmail(email + ''))));
		const san_password = emptyString(validator.trim(validator.escape(password + '')));
		
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
		//validate that all sanitized inputs follow DB constraints
		if (!((validator.isEmail(san_email) || validator.isEmpty(san_email)) && san_email.length < 26)){
			res.status(406).send('Please enter a valid email');
		} else {
			//verify correct password has been entered
			var promise_validate_password = dbReq.validatePW(uuid, san_password);
			promise_validate_password.then(function(validate_result){

				//If valid password, check if the new email already is an existing user
				if(validate_result == 'Valid'){
					var promise_check_user = dbReq.checkUserExists(san_email);
					promise_check_user.then(function(check_user_result){
							
						//If no email pre-exists, change email for user
						if(check_user_result.length == 0){
							if (!(validator.isEmpty(san_email))){
								var promise_update_email = dbReq.updateUser_email(uuid, san_email);
								promise_update_email.then(function(update_result){
									res.status(200).send('Email successfully changed!');
								}, function(update_error){
									console.log(update_error);
									res.status(500).send('Sorry an error ocurred while processing your request');
								});
							} else{
								res.status(200).send('No changes made!');
							}
						} else {
							res.status(409).send('This email is already associated with another user!');
						}
					}, function(check_user_error){
						console.log(check_user_error);
						res.status(500).send('Sorry an error ocurred while processing your request');
					});
				} else {
					res.status(406).send('Invalid password');
				}
			}, function(validate_error){
				console.log(validate_error);
				res.status(500).send('Sorry an error ocurred while processing your request');
			});
		}

	} catch(e) {
		console.log(e)
		res.status(500)
	}
});

module.exports = router;
