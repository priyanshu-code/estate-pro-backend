import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import User from "../models/user.model.js";

const fetchUserByEmailServoce = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const registerUserService = async (userData) => {
  try {
    // Destructure email user data
    const { email } = userData;
    // Check if the user with the email already exists
    const existingUser = await fetchUserByEmailServoce(email);
    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }
    // Create a new user instance
    const user = User.create(userData);
    return user;
  } catch (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
};

const loginUserService = async (email, password) => {
  try {
    // Find the user by email
    const user = await fetchUserByEmailServoce(email);
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    // Check if the password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    // Generate JWT token
    const token = user.createJWT();
    user.password = undefined;
    return { user, token };
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      throw error;
    }
    throw new Error(`Failed to login user: ${error.message}`);
  }
};

export { fetchUserByEmailServoce, registerUserService, loginUserService };
