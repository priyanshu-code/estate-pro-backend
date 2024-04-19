import express from "express";
const router = express.Router();
import {
  getUser,
  updateUser,
  checkLatestUser,
  getFavoriterProperties,
  getUserProperties,
} from "../controllers/user.controller.js";
import { validateUserUpdate } from "../validators/user.validator.js";
import validateRequest from "../utils/validation.util.js";

router
  .route("/")
  .get(getUser)
  .patch(validateUserUpdate, validateRequest, updateUser);
router.route("/checkLatestUser").get(checkLatestUser);
router.route("/getUserFavorites").get(getFavoriterProperties);
router.route("/getUserProperties").get(getUserProperties);

export default router;
