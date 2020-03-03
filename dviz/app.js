const express = require('express');
const partials = require('express-partials');
const path = require('path');
const bodyparser = require('body-parser')
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use("/public", express.static(__dirname + '/public'));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(3000, () => console.log("App listening on port 3000"));