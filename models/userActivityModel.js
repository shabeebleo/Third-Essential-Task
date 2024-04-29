import mongoose from "mongoose";

const { Schema } = mongoose;

const userActivitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  loginTime: { type: Date, required: true },
  productsCreated: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Array of references to created products
  productsUpdated: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Array of references to updated products
  logoutTime: { type: Date }
});

export default mongoose.model("UserActivity", userActivitySchema);
