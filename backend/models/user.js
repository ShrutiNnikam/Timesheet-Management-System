const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    role: String,
    managerId: String
});

module.exports = mongoose.model("User", userSchema);
