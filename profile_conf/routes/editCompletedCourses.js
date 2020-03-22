const express = require('express');
const validator = require('validator');
const bodyParser = require('body-parser');

const router = express.Router();
const handlePostReq = require('../resources/handlePost');
const handlePutReq = require('../resources/handlePut');
const handleDeleteReq = require('../resources/handleDel');

const emptyString = (input) => { if (input === 'undefined') { return ''; } return input; };

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));


router.post('/', (req, res) => {
    try {
        const { unsanUuid } = req.body;
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));

        if (uuid === '') {
            res.status(400).send();
        } else {
            const promiseGetCourses = handlePostReq.getCourses(uuid);
            promiseGetCourses.then((courseJSON) => {
                if (courseJSON === 400) {
                    res.status(400).send();
                } else {
                    res.status(200).json(courseJSON);
                }
            }).catch(() => {
                res.status(500).send();
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.put('/', (req, res) => {
    try {
        // retieve/sanitize UUID and courseCode from request
        const { unsanUuid, unsanCourseCode } = req.body;
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));
        const courseCode = emptyString(validator.trim(validator.escape(`${unsanCourseCode}`)));

        // verify UUID exists
        if (uuid === '') {
            res.status(400).send();
        } else {
            const promiseAddCourse = handlePutReq.addCourse(uuid, courseCode);
            promiseAddCourse.then((result) => {
                if (result === 406) {
                    res.status(406).send();
                } else {
                    res.status(200).send();
                }
            }).catch(() => {
                res.status(500).send();
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.delete('/', (req, res) => {
    try {
        const { unsanUuid, unsanCourseCode } = req.body;
        const uuid = emptyString(validator.trim(validator.escape(`${unsanUuid}`)));
        const courseCode = emptyString(validator.trim(validator.escape(`${unsanCourseCode}`)));

        // verify UUID exists
        if (uuid === '') {
            res.status(400).send();
        } else {
            const promiseDelCourse = handleDeleteReq.delCourse(uuid, courseCode);
            promiseDelCourse.then((result) => {
                if (result === 406) {
                    res.status(406).send();
                } else {
                    res.status(200).send();
                }
            }).catch(() => {
                res.status(500).send();
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

module.exports = router;
