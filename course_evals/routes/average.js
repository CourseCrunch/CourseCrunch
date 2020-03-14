const mongoose = require('mongoose');
const express = require('express');

const { Schema } = mongoose;
const router = express.Router();

mongoose.connect(process.env.CONNECTSTR, { useNewUrlParser: true });

const faculties = ['aands', 'asande', 'asande_grad', 'info', 'sw', 'utm', 'utsc'];
faculties.forEach((faculty) => {
    const collectionName = `${faculty}_evals`;
    mongoose.model(collectionName, new Schema({ Code: String }));
});

router.get('/:faculty/:courseId', (req, res) => {
    const { faculty } = req.params;
    const { courseId } = req.params;

    if (faculty !== 'utm') {
        res.status(404).send('Faculty not supported');
        return;
    }

    const collectionName = `${faculty}_evals`;
    mongoose.model(collectionName).aggregate([
        { $match: { Code: courseId } },
        { $group: { _id: '$Code', recommendation: { $avg: { $toDecimal: '$I_would_recommend_this_course' } } } },
    ]).exec().then((out) => {
        if (out.length === 0) {
            res.status(404).send('Course not found');
        } else {
            const temp = JSON.parse(JSON.stringify(out));
            const recommendation = temp[0].recommendation.$numberDecimal;
            res.status(200).json(recommendation);
        }
    })
        .catch(() => {
            console.log('Promise Rejected');
        });
});

module.exports = router;
