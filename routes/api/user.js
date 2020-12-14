const express = require('express')
const User = require('../../models/User')
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator')

const router = express.Router()

// @route  POST api/users
// @desc   Register user
// @access Public

router.post('/api/users', [ //using express-validator middleware for validation
    check('name','Name is Required').not().isEmpty(),
    check('email', 'Please use a valid Email').isEmail(),
    check('password', 'Password must be atleast 6 characters long').isLength({ min:6 })
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { name, email, password} = req.body
    try {
        let user = await User.findOne( {email })

        if(user){
            return res.status(400).json({errors: [{ msg: "User Already Exists" }] }) //this line different
        }

        const avatar = gravatar.url(email, {
            s: '200', //default size,
            r: 'pg', //rating
            d: 'mm' //default
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        await user.save()
        const token = await user.generateAuthToken()
        res.json( { token } )
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})



module.exports = router

