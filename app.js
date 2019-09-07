var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');


var config = require('./config/database');
const passport = require('passport'); 
const routes = require('./routes');

var app = express();

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true });


app.use(session({
    key: 'token',
    secret: 'user_token',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', routes);

module.exports = app;


//pm2 start npm --name pratoshijapatikamishra -- start