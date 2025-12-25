const express = require("express");
const router = express.Router();
const Timesheet = require("../models/Timesheet");

// Submit timesheet
router.post("/submit", async (req, res) => {
    try {
        const { employeeId, employeeName, date, work } = req.body;

        const existing = await Timesheet.findOne({ employeeId, date });
        if (existing && existing.locked)
            return res.status(403).json({ error: "Locked" });

        await Timesheet.findOneAndUpdate(
            { employeeId, date },
            { employeeName, work },
            { upsert: true }
        );

        res.json({ message: "Timesheet saved successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Save failed" });
    }
});

// Rate timesheet
router.post("/rate", async (req, res) => {
    const { id, rating } = req.body;
    await Timesheet.findByIdAndUpdate(id, { rating, locked: true });
    res.json({ message: "Rated & locked" });
});

// Get all
router.get("/all", async (req, res) => {
    const data = await Timesheet.find();
    res.json(data);
});

// Get employee timesheet
router.get("/my/:employeeId", async (req, res) => {
    const { date } = req.query;
    const sheet = await Timesheet.findOne({ employeeId: req.params.employeeId, date });
    res.json(sheet);
});

module.exports = router;
