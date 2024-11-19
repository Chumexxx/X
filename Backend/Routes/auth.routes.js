const express = require("express");
const router = express.Router();
const signUp = require("../Controllers/auth.Controller.js")
const logIn = require("../Controllers/auth.Controller.js")
const logOut = require("../Controllers/auth.Controller.js")

router.post("/signUp", signUp);

router.post("/logIn", logIn);

router.post("/logOut", logOut);











module.exports = router;