const express = require("express");
const router = express.Router();
const signUp = require("../Controllers/authController.js")
const logIn = require("../Controllers/authController.js")
const logOut = require("../Controllers/authController.js")

router.post("/signUp", signUp);

router.post("/logIn", logIn);

router.post("/logOut", logOut);











module.exports = router;