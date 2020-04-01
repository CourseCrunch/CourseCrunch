const express = require('express');
const api = require('../model/api');

const router = express.Router();

const schools = api.getSchools();

router.get('/:faculty/:courseId', (req, res) => {
    const { faculty } = req.params;
    const { courseId } = req.params;

    if (faculty !== 'utm') {
        res.status(404).send('Faculty not supported').end();
        return;
    }

    schools[faculty][0].category_code_average(courseId, '$Item_8').then((out) => {
        if (out.length === 0) {
            res.status(404).send('Course not found').end();
        } else {
            const temp = JSON.parse(JSON.stringify(out));
            const recommendation = temp[0].recommendation.$numberDecimal;
            res.json(recommendation);
        }
    }).catch(() => {
        res.status(500).end();
    });
});

module.exports = router;
