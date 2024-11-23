const express = require("express");
const protectRoute = require("../Middleware/protectRoute.js");
const userRouter = express.Router();
const userController = require("../Controllers/userController.js")


userRouter.get("/profile/:userName", protectRoute, userController.getUserProfile);
userRouter.get("/suggested", protectRoute, userController.getSuggestedUsers);
userRouter.post("/follow/:id", protectRoute, userController.followOrUnfollowUser);
userRouter.post("/update", protectRoute, userController.updateUser);

module.exports = userRouter;