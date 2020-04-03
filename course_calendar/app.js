const express = require('express');

const recommendationsRouter = require('./routes/getRecommendations');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/recommendations', recommendationsRouter);
app.use('/api', apiRouter);
app.listen(process.env.CALENDARPORT, () => console.log(`App listening on port ${process.env.CALENDARPORT}`));
