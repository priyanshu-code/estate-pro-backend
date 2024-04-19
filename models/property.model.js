import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner is required."],
  },
  title: {
    type: String,
    required: [true, "Title is required."],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  location: {
    type: String,
    required: [true, "Location is required."],
  },
  type: {
    type: String,
    required: [true, "Type is required."],
  },
  amenities: {
    type: [String],
    required: [true, "Amenities are required."],
  },
  propertyImages: {
    type: [String],
    required: [true, "Images are required."],
  },
  bedrooms: {
    type: Number,
    default: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
  },
  area: {
    type: Number,
    default: 0,
  },
});

// Index for price, location, and type fields for faster querying
propertySchema.index({ price: 1, location: 1, type: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;
