import User from "../models/userModel.js";
import UserActivity from "../models/userActivityModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();




//Register User

export const registerUser = async (req, res) => {
  try {
    console.log(req.body, "req.body in registerUser");
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: process.env.expiresIn,
    });

    res
      .status(201)
      .setHeader("Authorization", `Bearer ${token}`)
      .json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//loginUser 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create user activity for login
    const userActivity = new UserActivity({
      user: user._id, // Associate with the logged-in user
      loginTime: new Date() // Record the login time
    });
    await userActivity.save();

    // Generate JWT token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: process.env.expiresIn,
    });

    // Respond with success message and token
    return res
      .setHeader("Authorization", `Bearer ${token}`)
      .status(200)
      .json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logoutUser = async (req, res) => {
  try {
    // Find the latest user activity document for the current user
    const latestActivity = await UserActivity.findOne({ user: req.user.id }).sort({ loginTime: -1 });

    if (!latestActivity) {
      return res.status(400).json({ message: "No user activity found" });
    }

    // Update the latest user activity document with the logout time
    latestActivity.logoutTime = new Date();
    await latestActivity.save();

    // Respond with a success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

