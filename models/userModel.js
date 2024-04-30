import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  loginTimes: [{ type: Date }], // Track login times
  productsCreated: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // Reference to created products
  productsUpdated: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // Reference to updated products
  logoutTimes: [{ type: Date }] // Logout time
});

export default mongoose.model("User", userSchema);
