const express = require("express");
const router = express.Router();
const User = require("../models/user");

const MANAGER_ID = "ADMIN01";
const MANAGER_PASS = "manager123";

router.post("/register", async (req, res) => {
    const { name, password, managerId } = req.body;
    await User.create({ name, password, role: "employee", managerId });
    res.json({ message: "Registered" });
});

router.post("/login", async (req, res) => {
    const { name, password, role } = req.body;

    if (role === "manager") {
        if (name === MANAGER_ID && password === MANAGER_PASS) {
            return res.json({ role: "manager" });
        }
        return res.status(401).json({ error: "Invalid manager login" });
    }

    const user = await User.findOne({ name, password });
    if (!user) return res.status(401).json({ error: "Invalid employee login" });

    res.json({ role: "employee", userId: user._id });
});

module.exports = router;
