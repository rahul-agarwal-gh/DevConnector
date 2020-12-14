const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const auth = async (req, res, next) => {

    const token = req.header('x-auth-token') //Get Token from header
    if(!token)  //Check if no token
        return res.status(401).json({msg: "Not Authorized to Access this page"})

    try{
        const decoded = jwt.verify(token, config.get('jwtSecret')) 
        req.user = decoded.user
        next()
    } catch (e) {
        res.status(401).json( {msg: "You are not authenticated. Login to your Profile or SignUp for a new Profile to continue"} )
    }
}

module.exports = auth