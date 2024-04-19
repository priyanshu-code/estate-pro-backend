import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_LIFETIME,
  BCRYPT_SALT,
} from "../config/globals.config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name."],
      match: [/^[A-Za-z]*$/, "Please only use A-Z characters."],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Please provide email."],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: true,
      minlength: 3,
      maxlength: 100,
    },
    password: {
      type: String,
      required: [true, "Please provide password."],
      minlength: 6,
      maxlength: 500,
    },
    favoriteProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    userListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.password) {
    const salt = await bcrypt.genSalt(Number(BCRYPT_SALT));
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_LIFETIME,
  });
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
const User = mongoose.model("User", userSchema);

export default User;
