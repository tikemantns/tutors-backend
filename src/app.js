const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')

const routes = require('./routes')

const app = express()

dotenv.config()  
require('./db/database')
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


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', routes)

module.exports = app


//pm2 start npm --name pratoshijapatikamishra -- start