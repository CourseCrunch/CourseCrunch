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

router.get('/', (req, res, next) => {
    res.json({ info: 'Temp waitlist page' });
});


router.post('/', (req, res) => {
    // get required info from the JSON or url-encoded form
    const { course, term, year } = req.body;

    const uuid = '2e905a7e-567b-40db-b181-72c5132e09e0'; // localStorage.getItem('userid');
    /*
    if (typeof window === 'undefined') {
        res.status(403).send('Unauthorized to access resource');
    } */
    // sanitize all inputs!
    const sanCourse = emptyString(validator.trim(`${course}`));
    const sanTerm = emptyString(validator.trim(`${term}`));
    const sanYear = emptyString(validator.trim(`${year}`));
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
                res.status(200).send('User waitlisted!');
            }).catch((e) => {
                console.log(e);
                res.status(500).send('An error occured while handling your request');
            });
        }
    });
});


module.exports = router;
