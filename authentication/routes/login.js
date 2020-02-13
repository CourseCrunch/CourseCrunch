var express = require('express');
var router = express.Router();
var app = express();
var dbReq = require('../resources/queries');
var bodyParser = require('body-parser');
var validator = require('validator');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
	extended: true
}));

router.get('/', function(req, res) {
    try{
        
        const {email, password} = req.body;

        //Sanitize like the Romans
        const san_email = emptyString(validator.trim(validator.escape(validator.normalizeEmail(email + ''))));
        const san_password = emptyString(validator.trim(validator.escape(password + '')));

        if(!(validator.isEmail(san_email)) || !(san_email.length < 200)){
			res.status(406).send('Please enter a valid email');
        }

        dbReq.checkUserExists(san_email, function(response){
            if(response.length == 0){

                res.status(406).send("There is no account associated with this email.");

            }else{

                try{

                    dbReq.validatePW(san_email, san_password, function(resp){
                        if(resp == "Invalid Password"){

                            res.status(406).send("Invalid Password for the given email.");

                        }else if(resp == "error"){

                            res.status(500).send("Error during password validation.");

                        }else{
                            
                            //Sessions and other concepts here?
                            res.status(200).send("Successful login");
                        }
                    });

                }catch(e) {

                    res.status(500);
                    console.log(e);

                }
            }
        });
    
    }catch(e){      
        throw(e)
    }
});