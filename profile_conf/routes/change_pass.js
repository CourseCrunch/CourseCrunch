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
	res.json({info:'Temp Password changing page'});
});

router.patch('/', function (req, res){
	try{

		//retrieve info from request
		const {oldPassword, newPassword} = req.body;

		//sanitize input
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
		var promise_validate_password = dbReq.validatePW(uuid, san_old_password);
		promise_validate_password.then(function(validate_result){
			//If valid password, change to new password
			if(validate_result == 'Valid'){
						
				if (!(validator.isEmpty(san_new_password))){
					var promise_update_pass = dbReq.updateUser_pass(uuid, san_new_password);
					promise_update_pass.then(function(update_result){
						res.status(200).send('Password successfully changed!');
					}, function(update_error){
						console.log(update_error);
						res.status(500).send('Sorry an error occurred while processing your request');
					});
				} else{
					res.status(200).send('No changes made!');
				}	
			} else{
				res.status(406).send('Invalid password');
			}
		}, function(validate_error){
			console.log(validate_error);
			res.status(500).send('Sorry an error occurred while processing your request');
		});

	} catch(e){
		res.status(500);
		console.log(e);
	}
		

});

module.exports = router;
