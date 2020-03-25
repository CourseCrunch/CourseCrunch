const mongoose = require('mongoose');
const express = require('express');

const { Schema } = mongoose;
const router = express.Router();

mongoose.connect(process.env.MONGOEVALSTR, { useNewUrlParser: true });
router.get('/courses', (req, res) => {
    mongoose.model('utm_evals')
    // eslint-disable-next-line key-spacing
        .aggregate([{ $group: { _id:'$Code' } }])
        .exec()
        .then((out) => {
            res.status(200).send(out);
        })
        .catch(() => {
            console.log('Promise Rejected');
        });
});

module.exports = router;
