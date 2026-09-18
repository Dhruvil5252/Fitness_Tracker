const mongoose = require('mongoose')

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully")
    }catch(err){
        console.log("DB connection error", err)
    }
}

module.exports = connectToDB