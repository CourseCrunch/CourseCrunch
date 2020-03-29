const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const waitlistRouter = require('./routes/waitlist.js');

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/addWaitlist', waitlistRouter);
app.listen(process.env.WAITLISTPORT, () => console.log(`App listening on port ${process.env.WAITLISTPORT}`));
