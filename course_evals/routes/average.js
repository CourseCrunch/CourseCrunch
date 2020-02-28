var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.CONNECTSTR, {useNewUrlParser: true});

var faculties = ['aands','asande','asande_grad','info','sw','utm','utsc'];

faculties.forEach(faculty=>{
    var collectionName = faculty + '_evals';
    mongoose.model(collectionName,new Schema({Code:String}));
})

router.get('/:faculty/:courseId', function(req, res, next) {
    var faculty = req.params.faculty;
    var courseId = req.params.courseId;

    if(faculty != 'utm'){
        res.status(404).send("Faculty not supported");
        return;
    }

    var collectionName = faculty + '_evals';
    mongoose.model(collectionName).aggregate([
        {$match: {Code:courseId}},
        {$group: { _id: "$Code",recommendation: {$avg: {$toDecimal:"$I_would_recommend_this_course"}}}}
    ]).exec((err, out)=>{
        if(err != null){
            res.status(500).send("Server error");
        }else if (out.length == 0){
            res.status(404).send("Course not found");
        }else{
            var temp = JSON.parse(JSON.stringify(out));
            var recommendation = temp[0].recommendation.$numberDecimal
            res.status(200).send(recommendation);
        }
    })
});

module.exports = router;