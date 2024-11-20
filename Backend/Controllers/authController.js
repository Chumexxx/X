const User = require("../Models/userModel.js")
const bcrypt = require("bcryptjs")
const generateTokenAndSetCookie = require("../Lib/Utils/generateToken.js")

const signUp = async (req, res) => {
    try{
        const {fullName, userName, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({error: "invalid email format"})
        }

        const existingEmail = await User.findOne({ email })
        if(existingEmail) {
            return res.status(400).json({error: "Email is already taken"})
        }

        const existingUser = await User.findOne({ userName })
        if(existingUser) {
            return res.status(400).json({error: "userName is already taken"})
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        } else{
            res.status(400).json({error: "invalid user data"})
        }
    } catch (error) {
        console.log("error in signUp controller", error.message)
        res.status(500).json({error: "internal Server Error"})
    }
}

module.exports = signUp;

const logIn = async (req, res) => {
    res.json({
        data: "you have hit the logIn endpoint"
    })
}

module.exports = logIn;

const logOut = async (req, res) => {
    res.json({
        data: "you have hit the logOut endpoint"
    })
}

module.exports = logOut;