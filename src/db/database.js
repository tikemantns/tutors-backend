const mongoose = require('mongoose')

const connection =  mongoose.connect(
    process.env.DB_CONNECT,
    { useCreateIndex: true, useNewUrlParser: true }, 
	(err, success) => {
		if(err) console.log(err)
    }
)

module.exports = connection