const express = require('express');

const editProfRouter = require('./routes/edit_profile');
const changeEmailRouter = require('./routes/change_email');
const changePassRouter = require('./routes/change_pass');


const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/edit_profile', editProfRouter);
app.use('/change_email', changeEmailRouter);
app.use('/change_password', changePassRouter);

app.listen(3000, () => console.log('App listening on port 3000'));
