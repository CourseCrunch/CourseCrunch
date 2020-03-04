const express = require('express');

const router = express.Router();
const handlePutReq = require('../resources/handlePut');
const handleDeleteReq = require('../resources/handleDel');

router.get('/', (req, res) => {
    res.json({ info: 'Temp completed course page' });
});

router.put('/', (req, res) => {
    const promiseAddCourse = handlePutReq.addCourse(req);
    promiseAddCourse.then(() => {
        res.status(200).send('Added Course Successfully');
    }).catch((handlerErrorCode) => {
        res.status(handlerErrorCode).send('An Error Ocurred While Processing Your Request');
    });
});

router.delete('/', (req, res) => {
    const promiseDelCourse = handleDeleteReq.delCourse(req);
    promiseDelCourse.then(() => {
        res.status(20).send('Deleted Course Successfully');
    }).catch((handlerErrorCode) => {
        res.status(handlerErrorCode).send('An Error Ocurred While Processing Your Request');
    });
});

module.exports = router;
