const mongoose = require('mongoose')
const User = require('../models/user')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

module.exports = app => {
    // sign up
    app.post('/api/users/signup',async (req,res)=>{
        const avatar = gravatar.url(req.body.email, {
            s: '200', //size
            r: 'pg', //rating
            d: 'mm' //default
        }) 
        
        const user = new User ({...req.body,avatar})
        
        try {
            await user.save()
            const token = await user.generateAuthToken()
            
            res.status(201).send({ token })
        } catch(e){
                if(e.code) {
                    res.status(400).send("Email Already Used")
                } else {
                    res.status(400).send(e)
                }
            }
    })

    app.get('/api/users/',auth, async (req, res) => {
        try{
            const user = await User.findById(req.user.id).select('-password') 
            //password will not send. we protect password
            res.send(user);
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error');
        }
    })
}