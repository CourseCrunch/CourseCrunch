var express = require('express');
var course = require('./query/course.js');
var router = express.Router();


/* GET home page. */
router.get('/viz/:porc/:name', function(req, res, next) {
  if (req.params['porc'] == 'cours') {
    console.log("I want course data");
    var q = course(req.params['name']);
    res.render('pages/index', {dates: q[0], scores: q[1], name: req.params['name']});
  } else if (req.params['porc'] == 'prof') {
    console.log("I want prof data");
    var q = course(req.params['name']);
    res.render('pages/index', {dates: q[0], scores: q[1], name: req.params['name']});
  }
});

module.exports = router;
