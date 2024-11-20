//import express
const express = require("express");
const authRoutes = require("./Routes/authRoutes.js");
const dotenv = require("dotenv");
const ApplicationDB = require("./Config/index.js");

//configuring .env
dotenv.config();

//getting express ready for use
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api/auth", authRoutes);

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