const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const mailer = require("../utils/mailer");
require("dotenv").config();

// Helper to generate custom ID
async function generateUserId(role) {
  const year = new Date().getFullYear();
  let roleCode = "";
  if (role === "student") roleCode = "st";
  else if (role === "parent") roleCode = "p";
  else if (role === "tutor") roleCode = "t";
  else if (role === "admin") roleCode = "admin";
  else throw new Error("Invalid role");

  const count = (await userModel.countUsersByRoleAndYear(roleCode, year)) + 1;
  return `samcy/${year}/${roleCode}/${String(count).padStart(4, "0")}`;
}

// Signup (students only)
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      maritalStatus,
      dob,
      state,
      localGovt,
      address,
      nationality,
      nin,
      department,
      gender,
      role,
      privacyPolicy,
    } = req.body;

    if (role !== "student")
      return res.status(400).json({ error: "Only students can sign up here." });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match." });

    if (await userModel.findByEmail(email))
      return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await generateUserId(role);

    await userModel.createUser({
      id,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      maritalStatus,
      dob,
      state,
      localGovt,
      address,
      nationality,
      nin,
      department,
      gender,
      role,
      privacyPolicy,
    });

    res.status(201).json({ message: "User registered successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, expectedRole, rememberMe } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials." });

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        error: `Access denied. This account is not a ${expectedRole}.`,
      });
    }

    const expiresIn = rememberMe ? "7d" : process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user)
      return res.status(400).json({ error: "No user with that email." });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await userModel.setResetToken(email, token, expiry);

    await mailer.sendResetEmail(email, token);
    res.json({ message: "Password reset email sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match." });

    const user = await userModel.findByResetToken(token);
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token." });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
