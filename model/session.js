const { default: mongoose } = require("mongoose");

const sessionSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:new Date()
    },
})

module.exports.Session = mongoose.model("Session", sessionSchema)