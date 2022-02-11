const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
 try {
     //looking for the header that the user is supposed to provide
     const token = req.header('Authorization').replace('Bearer ','')
     //validates that header
     const decoded = jwt.verify(token,process.env.JWT_SECRET)
     //find the user associated  with header
     const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
     
     if(!user){
        throw new Error()
     }
     req.token = token
     req.user = user
     next()

 } catch (e) {
     //console.log(e)
     res.status(401).send({error:'Please authenticate.'})
 }
}

module.exports = auth