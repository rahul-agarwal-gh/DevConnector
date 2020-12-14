const express = require('express')
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const auth = require("../../middleware/auth")
const { check, validationResult } = require('express-validator')


const router = express.Router()

// @route  GET api/profile/me
// @desc   Get current user's Profile
// @access Private

router.get('/api/profile/me', auth, async (req, res) => {

    try {
        const profile =  await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']) //populate method will populate the 
        //response of user.findOne(). Here, we are populating user field of returned profile from users collection with fields name and avatar

        if(!profile)
            return res.status(400).json( {msg: "You don't have a profile Created yet"} )
        
        res.json(profile)

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

// @route  POST api/profile/
// @desc   Create or Update a user's Profile
// @access Private

router.post("/api/profile", [auth, [ //using more than one middlewares
    check('status', 'Status is Required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
    ] ], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json( { errors: errors.array()} )
    }

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body 

    //Build Profile Object
    const profileFields = {}
    profileFields.user = req.user.id //user field of profiles collection come from req.user.id

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    
    // Skills - Spilt into array
    if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    // SBuild Social array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try{   
        let profile = await Profile.findOne({user: req.user.id })
        
        if(profile){ //if profile exists, we want to update it
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                { $set: profileFields},
                { new: true} )
            
            return res.json(profile)
        }

        //if profile not found, then create it
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

// @route  GET api/profile/
// @desc   Get all profiles
// @access Public

router.get("/api/profile", async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


// @route  GET api/profile/user/:user_id
// @desc   Get a specific user's profile
// @access Public

router.get("/api/profile/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if(!profile)
            return res.status(400).json({msg: "No Profile exists for this User"})
        
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        //if the user didn't provide a valid object id, we do not want to show server error, we still want to show, no profile for this user
        if(err.kind == 'ObjectId')
            return res.status(400).json({msg: "No Profile exists for this User"})
        //else, there must be a server error
        res.status(500).send("Server Error")
    }
})

// @route  Delete api/profile
// @desc   Get a specific user's profile
// @access Public

router.delete("/api/profile", auth, async (req, res) => {
    try {
        //Remove Profile
        await Profile.findOneAndRemove({user: req.user.id })
        await User.findOneAndRemove({_id: req.user.id})
        
        res.json({msg: "User Deleted"})
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

// @route  PUT api/profile/experience
// @desc   Add Profile Experience
// @access Private

router.put("/api/profile/experience", [auth, [
    check( 'title', 'Title is Required').not().isEmpty(),
    check( 'company', 'Company is Required').not().isEmpty(),
    check( 'from', 'From Date is Required').not().isEmpty()
] ], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.jstatus(400).json({errors: errors.array()})
    }

    const { title, company, location, from, to, current, description } = req.body

    const newExperience = { title, company, location, from, to, current, description }

    try {
        const profile = await Profile.findOne( { user: req.user.id} )
        profile.experience.unshift(newExperience) //array.unshift() just pushes a new element at front instead of at back like array.push()
        await profile.save()
        res.json(profile)   
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    } 
})

// @route  Delete api/profile/experience/:exp_id
// @desc   Delete Experience from Profile
// @access Private

router.delete('/api/profile/experience/:exp_id', auth, async (req, res) => {
      
    try{
        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        // Splice out of array
        profile.experience.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch(err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


// @route  PUT api/profile/education
// @desc   Add Profile education
// @access Private

router.put("/api/profile/education", [auth, [
    check( 'school', 'School is Required').not().isEmpty(),
    check( 'degree', 'Degree is Required').not().isEmpty(),
    check( 'fieldofstudy', 'Field of Study is Required').not().isEmpty(),
    check( 'from', 'From Date is Required').not().isEmpty(),
] ], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { school, degree, fieldofstudy, from, to, current, description } = req.body

    const newEducation = { school, degree, fieldofstudy, from, to, current, description }

    try {
        const profile = await Profile.findOne( { user: req.user.id} )
        profile.education.unshift(newEducation) //array.unshift() just pushes a new element at front instead of at back like array.push()
        await profile.save()
        res.json(profile)   
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    } 
})

// @route  Delete api/profile/education/:edu_id
// @desc   Delete education from Profile
// @access Private

router.delete('/api/profile/education/:edu_id', auth, async (req, res) => {
      
    try{
        const profile = await Profile.findOne({ user: req.user.id })
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        // Splice out of array
        profile.education.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch(err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router
