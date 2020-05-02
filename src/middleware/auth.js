const jwt = require('jsonwebtoken')
const User = require('../_models/user')


const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        
        if(!user){ throw new Error('Invalid User')}
        
        req.token = token
        req.user = user
        next()
    } catch(e) {
        res.status(401).send({error: 'Unauthenticated'})
    }    
}



module.exports = auth