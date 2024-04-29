import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { logoutUser } from "../controllers/userController.js";
import {productList,createProduct,editProduct,deleteProduct} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register/", registerUser);
router.post("/login/", loginUser);
router.post("/logout",authMiddleware, logoutUser);
// Product routes

router.get("/products",authMiddleware, productList); // Get user-specific product list
router.post("/products",authMiddleware, createProduct); // Create a new product
router.put("/products/:productId",authMiddleware, editProduct); // Edit a product
router.delete("/products/:productId",authMiddleware, deleteProduct); // Delete a product

export default router;