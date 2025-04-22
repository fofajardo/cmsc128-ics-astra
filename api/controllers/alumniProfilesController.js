import httpStatus from "http-status-codes";
import usersService from "../services/usersService.js";
import alumniProfilesService from "../services/alumniProfilesService.js";
import { isValidUUID } from "../utils/validators.js";

const getAlumniProfiles = (supabase) => async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { data, error } = await alumniProfilesService.fetchAlumniProfiles(supabase, page, limit);

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

const getAlumniProfileById = (supabase) => async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await alumniProfilesService.fetchAlumniProfileById(supabase, userId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "Alumni profile not found"
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

const createAlumniProfile = (supabase) => async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!isValidUUID(userId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid userId format'
            });
        }

        const { data: userData, error: userError } = await usersService.fetchUserById(supabase, userId);

        if (userError || !userData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'User not found'
            });
        }

        // Check if alumni profile already exists (GET /v1/alumni/:userId)
        const { data: alumniData, error: alumniError } = await alumniProfilesService.fetchAlumniProfileById(supabase, userId);

        if (alumniData) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Alumni profile already exists for this user'
            });
        }

        // Check required fields
        const requiredFields = [
            "alum_id",
            "birthdate",
            "location",
            "address",
            "gender",
            "student_num",
            // "degree_program",
            "year_graduated",
            "skills",
            "honorifics",
            "citizenship",
            "sex",
            "primary_work_experience_id",
            "civil_status"
        ];

        const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        // Insert data to supabase
        const {
            alum_id,
            birthdate,
            location,
            address,
            gender,
            student_num,
            // degree_program,
            year_graduated,
            skills,
            honorifics,
            citizenship,
            sex,
            primary_work_experience_id,
            civil_status
        } = req.body;

        const { data, error } = await alumniProfilesService.insertAlumniProfile(supabase, {
            alum_id,
            birthdate,
            location,
            address,
            gender,
            student_num,
            // degree_program,
            year_graduated,
            skills,
            honorifics,
            citizenship,
            sex,
            primary_work_experience_id,
            civil_status
        });

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Alumni profile successfully created',
            id: userId
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const updateAlumniProfile = (supabase) => async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!isValidUUID(userId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid userId format'
            });
        }

        // Check if user exists
        const { data: userData, error: userError } = await usersService.fetchUserById(supabase, userId);

        if (userError || !userData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'User not found'
            });
        }

        // Check if alumni profile exists
        const { data: alumniData, error: alumniError } = await alumniProfilesService.fetchAlumniProfileById(supabase, userId);

        if (alumniError || !alumniData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Alumni profile not found'
            });
        }

        // Disallow edits to birthdate and student_num
        if (
            ('birthdate' in req.body && req.body.birthdate !== alumniData.birthdate) ||
            ('student_num' in req.body && req.body.student_num !== alumniData.student_num)
        ) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'Editing birthdate or student_num is not allowed'
            });
        }

        // Update only allowed fields
        const {
            location,
            address,
            gender,
            // degree_program,
            year_graduated,
            skills,
            field,
            job_title,
            company,
            citizenship,
            honorifics,
            civil_status
        } = req.body;

        const updateData = {
            location,
            address,
            gender,
            // degree_program,
            year_graduated,
            skills,
            field,
            job_title,
            company,
            citizenship,
            honorifics,
            civil_status
        };

        // Remove undefined fields to avoid overwriting with nulls
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const { data, error } = await alumniProfilesService.updateAlumniProfileData(supabase, userId, updateData)

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Alumni profile successfully updated',
            id: userId
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const alumniProfilesController = {
    getAlumniProfiles,
    getAlumniProfileById,
    createAlumniProfile,
    updateAlumniProfile
};

export default alumniProfilesController;