import {
  loginUserService,
  registerUserService,
} from "../services/auth.service.js";

// *No need to wrap in try catch I am using express-async-error package

const registerUser = async (req, res) => {
  const userData = req.body;
  const user = await registerUserService(userData);
  return res
    .status(201)
    .send({ userId: user._id, msg: "User registered successfully" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUserService(email, password);
  res.status(200).json({ msg: "Login successful", user, token });
};
export { registerUser, loginUser };
