const express = require('express');

const averageRouter = require('./routes/average');

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', averageRouter);

app.listen(process.env.EVALSPORT, () => console.log('App listening on port '+process.env.EVALSPORT));
