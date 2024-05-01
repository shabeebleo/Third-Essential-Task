import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Assuming this is your user model
import superAdminModel from "../models/superadminModel.js";


const authMiddleware = async (req, res, next) => {
  console.log(req.body,"req-bodyyy")
  console.log("authMiddleware")
  try {

    const authHeader = req.headers.authorization
    console.log(req.headers,"req.headersreq.headers");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("dfdf");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token, "tokentokentokentokentoken ");
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log(decoded, "decodeddecodeddecoded");
    const user = await User.findById(decoded.userId);
console.log(user,"userrrrr");
    if (user) {
      req.user = {
        id: user._id,
        username: user.username,
      };
      next();
    }

    const superAdmin = await superAdminModel.findById(decoded.adminId);
    if (superAdmin) {
      req.admin = {
        id: superAdmin._id,
        username: superAdmin.username,
      };
      console.log(superAdmin, "superAdminsuperAdminsuperAdmin");
      next();
    }
    
    if (!user && !superAdmin) {
      return res.status(404).json({ message: "User/Admin not found" });
    }

    // next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
    
      return res.status(401).json({ message: "Unauthorized" });
    } else {
    
      return res.status(500).json({ message: "Internal server error",logOut:true});
    }
  }
};

export default authMiddleware;
