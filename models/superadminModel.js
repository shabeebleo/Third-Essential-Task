import mongoose from "mongoose";

const { Schema } = mongoose;


const superadminSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
  
});

export default mongoose.model('Superadmin', superadminSchema);
