import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      default: "",
    },
    purchasePrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "reserved"],
      default: "available",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Vehicle", vehicleSchema);
