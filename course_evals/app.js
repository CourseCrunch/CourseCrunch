const express = require('express');

const averageRouter = require('./routes/average');

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', averageRouter);

app.listen(3000, () => console.log('App listening on port 3000'));
