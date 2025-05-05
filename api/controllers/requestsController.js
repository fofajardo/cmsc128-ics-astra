import httpStatus from "http-status-codes";
import requestsService from "../services/requestsService.js";
import alumniService from "../services/alumniProfilesService.js";
import contentsService from "../services/contentsService.js";

import { isValidUUID, isValidDate } from "../utils/validators.js";
import { REQUEST_TYPE } from "../utils/enums.js";
import { Actions, Subjects } from "../../common/scopes.js";
import projectsService from "../services/projectsService.js";
import usersService from "../services/usersService.js";
import { request } from "needle";

const getRequests = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const filters = req.query;
    const { data, error } = await requestsService.fetchRequests(req.supabase, filters);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || [],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getRequestById = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const { requestId } = req.params;

    if (!isValidUUID(requestId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid request ID.",
      });
    }
    const { data, error } = await requestsService.fetchRequestById(req.supabase, requestId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      request: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getRequestsByUserId = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const { userId } = req.params;

    if (!isValidUUID(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid user ID.",
      });
    }

    // Check if the user exists
    const { data: userData, error: userError } = await alumniService.fetchAlumniProfileById(req.supabase, userId);

    if (userError || !userData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "User not found.",
      });
    }

    const { data, error } = await requestsService.fetchRequestsByUserId(req.supabase, userId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getRequestsByContentId = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const { contentId } = req.params;

    if (!isValidUUID(contentId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid content ID.",
      });
    }

    // Check if the content exists
    const { data: contentData, error: contentError } = await contentsService.fetchContentById(req.supabase, contentId);

    if (contentError || !contentData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Content not found.",
      });
    }

    const { data, error } = await requestsService.fetchRequestsByContentId(req.supabase, contentId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getProjectRequests = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const filters = req.query;

    // get requests from Requests table
    const completeFilters = {
      ...filters,
      type: [REQUEST_TYPE.PROJECT_FUNDS, REQUEST_TYPE.FUNDRAISING],
    };
    const { data: requestData, error: requestError } = await requestsService.fetchProjectRequests(req.supabase, completeFilters);

    if (requestError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: requestError.message,
      });
    };

    // get name and role from alumni profiles table
    const { data: alumData, error: alumError } = await alumniService.fetchAlumniProfiles(req.supabase);

    if (alumError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: alumError.message
      });
    };

    // get emails from Users table
    const { data: userData, error: userError } = await usersService.fetchUsers(req.supabase);

    if (userError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: userError.message
      });
    };

    // get project details from Projects table
    const projectIds = requestData.map(request => request.content_id);
    const projectFilter = { project_id: projectIds };
    const { data: projectData, error: projectError } = await projectsService.fetchProjects(req.supabase, projectFilter);

    if (projectError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: projectError.message
      });
    };

    // Create lookup maps
    const alumMap = {};
    alumData.forEach(alum => {
      alumMap[alum.alum_id] = alum;
    });

    const userMap = {};
    userData.forEach(user => {
      userMap[user.id] = user;
    });

    const projectMap = {};
    projectData.forEach(project => {
      projectMap[project.project_id] = project;
    });

    // Combine everything
    const combinedData = requestData.map(request => {
      const alum = alumMap[request.user_id] || {};
      const user = userMap[request.user_id] || {};
      const project = projectMap[request.content_id] || {};

      const full_name = [alum.first_name, alum.middle_name, alum.last_name]
        .filter(Boolean) // remove undefined/null/empty values
        .join(" ");

      return {
        request_id: request.id,
        status: request.status,
        date_requested: request.date_requested,
        date_reviewed: request.date_reviewed,
        response: request.response,
        projectData: project,
        requesterData: {
          full_name,
          role: user.role || null,
          email: user.email || null,
        },
      };
    });

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: combinedData || [],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getProjectRequestById = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  };

  try {
    const { requestId } = req.params;

    const { data: requestsData, error: requestError } = await requestsService.fetchProjectRequestById(req.supabase, requestId);

    if (requestError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: requestError.message,
      });
    };

    const requestData = requestsData[0];

    // get name and role from alumni profiles table
    const { data: alumData, error: alumError } = await alumniService.fetchAlumniProfileById(req.supabase, requestData.user_id);

    // if (alumError) {
    //   return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    //     status: "FAILED",
    //     message: alumError.message
    //   });
    // };

    // let alumData = Array.isArray(alumsData) ? alumsData[0] : alumsData;

    // get email from Users table
    const { data: userData, error: userError } = await usersService.fetchUserById(req.supabase, requestData.user_id);

    if (userError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: userError.message
      });
    };

    // get project details from Projects table
    const { data: projectData, error: projectError } = await projectsService.fetchProjectById(req.supabase, requestData.content_id);

    if (projectError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: projectError.message
      });
    };


    let full_name;
    if (userData.role === "moderator") {    // TODO: Clarify if moderator/admin users will have profiles (and names)
      full_name = "Moderator";
    } else if (userData.role === "admin") {
      full_name = "Admin";
    } else if (alumError) {
      full_name = "Deleted user";
    } else {
      full_name = [alumData.first_name, alumData.middle_name, alumData.last_name]
        .filter(Boolean) // remove undefined/null/empty values
        .join(" ");
    };

    // Combine everything
    const combinedData = {
      request_id: requestData.id,
      date_requested: requestData.date_requested,
      status: requestData.status,
      projectData: projectData,
      requesterData: {
        full_name,
        role: userData.role,
        email: userData.email,
      },
    };

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: combinedData || [],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const createRequest = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const userId = req.body["user_id"];
    if (!isValidUUID(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid user ID.",
      });
    }

    // Check if the user exists
    const { data: userData, error: userError } = await alumniService.fetchAlumniProfileById(req.supabase, userId);

    if (userError || !userData) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "User not found.",
      });
    }

    const contentId = req.body["content_id"];
    if (!isValidUUID(contentId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid content ID.",
      });
    }

    // Check if the content exists
    const { data: contentData, error: contentError } = await contentsService.fetchContentById(req.supabase, contentId);

    if (contentError || !contentData) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Content not found.",
      });
    }

    const requestType = req.body["type"];
    if (requestType === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Request type is required.",
      });
    }

    const { requestId } = req.params;
    if ( requestId != undefined ) {
      // Check if the request ID is valid
      const { data: requestData, error: requestError } = await requestsService.fetchRequestById(req.supabase, requestId);
      if (requestData) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: "Request ID already exists.",
        });
      }
    }

    const requiredFields = [
      "user_id",
      "content_id",
      "type",
      "title",
    ];

    const optionalFields = [
      "description"
    ];

    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);
    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    for (const field of optionalFields) {
      if (req.body[field] === undefined) {
        req.body[field] = null; // Set optional fields to null if not provided
      }
    }

    const {
      user_id,
      content_id,
      type,
      title,
      description,
      date_requested,
      date_reviewed,
      status,
      response
    } = req.body;

    const restrictedFields = [
      "date_requested",
      "date_reviewed",
      "status",
      "response"
    ];

    restrictedFields.forEach(field => {
      if (field in req.body) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: `Field ${field} cannot be set when creating a request.`,
        });
      }
    });

    if ((!isValidUUID(user_id) ||
            !isValidUUID(content_id)) ||
            typeof type !== "number" ||
            typeof title !== "string" ||
            (description !== null && typeof description !== "string")) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "One or more fields are invalid.",
      });
    }

    const { data, error } = await requestsService.insertRequest(req.supabase, {
      user_id,
      content_id,
      type,
      title,
      description,
    });

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Request created successfully.",
      id: data[0].id,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const updateRequest = async (req, res) => {
  if (req.you.cannot(Actions.MANAGE, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const { requestId } = req.params;

    if (!isValidUUID(requestId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid request ID.",
      });
    }

    // Check if the request exists
    const { data: requestData, error: requestError } = await requestsService.fetchRequestById(req.supabase, requestId);

    if (requestError || !requestData) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Request not found.",
      });
    }

    // Columns of the request table
    const {
      user_id,
      content_id,
      type,
      status,
      title,
      description,
      date_requested,
      date_reviewed,
      response
    } = req.body;

    const updateData = {
      user_id,
      content_id,
      type,
      status,
      title,
      description,
      date_requested,
      date_reviewed,
      response
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]; // Remove undefined properties
      }
    });

    const allowedFields = [
      "status",
      "response"
    ];

    allowedFields.forEach(field => {
      if (!(field in updateData)) {
        return; // Remove fields that are not allowed to be updated
      };

      const value = updateData[field];
      if (field === "status" && ![0, 1, 2].includes(value)) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: "Invalid status value.",
        });
      } else
        if (field === "response" && typeof value !== "string") {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "FAILED",
            message: "Invalid response value.",
          });
        }
    });

    const restrictedFields = [
      "user_id",
      "content_id",
      "type",
      "title",
      "description",
      "date_requested",
      "date_reviewed"
    ];

    restrictedFields.forEach(field => {
      if (field in updateData) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: `Field ${field} cannot be updated.`,
        });
      }
    });

    if (updateData.status === 1) { // Assuming status 1 means "reviewed"
      updateData.date_reviewed = new Date().toISOString(); // Set current time
    }

    const { data, error } = await requestsService.updateRequest(req.supabase, requestId, updateData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Request updated successfully.",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the request.",
    });
  }
};

const deleteRequest = async (req, res) => {
  if (req.you.cannot(Actions.MANAGE, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Request ID is required.",
      });
    }

    if (!isValidUUID(requestId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid request ID.",
      });
    }

    // Check if the request exists
    const { data: existingRequest, error: requestError } = await requestsService.fetchRequestById(req.supabase, requestId);

    if (requestError || !existingRequest) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Request not found.",
      });
    }

    const { error } = await requestsService.deleteRequest(req.supabase, requestId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Request ${requestId} deleted successfully.`,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while deleting the request.",
    });
  }
};

const requestsController = {
  getRequests,
  getRequestById,
  getRequestsByUserId,
  getRequestsByContentId,
  getProjectRequests,
  getProjectRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
};

export default requestsController;