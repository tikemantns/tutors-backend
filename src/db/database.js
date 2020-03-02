const mongoose = require('mongoose')

//  before( () => {
    const connection =  mongoose.connect(
        process.env.DB_CONNECT_PROD,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
        (err, success) => {
            if(err) console.log(err)
        }
    )
// })
 
module.exports = connection