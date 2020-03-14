const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

mongoose.connect(process.env.CONNECTSTR, { useNewUrlParser: true });

router.post('/recommendation', (req, res) => {
    const filteredCourse = req.body.courses;
    const limit  = req.body.limit;
    mongoose.model('utm_evals').aggregate([
        { $group: { _id: '$Code', Course_Workload: { $avg: { $toDecimal: '$Course_Workload' } } } },
        { $match: { _id: { $nin: filteredCourse } } },
        { $sort: { Course_Workload: 1 } },
        {$limit: limit}
    ], (err, data) => {
        if (err) {
            res.sendStatus(404);
        } else {
            res.status(200).send(data);
        }
    });
});

module.exports = router;
