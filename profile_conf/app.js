var express = require('express');

var indexRouter = require('./routes/index');
var editProfRouter = require('./routes/edit_profile');
var changeEmailRouter = require('./routes/change_email')
var changePassRouter = require('./routes/change_pass')

var bodyParserURLEncode = require('body-parser').urlencoded({extended:true});
var path = require('path');

var app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/edit_profile', editProfRouter);
app.use('/change_email',changeEmailRouter);
app.use('/change_password',changePassRouter);

app.listen(3000, () => console.log("App listening on port 3000"));
