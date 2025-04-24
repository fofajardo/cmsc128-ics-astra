import httpStatus from 'http-status-codes';
import projectsService from '../services/projectsService.js';
import contentsService from '../services/contentsService.js';
import { isValidUUID, isValidDate } from '../utils/validators.js';
import {Actions, Subjects} from "../../common/scopes.js";

const getProjects = (supabase) => async (req, res) => {
    if (req.you.cannot(Actions.READ, Subjects.PROJECT)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: "FORBIDDEN",
            message: "You are not allowed to access this resource."
        });
    }

    try {
        const { page = 1, limit = 10 } = req.query;
        const { data, error } = await projectsService.fetchProjects(supabase, page, limit);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            projects: data || [],
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const getProjectById = (supabase) => async (req, res) => {
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
                status: 'FAILED',
                message: 'Invalid projectId format'
            });
        }

        const { data, error } = await projectsService.fetchProjectById(supabase, projectId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Project not found'
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            project: data
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const createProject = (supabase) => async (req, res) => {
    if (req.you.cannot(Actions.CREATE, Subjects.PROJECT)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: "FORBIDDEN",
            message: "You are not allowed to access this resource."
        });
    }

    try {
        const projectId = req.body['project_id'];

        if (!isValidUUID(projectId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Invalid projectId format`
            });
        }

        const { data: contentData, error: contentError } = await contentsService.fetchContentById(supabase, projectId);

        if (contentError || !contentData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Content not found'
            });
        }

        // Check if project already exists (GET /v1/project/:projectId)
        const { data: projectData, error: projectError } = await projectsService.fetchProjectById(supabase, projectId);

        if (projectData) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Project already exists'
            });
        }

        // Check required fields
        const requiredFields = [
            'project_id',
            'status',
            'due_date',
            // 'date_completed',
            'goal_amount',
            'donation_link'
        ];

        const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Insert data to supabase
        const {
            project_id,
            status,
            due_date,
            date_completed,
            goal_amount,
            donation_link
        } = req.body;

        // Invalid date_completed will result to null (invalid date objects serialized to null)
        if ((typeof status !== 'number' || ![0, 1, 2].includes(status)) ||
            !isValidDate(due_date) ||
            (date_completed !== undefined && date_completed !== null && !isValidDate(date_completed)) ||
            typeof goal_amount !== 'number' ||
            typeof donation_link !== 'string'
        ) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid field values'
            });
        }

        // Sanitize string fields
        const clean_donation_link = donation_link.trim();

        const { data, error } = await projectsService.insertProject(supabase, {
            project_id,
            status,
            due_date,
            date_completed,
            goal_amount,
            donation_link: clean_donation_link
        });

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Project successfully created',
            id: projectId
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const updateProject = (supabase) => async (req, res) => {
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
                status: 'FAILED',
                message: 'Invalid projectId format'
            });
        }

        // Check if project exists
        const { data: projectData, error: projectError } = await projectsService.fetchProjectById(supabase, projectId);

        if (projectError || !projectData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Project not found'
            });
        }

        // TODO: Clarify if disallow edits to donation_link
        // if (
        //     ('donation_link' in req.body && req.body.donation_link !== projectData.donation_link)
        // ) {
        //     return res.status(httpStatus.FORBIDDEN).json({
        //         status: 'FORBIDDEN',
        //         message: 'Editing donation_link is not allowed'
        //     });
        // }

        // Update only allowed fields
        const {
            project_id,
            status,
            due_date,
            date_completed,
            goal_amount,
            donation_link
        } = req.body;

        const updateData = {
            project_id,
            status,
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
        const allowedFields = ['status', 'due_date', 'date_completed', 'goal_amount', 'donation_link'];

        allowedFields.forEach(field => {
            if (!(field in req.body)) {
                return;
            }; // skip if field is not present

            const value = req.body[field];

            if ((field === 'status' && (typeof value !== 'number' || ![0, 1, 2].includes(value))) ||
                (field === 'due_date' && !isValidDate(value)) ||
                (field === 'date_completed' && (value !== null && !isValidDate(value))) ||
                (field === 'goal_amount' && typeof value !== 'number') ||
                (field === 'donation_link' && typeof value !== 'string')
            ) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid field values',
                });
            }
        })

        const { data, error } = await projectsService.updateProjectData(supabase, projectId, updateData)

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Project successfully updated',
            id: projectId
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const deleteProject = (supabase) => async (req, res) => {
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
                status: 'FAILED',
                message: 'Invalid projectId format'
            });
        }

        // Check if project exists
        const { data: projectData, error: projectError } = await projectsService.fetchProjectById(supabase, projectId);

        if (projectError || !projectData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Project not found'
            });
        }

        const { error } = await projectsService.deleteProject(supabase, projectId);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'DELETED',
            message: `Project ${projectId} has been deleted.`
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
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