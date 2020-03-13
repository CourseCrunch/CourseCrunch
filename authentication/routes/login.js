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

router.post('/', (req, res) => {
    try {
        const { Email, Password } = req.body;

        const sanPassword = emptyString(validator.trim(validator.escape(`${Password}`)));
        const sanEmail = emptyString(validator.trim(validator.escape(`${Email}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            //Verify if the correct password has been entered.
            const promiseValidatePassword = dbReq.validatePW(sanEmail, sanPassword);
            promiseValidatePassword.then((validateResult) => {
                //If password validated, log them
                if (validateResult === 'Valid') {
                    var uuid = dbReq.getUserIDFromMail(sanEmail);
                    res.status(200).json({userid:uuid});
                } else {
                    res.status(406).send();
                }
            }).catch((validateError) => {
                console.log(validateError);
                res.status(500).send();
            });
        }
    } catch (e) {
        res.status(500).send();
        console.log(e);
    }
});

module.exports = router;