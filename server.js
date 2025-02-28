// Require necessary packages
const express = require("express");
const path = require("path");
require("dotenv").config();
const mysql = require("mysql2/promise"); // Using promise-based MySQL
const cors = require("cors"); // CORS middleware
const jwt = require("jsonwebtoken"); // JWT for token generation
const multer = require("multer"); // File upload middleware
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Ensure URL-encoded data is parsed
app.use(cors()); // Enable CORS to handle requests from different origins
app.use(express.static(path.join(__dirname, "templates")));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Database Connection (Using Promises for better async handling)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Route for the homepage (serve index.html by default)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

// User Registration Route (Sign-up)
app.post("/registration", async (req, res) => {
  console.log("Received request body:", req.body); // Debugging line

  const { name, email, reg_no, password } = req.body;

  // Validate the fields
  if (!name || !reg_no || !email || !password) {
    console.log("Missing fields!");
    return res.redirect("/index.html?error=missing_fields");
  }

  try {
    // Store user in the database
    const query = `INSERT INTO doc_auth (name, email, reg_no, password) VALUES (?, ?, ?, ?)`;
    await db.query(query, [name, email, reg_no, password]);

    console.log("User registered successfully");
    res.redirect("/index.html?success=registered");
  } catch (err) {
    console.error("Database Error:", err);
    res.redirect("/index.html?error=database_error");
  }
});

// User Login Route (Sign-in)
app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);

  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    console.log("Missing email or password!");
    return res.redirect("/index.html?error=missing_credentials");
  }

  try {
    // Step 1: Check if the email exists
    const query = `SELECT * FROM doc_auth WHERE email = ?`;
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      console.log("Invalid login attempt: Email not found");
      return res.redirect("/index.html?error=invalid_login");
    }

    // Step 2: User exists, now check password
    const user = results[0];
    const storedPassword = user.password;
    const userName = user.name;

    if (storedPassword !== password) {
      console.log("Invalid login attempt: Incorrect password");
      return res.redirect("/index.html?error=invalid_login");
    }

    // Step 3: Successful login
    console.log("User Logged In:", userName);
    res.redirect(`/dashboard.html?user=${encodeURIComponent(userName)}`);
  } catch (err) {
    console.error("Login Error:", err);
    res.redirect("/index.html?error=login_failed");
  }
});

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + path.basename(file.originalname)); // Prevent overwriting
  },
});
const upload = multer({ storage: storage });

// Define Flask API URL
const FLASK_API_URL = "http://127.0.0.1:5000/predict";

// Route to handle image upload and call Flask API
app.post("/predict", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    // Prepare FormData for Flask API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Call Flask API
    const response = await axios.post(FLASK_API_URL, formData, {
      headers: { ...formData.getHeaders() },
    });

    // Send Flask API response back to client
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Flask API:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  } finally {
    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);
  }
});


// API Endpoint to Add a Patient
app.post("/add-patient", (req, res) => {
  try {
      // Extract data from request body
      const { doctorId, patientName, patientAge, patientGender, patientHistory, patientContact } = req.body;

      // Validate input (Basic checks)
      if (!doctorId || !patientName || !patientAge || !patientGender || !patientHistory || !patientContact) {
          return res.status(400).json({ error: "All fields are required" });
      }

      // SQL Query to Insert Data
      const query = `INSERT INTO patient_details (doctor_id, patient_name, age, gender, tumor_history, contact, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`;

      // Execute Query
      db.query(query, [doctorId, patientName, patientAge, patientGender, patientHistory, patientContact], (err, result) => {
          if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ error: "Database error", details: err.sqlMessage });
          }

          res.status(201).json({ message: "Patient added successfully!", patientId: result.insertId });
      });
  } catch (error) {
      console.error("Unexpected server error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/search-patient", async (req, res) => {
  let searchQuery = req.query.q ? req.query.q.trim() : null; // Trim input

  if (!searchQuery) {
      return res.status(400).json({ error: "Missing search query." });
  }

  try {
      let sql, params;

      // If the input is a number, search by ID
      if (!isNaN(searchQuery)) {
          sql = `SELECT * FROM patient_details WHERE id = ?`;
          params = [searchQuery];
      } else {
          // Otherwise, search by patient name (case-insensitive)
          sql = `SELECT * FROM patient_details WHERE LOWER(patient_name) LIKE LOWER(?)`;
          params = [`%${searchQuery}%`];
      }

      const [results] = await db.query(sql, params);

      if (results.length === 0) {
          return res.status(404).json({ message: "No patient found." });
      }

      res.json(results);
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database query failed." });
  }
});




// Start server
const PORT = process.env.PORT || 5055;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});