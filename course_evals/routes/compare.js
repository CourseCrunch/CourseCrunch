const express = require('express');
const api = require('../model/api');

const router = express.Router();
const campuses = api.getSchools();

router.get('/compare/instructors/:courseId', (req, res) => {
    const { courseId } = req.params;

    campuses.utm[0]
        .compareCourses(courseId)
        .then((out) => out.map((each) => campuses.utm[0].convert(each)))
        .then((out) => {
            res.send(out);
        })
        .catch(() => {
            res.status(500).send('internal server error');
            console.log('Promise Rejected');
        });
});

module.exports = router;
