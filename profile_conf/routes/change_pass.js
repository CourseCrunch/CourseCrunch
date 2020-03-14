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

router.patch('/', (req, res) => {
    try {
        // retrieve info from request
        const { unsanUuid, oldPassword, newPassword } = req.body;

        // sanitize input
        const sanOldPassword = emptyString(validator.trim(validator.escape(`${oldPassword}`)));
        const sanNewPassword = emptyString(validator.trim(validator.escape(`${newPassword}`)));
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            // verify correct password has been entered
            const promiseValidatePassword = dbReq.validatePW(uuid, sanOldPassword);
            promiseValidatePassword.then((validateResult) => {
                // If valid password, change to new password
                if (validateResult === 'Valid') {
                    if (!(validator.isEmpty(sanNewPassword))) {
                        const promiseUpdatePass = dbReq.updateUserPass(uuid, sanNewPassword);
                        promiseUpdatePass.then(() => {
                            res.status(200).send();
                        }).catch((updateError) => {
                            console.log(updateError);
                            res.status(500).send();
                        });
                    } else {
                        res.status(200).send();
                    }
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
