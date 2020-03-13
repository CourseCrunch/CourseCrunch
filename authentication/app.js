const express = require('express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const bodyParserURLEncode = require('body-parser').urlencoded({ extended: true });
const path = require('path');

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.listen(process.env.AUTHPORT, () => console.log(`App listening on port ${process.env.AUTHPORT}`));
