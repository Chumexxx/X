const User = require("../Models/userModel.js");
const jwt = require("jsonwebtoken")

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized: No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({error: "Unauthorized: Invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-passwprd");

        if(!user){
            return res.status(404).json({erroe: "user not found"});
        }

        req.user = user;
        next();
    } catch (error){
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({error: "Internal server error"})
    }
}

module.exports = protectRoute