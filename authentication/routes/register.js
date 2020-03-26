const express = require('express');

const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');

// this line is borrowed from creator of validator as work-around for validating alphas with spaces
const valid = (input) => input.split(' ').every((s) => validator.isAlpha(s));
// modified to check dashes
const valid2 = (input) => input.split('-').every((s) => validator.isAlpha(s));

const emptyString = function (input) { if (input == 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));
// Temporary page
router.get('/', (req, res, next) => {
    res.json({ info: 'Temp register page' });
});

router.post('/', (req, res) => {
    try {
        // get required info from the JSON or url-encoded form
        const {
            fname, lname, email, program, password,
        } = req.body;

        // sanitize all inputs!
        const san_fname = emptyString(validator.trim(`${fname}`));
        const san_lname = emptyString(validator.trim(`${lname}`));
        const san_email = emptyString(validator.trim(validator.escape(validator.normalizeEmail(`${email}`))));
        const san_program = emptyString(validator.trim(`${program}`));
        const san_password = emptyString(validator.trim(validator.escape(`${password}`)));

        // validate that all sanitized inputs follow DB constraints
        if (!(validator.isEmail(san_email)) || !(san_email.length < 200)) {
            res.status(406).send('Please enter a valid email');
        } else if (!((valid(san_fname) || valid2(san_fname)) && san_fname.length < 26)) {
            res.status(406).send('Please enter a valid first name');
        } else if (!((valid(san_lname) || valid2(san_lname) || validator.isEmpty(san_lname)) && san_lname.length < 41)) {
            res.status(406).send('Please enter a valid last name');
        } else if (!((valid(san_program) || valid2(san_program) || validator.isEmpty(san_program)) && san_program.length < 256)) {
            res.status(406).send('please enter a valid program');
        } else {
            // check if email already registered with our website
            dbReq.checkUserExists(san_email, (response) => {
                // if no email pre-exists
                if (response.length == 0) {
                    try {
                        dbReq.createUser(san_fname, san_lname, san_email, san_program, san_password, (resp) => {
                            if (resp == 'error') {
                                res.status(500).send('Sorry, an error occured while attempting to register you!');
                            } else {
                                res.status(200).send('User registered!');
                            }
                        });
                    } catch (e) {
                        res.status(500);
                        console.log(e);
                    }
                } else {
                    res.status(409).send('This email is already associated with another user!');
                }
            });
        }
    } catch (e) {
        throw (e);
    }
});

module.exports = router;
