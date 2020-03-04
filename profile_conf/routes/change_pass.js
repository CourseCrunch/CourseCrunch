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
    res.json({ info: 'Temp Password changing page' });
});

router.patch('/', (req, res) => {
    try {
        // retrieve info from request
        const { oldPassword, newPassword } = req.body;

        // sanitize input
        const sanOldPassword = emptyString(validator.trim(validator.escape(`${oldPassword}`)));
        const sanNewPassword = emptyString(validator.trim(validator.escape(`${newPassword}`)));

        // TEMPORARY UNTIL PROPER SESSION AND SESSION SERVER IS SET UP FROM LOGIN
        const uuid = req.cookies.sessionid;

        // NOTE: all response messages are for debugging and TA presentation,
        //       will be removed once front end implemented!
        // verify correct password has been entered
        const promiseValidatePassword = dbReq.validatePW(uuid, sanOldPassword);
        promiseValidatePassword.then((validateResult) => {
            // If valid password, change to new password
            if (validateResult === 'Valid') {
                if (!(validator.isEmpty(sanNewPassword))) {
                    const promiseUpdatePass = dbReq.updateUserPass(uuid, sanNewPassword);
                    promiseUpdatePass.then(() => {
                        res.status(200).send('Password successfully changed!');
                    }, (updateError) => {
                        console.log(updateError);
                        res.status(500).send('Sorry an error occurred while processing your request');
                    });
                } else {
                    res.status(200).send('No changes made!');
                }
            } else {
                res.status(406).send('Invalid password');
            }
        }, (validateError) => {
            console.log(validateError);
            res.status(500).send('Sorry an error occurred while processing your request');
        });
    } catch (e) {
        res.status(500);
        console.log(e);
    }
});

module.exports = router;
