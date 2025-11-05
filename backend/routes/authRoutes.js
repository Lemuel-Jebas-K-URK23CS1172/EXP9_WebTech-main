import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Helper: basic password rules
function validatePassword(pw) {
  return typeof pw === "string" && pw.length >= 6;
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, username, password, confirmPassword } = req.body;
    if (!full_name || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check duplicates
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      full_name, email: email.toLowerCase(), username, password: hashed
    });
    await user.save();

    // Generate token (optional)
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "7d" });

    return res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (username or email)
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = username or email
    if (!identifier || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "7d" });

    return res.json({ message: "Login successful", token, user: { id: user._id, username: user.username, full_name: user.full_name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
