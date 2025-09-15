import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    categoryType: {
      type: String,
      required: true,
      enum: ["Featured", "Hot categories", "Top categories"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
