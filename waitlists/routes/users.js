const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.json({ userid: '1234', username: 'krishc' });
});

module.exports = router;
