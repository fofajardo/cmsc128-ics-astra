import httpStatus from "http-status-codes";
import usersService from "../services/usersService.js";
import { Actions, Subjects } from "../../common/scopes.js";

const getUsers = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.USER)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const { page = 1, limit = 10 } = req.query;
    const { data, error } = await usersService.fetchUsers(req.supabase, page, limit);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || [],
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await usersService.fetchUserById(req.supabase, userId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "User not found"
      });
    }

    if (req.you.cannotAs(Actions.READ, Subjects.USER, data)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      user: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};


const createUser = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.USER)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const requiredFields = [
      "username",
      "email",
      "password",
      "salt",
      "is_enabled",
      "created_at",
      "updated_at",
      "role"
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      username,
      email,
      password,
      salt,
      is_enabled,
      first_name,
      middle_name,
      last_name,
      created_at,
      updated_at,
      role
    } = req.body;

    const { data: existingUsers, error: checkError } = await usersService.checkExistingUser(req.supabase, username, email);

    if (checkError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: checkError
      });
    }

    if (existingUsers.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Username or email already exists"
      });
    }

    const { data, error } = await usersService.insertUser(req.supabase, {
      username,
      email,
      password,
      salt,
      is_enabled,
      first_name,
      middle_name,
      last_name,
      created_at,
      updated_at,
      role
    });

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "User successfully created",
      id: data[0].id
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const { data: existingUser, error: fetchError } = await usersService.fetchUserById(req.supabase, userId);

    if (fetchError || !existingUser) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "User not found"
      });
    }

    if (req.you.cannotAs(Actions.MANAGE, Subjects.USER, existingUser)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    const {
      username,
      email,
      password,
      first_name,
      middle_name,
      last_name,
      role
    } = req.body;

    const hasRestrictedFieldChanges =
            first_name !== undefined ||
            middle_name !== undefined ||
            last_name !== undefined ||
            role !== undefined;

    if (hasRestrictedFieldChanges) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "Cannot update name and role fields"
      });
    }

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "No valid fields to update"
      });
    }

    updateData.updated_at = new Date().toISOString();

    const { error: updateError } = await usersService.updateUserData(req.supabase, userId, updateData);

    if (updateError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: updateError.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "User profile updated successfully"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the user"
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const hard = req.query.hard === "true";

    if (req.you.cannotAs(Actions.MANAGE, Subjects.USER, {
      id: userId,
    })) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    const { error } = hard
      ? await usersService.hardDeleteUser(req.supabase, userId)
      : await usersService.softDeleteUser(req.supabase, userId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `User ${userId} has been ${hard ? "hard" : "soft"} deleted.`
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const usersController = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default usersController;