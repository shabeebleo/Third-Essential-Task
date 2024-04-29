import Admin from "../models/superadminModel.js"; // Import the Admin model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const payload = { adminId: newAdmin._id };
    const token = jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: process.env.expiresIn,
    });

    res
      .status(201)
      .setHeader("Authorization", `Bearer ${token}`)
      .json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = { adminId: admin._id };
    const token = jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: process.env.expiresIn,
    });

    return res
      .setHeader("Authorization", `Bearer ${token}`)
      .status(200)
      .json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
