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

        dbReq.checkUserExists(email, function(response){
            if(response.length == 0){

                res.status(406).send("This email does not exist.");

            }else{

                try{

                    dbReq.validatePW(email, password, function(resp){
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