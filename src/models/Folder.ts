import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

export const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
