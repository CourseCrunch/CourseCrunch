const express = require('express');
const { google } = require('googleapis');


const rmp = require('../../rmp_api/api');
const evals = require('../model/api');


const rmpCampuses = rmp.getSchools();
const evalsCampuses = evals.getSchools();
const router = express.Router();
const customsearch = google.customsearch('v1');


router.get('/rmp/:campus', (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
    if (!(rCampus in rmpCampuses) || iName == null) {
        response.status(400).end();
        return;
    }
    rmp.searchInstructor(rCampus, iName).then((r) => {
        if (r) {
            if (r[0].score > 0.4) response.status(404).end();
            else {
                rmp.findInstructor(r[0].item.pk_id).then((result) => {
                    response.json(result);
                });
            }
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
            )
                .then((res) => {
                    const jsonResult = ObjectAverage(res);
                    delete jsonResult['Number Invited'];
                    delete jsonResult['Number of Responses'];
                    response.json(jsonResult);
                });
        } else {
            response.status(404).end();
        }
    });
});

router.get('/pfp/:campus', async (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
    if (!(rCampus in evalsCampuses) || iName == null) {
        response.status(400).end();
        return;
    }
    customsearch.cse.list({
        cx: process.env.GOOGLECSE,
        q: `${iName} ${rCampus}`,
        // q: `${iName}`,
        auth: process.env.GOOGLEIMAGES,
        searchType: 'image',
        num: 1,
    }).then((res) => {
        if (res.data.items.length) {
            response.json(res.data.items[0].link);
        } else {
            response.status(404).end();
        }
    }).catch(() => {
        response.status(429).end();
    });
});

router.post('/allInstructors', async (req, res) => {
    const rCampus = req.body.campus;
    if (!(rCampus in evalsCampuses) && rCampus !== 'all') {
        res.status(400).end();
        return;
    }
    evals.allInstructors(rCampus).then((result) => {
        res.json(result);
    }).catch(() => {
        res.status(500).end();
    });
});

module.exports = router;
