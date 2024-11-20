const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        require: true,
        unique: true
    },
    fullName:{
        type:String,
        require: true,
    },
    password:{
        type:String,
        require: true,
        minLength: 6,
    },
    email:{
        type:String,
        require: true,
        unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profilemg:{
        type: String,
        default: ""
    },
    coverImage:{
        type: String,
        default: ""
    },
    bio:{
        type: String,
        default: ""
    },
    link:{
        type: String,
        default: ""
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User