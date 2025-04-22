import httpStatus from 'http-status-codes';
import workExperiencesService from '../services/workExperiencesService.js';

const getWorkExperiences = (supabase) => async (req, res) => {
    try {
        const filters = req.query;
        const { data, error } = await workExperiencesService.fetchWorkExperiences(supabase, filters);

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

const getWorkExperienceById = (supabase) => async (req, res) => {
    try {
        const { workExperienceId } = req.params;

        const { data, error } = await workExperiencesService.fetchWorkExperienceById(supabase, workExperienceId);

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

const getWorkExperiencesByAlumId = (supabase) => async (req, res) => {
    try {
        const { alumId } = req.params;
        const { data, error } = await workExperiencesService.fetchWorkExperiencesByAlumId(supabase, alumId);

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

const createWorkExperience = (supabase) => async (req, res) => {
    try {
        const requiredFields = [
            'alum_id',
            'title',
            'field',
            'company',
            'year_started',
        ];

        const optionalFields = [
            'year_ended'
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

        if (req.body.year_ended !== null && req.body.year_ended < req.body.year_started) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Year ended cannot be less than year started',
            });
        };

        const {
            alum_id,
            title,
            field,
            company,
            year_started,
            year_ended
        } = req.body;

        const { data, error } = await workExperiencesService.insertWorkExperience(supabase, {
            alum_id,
            title,
            field,
            company,
            year_started,
            year_ended
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

const updateWorkExperience = (supabase) => async (req, res) => {
    try {
        const { workExperienceId } = req.params;

        const { data: existingWorkExperience, error: fetchError } = await workExperiencesService.fetchWorkExperienceById(supabase, workExperienceId);
        
        if (fetchError || !existingWorkExperience) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Work experience not found',
            });
        }
        
        const {
            alum_id, 
            title, 
            field,
            company, 
            year_started, 
            year_ended 
        } = req.body;

        const hasRestrictedFieldChanges = 
            alum_id !== undefined;

        if (hasRestrictedFieldChanges) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'Cannot update alum_id',
            });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (field !== undefined) updateData.field = field;
        if (company !== undefined) updateData.company = company;
        if (year_started !== undefined) updateData.year_started = year_started;
        if (year_ended !== undefined) updateData.year_ended = year_ended;

        if (year_ended !== null && year_ended < year_started) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Year ended cannot be less than year started',
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'No fields to update',
            });
        }

        const { error: updateError } = await workExperiencesService.updateWorkExperience(supabase, workExperienceId, updateData);

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


const deleteWorkExperience = (supabase) => async (req, res) => {
    try {
        const { workExperienceId } = req.params;

        const { data: existingWorkExperience, error: fetchError } = await workExperiencesService.fetchWorkExperienceById(supabase, workExperienceId);
        
        if (fetchError || !existingWorkExperience) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Work experience not found',
            });
        }

        const { error } = await workExperiencesService.deleteWorkExperience(supabase, workExperienceId);

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
    getWorkExperiencesByAlumId,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
};

export default workExperiencesController;