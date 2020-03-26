const express = require('express');

const rmp = require('../../rmp_api/api');
const evals = require('../model/api');


const rmpCampuses = rmp.getSchools();
const evalsCampuses = evals.getSchools();

const router = express.Router();


router.get('/rmp/:campus', (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
    if (!(rCampus in rmpCampuses) || iName == null) {
        response.status(400).end();
        return;
    }
    rmp.searchInstructor(rCampus, iName).then((r) => {
        if (r) {
            rmp.findInstructor(r[0].item.pk_id).then((result) => {
                response.json(result);
            });
        } else {
            response.status(404).end();
        }
    });
});

function ObjectAverage(data) {
    const avg = {};
    let count = 0;
    data.forEach((e) => {
        const first = e[0];
        Object.keys(first).forEach((key) => {
            if (key in avg) {
                avg[key] += first[key];
            } else {
                avg[key] = first[key];
            }
        });
        count += 1;
    });
    Object.keys(avg).forEach((key) => {
        avg[key] /= count;
        if (avg[key] === 0) avg[key] = null;
    });
    return avg;
}


router.get('/eval/:campus', (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
    if (!(rCampus in evalsCampuses) || iName == null) {
        response.status(400).end();
        return;
    }
    evals.searchInstructor(rCampus, iName).then((result) => {
        if (result) {
            const first = result[0].item.First_Name;
            const last = result[0].item.Last_Name;
            Promise.all(
                evalsCampuses[rCampus].map((campus) => campus.prof_scores(first, last)
                    .then((res) => res.map((each) => campus.convert(each)))),
            ).then((res) => {
                response.json(ObjectAverage(res));
            });
        } else {
            response.status(404).end();
        }
    });
});


module.exports = router;
