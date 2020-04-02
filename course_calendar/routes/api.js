const express = require('express');

const router = express.Router();
const validator = require('validator');
const bodyParser = require('body-parser');
const dbReq = require('../resources/queries');

const emptyString = (input) => { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

/* GET courses that a course code is a prerequisite to. */
router.post('/prereqTo', (req, res) => {
    try {
        console.log(req.body);
        const reqCourses = req.body.courses;

        dbReq.getPrereqTo(reqCourses).then((courses) => {
            const jsonObj = { courseList: courses };
            res.status(200).send(jsonObj);
        }).catch((e) => {
            console.log(e);
            res.status(500).send('Something went wrong while handling your request');
        });
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.get('/exclusionTo', (req, res) => {
    try {
        // retrieve uuid from request
        const reqCourses = req.body.courses;

        dbReq.getExclusionTo(reqCourses).then((courses) => {
            const jsonObj = { courseList: courses };
            res.status(200).send(jsonObj);
        }).catch((e) => {
            console.log(e);
            res.status(500).send('Something went wrong while handling your request');
        });
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});


/* Prerequisites that course code has */
router.get('/prerequisites', (req, res) => {
    try {
        // retrieve uuid from request
        const { courseCode } = req.body;

        const sanCourseCode = emptyString(validator.trim(validator.escape(`${courseCode}`)));

        if (sanCourseCode === '') {
            res.status(400).send();
        } else {
            dbReq.getPrerequisites(sanCourseCode).then((courses) => {
                const jsonObj = { courseList: courses };
                res.status(200).send(jsonObj);
            }).catch((e) => {
                console.log(e);
                res.status(500).send('Something went wrong while handling your request');
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});


module.exports = router;