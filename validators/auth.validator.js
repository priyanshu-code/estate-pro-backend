import { body } from "express-validator";

export const validateUserRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  // Custom sanitizer to trim whitespace from name and email
  body("name").trim(),
  body("email").trim(),
];

export const validateUserLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  // Custom sanitizer to trim whitespace from email
  body("email").trim(),
];
