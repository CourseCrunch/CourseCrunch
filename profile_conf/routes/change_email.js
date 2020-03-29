const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');

const emptyString = (input) => { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

router.use(cookieParser());

router.get('/', (req, res) => {
    res.json({ info: 'Success' });
});

router.post('/', (req, res) => {
    try {
        // retrieve uuid from request
        const { unsanUuid } = req.body;

        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            const promiseGetUserEmail = dbReq.getUserEmail(uuid);
            promiseGetUserEmail.then((queryResult) => {
                const { email } = queryResult.rows[0];
                res.status(200).json({ eMail: email });
            }).catch((constructError) => {
                console.log(constructError);
                res.status(500).send();
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.patch('/', (req, res) => {
    try {
        // retrieve info from request
        const { unsanUuid, password, email } = req.body;

        // sanitize input
        const sanEmail = emptyString(validator.trim(validator.escape(validator.normalizeEmail(`${email}`))));
        const sanPassword = emptyString(validator.trim(validator.escape(`${password}`)));
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else if (!((validator.isEmail(sanEmail) || validator.isEmpty(sanEmail))
                    && sanEmail.length < 26)) {
            res.status(406).send();
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
                                    res.status(200).send();
                                }).catch((updateError) => {
                                    console.log(updateError);
                                    res.status(500).send();
                                });
                            } else {
                                res.status(200).send();
                            }
                        } else {
                            res.status(409).send();
                        }
                    }).catch((checkUserError) => {
                        console.log(checkUserError);
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
        console.log(e);
        res.status(500).send();
    }
});

module.exports = router;
