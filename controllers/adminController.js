import Admin from "../models/superadminModel.js"; // Import the Admin model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import UserActivity from "../models/userActivityModel.js";
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




// Controller function to fetch the list of users
export const userList = async (req, res) => {
  try {
    const users = await User.find({}, "username email phone address"); // Fetch users with specified fields
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Create a new user
    const newUser = new User({ name, email, phone, address });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller function to fetch user-specific activity for the super admin
export const userActivity = async (req, res) => {
  try {
    // Fetch user activity from the 'UserActivity' collection
    const userActivity = await UserActivity.find()
      .populate("user", "name") // Populate the 'user' field with the 'name'
      .populate("productsCreated", "name description price") // Populate the 'productsCreated' field with product details
      .populate("productsUpdated", "name description price") // Populate the 'productsUpdated' field with product details
      .sort({ loginTime: -1 }); // Sort the results by loginTime in descending order

    // Return the fetched user activity
    res.status(200).json(userActivity);
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

