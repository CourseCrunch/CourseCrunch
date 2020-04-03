
const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');

const emptyString = function (input) { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

router.post('/', (req, res) => {
    try {
        const { email, password } = req.body;

        const sanPassword = emptyString(validator.trim(validator.escape(`${password}`)));
        const sanEmail = emptyString(validator.trim(validator.escape(`${email}`)));

        if (sanEmail === '') {
            res.status(400).send();
        } else {
            // Verify if the correct password has been entered.
            const promiseValidatePassword = dbReq.validatePW(sanEmail, sanPassword);
            promiseValidatePassword.then((validateResult) => {
                // If password validated, log them
                if (validateResult === 'Valid') {
                    const uuid = dbReq.getUserIDFromMail(sanEmail);
                    uuid.then((result) => {
                        const data = { userid: result };
                        res.status(200).json(data);
                    }).catch((error) => {
                        console.log(error);
                        res.status(500).send();
                    });
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
