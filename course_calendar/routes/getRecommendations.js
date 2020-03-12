var express = require('express');
var moment = require('moment');
var router = express.Router();


var Courses = [
{name: "CSC369",timing:[{start:moment().month(0).day("Monday").hour(12),to:moment().month(0).day("Monday").hour(14)}]},
{name: "CSC343",timing:[{start:moment().month(0).day("Tuesday").hour(14),to:moment().month(0).day("Monday").hour(18)}]},
{name: "CSC324",timing:[{start:moment().month(0).day("Monday").hour(12),to:moment().month(0).day("Monday").hour(14)}]}
]

function removeExcludedCourses(courses,excludedCourses){
    var newCourses = [];
    for (course in courses){
        if (!(excludedCourses.includes(courses[course].name))){
            newCourses.push(courses[course]);
        }
    }
    return newCourses;
}

function removeExcludedTimings(courses,excludedTimings){
    var newCourses = [];
    excludedTimings.forEach(element => {
        let d1 = moment().month(0).day(element.day).hour(element.start);
        let d2 = moment().month(0).day(element.day).hour(element.end);
        courses.forEach(element2 =>{
            var notBetween = true;
            element2.timing.forEach(timings =>{
                let d3 = timings.start;
                let d4 = timings.to;
                if ((d1.isBetween(d3,d4) || d2.isBetween(d3,d4))){
                    notBetween = false;
                }
            });

            if (notBetween){
                newCourses.push(element2);
            }
            console.log(newCourses);
        });
    });
    return newCourses;
}
/* GET users listing. */
router.post('/', function(req, res, next) {
var reqCourses = req.body.courses;
var reqTimings = req.body.timing;
var newCourses = removeExcludedCourses(Courses,reqCourses);
var finalCourses = removeExcludedTimings(newCourses,reqTimings);
  res.json(finalCourses);
});

module.exports = router;