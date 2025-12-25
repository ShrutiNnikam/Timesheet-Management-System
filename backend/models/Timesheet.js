const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
    employeeId: String,
    employeeName: String,
    date: String,
    work: String,
    rating: Number,
    locked: { type: Boolean, default: false }
});

module.exports = mongoose.model("Timesheet", timesheetSchema);
