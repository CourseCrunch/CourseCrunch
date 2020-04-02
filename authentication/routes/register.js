const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');

// this line is borrowed from creator of validator as work-around for validating alphas with spaces
const valid = (input) => input.split(' ').every((s) => validator.isAlpha(s));
// modified to check dashes
const valid2 = (input) => input.split('-').every((s) => validator.isAlpha(s));

const emptyString = function (input) { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));
// Temporary page
router.get('/', (req, res) => {
    res.json({ info: 'loaded!' });
});

router.post('/', (req, res) => {
    try {
        // get required info from the JSON or url-encoded form
        const {
            fName, lName, email, program, password,
        } = req.body;

        // sanitize all inputs!
        const sanFname = emptyString(validator.trim(`${fName}`));
        const sanLname = emptyString(validator.trim(`${lName}`));
        const sanEmail = emptyString(validator.trim(validator.escape(validator.normalizeEmail(`${email}`))));
        const sanProgram = emptyString(validator.trim(`${program}`));
        const sanPassword = emptyString(validator.trim(validator.escape(`${password}`)));

        // validate that all sanitized inputs follow DB constraints
        if (!(validator.isEmail(sanEmail)) || !(sanEmail.length < 200)) {
            res.status(406).send('mail');
        } else if (!((valid(sanFname) || valid2(sanFname)) && sanFname.length < 26)) {
            res.status(406).send();
        } else if (!((valid(sanLname) || valid2(sanLname) || validator.isEmpty(sanLname))
            && sanLname.length < 41)) {
            res.status(406).send();
        } else if (!((valid(sanProgram) || valid2(sanProgram) || validator.isEmpty(sanProgram))
            && sanProgram.length < 256)) {
            res.status(406).send();
        } else {
            // check if email already registered with our website
            const promiseCheckEmail = dbReq.checkUserExists(sanEmail);
            promiseCheckEmail.then((checkResponse) => {
                // if no email pre-exists
                if (checkResponse.rows.length === 0) {
                    const promiseCreateUser = dbReq
                        .createUser(sanFname, sanLname, sanEmail, sanProgram, sanPassword);
                    promiseCreateUser.then((registerResp) => {
                        const data = { uuid: registerResp };
                        res.status(200).json(data);
                    }).catch((createUserError) => {
                        console.log(createUserError);
                        res.status(500).send();
                    });
                } else {
                    res.status(409).send();
                }
            }).catch((checkEmailError) => {
                console.log(checkEmailError);
                res.status(500).send();
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

module.exports = router;
