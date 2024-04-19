import BadRequestError from "../errors/BadRequestError.js";
import NotFoundError from '../errors/NotFoundError.js'
import {
  createPropertyService,
  deletePropertyByIdService,
  fetchAllPropertiesByUserIdService,
  fetchManyPropertiesByIdService,
  fetchPropertyByIdService,
  updatePropertyByIdService,
} from "../services/property.service.js";
import { updateUserByIdService } from "../services/user.service.js";

// *No need to wrap in try catch I am using express-async-error package

const createProperty = async (req, res) => {
  const { userId } = req.body;
  const images = req.files;
  // If no images
  if (images.length === 0) {
    throw new BadRequestError("Please provide property images.");
  }
  // Data for property
  const propertyData = {
    ...req.body,
    owner: userId,
    propertyImages: images.map((item) => item.filename),
    userId: undefined,
  };
  const property = await createPropertyService(propertyData);

  // Add to use listings
  const userData = {
    $addToSet: { userListings: property._id },
  };
  const user = await updateUserByIdService({ userId, data: userData });

  return res.status(201).send({ property, user });
};

const getProperty = async (req, res) => {
  const { propertyId } = req.params;
  const property = await fetchPropertyByIdService(propertyId);
  return res.status(200).send({ property });
};

const getAllProperties = async (req, res) => {
  const { userId } = req.body;
  const properties = await fetchAllPropertiesByUserIdService(userId);
  return res.status(200).send({ properties });
};

const updateProperty = async (req, res) => {
  const { userId, removedImages } = req.body;
  const { propertyId } = req.params;
  const images = req.files;
  const propertyData = {
    ...req.body,
    userId: undefined,
  };
  // Doing both operations at the same time would create conflicts 

  // If removed images
  if (removedImages && removedImages.length > 0) {
    const removeData = { $pull: { propertyImages: { $in: removedImages } } }
    await updatePropertyByIdService({ propertyId, data: removeData, });
  }

  // If images
  if (images && images.length > 0) {
    const newImages = images.map((item) => item.filename);
    propertyData.$addToSet = { propertyImages: { $each: newImages } };
  }

  const updatedProperty = await updatePropertyByIdService({
    propertyId,
    data: propertyData,
  });

  return res.status(200).send({ property: updatedProperty });
};

const deleteProperty = async (req, res) => {
  const { userId } = req.body;
  const { propertyId } = req.params;

  const userData = {
    $pull: { userListings: propertyId },
  };

  const deletedProperty = await deletePropertyByIdService(propertyId);
  console.log(deletedProperty);
  if (!deletedProperty) {
    throw new NotFoundError("Property not found")
  }
  const user = await updateUserByIdService({ userId, data: userData });
  console.log(user)
  return res.status(200).send({ user, msg: "success" });
};

const favoriteProperty = async (req, res) => {
  const { propertyId, userId } = req.body;
  let data = { $addToSet: { favoriteProperties: propertyId } };
  const user = await updateUserByIdService({ userId, data });
  return res.status(200).send({ user, msg: "success" });
};

const unFavoriteProperty = async (req, res) => {
  const { propertyId, userId } = req.body;
  let data = { $pull: { favoriteProperties: propertyId } };
  const user = await updateUserByIdService({ userId, data });
  return res.status(200).send({ user, msg: "success" });
};

export {
  createProperty,
  getProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
  favoriteProperty,
  unFavoriteProperty
};
