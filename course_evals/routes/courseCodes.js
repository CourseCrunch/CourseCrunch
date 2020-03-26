const express = require('express');
const api = require('../model/api');

const router = express.Router();

const campuses = api.getSchools();

router.get('/courses', (req, res) => {
    campuses.utm[0]
        .codes()
        .then((out) => {
            res.json(out);
        })
        .catch(() => {
            res.status(500).end();
        });
});

module.exports = router;
