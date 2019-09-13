var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
const dotenv = require('dotenv');
var passport = require('passport');
// var jwt = require('jsonwebtoken');

const routes = require('./routes');

var app = express();

dotenv.config();  

mongoose.connect(process.env.DB_CONNECT, { useCreateIndex: true, useNewUrlParser: true }, 
	(err, success) => {
		if(err) console.log(err);
	});


app.use(passport.initialize());
require('./config/passport')(passport);

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


app.use('/', routes);

module.exports = app;


//pm2 start npm --name pratoshijapatikamishra -- start