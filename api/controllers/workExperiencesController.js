import httpStatus from 'http-status-codes';
import workExperiencesService from '../services/workExperiencesService.js';
import alumniService from '../services/alumniProfilesService.js';

import { isValidUUID, isValidDate } from '../utils/validators.js';
import { Actions, Subjects } from '../../common/scopes.js';

const getWorkExperiences = async (req, res) => {
    if (req.you.cannot(Actions.READ, Subjects.WORK_EXPERIENCES)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You are not allowed to access this resource',
        });
    }

    try {
        const filters = req.query;
        const { data, error } = await workExperiencesService.fetchWorkExperiences(req.supabase, filters);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            list: data || [],
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message,
        });
    }
};

const getWorkExperienceById = async (req, res) => {
    if (req.you.cannot(Actions.READ, Subjects.WORK_EXPERIENCES)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You are not allowed to access this resource',
        });
    }

    try {
        const { workExperienceId } = req.params;

        if (!isValidUUID(workExperienceId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid work experience ID',
            });
        }

        const { data, error } = await workExperiencesService.fetchWorkExperienceById(req.supabase, workExperienceId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Work experience not found',
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            work_experience: data,
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message,
        });
    }
};

const getWorkExperiencesByUserId = async (req, res) => {
    if (req.you.cannot(Actions.READ, Subjects.WORK_EXPERIENCES)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You are not allowed to access this resource',
        });
    }

    try {
        const { userId } = req.params;

        if (!isValidUUID(userId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid alum ID',
            });
        }

        const { data, error } = await workExperiencesService.fetchWorkExperiencesByAlumId(req.supabase, userId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Work experience/s not found',
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            work_experiences: data,
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message,
        });
    }
};

const createWorkExperience = async (req, res) => {
    if (req.you.cannot(Actions.CREATE, Subjects.WORK_EXPERIENCES)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You are not allowed to access this resource',
        });
    }

    try {
        const userId = req.body['user_id'];
        if (!isValidUUID(userId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid alum ID format',
            });
        }

        // check if userId exists in alumni_profiles table
        const { data: alumData, error: alumError } = await alumniService.fetchAlumniProfileById(req.supabase, userId);
        
        if (alumError || !alumData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Alumni profile not found',
            });
        }

        const { workExperienceId } = req.params;

        if (workExperienceId != undefined) {
            // check if the work experience already exists in the database
            if (!isValidUUID(workExperienceId)) {
                const { data: workExperienceData, error: workExperienceError } = await workExperiencesService.fetchWorkExperienceById(req.supabase, workExperienceId);
                if (workExperienceData) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        status: 'FAILED',
                        message: 'Work experience already exists',
                    }); 
                }
            }
        }

        const requiredFields = [
            'user_id',
            'title',
            'field',
            'company',
            'year_started'
        ];

        const optionalFields = [
            'year_ended',
            'salary'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) { 
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(', ')}`,
            });
        };

        for (const field of optionalFields) {
            if (!req.body[field]) {
                req.body[field] = null;
            };
        };

        const {
            user_id,
            title,
            field,
            company,
            year_started,
            year_ended,
            salary
        } = req.body;

        if ((year_started && !isValidDate(year_started)) ||
            (year_ended && !isValidDate(year_ended)) ||
            typeof salary !== 'number' || typeof title !== 'string' ||
            typeof field !== 'string' || typeof company !== 'string') 
        {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid field value/s',
            });
        }

        if (year_ended !== null && year_ended < year_started) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Year ended cannot be less than year started',
            });
        }
        
        const { data, error } = await workExperiencesService.insertWorkExperience(req.supabase, {
            user_id,
            title,
            field,
            company,
            year_started,
            year_ended,
            salary
        });

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }
        
        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Work experience created successfully',
            id: data[0].id,
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error,
        });

    };
};

const updateWorkExperience = async (req, res) => {
    if (req.you.cannot(Actions.MANAGE, Subjects.WORK_EXPERIENCES)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You are not allowed to access this resource',
        });
    }

    try {
        const { workExperienceId } = req.params;

        if (!isValidUUID(workExperienceId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid work experience ID format',
            });
        }

        const { data: existingWorkExperience, error: workExperienceError } = await workExperiencesService.fetchWorkExperienceById(req.supabase, workExperienceId);
        
        if (workExperienceError || !existingWorkExperience) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Work experience not found',
            });
        }
        
        const {
            user_id,
            title, 
            field,
            company, 
            year_started, 
            year_ended ,
            salary
        } = req.body;

        const updateData = {
            user_id,
            title,
            field, 
            company,
            year_started,
            year_ended,
            salary
        };
        
        // Remove undefined values from updateData
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const allowedFields = ['title', 'field', 'company', 'year_started', 'year_ended', 'salary'];

        allowedFields.forEach(field => {
            if (!(field in req.body)) {
                return
            };

            const value = req.body[field];

            if ((field === 'year_started' || field === 'year_ended') && !isValidDate(value) ||
                (field === 'salary' && typeof value !== 'number') ||
                (field === 'title' && typeof value !== 'string') ||
                (field === 'field' && typeof value !== 'string') ||
                (field === 'company' && typeof value !== 'string'))
            {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Invalid ${field} value`,
                });
            };
            
            if (field === 'year_ended' && value !== null && value < year_started) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Year ended cannot be less than year started',
                });
            };
        });

        const restrictedFields = ['user_id', 'created_at', 'updated_at'];

        restrictedFields.forEach(field => {
            if (field in req.body) {
                return res.status(httpStatus.FORBIDDEN).json({
                    status: 'FORBIDDEN',
                    message: `You are not allowed to edit the ${field} field`,
                });
            };
        });

        const { error: updateError } = await workExperiencesService.updateWorkExperience(req.supabase, workExperienceId, updateData);

        if (updateError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: updateError.message,
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Work experience updated successfully',
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || 'An error occurred while updating the work experience',
        });
    }
};

const deleteWorkExperience = async (req, res) => {
    if (req.you.cannot(Actions.MANAGE, Subjects.WORK_EXPERIENCES)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You are not allowed to access this resource',
        });
    }

    try {
        const { workExperienceId } = req.params;

        if (!workExperienceId) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Work experience ID is required',
            });
        }

        if (!isValidUUID(workExperienceId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid work experience ID format',
            });
        }

        const { data: existingWorkExperience, error: workExperienceError } = await workExperiencesService.fetchWorkExperienceById(req.supabase, workExperienceId);
        
        if (workExperienceError || !existingWorkExperience) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Work experience not found',
            });
        }

        const { error } = await workExperiencesService.deleteWorkExperience(req.supabase, workExperienceId);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message,
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'DELETED',
            message: `Work experience ${workExperienceId} has been deleted successfully`,
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || 'An error occurred while deleting the work experience',
        });
    }
}

const workExperiencesController = {
    getWorkExperiences,
    getWorkExperienceById,
    getWorkExperiencesByUserId,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
};

export default workExperiencesController;