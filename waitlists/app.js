const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const emailer = require('./emails/api.js');
const app = express();

// view engine setup
setInterval(emailer.checkWaitlists, 1000 * 60 * 1); // check every 5 minutes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.listen(process.env.WAITLISTPORT, () => console.log(`App listening on port ${process.env.WAITLISTPORT}`));
