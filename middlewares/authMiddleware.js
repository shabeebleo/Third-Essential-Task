import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Assuming this is your user model

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.jwtSecret);
    

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    req.user = {
      id: user._id,
      username: user.username
    
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default authMiddleware;
