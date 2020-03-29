const express = require('express');

const router = express.Router();
const fetch = require('node-fetch');
const moment = require('moment');
const courseEvals = require('../model/api');
const timetableApi = require('../../timetable_api/api');
// mongoose.connect(process.env.MONGOEVALSTR, { useNewUrlParser: true });

function getDay(day) {
    switch (day) {
    case 'MO': return 'Monday';
    case 'TU': return 'Tuesday';
    case 'WE': return 'Wednesday';
    case 'TH': return 'Thursday';
    case 'FR': return 'Friday';
    default:
        return null;
    }
}

function getHour(hour) {
    const splitString = hour.split(':');
    return splitString[0];
}
async function isInBetween(data, timings) {
    // A course is considered takeable if there exists a non-conflicting lecture
    const lectures = data.courses; // contains every lecture
    if (lectures == null) {
        return true;
    }
    const AvailableLecture = lectures.map((lecture) => {
        // check to see if a lecture works, every section for that lecture must be non-conflicting
        const { sections } = lecture;
        const AvailableSections = sections.map((section) => {
            if (section.day === '' || section.start === '' || section.end === '') {
                // Online courses;
                return true;
            }
            const s1 = moment().day(getDay(section.day)).hour(getHour(section.start)).minute(0)
                .date(getDay(section.day));
            const s2 = moment().day(getDay(section.day)).hour(getHour(section.end)).minute(0)
                .date(getDay(section.day));
            const availableTimings = timings.map((timing) => {
                const d1 = moment(timing.start);
                const d2 = moment(timing.end);
                return !(s1.isBetween(d1, d2) || d1.isBetween(s1, s2));
            });
            return availableTimings.every((value) => value === true);
        });
        return AvailableSections.every((value) => value === true);
    });
    return AvailableLecture.some((value) => value === true);
}

async function filterCourses(res, data, timings) {
    const finalArray = await Promise.all(data.map(async (value) => {
        // eslint-disable-next-line no-underscore-dangle
        const result = await timetableApi.queryCourse(value._id, 'winter', '2019');
        if (timings === [] || result === null) {
            return result;
        }
        const IsConflicting = await isInBetween(result, timings);
        if (!IsConflicting) {
            return null;
        }
        return result;
    }));
    res.status(200).send(finalArray);
}

router.post('/recommendation', (req, res) => {
    const filteredCourse = req.body.courses;
    const { limit, timings } = req.body;
    // console.log(someFunction2(res,"4",timings));
    try {
        fetch(`http://localhost:${process.env.CALENDARPORT}/api/prereqTo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courses: ['CSC108H5'] }),
        }).then((response) => response.json())
            .then((result) => {
                const courses = result.courseList;
                courseEvals.getCourseRecommendations('utm', courses, filteredCourse, limit)
                    .then((data) => {
                        if (timings.length === 0) {
                            res.status(200).send(data);
                        } else {
                            filterCourses(res, data, timings);
                        }
                    });
            }).catch((e) => console.log(e));
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
