const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');

const emptyString = function (input) { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

router.use(cookieParser());

router.get('/', (req, res, next) => {
    res.json({ info: 'Temp Email changing page' });
});

router.patch('/', (req, res) => {
    try {
        // retrieve info from request
        const { password, email } = req.body;

        // sanitize input
        const sanEmail = emptyString(validator.trim(validator.escape(validator.normalizeEmail(`${email}`))));
        const sanPassword = emptyString(validator.trim(validator.escape(`${password}`)));

        // TEMPORARY UNTIL PROPER SESSION AND SESSION SERVER IS SET UP FROM LOGIN
        const uuid = req.cookies.sessionid;

        // NOTE: all response messages are for debugging and TA presentation,
        //       will be removed once front end implemented!
        // validate that all sanitized inputs follow DB constraints
        if (!((validator.isEmail(sanEmail) || validator.isEmpty(sanEmail))
                && sanEmail.length < 26)) {
            res.status(406).send('Please enter a valid email');
        } else {
            // verify correct password has been entered
            const promiseValidatePassword = dbReq.validatePW(uuid, sanPassword);
            promiseValidatePassword.then((validateResult) => {
                // If valid password, check if the new email already is an existing user
                if (validateResult === 'Valid') {
                    const promiseCheckUser = dbReq.checkUserExists(sanEmail);
                    promiseCheckUser.then((checkUserResult) => {
                        // If no email pre-exists, change email for user
                        if (checkUserResult.rows[0] === undefined) {
                            if (!(validator.isEmpty(sanEmail))) {
                                const promiseUpdateEmail = dbReq.updateUserEmail(uuid, sanEmail);
                                promiseUpdateEmail.then(() => {
                                    res.status(200).send('Email successfully changed!');
                                }, (updateError) => {
                                    console.log(updateError);
                                    res.status(500).send('Sorry an error ocurred while processing your request');
                                });
                            } else {
                                res.status(200).send('No changes made!');
                            }
                        } else {
                            res.status(409).send('This email is already associated with another user!');
                        }
                    }, (checkUserError) => {
                        console.log(checkUserError);
                        res.status(500).send('Sorry an error ocurred while processing your request');
                    });
                } else {
                    res.status(406).send('Invalid password');
                }
            }, (validateError) => {
                console.log(validateError);
                res.status(500).send('Sorry an error ocurred while processing your request');
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});

module.exports = router;
