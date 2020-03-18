<<<<<<< HEAD
/* eslint-disable no-useless-catch */
const express = require('express');

const router = express.Router();
=======
const express = require('express');

const router = express.Router();
const app = express();
>>>>>>> master
const bodyParser = require('body-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');

<<<<<<< HEAD
const emptyString = function (input) { if (input === 'undefined') { return ''; } return input; };
=======
const emptyString = function (input) { if (input == 'undefined') { return ''; } return input; };
>>>>>>> master

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

<<<<<<< HEAD
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
=======
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
>>>>>>> master
                }
            }).catch((validateError) => {
                console.log(validateError);
                res.status(500).send();
            });
        }
    } catch (e) {
<<<<<<< HEAD
        throw (e);
=======
        res.status(500).send();
        console.log(e);
>>>>>>> master
    }
});

module.exports = router;
