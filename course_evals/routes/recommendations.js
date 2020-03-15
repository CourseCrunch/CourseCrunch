const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const timetableApi = require('../../timetable_api/api.js');

mongoose.connect(process.env.CONNECTSTR, { useNewUrlParser: true });

async function someFunction(res,data){
    console.log(data);
    let finalArray = data.map((value) => {
        return timetableApi.queryCourse(value._id,"winter","2019");
        }
        )
    const resolved = await Promise.all(finalArray);
    res.status(200).send(resolved);

}
router.post('/recommendation', (req, res) => {
    const filteredCourse = req.body.courses;
    const limit  = req.body.limit;
    mongoose.model('utm_evals').aggregate([
        { $group: { _id: '$Code', Course_Workload: { $avg: { $toDecimal: '$Course_Workload' } }, Term: {$addToSet: {$concat: ["$Term" ,"$Year"]}} }},
        { $match: { _id: { $nin: filteredCourse }, Term: {$in: ["Winter2019"]} }},
        { $sort: { Course_Workload: 1 } },
        {$limit: limit}
    ], (err, data) => {
        if (err) {
            res.sendStatus(404);
        } else {
            someFunction(res,data);
        }
    });
});

module.exports = router;
