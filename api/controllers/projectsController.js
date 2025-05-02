import httpStatus from "http-status-codes";
import projectsService from "../services/projectsService.js";
import contentsService from "../services/contentsService.js";
import requestsService from "../services/requestsService.js";
import { isValidUUID, isValidDate } from "../utils/validators.js";
import {Actions, Subjects} from "../../common/scopes.js";
import { v4 as uuvidv4 } from "uuid";

const getProjects = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.PROJECT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const filters = req.query;
    const { data: projectData, error: projectError } = await projectsService.fetchProjects(req.supabase, filters);

    if (projectError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: projectError.message
      });
    }

    const projectIds = projectData.map(project => project.project_id);
    const contentFilter = { id: projectIds };
    const { data: contentData, error: contentError } = await contentsService.fetchContents(req.supabase, contentFilter);

    if (contentError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: contentError.message
      });
    }

    const contentMap = new Map();
    contentData.forEach(content => {
      contentMap.set(content.id, content);
    });

    const combinedData = projectData.map(project => {
      const content = contentMap.get(project.project_id);
      const { id, ...contentWithoutId } = content || {};  // Destructure and omit the "id" field
      return {
        ...project,  // Include all project fields
        ...contentWithoutId,  // Include all content fields except "id"
        tags: content ? content["tags"] : null,  // If tags exist, include them
      };
    });

    return res.status(httpStatus.OK).json({
      status: "OK",
      projects: combinedData || [],
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getProjectById = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.PROJECT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const { projectId } = req.params;

    if (!isValidUUID(projectId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid projectId format"
      });
    }

    const { data, error } = await projectsService.fetchProjectById(req.supabase, projectId);

    if (!isValidUUID(projectId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid projectId format"
      });
    }

    const { data: projectData, error: projectError } = await projectsService.fetchProjectById(req.supabase, projectId);

    if (projectError) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Project not found"
      });
    }

    const { data: contentData, error: contentError } = await contentsService.fetchContentById(req.supabase, projectData.project_id);

    const { id, ...contentWithoutId } = contentData || {};  // Destructure and omit the "id" field
    const combinedData = {
      ...projectData,  // Include all project fields
      ...contentWithoutId,  // Include all content fields except "id"
      tags: contentData["tags"] ? contentData["tags"] : null,  // If tags exist, include them
    };

    return res.status(httpStatus.OK).json({
      status: "OK",
      project: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const createProject = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.PROJECT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  let isContentCreated = false;
  let isRequestCreated = false;
  let contentId;
  let requestId;
  let projectId;

  try {
    const allowedFields = [
      "user_id",
      "title",
      "details",
      "created_at",
      "updated_at",
      "views",
      "tags",
      "project_id",
      "project_status",
      "due_date",
      "date_completed",
      "goal_amount",
      "donation_link",
      "type",
    ];

    const providedFields = Object.keys(req.body);
    const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));
    if (unexpectedFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Unexpected fields: ${unexpectedFields.join(", ")}`
      });
    }

    // Check required fields
    const requiredFields = [
      "user_id",
      "title",
      "details",
      // "tags",
      "project_id",
      // "project_status",
      "due_date",
      // "date_completed",
      "goal_amount",
      "donation_link",
      "type",
    ];

    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      user_id,
      title,
      details,
      created_at = new Date().toISOString(),
      views = 0,
      tags = null,
      project_id,
      project_status = 0,
      due_date,
      date_completed = null,
      goal_amount,
      donation_link,
      type,
    } = req.body;

    // Invalid date_completed will result to null (invalid date objects serialized to null)
    if ((typeof project_status !== "number" || ![0, 1].includes(project_status)) ||
            !isValidDate(due_date) ||
            (date_completed !== undefined && date_completed !== null && !isValidDate(date_completed)) ||
            typeof goal_amount !== "number" ||
            typeof donation_link !== "string"
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid field values"
      });
    }

    // Sanitize string fields
    const clean_donation_link = donation_link.trim();

    // Create content
    contentId = uuvidv4();

    const { data: contentData, error: contentError } = await contentsService.insertContent(req.supabase, {
      id: contentId,
      user_id,
      title,
      details,
      created_at,
      updated_at: created_at,
      views,
      tags,
    });

    if (contentError) {
      console.error("Insert Content Error:", contentError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: contentError.message
      });
    };

    isContentCreated = true;

    // Create request
    const { data: requestData, error: requestError } = await requestsService.insertRequest(req.supabase, {
      user_id,
      content_id: contentId,
      type: 1,
      title,
      description: details,
    });

    if (requestError) {
      if (isContentCreated) await contentsService.deleteContentData(req.supabase, contentId);
      console.error("Insert Request Error:", requestError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: requestError.messsage
      });
    }
    isRequestCreated = true;
    requestId = requestData[0].id;

    // Create project
    const { data: projectData, projectError } = await projectsService.insertProject(req.supabase, {
      project_id: contentId,
      project_status,
      due_date,
      date_completed,
      goal_amount,
      donation_link: clean_donation_link,
      type,
    });

    if (projectError) {
      if (isContentCreated) await contentsService.deleteContentData(req.supabase, contentId);
      if (isRequestCreated) await requestsService.deleteRequest(req.supabase, requestId);
      console.error("Insert Project Error:", projectError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: projectError.messsage
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Project successfully created",
      id: contentId
    });

  } catch (error) {
    if (isContentCreated) await contentsService.deleteContentData(req.supabase, contentId);
    if (isRequestCreated) await requestsService.deleteRequest(req.supabase, requestId);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const updateProject = async (req, res) => {
  if (req.you.cannot(Actions.MANAGE, Subjects.PROJECT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const projectId = req.params.projectId;

    if (!isValidUUID(projectId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid projectId format"
      });
    }

    // Check if project exists
    const { data: projectData, error: projectError } = await projectsService.fetchProjectById(req.supabase, projectId);

    if (projectError || !projectData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Project not found"
      });
    }

    // TODO: Clarify if disallow edits to donation_link
    // if (
    //     ("donation_link" in req.body && req.body.donation_link !== projectData.donation_link)
    // ) {
    //     return res.status(httpStatus.FORBIDDEN).json({
    //         status: "FORBIDDEN",
    //         message: "Editing donation_link is not allowed"
    //     });
    // }

    // Update only allowed fields
    const {
      project_id,
      project_status,
      due_date,
      date_completed,
      goal_amount,
      donation_link
    } = req.body;

    const updateData = {
      project_id,
      project_status,
      due_date,
      date_completed,
      goal_amount,
      donation_link
    };

    // Remove undefined fields to avoid overwriting with nulls
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Validate request body
    const allowedFields = ["project_status", "due_date", "date_completed", "goal_amount", "donation_link"];

    allowedFields.forEach(field => {
      if (!(field in req.body)) {
        return;
      }; // skip if field is not present

      const value = req.body[field];

      if ((field === "project_status" && (typeof value !== "number" || ![0, 1, 2].includes(value))) ||
                (field === "due_date" && !isValidDate(value)) ||
                (field === "date_completed" && (value !== null && !isValidDate(value))) ||
                (field === "goal_amount" && typeof value !== "number") ||
                (field === "donation_link" && typeof value !== "string")
      ) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: "Invalid field values",
        });
      }
    });

    const { data, error } = await projectsService.updateProjectData(req.supabase, projectId, updateData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Project successfully updated",
      id: projectId
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const deleteProject = async (req, res) => {
  if (req.you.cannot(Actions.MANAGE, Subjects.PROJECT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const { projectId } = req.params;

    if (!isValidUUID(projectId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid projectId format"
      });
    }

    // Check if project exists
    const { data: projectData, error: projectError } = await projectsService.fetchProjectById(req.supabase, projectId);

    if (projectError || !projectData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Project not found"
      });
    }

    const { error } = await projectsService.deleteProject(req.supabase, projectId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Project ${projectId} has been deleted.`
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const projectsController = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};

export default projectsController;