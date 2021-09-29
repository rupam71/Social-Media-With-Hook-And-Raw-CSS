const Post = require('../models/post')
const gravatar = require('gravatar')
const auth = require('../middleware/auth')
const User = require('../models/user')
// const request = require('request')

module.exports = app => {
    //create post
    // private route
    app.post('/api/post/', auth, async (req,res)=>{
        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = new Post({
                ...req.body,
                user: req.user.id,
                avatar: user.avatar,
                name : user.name
            })
            await post.save()
            res.status(200).send(post)
        } catch (error) {
            res.status(400).send(Object.entries(e.errors)[0][1].message)
        }
    })

    // Get post
    // private route
    app.get('/api/post/', auth, async (req,res)=>{
        try {
            const post = await Post.find().sort({date:-1})
            res.status(200).send(post)
        } catch (error) {
            console.log(error.message)
            res.status(500).send('Server Error')
        }
    })

    // Get post by id
    // private route
    app.get('/api/post/:id', auth, async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id)
            if(!post) return res.status(404).send("post not found")

            res.status(200).send(post)
        } catch (error) {
            console.log(error.message)
            if(error.kind==='ObjectId') return res.status(404).send("post not found")
            res.status(500).send('Server Error')
        }
    })

    // delete post by id
    // private route
    app.delete('/api/post/:id', auth, async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id)
            if(!post) return res.status(404).send("post not found")

            //check user
            if(post.user.toString() !== req.user.id) return res.status(401).send("User not authoriged")

            await post.remove()
            res.status(200).send('post removed')
        } catch (error) {
            console.log(error.message)
            if(error.kind==='ObjectId') return res.status(404).send("post not found")
            res.status(500).send('Server Error')
        }
    })

    // Like a post
    // private route
    app.patch('/api/post/like/:id', auth, async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id)
            if(!post) return res.status(404).send("post not found")

            //check post already liked by user
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0) return res.status(400).send("Post already liked")

            post.likes.unshift({user: req.user.id})
            await post.save();
            res.status(200).send(post.likes)
        } catch (error) {
            console.log(error.message)
            if(error.kind==='ObjectId') return res.status(404).send("post not found")
            res.status(500).send('Server Error')
        }
    })

    // Unlike a post
    // private route
    app.patch('/api/post/unlike/:id', auth, async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id)
            if(!post) return res.status(404).send("post not found")

            //check post not liked by user
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length === 0) return res.status(400).send("Post has not yet been liked")

            for (const key in post.likes) {
                if (post.likes[key].user.toString() === req.user.id) {
                    post.likes.splice(key,1)
                    await post.save();            
                    res.status(200).send(post.likes)
                }
            }
            // await post.save();
            // res.status(200).send(post.likes)
        } catch (error) {
            console.log(error.message)
            if(error.kind==='ObjectId') return res.status(404).send("post not found")
            res.status(500).send('Server Error')
        }
    })

    // comment on a post
    // private route
    app.patch('/api/post/comment/:id', auth, async (req,res)=>{
        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id)
            if(!post) return res.status(404).send("post not found")

            const comment = {
                ...req.body,
                user: req.user.id,
                avatar: user.avatar,
                name : user.name
            }
            
            post.comments.unshift(comment)
            await post.save();
            res.status(200).send(post.comments)
        } catch (error) {
            console.log(error.message)
            if(error.kind==='ObjectId') return res.status(404).send("post not found")
            res.status(500).send('Server Error')
        }
    })

    // Delete comment
    // private route
    app.delete('/api/post/comment/:id/:comment_id', auth, async (req,res)=>{
        try {
           // const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id)
            if(!post) return res.status(404).send("post not found")

            //pull comment out
            const comment = post.comments.find(comment => comment.id === req.params.comment_id);

            if(!comment) return res.status(404).send('Comment does not exists')

            //check user
            if(comment.user.toString() !== req.user.id) return res.status(401).send('User not authorized')

            for (const key in post.comments) {
                if (post.comments[key]._id.toString() === req.params.comment_id) {
                    post.comments.splice(key,1)
                    await post.save();            
                    res.status(200).send(post.comments)
                }
            }
            
        } catch (error) {
            console.log(error.message)
            if(error.kind==='ObjectId') return res.status(404).send("post not found")
            res.status(500).send('Server Error')
        }
    })
}