const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/auth"));
app.use("/api/timesheet", require("./routes/timesheet"));

mongoose.connect(
    "mongodb+srv://nikamshruti27_db_user:shruti123@cluster0.na6ayou.mongodb.net/timesheet"
).then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("Mongo Error:", err));

app.listen(5000, () => console.log("Server running on 5000"));
