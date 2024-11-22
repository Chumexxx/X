//UserModel
const User = require("../Models/userModel.js")
//NotificationModel
const Notification = require("../Models/notificationModel.js")


const getUserProfile = async (req, res) => {
    const {userName } = req.params;

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

module.exports = {
    getUserProfile,
    followOrUnfollowUser,
    getSuggestedUsers
}