const express = require('express');

const rmp = require('../../rmp_api/api');

rmp.getFuse();
const campuses = rmp.allSchools();

const router = express.Router();


router.get('/instructor/:campus/:id', (req, res) => {
    const campus = req.params.id;
    const i_id = req.params.id;
    if (!(campus in campuses)) {
        res.status(400).end();
    }
    console.log(req);
    console.log(res);
});


module.exports = router;
