//import express
const express = require("express");
const authRoutes = require("./Routes/auth.routes.js");

const app = express();

//middleware
app.use(express.json());

//conmnectiong to mongo
console.log(process.env.DB_Url)

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
    console.log("Server is up and running on port", port);
});

// module.exports = app;