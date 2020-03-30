const express = require('express');
const cors = require('cors');
const editProfRouter = require('./routes/edit_profile');
const changeEmailRouter = require('./routes/change_email');
const changePassRouter = require('./routes/change_pass');
const courseRouter = require('./routes/editCompletedCourses');
const getCoursesRouter = require('./routes/completedCourses');


const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// routers for editing profiles
app.use('/edit_profile', editProfRouter);
app.use('/change_email', changeEmailRouter);
app.use('/change_password', changePassRouter);
// router for front end interaction with user courses
app.use('/edit_Completed_Courses', courseRouter);
// router for getting all courses taken by a user
app.use('/completed_Courses', getCoursesRouter);

app.listen(process.env.PROFILEPORT, () => console.log(`App listening on port ${process.env.PROFILEPORT}`));
