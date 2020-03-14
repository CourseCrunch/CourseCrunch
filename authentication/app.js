var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var bodyParserURLEncode = require('body-parser').urlencoded({extended:true});
var path = require('path');

var app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.listen(process.env.AUTHPORT, () => console.log("App listening on port "+process.env.AUTHPORT));
