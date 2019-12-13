const crossOrigin = (req, res, next) => {
    try{
        res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET")
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.header('Access-Control-Allow-Origin', '*')
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        res.header("Access-Control-Allow-Credentials", true)
        next()
    } catch(e) {
        res.status(500).send({error: 'Something went wrong'})
    }    
}

module.exports = crossOrigin