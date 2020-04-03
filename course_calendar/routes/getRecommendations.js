const express = require('express');
const moment = require('moment');

const router = express.Router();


const Courses = [
    { name: 'CSC369', timing: [{ start: moment().month(0).day('Monday').hour(12), to: moment().month(0).day('Monday').hour(14) }] },
    { name: 'CSC343', timing: [{ start: moment().month(0).day('Tuesday').hour(14), to: moment().month(0).day('Monday').hour(18) }] },
    { name: 'CSC324', timing: [{ start: moment().month(0).day('Monday').hour(12), to: moment().month(0).day('Monday').hour(14) }] },
];

function removeExcludedCourses(courses, excludedCourses) {
    const newCourses = [];
    Object.keys(courses).forEach((course) => {
        if (!(excludedCourses.includes(courses[course].name))) {
            newCourses.push(courses[course]);
        }
    });
    return newCourses;
}

function removeExcludedTimings(courses, excludedTimings) {
    const newCourses = [];
    excludedTimings.forEach((element) => {
        const d1 = moment().month(0).day(element.day).hour(element.start);
        const d2 = moment().month(0).day(element.day).hour(element.end);
        courses.forEach((element2) => {
            let notBetween = true;
            element2.timing.forEach((timings) => {
                const d3 = timings.start;
                const d4 = timings.to;
                if ((d1.isBetween(d3, d4) || d2.isBetween(d3, d4))) {
                    notBetween = false;
                }
            });

            if (notBetween) {
                newCourses.push(element2);
            }
            console.log(newCourses);
        });
    });
    return newCourses;
}
/* GET users listing. */
router.post('/', (req, res) => {
    const reqCourses = req.body.courses;
    const reqTimings = req.body.timing;
    const newCourses = removeExcludedCourses(Courses, reqCourses);
    const finalCourses = removeExcludedTimings(newCourses, reqTimings);
    res.json(finalCourses);
});

module.exports = router;
