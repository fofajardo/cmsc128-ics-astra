import httpStatus from "http-status-codes";
import requestsService from "../services/requestsService.js";
import alumniService from "../services/alumniProfilesService.js";
import contentsService from "../services/contentsService.js";

import { isValidUUID, isValidDate } from "../utils/validators.js";
import { Actions, Subjects } from "../../common/scopes.js";
import projectsService from "../services/projectsService.js";

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

  if (req.you.cannot(Actions.READ, Subjects.Requests)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FAILED",
      message: "You do not have permission to access this resource.",
    });
  }

  try {
    const filters = {
      type: [0, 1],
    };
    const { data: requestData, error: requestError } = await requestsService.fetchProjectRequests(req.supabase, filters);

    if (requestError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: requestError.message,
      });
    }

    const projectIds = requestData.map(request => request.content_id);
    const projectFilter = { project_id: projectIds };
    const { data: projectData, error: projectError } = await projectsService.fetchProjects(req.supabase, projectFilter);

    if (projectError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'FAILED',
        message: projectError.message
      });
    }

    const statusMap = new Map();
    requestData.forEach(request => {
      statusMap.set(request.content_id, request.status);
    });

    // combine with status from requestData
    const combinedData = projectData.map(project => {
      const request_status = statusMap.get(project.project_id);
      return {
        ...project,  // Include all project fields
        request_status,
      };
    })

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
}

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
  createRequest,
  updateRequest,
  deleteRequest,
};

export default requestsController;