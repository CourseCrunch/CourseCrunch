const express = require('express');
const mongo = require('./query/course');

const router = express.Router();

// const faculties = ['aands', 'asande', 'asande_grad', 'info', 'sw', 'utm', 'utsc'];

/* GET home page. */
router.get('/viz/:porc/:name', (req, res) => {
    if (req.params.porc === 'cours') {
        console.log(`I want ${req.params.name} data`);
        // const data = [];
        mongo.model('utm_evals').find({
            Code: new RegExp(req.params.name, 'i'), // search query
        })
            .then((doc) => {
                res.send({ labels: 'temp', data: doc, title: req.params.name });
            })
            .catch((err) => {
                console.error(err);
            });
    } else if (req.params.porc === 'prof') {
        console.log('I want prof data');
        // const q = course(req.params.name);
        // res.send({ dates: q[0], scores: q[1] });
    // res.render('pages/index', {dates: q[0], scores: q[1], name: req.params['name']});
    }
});

module.exports = router;
