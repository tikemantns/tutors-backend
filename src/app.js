const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
// const jwt = require('jsonwebtoken')

const routes = require('./routes')

const app = express()

//setting up for cross origin

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET")
   res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
   res.header('Access-Control-Allow-Origin', '*')
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
   res.header("Access-Control-Allow-Credentials", true)
  next()
})

app.use(cors())

dotenv.config()  

mongoose.connect(process.env.DB_CONNECT, { useCreateIndex: true, useNewUrlParser: true }, 
	(err, success) => {
		if(err) console.log(err)
	})


app.use(passport.initialize())
require('./config/passport')(passport)

app.use(session({
    key: 'token',
    secret: 'user_token',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', routes)

module.exports = app


//pm2 start npm --name pratoshijapatikamishra -- start