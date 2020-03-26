const express = require('express');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api', apiRouter);
process.env.CALENDARPORT = 30002;
app.listen(process.env.CALENDARPORT, () => console.log(`App listening on port ${process.env.CALENDARPORT}`));
