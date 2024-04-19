import { NotFoundError } from "../errors/index.js";
import {
  fetchAllPropertiesByUserIdService,
  fetchManyPropertiesByIdService,
} from "../services/property.service.js";
import {
  fetchUserByIdService,
  updateUserByIdService,
} from "../services/user.service.js";

const getUser = async (req, res) => {
  const { userId } = req.body;
  const user = await fetchUserByIdService(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return res.status(200).send({ user });
};

const updateUser = async (req, res) => {
  const { firstname, lastname, userId } = req.body;
  let data = { $set: { firstname, lastname } };
  const user = await updateUserByIdService({ userId, data });
  return res.status(200).send({ user });
};

const checkLatestUser = async (req, res) => {
  const { userId } = req.body;
  const user = await fetchUserByIdService(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return res.status(200).send({ latestUser: user.updatedAt });
};

const getFavoriterProperties = async (req, res) => {
  const { userId } = req.body;
  const user = await fetchUserByIdService(userId);

  const { favoriteProperties } = user;

  if (favoriteProperties.length > 0) {
    const properties = await fetchManyPropertiesByIdService(favoriteProperties);
    return res.status(200).send({ properties });
  }
  return res.status(200).send({ properties: [] });
};

const getUserProperties = async (req, res) => {
  const { userId } = req.body;
  const user = await fetchUserByIdService(userId);

  const { userListings } = user;

  if (userListings.length > 0) {
    const properties = await fetchAllPropertiesByUserIdService(userId);
    return res.status(200).send({ properties });
  }
  return res.status(200).send({ properties: [] });
};


export {
  getUser,
  updateUser,
  checkLatestUser,
  getFavoriterProperties,
  getUserProperties,
};
