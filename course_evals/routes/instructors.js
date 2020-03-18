const express = require('express');

const rmp = require('../../rmp_api/api');

const campuses = rmp.allSchools();

const router = express.Router();


router.get('/rmp/:campus', (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
    if (!(rCampus in campuses) || iName == null) {
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

router.get('/eval/:campus', (req, response) => {
    const rCampus = req.params.campus;
    const iName = req.query.instructor;
});


module.exports = router;
