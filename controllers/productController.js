import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// Get user-specific product list
export const productList = async (req, res) => {
  try {
    // Fetch products specific to the logged-in user
    const products = await Product.find({ createdBy: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const createdBy = req.user.id;
    const updatedBy = req.user.id;
    
    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      createdBy,
      updatedBy
    });
    
    // Save the new product
    await newProduct.save();

    // Update the user who created the product
    await User.findByIdAndUpdate(createdBy, {
      $push: { products: newProduct._id, productsCreated: newProduct._id }
    });

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit a product
export const editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, image } = req.body;
    const updatedBy = req.user.id;

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, image, updatedBy },
      { new: true }
    );

    // Update the user who updated the product
    await User.findByIdAndUpdate(updatedBy, {
      $push: { productsUpdated: productId }
    });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const  productId  = req.params.productId;

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
