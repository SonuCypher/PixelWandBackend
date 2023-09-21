const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    email:{
        type:String,
        lowercase:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        lowercase:true,
        required:true
    }
})

userSchema.pre('save', async (next)=>{
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)
    next()
})


module.exports.Users = mongoose.model('Users',userSchema)