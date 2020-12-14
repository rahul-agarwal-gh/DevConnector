const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const config = require('config')
const bcrypt = require('bcryptjs');


const router = express.Router()

// @route  GET api/auth
// @desc   Authenticate a route
// @access Public  

router.get('/api/auth', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') //we do not want to return the password
        res.json(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")   
    }
})


// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public

router.post('/api/auth', [ //using express-validator middleware for validation
    check('email', 'Please use a valid Email').isEmail(),
    check('password', 'Password is Required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body
    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
        }
    
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            
        const token = await user.generateAuthToken()
        res.json( { token } )
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router

