var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recommendationsRouter = require('./routes/getRecommendations');

var app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recommendations', recommendationsRouter);

app.listen(process.env.CALENDARPORT, () => console.log("App listening on port "+process.env.CALENDARPORT));