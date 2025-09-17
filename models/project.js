import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  images: {
    type: [
      {
        key: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    validate: [(arr) => arr.length <= 10, "Maximum 10 images allowed"],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);
export default Project;
