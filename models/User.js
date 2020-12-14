const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },  
    date: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.methods.generateAuthToken = async function() {

    const user = this
    const payload = { user: { 
        id: user._id
    }} //In payload, we are setting user's ID
    
    const token = jwt.sign( payload, config.get('jwtSecret'), { expiresIn: 360000} )

    //user.tokens = user.tokens.concat( { token } )
    //await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    
    const user = await User.findOne( {email : email} ) //find a user with email property equal to email value received as argument
   
    const isMatch = await bcrypt.compare(password, user.password)

    if(!user || !isMatch)
        return "Invalid Login Credentials"
    
    return user
}


const User = new mongoose.model('user', userSchema)

module.exports = User