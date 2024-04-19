import express from "express";
const router = express.Router();
import {
  validateUserRegistration,
  validateUserLogin,
} from "../validators/auth.validator.js";
import validateRequest from "../utils/validation.util.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

router.route("/login").post(validateUserLogin, validateRequest, loginUser);
router
  .route("/register")
  .post(validateUserRegistration, validateRequest, registerUser);

export default router;
