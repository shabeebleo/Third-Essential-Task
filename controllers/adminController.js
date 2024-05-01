import Admin from "../models/superadminModel.js"; // Import the Admin model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
// import UserActivity from "../models/userActivityModel.js";
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
      .json({ message: "Login successful" ,success:true,token:{token}});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//logout

export const logoutAdmin = async (req, res) => {

  try {
    // Find the current admin
    const admin = await Admin.findById(req.admin.id);
   
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

      // Respond with a success message
    res.status(200).json({ message: "Admin logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Controller function to fetch the list of users
export const userList = async (req, res) => {
  try {
    const users = await User.find();
   
   
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to register a new user

export const registerUser = async (req, res) => {
  try {
    console.log(req.body,"req.body in resister userrrr");
    const { username, email, phone, address, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, phone, address, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller function to fetch user-specific activity for the super admin
export const userActivity = async (req, res) => {

  const userId = req.params.id;
  console.log(userId,"userActivity")
  try {
    // Fetch user activity from the 'User' collection
   
    const user = await User.findById(userId, 'username loginTimes logoutTimes productsCreated productsUpdated');
console.log(user);

    // Construct an array to store user activities
    const userActivities = [];

    // Iterate over each user
  
      // Construct an object to store user activity details
      const userActivity = {
        username: user.username,
        loginTimes: user.loginTimes,
        logoutTimes: user.logoutTimes,
        productsCreated: [],
        productsUpdated: []
      };

      // Fetch product details for products created by the user
      const createdProducts = await Product.find({ _id: { $in: user.productsCreated } }, 'name description price image createdAt updatedAt');
      userActivity.productsCreated = createdProducts;

      // Fetch product details for products updated by the user
      const updatedProducts = await Product.find({ _id: { $in: user.productsUpdated } }, 'name description price image createdAt updatedAt');
      userActivity.productsUpdated = updatedProducts;

      // Push user activity to the array
      userActivities.push(userActivity);
  
console.log(userActivities)
    // Return the fetched user activities
    res.status(200).json(userActivities);
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
