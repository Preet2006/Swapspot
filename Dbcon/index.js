const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
let app = express();

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/"); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique file name
    },
});

const upload = multer({ storage: storage }); // Initialize Multer

app.use(express.static('C:\\Users\\abc\\Desktop\\web_\\webproject'));

app.get('/', (req, res) => {
    res.sendFile(path.join('C:\\Users\\abc\\Desktop\\web_\\webproject', 'index.html'));
});

let dbconnect = require("./connectdb/connect.js");
dbconnect();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define User Schema
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/signuppage.html", async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({ fullname, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
app.post("/loginpage", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                email: user.email,
                fullname: user.fullname,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Form Data Schema (with image URL)
const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
});

const FormData = mongoose.model("FormData", formSchema);

// Upload Form Data with Image Route
app.post("/form.html", upload.single("image"), async (req, res) => {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newFormData = new FormData({ title, description, imageUrl });
        await newFormData.save();

        res.status(201).json({ message: "Data uploaded successfully", imageUrl });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Serve static files for image URLs
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Get form data (uploaded items)

// Get form data (uploaded items)
app.get("/getFormData", async (req, res) => {
    try {
        const formData = await FormData.find(); // Retrieve all data from the FormData collection
        res.status(200).json(formData); // Send the data as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
