require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 3015;

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure Express can parse JSON

// MongoDB Connection (Using Environment Variables)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas Connection Successful"))
.catch((err) => console.error("❌ MongoDB Atlas Connection Error:", err));

// Define Schema & Model
const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    branch: String
});
const Users = mongoose.model("Users", userSchema);

// Serve Form Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "form.html"));
});

// Handle Form Submission
app.post("/post", async (req, res) => {
    try {
        console.log("📥 Received Form Data:", req.body);

        const { regd_no, name, email, branch } = req.body;

        if (!regd_no || !name || !email || !branch) {
            return res.status(400).send("❌ All fields are required!");
        }

        const user = new Users({ regd_no, name, email, branch });
        await user.save();

        console.log("✅ Data Saved in MongoDB Atlas:", user);
        res.redirect("/signup");
    } catch (error) {
        console.error("❌ Error saving data:", error);
        res.status(500).send("Server Error: Unable to save data.");
    }
});

// Serve Success Page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}/`);
});
