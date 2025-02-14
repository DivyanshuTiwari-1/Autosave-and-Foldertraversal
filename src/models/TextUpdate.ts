import mongoose from "mongoose";

const TextUpdateSchema = new mongoose.Schema({
  text: String,
  startTime: Number,
  endTime: Number,
}, { timestamps: true });

export const TextUpdate = mongoose.models.TextUpdate || mongoose.model("TextUpdate", TextUpdateSchema);
