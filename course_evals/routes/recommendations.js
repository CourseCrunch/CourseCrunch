const mongoose = require('mongoose');
const express = require('express');

const { Schema } = mongoose;
const router = express.Router();

mongoose.connect(process.env.CONNECTSTR, { useNewUrlParser: true });

router.get('/recommendation', (req, res) => {
    var filteredCourse = req.body.courses;
    var limit = req.body.limit;
    mongoose.model('utm_evals').aggregate([
        {$group:{_id:"$Code",Course_Workload:{$avg: {$toDecimal: "$Course_Workload"}}}},
        {$match:{"_id":{$nin:filteredCourse}}},
        {$sort: {"Course_Workload":1}},
        {$limit:limit}
    ],function(err,data){
        if (err){
            res.sendStatus(404);
        }else{
        res.status(200).send(data);
        }
    });
    //mongoose.model('utm_evals').find({"Code":{"$nin":filteredCourse}}).sort({ Course_Workload: -1 }).limit(10).exec((err, data) => {
    //    console.log(data);
     //   res.status(200).send(data);
  //  });
});

module.exports = router;
