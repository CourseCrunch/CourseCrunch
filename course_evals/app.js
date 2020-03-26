const express = require('express');
const cors = require('cors');

const averageRouter = require('./routes/average');
const courseCodesRouter = require('./routes/courseCodes');
const compareRouter = require('./routes/compare');
const instructorRouter = require('./routes/instructors');

const app = express();
app.use(cors()); // Use this after the variable declaration
// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', compareRouter);
app.use('/', averageRouter);

app.use('/', courseCodesRouter);
app.use('/instructors', instructorRouter);

app.listen(process.env.EVALSPORT, () => console.log(`App listening on port ${process.env.EVALSPORT}`));
