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
    return Array.from(data.reduce(
        (acc, obj) => Object.keys(obj).reduce((acc, key) => {
            typeof obj[key] === 'number'
                ? acc.set(key, (acc.get(key) || []).concat(obj[key]))
                : acc,
            },
        acc),
    new Map()), 
        ([name, values]) =>
            ({ name, average: values.reduce( (a,b) => a+b ) / values.length })
    );
}


router.get('/eval/:campus', (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
    if (!(rCampus in evalsCampuses) || iName == null) {
        response.status(400).end();
        return;
    }
    evals.searchInstructor(rCampus, iName).then((r) => {
        if (r) {
            // rmp.findInstructor(r[0].item.pk_id).then((result) => {
            //     response.json(result);
            // });
            const first = r[0].item.First_Name;
            const last = r[0].item.Last_Name;
            Promise.all(
                evalsCampuses[rCampus].map((campus) => campus.aggregate_professor(first, last)),
            ).then((res) => {
                
                response.status(200).end();
            });
        } else {
            response.status(404).end();
        }
    });
});


module.exports = router;
