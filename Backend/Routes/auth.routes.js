const express = require("express");
const router = express.Router();

router.get("/signUp", (req, res) => {
    res.json({
        message: "you hit the signup endpoint"
    });
});

module.exports = router;