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
	res.json({info:'Temp Email changing page'});
});

router.put('/', function (req, res){
	try{

		const {password, email} = req.body;

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

		//validate that all sanitized inputs follow DB constraints
		//NOTE: all response messages are for debugging and TA presentation, will be removed once front end implemented!
		if (!((validator.isEmail(san_email) || validator.isEmpty(san_email)) && san_email.length < 26)){
			res.status(406).send('Please enter a valid email');
		} else {
			//verify correct password has been entered
			try {
				dbReq.validatePW(uuid, san_password, function(resp){
					if(resp == 'error'){
						res.status(500).send('Sorry an error occurred while processing your request');

					//If valid password, check if the new email already is an existing user
					} else if(resp == 'Valid'){
						dbReq.checkUserExists(san_email, function(response){
							
							//If no email pre-exists, change email for user
							if(response.length == 0){
								if (!(validator.isEmpty(san_email))){
									dbReq.updateUser_email(uuid, san_email, function(resp){
										if(resp == 'error'){
											res.status(500).send('Sorry an error occurred while processing your request');
										}
									});
								}
								res.status(200).send('Email successfully changed!');
							} else {
								res.status(409).send('This email is already associated with anotehr user!')
							}
						});
					} else {
						res.status(406).send('Invalid password');
					}
				});

			} catch(e) {
				res.status(500);
				console.log(e);
			}
		}

	} catch(e) {
		throw(e)
	}
});

module.exports = router;
