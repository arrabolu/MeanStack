import Role from "../models/Role.js";
import { createError } from "../utils/error.js";
import { createSuccess } from "../utils/success.js";

export const createRole = async (req, res, next) => {
  try {
    if (req.body.role && req.body.role !== "") {
      const newrole = new Role(req.body);
      await newrole.save();
      return next(createSuccess(200, "Role created successfully", newrole));
    } else {
      return next(createError(400, "Bad Request"));
    }
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById({ _id: req.params.id });

    if (role) {
      const newData = await Role.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return next(createSuccess(200, "Role updated", newData));
    } else {
      return next(createError(404, "Role not found"));
    }
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

export const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});
    return next(createSuccess(200, "Role fetched", roles));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById({ _id: req.params.id });
    if (role) {
      await Role.findByIdAndDelete(role);
      return next(createSuccess(200, "Role Deleted", role));
    } else {
      return next(createError(400, "Role Not Found"));
    }
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};
