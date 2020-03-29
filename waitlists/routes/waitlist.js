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


router.post('/', (req, res) => {
    // get required info from the JSON or url-encoded form
    try {
        const { course, term, year } = req.body;

        if (typeof window === 'undefined') {
            res.status(403).send('Unauthorized to access resource');
        } else {
            // sanitize all inputs!
            const uuid = emptyString(validator.trip(`${localStorage.getItem('userID')}`));
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
                            res.status(200).send({});
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
        }
    } catch (e) {
        res.status(500).send('Something went wrong while handling your request');
        console.log(e);
    }
});


module.exports = router;