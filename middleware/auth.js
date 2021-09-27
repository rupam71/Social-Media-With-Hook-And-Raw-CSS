const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
     //get token from header
     const token = req.header('x-auth-token');

     //check if not token
     if(!token){
         return res.status(401).json({msg:'No token, authorization denied'})
     }
         //verify token
         try{
            const decoded = jwt.verify(token, process.env.jwtsecret)
            const user = await User.findById(decoded.user.id)
                   
            if(!user) throw new Error()

            req.user = user
            req.token = token
        
        next()
        } catch(err) {
            res.status(401).json({ msg:'Token is not valid' })
         }
    
}