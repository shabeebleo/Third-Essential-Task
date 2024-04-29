import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
});

export default mongoose.model('Product', productSchema);
