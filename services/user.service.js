import User from "../models/user.model.js";

const fetchUserByIdService = async (userId) => {
  const user = await User.findById({ _id: userId });
  if (user) user.password = undefined;
  return user;
};

const updateUserByIdService = async ({ userId, data }) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...data },
    { runValidators: true, new: true },
  );
  updatedUser.password = undefined;
  return updatedUser;
};

export { fetchUserByIdService, updateUserByIdService };
