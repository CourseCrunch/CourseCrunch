var express = require('express');
var router = express.Router();
var dbReq = require('../resources/queries');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var validator = require('validator');
var Promise = require('promise');

//this line is borrowed from creator of validator as work-around for validating alphas with spaces
const valid = (input) => input.split(' ').every(function (s) { return validator.isAlpha(s); });
//modified to check dashes
const valid2 = (input) => input.split('-').every(function (s) { return validator.isAlpha(s); });

const emptyString = function(input) { if(input == 'undefined') {return ''} else {return input}}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
	extended: true
}));

router.use(cookieParser());

router.get('/',function(req, res, next) {
	res.json({info:'Temp Profile conf page'});
});

router.patch('/', function (req, res){
	try{

		//retrieve info from request
		const {fname, lname, program} = req.body;

		//sanitize input
		const san_fname = emptyString(validator.trim(fname + ''));
		const san_lname = emptyString(validator.trim(lname + ''));
		const san_program = emptyString(validator.trim(program + ''));
		
		//TEMPORARY UNTIL PROPER SESSION AND SESSION SERVER IS SET UP FROM LOGIN
		const uuid = req.cookies.sessionid;

		/***************UNCOMMENT ME WHEN SESSION IS IMPLEMENTED
		//Gets user ID from session db using the user session key
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



		//NOTE: all res status messages are for debugging and presenting to our TA, will remove when front end is built
		//validate that all sanitized inputs follow DB constraints
		if (!((valid(san_fname) || valid2(san_fname) || validator.isEmpty(san_fname)) && san_fname.length < 26)){
			res.status(406).send('Please enter a valid first name');
		} else if (!((valid(san_lname) || valid2(san_lname) || validator.isEmpty(san_lname)) && san_lname.length < 41)){
			res.status(406).send('Please enter a valid last name');
		} else if (!((valid(san_program) || valid2(san_program) || validator.isEmpty(san_program)) && san_program.length < 256)){
			res.status(406).send('please enter a valid program');
		} else {
			//If the any of the fields are not empty, update them
			if (!(validator.isEmpty(san_fname))){
				var promise_update_fname = dbReq.updateUser_fname(uuid, san_fname);
				promise_update_fname.then(function(update_fname_error){
					console.log(update_fname_error);
					res.status(500).send('Sorry an error occurred while processing your request');
				});
			}
			if (!(validator.isEmpty(san_lname))){
				var promise_update_lname = dbReq.updateUser_lname(uuid, san_lname);
				promise_update_lname.then(function(update_lname_error){
					console.log(update_lname_error);
					res.status(500).send('Sorry an error occurred while processing your request');
				});
			}
			if (!(validator.isEmpty(san_program))){
				var promise_update_program = dbReq.updateUser_program(uuid, san_program);
				promise_update_program.then(function(update_program_error){
					console.log(update_program_error);
					res.status(500).send('Sorry an error occurred while processing your request');
				});
			}
			res.status(200).send('Profile Updated!');
		}			
	} catch(e) {
		console.log(e);
		res.status(500);
	}
});

module.exports = router;
