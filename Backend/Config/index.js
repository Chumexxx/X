const mongoose = require("mongoose")

const ApplicationDB = async () => {
    try{
        const connectToDB = await mongoose.connect(process.env.DB_Url)
        console.log(`MongoDB connected: ${connectToDB.connection.host}`)
    } catch(error){
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = ApplicationDB;