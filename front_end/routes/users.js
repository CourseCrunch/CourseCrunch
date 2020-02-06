var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({"userid":"1234",'username':"krishc"});
});

module.exports = router;
