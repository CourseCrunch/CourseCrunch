const mongoose = require('mongoose');
const express = require('express');

const { Schema } = mongoose;
const router = express.Router();

router.get('/courses',(req,res)=>{
    mongoose.model('utm_evals')
            .aggregate([{$group:{_id:'$Code'}}])
            .exec()
            .then((out) => {
                res.status(200).send(out);
            }).catch(() => {
                console.log('Promise Rejected');
            });
});

module.exports = router;