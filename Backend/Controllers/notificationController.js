const Notifications = require("../Models/notificationModel.js")

const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id;

        const notifications = await Notifications.find({to:userId}).populate({
            "path": "from",
            select: "username profileImg"
        });

        await Notifications.updateMany({to:userId}, {read:true})

        res.status(200).json(notifications)
    } catch (error){
        console.log("Error in getNotification controller", error.message)
        return res.status(500).json({ error: "Internal Server Error"})
    }
}

const deleteNotifications = async (req, res) => {
    try{
        const userId = req.user._id

        await Notification.deleteMany({to:userId})

        res.status(200).json({ message: "Notification deleted successfully"})
    } catch (error){
        console.log("Error in deleteNotifications controller", error.message)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = {getNotifications, deleteNotifications}