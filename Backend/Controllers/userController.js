const User = require("../Models/userModel.js");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../Lib/Utils/generateToken.js");

const signUp = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "invalid email format" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({ error: "userName is already taken" });
    }

    if (password.length < 6){
        return res.status(400).json({error: "Password must be at least 6 characters long"})
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
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
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (error) {
    console.log("error in signUp controller", error.message);
    res.status(500).json({ error: "internal Server Error" });
  }
};

const logIn = async (req, res) => {
    try{
        const {userName, password} = req.body;
        const user = await User.findOne({userName})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
          return res.status(400).json({error: "Invalid username or password"})
        }

        generateTokenAndSetCookie (user._id, res);

        res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        });

    } catch(error) {
      console.log("error in login controller", error.message);
      res.status(500).json({ error: "internal Server Error" });
    }
};

const logOut = async (req, res) => {
    try{
        res.cookie("jwt","", {maxAge:0} )
        res.status(200).json({message: "logged out successfully"})
    }catch(error){
        console.log("error in logout controller", error.message);
        res.status(500).json({ error: "internal Server Error" });
    }
};

const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user);
    } catch(error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {
  logOut,
  signUp,
  logIn,
  getMe
};
