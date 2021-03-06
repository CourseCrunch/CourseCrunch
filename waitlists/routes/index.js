const bodyParser = require('body-parser');
const validator = require('validator');
const express = require('express');
const timetableApi = require('../../timetable_api/api.js');
const dbReq = require('../resources/queries');

const router = express.Router();

const emptyString = (input) => { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
    extended: true,
}));

router.get('/', (req, res) => {
    res.json({ info: 'Temp waitlist page' });
});


router.post('/addWaitlist', (req, res) => {
    // get required info from the JSON or url-encoded form
    try {
        const {
            userid, course, term, year,
        } = req.body;
        // sanitize all inputs!
        const uuid = emptyString(validator.trim(`${userid}`));
        const sanCourse = emptyString(validator.trim(`${course}`));
        const sanTerm = emptyString(validator.trim(`${term}`));
        const sanYear = emptyString(validator.trim(`${year}`));
        res.header('Access-Control-Allow-Origin', '*');
        if (uuid === '' || sanCourse === '' || sanTerm === '' || sanYear === '') {
            res.status(400).send('Empty fetch');
        } else {
            timetableApi.waitListSpace(sanCourse, sanTerm, sanYear).then((result) => {
                if (!result) {
                    return -2;
                } if (result.space) {
                    return -1;
                }
                return 0;
            }).then((courseStatus) => {
                if (courseStatus === -1) {
                    res.status(409).send('This course has space, you cannot waitlist it at this moment');
                } else if (courseStatus === -2) {
                    res.status(409).send('An error occured while handling your request. Are you sure this course exists?');
                } else {
                    dbReq.addUser(uuid, sanCourse, sanYear, sanTerm).then(() => {
                        res.status(200).send('Added');
                    }).catch((e) => {
                        res.status(500).send('An error occured while handling your request');
                        console.log(e);
                    });
                }
            }).catch((e) => {
                res.status(409).send('An error occured while handling your request. Are you sure this course exists?');
                console.log(e);
            });
        }
    } catch (e) {
        res.status(500).send('Something went wrong while handling your request');
        console.log(e);
    }
});


router.delete('/deleteWaitlist', (req, res) => {
    // get required info from the JSON or url-encoded form
    try {
        const {
            userid, course, term, year,
        } = req.body;
        // TODO REMOVE THE FALSE PART
        const uuid = emptyString(validator.trim(userid));
        const sanCourse = emptyString(validator.trim(`${course}`));
        const sanTerm = emptyString(validator.trim(`${term}`));
        const sanYear = emptyString(validator.trim(`${year}`));
        res.header('Access-Control-Allow-Origin', '*');
        if (uuid === '' || sanCourse === '' || sanTerm === '' || sanYear === '') {
            res.status(400).send('Empty fetch');
        } else {
            dbReq.removeUser(uuid, sanCourse, sanYear, sanTerm).then(() => {
                res.status(200).send('Removed');
            }).catch((e) => {
                res.status(409).send('An error occured while handling your request. Are you sure you waitlisted this course?');
                console.log(e);
            });
        }
    } catch (e) {
        res.status(500).send('Something went wrong on the server side');
        console.log(e);
    }
});

router.post('/getWaitlists', (req, res) => {
    try {
        const {
            userid,
        } = req.body;
            // sanitize all inputs!
        const uuid = emptyString(validator.trim(userid));
        if (uuid === '') {
            res.status(400).send('Empty fetch');
        } else {
            dbReq.getWaitlistsForUser(uuid).then((waitlists) => {
                if (waitlists != null) {
                    res.status(200).send(waitlists);
                } else {
                    res.status(500).send('Something went wrong on the server side');
                }
            }).catch((e) => {
                res.status(409).send('Something went while getting your response');
                console.log(e);
            });
        }
    } catch (e) {
        res.status(500).send('Something went wrong on the server side');
        console.log(e);
    }
});
module.exports = router;
