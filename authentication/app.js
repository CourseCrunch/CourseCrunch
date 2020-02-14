var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

app.listen(3000, () => console.log("App listening on port 3000"));