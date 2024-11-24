const express = require("express");
const authRouter = express.Router();
const authController = require("../Controllers/authController.js");
const protectRoute = require("../Middleware/protectRoute.js")

authRouter.get("/", (req, res) => {
    res.send("welcome to the authentication route")
});

authRouter.get("/me", protectRoute, authController.getMe);

authRouter.post("/signUp", authController.signUp);

authRouter.post("/logIn", authController.logIn);

authRouter.post("/logOut", authController.logOut);

module.exports =  authRouter;
