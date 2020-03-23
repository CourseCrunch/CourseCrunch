var express = require('express');
var mongo = require('./query/course');
var router = express.Router();

const faculties = ['aands', 'asande', 'asande_grad', 'info', 'sw', 'utm', 'utsc'];

/* GET home page. */
router.get('/viz/:porc/:name', function(req, res, next) {
  if (req.params['porc'] == 'cours') {
    console.log("I want " + req.params['name'] + " data");
    var data = [];
    mongo.model('utm_evals').find({
      Code: new RegExp(req.params['name'], 'i')  // search query
    })
    .then(doc => {
      res.send({labels: "temp", data: doc, title: req.params['name']});
    })
    .catch(err => {
      console.error(err)
    })

    

  } else if (req.params['porc'] == 'prof') {
    console.log("I want prof data");
    var q = course(req.params['name']);
    res.send({dates: q[0], scores: q[1]});
    //res.render('pages/index', {dates: q[0], scores: q[1], name: req.params['name']});
  }
});

module.exports = router;
