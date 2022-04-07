var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

require("dotenv").config();

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var workoutsRouter = require('./routes/workouts')
var ridesRouter = require('./routes/rides')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/workouts', workoutsRouter)
app.use('/rides', ridesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const db = require("./models")
db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to the database!");
})
.catch(err => {
  console.log("Cannot connect to database!", err);
  process.exit();
});

const { peloton } = require('peloton-client-node');

const {
  PELOTON_USER,
  PELOTON_PASSWORD,
} = process.env;

async function authenticateAndUpdate() {
  await peloton.authenticate({
    username: PELOTON_USER,
    password: PELOTON_PASSWORD,
  });

  const users = require("./services/users.service");
  const workouts = require("./services/workouts.service");

  await users.updateUserData().catch(err => {
    console.error(err);
  });
  await workouts.refreshAllWorkouts().catch(err => {
    console.error(err);
  });
}

authenticateAndUpdate();

module.exports = app;
