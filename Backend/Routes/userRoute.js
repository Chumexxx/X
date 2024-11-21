const express = require("express");
const userRouter = express.Router();
const userController = require("../Controllers/userController.js");
const protectRoute = require("../Middleware/protectRoute.js")

userRouter.get("/", (req, res) => {
    res.send("welcome to the user route")
});

userRouter.get("/me", protectRoute, userController.getMe);

userRouter.post("/signUp", userController.signUp);

userRouter.post("/logIn", userController.logIn);

userRouter.post("/logOut", userController.logOut);

module.exports =  userRouter;
