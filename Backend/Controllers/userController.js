//UserModel
const User = require("../Models/userModel.js")
//NotificationModel
const Notification = require("../Models/notificationModel.js")
//importing bcrypt
const bcrypt = require("bcryptjs")
//importing cloudinary
const cloudinary = require("cloudinary").v2

const getAllProfiles = async (req, res) => {

    User.find().then((data) => {
        console.log(data);

        return res.json({
            message: "List of Users",
            data
        })
    }). catch(err => 
        console.log(err)
    )
}

const getUserProfile = async (req, res) => {
    const { userName } = req.params;

    try{
        const user = await User.findOne({ userName }).select("-password");
        if (!user) 
            return res.status(400).json({message: "User not found"});

        res.status(200).json(user);
    } catch (error) {
        console.log("error in getUserProfile:", error.message)
        res.status(500).json({error: error.message});
    }
}

const followOrUnfollowUser = async (req, res) => {
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id  === req.user._id.toString()) {
            return res.status(400).json({error: "You cannot follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser){
            return res.status(400).json({ error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            //unfollow the user
            await User.findByIdAndUpdate(id, { $pull: {followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $pull: {following: id } });
            
            res.status(200).json({ message: " User unfollowed successfully"});
        } else{
            //follow the user
            await User.findByIdAndUpdate(id, { $push: {followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id } });
            //send follow notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();

            //return the id of the user as a response
            res.status(200).json({ message: " User followed successfully"});
        }

    } catch (error) {
        console.log("error in followOrUnfollowUser:", error.message)
        res.status(500).json({error: error.message});
    }
}

const getSuggestedUsers = async (req, res) => {
    try{
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
            $match: {
                _id: { $ne: userId },
            },
        },
            { $sample: { size: 10 }}
    ])

    const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id))
    const suggestedUsers = filteredUsers.slice(0,4)

    suggestedUsers.forEach((user) => (user.password = null))

    res.status(200).json(suggestedUsers)

    } catch(error){
        console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
    }
}

const updateUser = async (req, res) => {

    const { fullName, email, userName, currentPassword, newPassword, bio, link } = req.body;

    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

        if (profileImg){
            if (user.profileImg) {
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}
            const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
                folder: "profileImages",
                resource_type: "auto",
                allowed_formats: ['jpg', 'png', 'jpeg'], 
                transformation: [
                    { width: 500, height: 500, crop: "fill" }
                ]
            })
            profileImg = uploadedResponse.secure_url;
        }

        if (coverImg){
            if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}
            const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
                folder: "coverImages",
                resource_type: "auto",
                allowed_formats: ['jpg', 'png', 'jpeg'], 
                transformation: [
                    { quality: "auto", crop: "fill" }
                ]
            })
            coverImg = uploadedResponse.secure_url;
        }

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.userName = userName || user.userName;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllProfiles,
    getUserProfile,
    followOrUnfollowUser,
    getSuggestedUsers,
    updateUser
}