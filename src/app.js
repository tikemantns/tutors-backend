const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const crossOrigin = require('./middleware/cross-origin') 
const routes = require('./routes')

const app = express()

dotenv.config()  
require('./db/database')

app.use(crossOrigin)
app.use(cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', routes)

module.exports = app


//pm2 start npm --name pratoshijapatikamishra -- start