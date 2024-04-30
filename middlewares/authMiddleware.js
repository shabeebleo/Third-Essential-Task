import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Assuming this is your user model
import superAdminModel from "../models/superadminModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token, "tokentokentokentokentoken ");
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log(decoded, "decodeddecodeddecoded");
    const user = await User.findById(decoded.userId);
    const superAdmin = await superAdminModel.findById(decoded.adminId);
    console.log(superAdmin, "superAdminsuperAdminsuperAdmin");
    if (!user && !superAdmin) {
      return res.status(404).json({ message: "User/Admin not found" });
    }
    if (user) {
      req.user = {
        id: user._id,
        username: user.username,
      };
    }
    if (superAdmin) {
      req.user = {
        id: superAdmin._id,
        username: superAdmin.username,
      };
    }

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
