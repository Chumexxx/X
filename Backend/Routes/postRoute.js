const express = require("express");
const postRouter = express.Router();
const postController = require("../Controllers/postController.js");
const protectRoute = require("../Middleware/protectRoute.js")

postRouter.get("/all", protectRoute, postController.getAllPosts)

postRouter.get("/following", protectRoute, postController.getFollowingPosts)

postRouter.get("/likes/:id", protectRoute, postController.getLikedPosts)

postRouter.get("/user/:username", protectRoute, postController.getUserPosts)

postRouter.post("/create", protectRoute, postController.createPost)

postRouter.post("/like/:id", protectRoute, postController.likeOrUnlikePost)

postRouter.post("/comment/:id", protectRoute, postController.commentOnPost)

postRouter.delete("/:id", protectRoute, postController.deletePost)

module.exports = postRouter