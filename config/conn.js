const mongoose = require("mongoose");
const dbConn = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = dbConn