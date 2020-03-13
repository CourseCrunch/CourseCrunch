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
        const { unsanUuid, oldPassword } = req.body;

        const sanOldPassword = emptyString(validator.trim(validator.escape(`${oldPassword}`)));
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            //Verify if the correct password has been entered.
            const promiseValidatePassword = dbReq.validatePW(uuid, sanOldPassword);
            promiseValidatePassword.then((validateResult) => {
                //If password validated, log them in.
                if (validateResult === 'Valid') {
                    res.status(200).send();
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