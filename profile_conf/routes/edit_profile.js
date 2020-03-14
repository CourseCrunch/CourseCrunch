const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const dbReq = require('../resources/queries');
const utils = require('../resources/utils');

// this line is borrowed from creator of validator as work-around for validating alphas with spaces
const valid = (input) => input.split(' ').every((s) => validator.isAlpha(s));
// modified to check dashes
const valid2 = (input) => input.split('-').every((s) => validator.isAlpha(s));

const emptyString = (input) => { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

router.use(cookieParser());

router.post('/', (req, res) => {
    try {
        // retrieve uuid from request
        const { unsanUuid } = req.body;

        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            const promiseGetUserInfo = dbReq.getUserInfo(uuid);
            promiseGetUserInfo.then((queryResult) => {
                const { fname, lname, program } = queryResult.rows[0];
                res.status(200).json({ fNam: fname, lNam: lname, prog: program });
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
        const {
            unsanUuid, unsanFname, unsanLname, unsanProgram,
        } = req.body;

        // sanitize input
        const sanFname = emptyString(validator.trim(validator.escape(`${unsanFname}`)));
        const sanLname = emptyString(validator.trim(validator.escape(`${unsanLname}`)));
        const sanProgram = emptyString(validator.trim(validator.escape(`${unsanProgram}`)));
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            // validate that all sanitized inputs follow DB constraints
            if (!((valid(sanFname) || valid2(sanFname) || validator.isEmpty(sanFname))
                    && sanFname.length < 26)) {
                res.status(406).send();
            } else if (!((valid(sanLname) || valid2(sanLname) || validator.isEmpty(sanLname))
                    && sanLname.length < 41)) {
                res.status(406).send();
            } else if (!((valid(sanProgram) || valid2(sanProgram) || validator.isEmpty(sanProgram))
                    && sanProgram.length < 256)) {
                res.status(406).send();
            } else {
                // If the any of the fields are not empty, update them
                const promiseGetUserInfo = dbReq.getUserInfo(uuid);
                promiseGetUserInfo.then((queryResult) => {
                    const { fname, lname, program } = queryResult.rows[0];
                    const columnList = [];
                    const paramList = [];
                    if ((!(validator.isEmpty(sanFname))) && fname !== sanFname) {
                        columnList.push('FNAME');
                        paramList.push(sanFname);
                    }

                    if ((!(validator.isEmpty(sanLname))) && lname !== sanLname) {
                        columnList.push('LNAME');
                        paramList.push(sanLname);
                    }

                    if ((!(validator.isEmpty(sanProgram))) && program !== sanProgram) {
                        columnList.push('PROGRAM');
                        paramList.push(sanProgram);
                    }

                    if (columnList.length > 0) {
                        const promiseConstructQuery = 
				    utils.constructQuery(columnList, paramList, uuid);
                        promiseConstructQuery.then((query) => {
                            const promiseUpdateUser = dbReq.updateUser(query);
                            promiseUpdateUser.then(() => {
                                res.status(200).send();
                            }).catch((queryError) => {
                                console.log(queryError);
                                res.status(500).send();
                            });
                        }).catch((constructError) => {
                            console.log(constructError);
                            res.status(500).send();
                        });
                    } else {
                        res.status(200).send();
                    }
                }).catch((userInfoError) => {
                    console.log(userInfoError);
                    res.status(500).send();
                });
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

module.exports = router;
