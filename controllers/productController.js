import Product from "../models/productModel.js";

// Get user-specific product list
export const productList = async (req, res) => {
  try {
    // Fetch products specific to the logged-in user
    const products = await Product.find({ users: req.user.id }).populate("users", "username email");

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    console.log(req.body,"req.body in create product")
    const { name, description, price, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      users: [req.user.id], // Associate the product with the logged-in user
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit a product
export const editProduct = async (req, res) => {
  try {
    const  productId  = req.params.productId;
    console.log(productId,"productIdproductId");
    const { name, description, price, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, image },
      { new: true }
    );

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
