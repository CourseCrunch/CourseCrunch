const mongoose = require('mongoose');
const express = require('express');

const { Schema } = mongoose;
const router = express.Router();

mongoose.connect(process.env.MONGOEVALSTR, { useNewUrlParser: true });
router.get('/compare/instructors/:courseId', (req, res) => {
    const { courseId } = req.params;
    console.log('in compare');
    console.log(courseId);

    mongoose.model('utm_evals')
    // eslint-disable-next-line key-spacing
        .aggregate([{ $match: { Code:courseId } },
            // {
            //     $group: {
            //         _id: { $concat: ['$First_Name', ' ', '$Last_Name'] },
            //         lectures_taught: { $sum: 1 },
            //         item_1: { $avg: { $toDecimal: '$Item_1' } },
            //         item_2: { $avg: { $toDecimal: '$Item_2' } },
            //         item_3: { $avg: { $toDecimal: '$Item_3' } },
            //         item_4: { $avg: { $toDecimal: '$Item_4' } },
            //         item_5: { $avg: { $toDecimal: '$Item_5' } },
            //         item_6: { $avg: { $toDecimal: '$Item_6' } },
            //         workload: { $avg: { $toDecimal: '$Course_Workload' } },
            //         recommendation: { $avg: { $toDecimal: '$I_would_recommend_this_course' } },
            //         number_invited: { $sum: { $toDecimal: '$Number_Invited' } },
            //         responses: { $sum: { $toDecimal: '$Number_of_Survey_Responses' } },

            //     },
            // },
        ])
        .exec()
        .then((out) => {
            res.send(out);

            const new_out = [];
            out = JSON.parse(JSON.stringify(out));
            out.forEach((element) => {
                const temp = {};
                temp['Instructor Name'] = element._id;
                temp['Lectures Taught'] = element.lectures_taught;
                temp['I found the course intellectually stimulating'] = Math.round(element.item_1.$numberDecimal * 100) / 100;
                temp['The course provided me with a deeper understanding of the subject matter'] = Math.round(element.item_2.$numberDecimal * 100) / 100;
                temp['The instructor created a course atmosphere that was conducive to my learning'] = Math.round(element.item_3.$numberDecimal * 100) / 100;
                temp['Course projects, assignments, tests and/or exams improved my understanding of the course material'] = Math.round(element.item_4.$numberDecimal * 100) / 100;
                temp['Course projects, assignments, tests and/or exams provided opportuinity for me to demonstrate an understanding of the course material'] = Math.round(element.item_5.$numberDecimal * 100) / 100;
                temp['Overall, the quality of my learning experience in this course was'] = Math.round(element.item_6.$numberDecimal * 100) / 100;
                temp.Workload = Math.round(element.workload.$numberDecimal * 100) / 100;
                temp.Recommendation = Math.round(element.recommendation.$numberDecimal * 100) / 100;
                temp['number invited'] = Math.round(element.number_invited.$numberDecimal);
                temp['survey responses'] = Math.round(element.responses.$numberDecimal);

                new_out.push(temp);
            });

            console.log(new_out);
            res.status(200).json(new_out);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('internal server error');
            console.log('Promise Rejected');
        });
});

module.exports = router;
