import express from "express";
import { registerAdmin, loginAdmin,userList,registerUser,userActivity } from "../controllers/adminController.js";



const router = express.Router();

router.post("/register/", registerAdmin);
router.post("/login/", loginAdmin);



// User routes
router.get("/users", userList); // Route to fetch user list
router.post("/users/register", registerUser); // Route to register a user
router.get("/users/activity", userActivity); // Route to fetch user activity

export default router;