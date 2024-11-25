const Post = require("../Models/postModel.js")
const User = require("../Models/userModel.js")
const cloudinary = require("cloudinary").v2

const createPost = async (req, res) => {
    try{
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId)
        if(!user) 
            return res.status(404).json({message: "User not found"})

        if(!text && !img){
            return res.status(400).json({error: "Post must have image or text"})
        }

        // if(img){
        //     const uploadResponse = await cloudinary.uploader.upload(img)
        //     img = uploadResponse.secure_url;
        // }

        const newPost = new Post({
            user: userId,
            text,
            img,
        })

        await newPost.save();
        res.status(201).json(newPost)
    } catch (error){
        res.status(500).json({ error: "Internal Server Error" })
        console.log("Error in createPost controller", error)
    }
}

const deletePost = async (req, res) => {
    try{

    } catch (error){
        
    }
}

module.exports = {
    createPost,
    deletePost
}