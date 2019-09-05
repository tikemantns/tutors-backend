const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const config = require('./config/database');
var routes = require('./_routes');

const app = express();
var path = require('path');

var session = require('express-session');
app.use(session({secret: "adnetwork"}));

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true });

app.use( (req, res, next) => {
   res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
   res.header('Access-Control-Allow-Origin', 'https://marketingapi.arth.tech');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.get('/', (req, res) => { res.send('Page under construction.') });

//api routing
app.use('/', routes);

app.use( (req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.sendfile('./views/error.html');
});

module.exports = app;
