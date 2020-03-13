const express = require('express');

const averageRouter = require('./routes/average');
const courseCodesRouter = require('./routes/courseCodes');

const app = express();

var cors = require('cors')
app.use(cors()) // Use this after the variable declaration
// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', averageRouter);

app.use('/', courseCodesRouter);

app.listen(3001, () => console.log('App listening on port 3001'));
