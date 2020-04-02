const express = require('express');
const validator = require('validator');
const bodyParser = require('body-parser');

const router = express.Router();
const dbReq = require('../resources/queries');

const emptyString = (input) => { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));

// function returns all of the courses taken by a given user
router.post('/', (req, res) => {
    try {
        const { unsanUuid } = req.body;
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            const respJSON = {};
            const promiseGetCourses = dbReq.getAllTakenCourses(uuid);
            promiseGetCourses.then((queryResult) => {
                const courseList = [];
                queryResult.rows.forEach((row) => {
                    courseList.push(row.course_code);
                });
                respJSON.courses = courseList;
                res.status(200).json(respJSON);
            }).catch((queryError) => {
                console.log(queryError);
                res.status(400).send();
            });
        }
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
