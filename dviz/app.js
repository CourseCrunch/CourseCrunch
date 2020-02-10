const express = require('express');
const path = require('path');
const bodyparser = require('body-parser')
const app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


app.use('/public', express.static(path.join(__dirname, '/static')));
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, '/static', '/viz.html'));
});



app.get('/', (req, res)=>{
    res.send('Hello World!');
});

app.get('/tutorial', (req,res)=>{
    res.send('hitting tutorial route');
});

app.get('/example/:name/:age', (req, res)=>{
    console.log(req.params);
    res.send('example with route params');
});

app.get('/viz/:porc/:name', (req, res)=>{
    if (req.params['porc'] == 'cours') {
        console.log("I want course data");
        res.send('here is some course data');
    } else if (req.params['porc'] == 'prof') {
        console.log("I want prof data");
        res.send('here is some prof data for');
    }
});

// view engine setup

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.listen(3000, () => console.log("App listening on port 3000"));