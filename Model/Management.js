const mongoose = require("mongoose");
const ManagementSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    qualification: String,
    password: String
})

module.exports = mongoose.model("Management", ManagementSchema)