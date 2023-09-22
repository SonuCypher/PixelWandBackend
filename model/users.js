const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    email:{
        type:String,
        lowercase:true,
        match: [/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/, 'Invalid email format.'],
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,128}$/, 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character. It must also be between 8 and 128 characters long.'],
    },
    name:{
        type:String,
        // lowercase:true,
        required:true
    }
})

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,12)
    next()
})


module.exports.Users = mongoose.model('Users',userSchema)