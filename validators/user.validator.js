import { body } from "express-validator";

export const validateUserUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").optional().trim(),
  body("email").optional().trim(),
];
