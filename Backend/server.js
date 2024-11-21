//import express
const express = require("express");
const userRoute = require("./Routes/userRoute.js");
const dotenv = require("dotenv");
const ApplicationDB = require("./Config/index.js");
const cookieParser = require("cookie-parser");

//configuring .env
dotenv.config();

//getting express ready for use
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//routes
app.use("/api/v1/user", userRoute);

//default get
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

//create port and listen
const port = process.env.PORT || 8100;
app.listen(port, () => {
    console.log(`Server is up and running on port, ${port}`);
    //connecting to mongo
    ApplicationDB();
});

// module.exports = app;