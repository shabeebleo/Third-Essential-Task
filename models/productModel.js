import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  // users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the product
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who last updated the product
  deletedBy:{ type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }, // Timestamp when the product was created
  updatedAt: { type: Date } // Timestamp when the product was last updated
});

// Update the 'updatedAt' field before saving if the product is being updated
productSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

export default mongoose.model('Product', productSchema);
