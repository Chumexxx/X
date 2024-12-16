const express = require("express");
const notificationRouter = express.Router();
const protectRoute = require("../Middleware/protectRoute")
const notificationController = require("../Controllers/notificationController")

notificationRouter.get("/getNotifications", protectRoute, notificationController.getNotifications)
notificationRouter.delete("/deleteNotifications", protectRoute, notificationController.deleteNotifications)



module.exports = notificationRouter