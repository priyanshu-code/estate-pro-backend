import { body } from "express-validator";

export const validatePropertyCreation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("location").notEmpty().withMessage("Location is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array"),
  // Validate bedrooms (optional, can be empty)
  body("bedrooms")
    .optional()
    .isNumeric()
    .withMessage("Bedrooms must be a number"),
  // Validate bathrooms (optional, can be empty)
  body("bathrooms")
    .optional()
    .isNumeric()
    .withMessage("Bathrooms must be a number"),
  // Validate area (optional, can be empty)
  body("area").optional().isNumeric().withMessage("Area must be a number"),
];

export const validatePropertyUpdate = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("location").notEmpty().withMessage("Location is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array"),
  // Validate bedrooms (optional, can be empty)
  body("bedrooms")
    .optional()
    .isNumeric()
    .withMessage("Bedrooms must be a number"),
  // Validate bathrooms (optional, can be empty)
  body("bathrooms")
    .optional()
    .isNumeric()
    .withMessage("Bathrooms must be a number"),
  // Validate area (optional, can be empty)
  body("area").optional().isNumeric().withMessage("Area must be a number"),
];
