const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        validate(value){
            if(value.length===0){
                throw new Error ('Name Must Be Added')
            }
        }
    },
    email: {
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email not valid')
            }
        }
    },
    password: {
        type:String,
        required:true,
        validate(value){
            if(value.length<6) {
                throw new Error('Password need to be atleast 6 word')
            }
            if(value==='password') {
                throw new Error('password can not be password')
            }
        }
    },
    avatar: {
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

// pre mean previou!!!post mean later
// pre = before save ! post = after save
// 'save' is a middleware come from mongoose
userSchema.pre('save', async function(next) {
    const user = this

    const salt = await bcrypt.genSalt(10); //10 rounds
        
    user.password = await bcrypt.hash(user.password, salt);

    next()
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const payload = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(
        payload, 
        process.env.jwtsecret,
        {expiresIn: 360000}
    )
    
    return token
}

const User = mongoose.model('user',userSchema)
module.exports = User