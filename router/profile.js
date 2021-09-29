const Profile = require('../models/profile')
const gravatar = require('gravatar')
const auth = require('../middleware/auth')
const request = require('request')

module.exports = app => {
    //get current user profile
    // private route
    app.get('/api/profile/me', auth, async (req,res)=>{
        try {
            const profile = await Profile
                            .findOne({ user:req.user.id })
                            .populate('user',['name','avatar']) 
                            //bring name and avatar from user to profile
            if(!profile) return res.status(400).send({message:'There is no profile for this user'})
            res.send(profile)
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    })

    //create current user profile
    // private route
    app.post('/api/profile/', auth, async (req,res)=>{
        try {
            const Existingrofile = await Profile.findOne({ user:req.user.id })
            if(Existingrofile) return res.status(400).send({message:'Profile already exists. Please Edit existing one'})
            const profile = new Profile ({...req.body,user:req.user.id})
            await profile.save()
            res.status(201).send(profile)
        } catch(e){
            res.status(400).send(Object.entries(e.errors)[0][1].message)
        }
    })

    // Update profile of user]
    app.patch(`/api/profile/`, auth, async (req,res) => {
        try{
            const profile = await Profile.findOne({ user:req.user.id })
            if(!profile) return res.status(400).send({message:'There is no profile for this user'})

            const updatedProfile = await Profile.findByIdAndUpdate(
                profile.id,
                {
                    ...req.body
                },
                { new: true }
              );
            
            res.send(updatedProfile)
        } catch(e){
            res.status(400).send(e)
        }
    })

    //get all user profile
    // public route
    app.get('/api/profile/', async (req,res)=>{
        try {
            const profile = await Profile.find().populate('user',['name','avatar'])
            res.send(profile)
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    })

    //get other user profile
    // public route
    app.get('/api/profile/user/:id', async (req,res)=>{
        try {
            const profile = await Profile.findOne({user:req.params.id}).populate('user',['name','avatar'])
            if(!profile) return res.status(400).send({msg:"Profile Not Found"})
            res.send(profile)
        } catch (error) {
            console.log(error.message)
            if(error.kind=='ObjectId') return res.status(400).send({msg:"Profile Not Found"})
            res.status(500).send(error.message)
        }
    })

    // Added profile experience
    // private
    app.patch(`/api/profile/experience`, auth, async (req,res) => {
        try{            
            const profile = await Profile.findOne({ user:req.user.id })            
            if(!profile) return res.status(400).send({message:'There is no profile for this user'})
            
            profile.experience.unshift(req.body)
            
            await profile.save();            
            res.send(profile)
        } catch(e){
            res.status(400).send(Object.entries(e.errors)[0][1].message)
        }
    })

    // Remove profile experience
    // private
    app.delete(`/api/profile/experience/:id`, auth, async (req,res) => {
        try{            
            const profile = await Profile.findOne({ user:req.user.id })            
            if(!profile) return res.status(400).send({message:'There is no profile for this user'})
            
            for (const key in profile.experience) {
                if (profile.experience[key].id === req.params.id) {
                    profile.experience.splice(key,1)
                    await profile.save();            
                    res.send(profile)
                }
            }
            res.send("Experience not found")

            
        } catch(e){
            res.status(400).send(Object.entries(e.errors)[0][1].message)
        }
    })



    // Added profile education
    // private
    app.patch(`/api/profile/education`, auth, async (req,res) => {
        try{            
            const profile = await Profile.findOne({ user:req.user.id })            
            if(!profile) return res.status(400).send({message:'There is no profile for this user'})
            
            profile.education.unshift(req.body)
            
            await profile.save();            
            res.send(profile)
        } catch(e){
            res.status(400).send(Object.entries(e.errors)[0][1].message)
        }
    })

    // Remove profile education
    // private
    app.delete(`/api/profile/education/:id`, auth, async (req,res) => {
        try{            
            const profile = await Profile.findOne({ user:req.user.id })            
            if(!profile) return res.status(400).send({message:'There is no profile for this user'})
            
            for (const key in profile.education) {
                if (profile.education[key].id === req.params.id) {
                    profile.education.splice(key,1)
                    await profile.save();            
                    res.send(profile)
                }
            }
            res.send("Education not found")

            
        } catch(e){
            res.status(400).send(Object.entries(e.errors)[0][1].message)
        }
    })

    // Get github profile
    // public
    app.get(`/api/profile/github/:username`, async (req,res) => {
        try{            
            const option = {
                uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.githubclient}&client_secret=${process.env.githubsecret}`,
                method: 'GET',
                headers: {'user-agent':'node.js'}
            };
            request(option, (err, response, body) => {
                if(err) console.log(err)
                if(response.statusCode !== 200) {
                    return res.status(404).send({msg:'No Github Profile Found'})
                }
                res.status(201).send(JSON.parse(body))
            })
            // const profile = await Profile.findOne({ user:req.user.id })            
            // if(!profile) return res.status(400).send({message:'There is no profile for this user'})
            
            // profile.education.unshift(req.body)
            
            // await profile.save();            
            // res.send(profile)
        } catch(error){
            console.log(error.message)
            res.status(500).send(error.message)
        }
    })
}