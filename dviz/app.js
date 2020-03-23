const express = require('express');
const partials = require('express-partials');
const path = require('path');
const bodyparser = require('body-parser')
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use("/public", express.static(__dirname + '/public'));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(3000, () => console.log("App listening on port 3000"));