var express = require('express');

var averageRouter = require('./routes/average');
var app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', averageRouter);
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.listen(3000, () => console.log("App listening on port 3000"));
process  // Handle normal exits
.on('exit', (code) => {
  nodemon.emit('quit');
  process.exit(code);
})

// Handle CTRL+C
.on('SIGINT', () => {
  nodemon.emit('quit');
  process.exit(0);
});