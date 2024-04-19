import express from "express";
const router = express.Router();
import {
  validatePropertyCreation,
  validatePropertyUpdate,
} from "../validators/property.validator.js";
import validateRequest from "../utils/validation.util.js";
import {
  createProperty,
  updateProperty,
  getProperty,
  getAllProperties,
  deleteProperty,
  favoriteProperty,
  unFavoriteProperty,
} from "../controllers/property.controller.js";

router
  .route("/")
  .get(getAllProperties)
  .post(validatePropertyCreation, validateRequest, createProperty);

router.route("/favoriteProperty").patch(favoriteProperty);
router.route("/unFavoriteProperty").patch(unFavoriteProperty);

router
  .route("/:propertyId")
  .get(getProperty)
  .patch(validatePropertyUpdate, validateRequest, updateProperty)
  .delete(deleteProperty);


export default router;
