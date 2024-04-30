import express from "express";
import { registerAdmin, loginAdmin,userList,registerUser,userActivity } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register/", registerAdmin);
router.post("/login/", loginAdmin);



// User routes
router.get("/users",authMiddleware, userList); // Route to fetch user list
router.post("/users/register",authMiddleware, registerUser); // Route to register a user
router.get("/users/activity",authMiddleware, userActivity); // Route to fetch user activity

export default router;