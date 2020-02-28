/* eslint-disable no-useless-catch */
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

router.get('/', (req, res) => {
    try {
        const { email, password } = req.body;

        // Sanitize like the Romans
        const sanEmail = emptyString(validator.trim(validator.escape(validator.normalizeEmail(`${email}`))));
        const sanPassword = emptyString(validator.trim(validator.escape(`${password}`)));

        if (!(validator.isEmail(sanEmail)) || !(sanEmail.length < 200)) {
            res.status(406).send('Please enter a valid email.');
        } else {
            dbReq.checkUserExists(sanEmail, (response) => {
                if (response.length === 0) {
                    res.status(406).send('There is no account associated with this email.');
                } else {
                    try {
                        dbReq.validatePW(sanEmail, sanPassword, (resp) => {
                            if (resp === 'Invalid Password') {
                                res.status(406).send('Invalid Password for the given email.');
                            } else if (resp === 'error') {
                                res.status(500).send('Error during password validation.');
                            } else {
                            // Sessions and other concepts here?
                                res.status(200).send('Successful login');
                            }
                        });
                    } catch (e) {
                        res.status(500);
                    }
                }
            });
        }
    } catch (e) {
        throw (e);
    }
});

module.exports = router;
