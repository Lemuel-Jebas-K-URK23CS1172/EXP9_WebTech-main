import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  username: { type: String, required: true, unique: true, trim: true, index: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create indexes to ensure uniqueness at DB level
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ username: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
