const express = require('express')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')
const { check, validationResult }= require('express-validator')
const auth = require('../../middleware/auth')


const router = express.Router()

// @route  POST api/post
// @desc   Create a Post by an authenticated User
// @access Private

router.post('/api/post', [auth, 
    [ check('text', 'Text is Required').not().isEmpty()]
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })
    
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = {
            text: req.body.text, //text will come from request body
            name: user.name, //since the user is authenticated, we can take name and rest of stuff from Users document for that user
            avatar: user.avatar,
            user: user._id
        }
        let post = new Post(newPost)
        await post.save()
        res.json(post)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }

})

// @route  GET api/posts
// @desc   Get all Posts
// @access Private

router.get('/api/posts', auth, async (req, res) => {
    
    try {
        const posts = await Post.find().sort({date: -1}) //sort({date: -1}) will sort the data in descending order of date  
        res.json(posts)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Private

router.get('/api/posts/:id', auth, async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post)
            return res.send(400).json({msg:"Post does not exist"})

        res.json(post)
    } catch (err) {
        console.log(err.message)
        if(err.kind == 'ObjectId')
            return res.send(400).json({msg:"Post does not exist"})
        res.status(500).send("Server Error")
    }
})


// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private

router.delete('/api/posts/:id', auth, async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post)
            return res.send(400).json({msg:"Post does not exist"})

         //check if the user trying to delete the post is not same as user who created the post
        if(post.user.toString() !== req.user.id)
            return res.status(401).json({msg: "You are not authorised to delete this Post"})
        
        await post.remove()

        res.json({msg: "Post removed"})

    } catch (err) {
        console.log(err.message)
        if(err.kind == 'ObjectId')
            return res.send(400).json({msg:"Post does not exist"})
        res.status(500).send("Server Error")
    }
})


// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private
router.put('/api/posts/like/:id', auth, async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post)
            return res.send(400).json({msg:"Post does not exist"})

         //check if the post has already been liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
            return res.status(400).json({msg: "Post already liked"})
        
        post.likes.unshift({user: req.user.id})
        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


// @route  PUT api/posts/unlike/:id
// @desc   Like a post
// @access Private
router.put('/api/posts/unlike/:id', auth, async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post)
            return res.send(400).json({msg:"Post does not exist"})

         //check if the post has not been liked(if it is not likedm you can't unlike it)
        if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0) 
            return res.status(400).json({msg: "Post not liked"})
        
        //Get remove index
        const removeIndex = post.likes.map( like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


// @route  POST api/posts/comment/:id
// @desc   Add a comment to a post
// @access Private

router.post('/api/posts/comments/:id', [auth, 
    [ check('text', 'Please enter something for comment').not().isEmpty()]
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })
    
    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)

        const newComment = {
            text: req.body.text, //text will come from request body
            name: user.name, //since the user is authenticated, we can take name and rest of stuff from Users document for that user
            avatar: user.avatar,
            user: user._id
        }
        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }

})
 
// @route  Delete /api/posts/comments/:id/:comment_id        //here id is post id and comment_id is id of comment on that post
// @desc   Delete a comment from a post
// @access Private

router.delete("/api/posts/comments/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id )

        //Make sure comment exists
        if(!comment)
            return res.status(404).json({msg: "Comment does not exist"})

        //Check user trying to delete the comment is same as user who made the comment
        if(comment.user.toString() !== req.user.id)
            return res.status(401).json({msg: "You can't delete this comment"})
        
        //Get remove index
        const removeIndex = post.comments.map( comments => comments.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)
        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router
