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

    // Update user's login times
    user.loginTimes.push(new Date());
    await user.save();

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
    // Find the current user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the user's logout time
    user.logoutTimes.push(new Date());
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
