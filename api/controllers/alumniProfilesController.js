import httpStatus from "http-status-codes";
import usersService from "../services/usersService.js";
import alumniProfilesService from "../services/alumniProfilesService.js";
import { isValidUUID } from "../utils/validators.js";
import { Actions, Subjects } from "../../common/scopes.js";

const getAlumniProfiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      filters = {}
    } = req.query;

    const { data, error } = await alumniProfilesService.fetchAlumniProfiles(
      req.supabase,
      page,
      limit,
      search,
      filters
    );

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

const getAlumniSearch = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      filters = {}
    } = req.query;

    const { data, total, error } = await alumniProfilesService.fetchAlumniSearch(
      req.supabase,
      page,
      limit,
      search,
      filters
    );

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || [],
      total: total
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getAlumniProfilesById = async function(aRequest, aResponse) {
  const {userId} = aRequest.params;
  if (!userId) {
    return aResponse.sendErrorEmptyParam("userId");
  }

  try {
    const {page = 1, limit = 10} = aRequest.query;
    const {data, error} = await alumniProfilesService.fetchAlumniProfiles(aRequest.supabase, page, limit, userId);

    if (error) {
      return aResponse.sendErrorServer(error);
    }

    return aResponse.status(httpStatus.OK).json({
      status: "OK",
      list: data || [],
    });
  } catch (e) {
    return aResponse.sendErrorServer(e);
  }
};

const getAlumniProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await alumniProfilesService.fetchAlumniProfileById(req.supabase, userId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Alumni profile not found"
      });
    }

    if (req.you.cannotAs(Actions.READ, Subjects.ALUMNI_PROFILE, data)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this profile."
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      alumniProfile: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const createAlumniProfile = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.ALUMNI_PROFILE)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid userId format"
      });
    }

    const { data: userData, error: userError } = await usersService.fetchUserById(req.supabase, userId);

    if (userError || !userData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "User not found"
      });
    }

    const requiredFields = [
      "alum_id",
      "birthdate",
      "location",
      "address",
      "gender",
      "student_num",
      "honorifics",
      "citizenship",
      "sex",
      // "primary_work_experience_id",
      "civil_status",
      "first_name",
      // "middle_name",
      "last_name",
      "is_profile_public",
      // "skills",
      // "suffix"
    ];

    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    // Destructure and append created_at and approved
    const {
      alum_id,
      birthdate,
      location,
      address,
      gender,
      student_num,
      honorifics,
      citizenship,
      sex,
      primary_work_experience_id,
      civil_status,
      first_name,
      middle_name,
      last_name,
      is_profile_public,
      skills,
      suffix,
      approved,
      interests,
    } = req.body;

    const { result, error } = await alumniProfilesService.insertAlumniProfile(req.supabase, {
      alum_id,
      birthdate,
      location,
      address,
      gender,
      student_num,
      honorifics,
      citizenship,
      sex,
      primary_work_experience_id,
      civil_status,
      first_name,
      middle_name,
      last_name,
      is_profile_public,
      skills,
      suffix,
      approved,
      interests,
    });

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Alumni profile successfully created and approved",
      id: userId
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const approveAlumniProfiles = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.ALUMNI_PROFILE)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const alumIds = req.body;

    if (!Array.isArray(alumIds)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Request body must be a non-empty array of alumni profile IDs"
      });
    }

    const { success, error } = await alumniProfilesService.approveAlumniProfiles(req.supabase, alumIds);

    if (error || !success) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Alumni profiles not approved"
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Alumni profiles approved successfully",
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const removeAlumniProfiles = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.ALUMNI_PROFILE)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const alumIds = req.body;

    if (!Array.isArray(alumIds)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Request body must be a non-empty array of alumni profile IDs"
      });
    }

    const { success, error } = await alumniProfilesService.removeAlumniProfiles(req.supabase, alumIds);

    if (error || !success) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Alumni profiles not removed"
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Alumni profiles approved successfully",
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const reactivateAlumniProfiles = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.ALUMNI_PROFILE)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const alumIds = req.body;

    if (!Array.isArray(alumIds)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Request body must be a non-empty array of alumni profile IDs"
      });
    }

    const { success, error } = await alumniProfilesService.reactivateAlumniProfiles(req.supabase, alumIds);

    if (error || !success) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Alumni profiles not reactivated"
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Alumni profiles reactivated successfully",
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const updateAlumniProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!isValidUUID(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid userId format"
      });
    }

    // Check if user exists
    const { data: userData, error: userError } = await usersService.fetchUserById(req.supabase, userId);

    if (userError || !userData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "User not found"
      });
    }

    if (req.you.cannotAs(Actions.MANAGE, Subjects.ALUMNI_PROFILE, userData)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    // Check if alumni profile exists
    const { data: alumniData, error: alumniError } = await alumniProfilesService.fetchAlumniProfileById(req.supabase, userId);

    if (alumniError || !alumniData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Alumni profile not found"
      });
    }

    // Disallow edits to birthdate and student_num
    if (
      ("birthdate" in req.body && req.body.birthdate !== alumniData.birthdate) ||
      ("student_num" in req.body && req.body.student_num !== alumniData.student_num)
    ) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "Editing birthdate or student_num is not allowed"
      });
    }

    // Define fields that can be updated
    const allowedFields = [
      "location",
      "address",
      "gender",
      "skills",
      "honorifics",
      "citizenship",
      "civil_status",
      "is_profile_public",
      "first_name",
      "middle_name",
      "last_name",
      "suffix",
      "sex",
      "primary_work_experience_id",
      "approved",
      "interests",
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "No valid fields provided for update"
      });
    }

    const { result, error } = await alumniProfilesService.updateAlumniProfileData(req.supabase, userId, updateData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Alumni profile successfully updated",
      id: userId
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const alumniProfilesController = {
  getAlumniProfiles,
  getAlumniSearch,
  getAlumniProfilesById,
  getAlumniProfileById,
  createAlumniProfile,
  approveAlumniProfiles,
  removeAlumniProfiles,
  reactivateAlumniProfiles,
  updateAlumniProfile
};

export default alumniProfilesController;