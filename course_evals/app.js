const express = require('express');

const averageRouter = require('./routes/average');
const courseCodesRouter = require('./routes/courseCodes');
const recommendationsRouter = require('./routes/recommendations');

const app = express();

const cors = require('cors');

app.use(cors()); // Use this after the variable declaration
// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', averageRouter);

app.use('/', courseCodesRouter);

app.use('/', recommendationsRouter);

app.listen(process.env.EVALSPORT, () => console.log(`App listening on port ${process.env.EVALSPORT}`));
