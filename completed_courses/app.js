const express = require('express');
// const bodyParserURLEncode = require('body-parser').urlencoded({ extended: true });
// const path = require('path');
const courseRouter = require('./routes/editCompletedCourses');


const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/edit_Completed_Courses', courseRouter);

app.listen(3000, () => console.log('App listening on port 3000'));
