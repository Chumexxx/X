//import express
const express = require("express");
const dotenv = require("dotenv");
const ApplicationDB = require("./Config/index.js");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2

//importing routes
const authRoute = require("./Routes/authRoute.js");
const userRoute = require("./Routes/userRoute.js");
const postRoute = require("./Routes/postRoute.js");
const notificationRoute = require("./Routes/notificationRoute.js")

//configuring .env
dotenv.config();
cloudinary.config({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
})

//getting express ready for use
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/notifications", notificationRoute)


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