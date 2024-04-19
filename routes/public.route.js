import express from "express";
import { getProperty } from "../controllers/property.controller.js";
import { getFilteredProperties, getHomepageProperties } from "../controllers/public.controller.js";
const router = express.Router();

router.route("/getHomeProperties").get(getHomepageProperties);
router.route("/getFilteredProperties").post(getFilteredProperties);

// This needs to be last
router.route("/:propertyId").get(getProperty);

export default router;
