const express = require("express");
const router = express.Router();
const Timesheet = require("../models/Timesheet");

// Submit / Update Timesheet
router.post("/submit", async (req, res) => {
    try {
        const { employeeId, employeeName, date, work, hours } = req.body;

        let sheet = await Timesheet.findOne({ employeeId, date });

        if (sheet && sheet.locked) {
            return res.status(400).json({ msg: "Timesheet already locked" });
        }

        if (sheet) {
            sheet.work = work;
            sheet.hours = hours;
        } else {
            sheet = new Timesheet({ employeeId, employeeName, date, work, hours });
        }

        await sheet.save();
        res.json(sheet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get logged-in employee sheet for today
router.get("/my/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { date } = req.query;

        const sheet = await Timesheet.findOne({ employeeId, date });
        res.json(sheet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all timesheets (Manager)
router.get("/all", async (req, res) => {
    try {
        const data = await Timesheet.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rate timesheet & lock
router.post("/rate", async (req, res) => {
    try {
        const { id, rating } = req.body;

        const sheet = await Timesheet.findById(id);
        sheet.rating = rating;
        sheet.locked = true;

        await sheet.save();
        res.json(sheet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total working hours of employee
router.get("/total/:employeeId", async (req, res) => {
    try {
        const data = await Timesheet.find({ employeeId: req.params.employeeId });
        const totalHours = data.reduce((sum, s) => sum + Number(s.hours || 0), 0);
        res.json({ totalHours });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
