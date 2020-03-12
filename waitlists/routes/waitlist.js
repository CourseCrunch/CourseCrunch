var timetable_api = require('../../timetable_api/api.js');
var express = require('express');
var router = express.Router();
var app = express();
var dbReq = require('../resources/queries');
var bodyParser = require('body-parser');
var validator = require('validator');
const emptyString = function(input) { if(input == 'undefined') {return ''} else {return input}}

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
	extended: true
}));

router.get('/', function(req, res, next) {
    res.json({ info:'Temp waitlist page'});
  });


router.post('/', function (req, res){
	try{
        //get required info from the JSON or url-encoded form
        console.log(req.body);
        const {course, term, year} = req.body;
        
        // TEMPORARY UNTIL PROPER SESSION AND SESSION SERVER IS SET UP FROM LOGIN
        const uuid = "1"; //req.cookies.sessionid;
		//sanitize all inputs!
		const san_course = emptyString(validator.trim(course + ''));
		const san_term = emptyString(validator.trim(term + ''));
        const san_year = emptyString(validator.trim(year + ''));
        console.log(san_course);
        console.log(san_term);
        console.log(san_year);
		timetable_api.waitListSpace(san_course, san_term, san_year).then(result => {
            if(!result){
                return -2;
            }
            else if(result.space){
                return -1;
            }
            return 0;
        }).then((courseStatus)=>{
            if(courseStatus == -1){
                res.status(409).send('This course has space, you cannot waitlist it at this moment');
            }
            else if(courseStatus == -2){
                res.status(409).send('An error occured while handling your request. Are you sure this course exists?');
            }
            else{
                try{
                    dbReq.addUser(uuid, san_course, san_year, san_term);
                    res.status(200).send('User waitlisted!');
                }
                catch{
                    res.status(500).send('An error occured while handling your request');
                }
            }   
        });
    } catch(e){
        throw(e);
    }
});


		

module.exports = router;