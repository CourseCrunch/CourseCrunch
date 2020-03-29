const express = require('express');
const cors = require('cors');
const editProfRouter = require('./routes/edit_profile');
const changeEmailRouter = require('./routes/change_email');
const changePassRouter = require('./routes/change_pass');


const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/edit_profile', editProfRouter);
app.use('/change_email', changeEmailRouter);
app.use('/change_password', changePassRouter);

app.listen(process.env.PROFILEPORT, () => console.log(`App listening on port ${process.env.PROFILEPORT}`));
