import User from "../models/User.js";
import { createError } from "../utils/error.js";
import { createSuccess } from "../utils/success.js";

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await  User.find();
    return next(createSuccess(200, "All Users", allUsers));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

export const getUserByID =async (req, res, next) => {
  try {
    const userById = await User.findById(req.params.id);

    if (!userById) {
      return next(createError(404, "User not found"));
    } else {
      return next(createSuccess(200, "Single User", userById));
    }
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};
