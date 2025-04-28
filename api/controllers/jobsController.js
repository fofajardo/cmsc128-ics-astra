import httpStatus from "http-status-codes"; 
import jobsService from "../services/jobsService.js";
import { isValidUUID } from "../utils/validators.js";
import { validateField } from "../utils/validators.js";

const getJobs = (supabase) => async (req, res) => {
    try {
        const filters = req.query;

        const { data, error } = await jobsService.fetchJobs(supabase, filters);

        if (error) {
            console.log(error)
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
        console.log(error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message
        });
    }
};

const getJobById = (supabase) => async (req, res) => {
    try {
        const { jobId } = req.params;

        const { data, error } = await jobsService.fetchJobById(supabase, jobId);

        if (error || !data) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "Job not found"
            });
        }

        return res.status(httpStatus.OK).json({
            status: "OK",
            content: data
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message
        });
    }
};

const createJob = (supabase) => async (req, res) => {
    try {
        const allowedFields = [
            "job_id", 
            "job_title", 
            "hiring_manager", 
            "company_name", 
            "salary", 
            "apply_link", 
            "location", 
            "location_type", 
            "employment_type", 
            "created_at", 
            "expires_at"
        ];
        const providedFields = Object.keys(req.body);

        // Check for unexpected fields
        const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));
        if (unexpectedFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: `Unexpected fields: ${unexpectedFields.join(", ")}`
            });
        }

        const requiredFields = [
            "job_id", 
            "job_title", 
            "hiring_manager", 
            "company_name", 
            "salary", 
            "apply_link", 
            "location", 
            "location_type", 
            "employment_type", 
            "created_at", 
            "expires_at"
        ];

        // Check for missing required fields
        const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);
        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const {
            job_id,
            job_title,
            hiring_manager,
            company_name,
            salary,
            apply_link,
            location,
            location_type,
            employment_type,
            created_at = new Date().toISOString(),  // Default to current date if not provided
            expires_at
        } = req.body;

        // Salary validation: Ensure salary is a valid number and non-negative
        if (salary !== undefined && (isNaN(Number(salary)) || Number(salary) < 0)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Salary must be a non-negative number'
            });
        }

        // Check if the job already exists in the database
        const { data: existingJobs, error: checkError } = await jobsService.checkExistingJob(supabase, job_title, company_name, location);
        if (checkError) {
            console.error('Create Content Error:', checkError);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: checkError.message
            });
        }

        if (existingJobs?.length > 0) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Job already exists'
            });
        }

        // Insert new job into the database
        const { data, error } = await jobsService.insertJob(supabase, {
            job_id,
            job_title,
            hiring_manager,
            company_name,
            salary,
            apply_link,
            location,
            location_type,
            employment_type,
            created_at,
            expires_at
        });

        if (error) {
            console.error('Create Job Error:', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message,
            });
        }

        // Return successful creation response with job data
        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Job successfully created',
            data: { job_id, job_title, company_name, location, expires_at },  // Optionally include created data
        });

    } catch (error) {
        console.error('Unexpected error creating job:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || 'An error occurred while creating the job'
        });
    }
};


const updateJob = (supabase) => async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Validate job format
        if (!isValidUUID(jobId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: "Invalid jobId format",
            });
        }

        // Fetch existing job
        const { data: existingJob, error: fetchError } = await jobsService.fetchJobById(supabase, jobId);

        if (fetchError || !existingJob) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Job not found'
            });
        }

        const {
            job_title,
            hiring_manager,
            company_name,
            salary,
            apply_link,
            location,
            location_type,
            employment_type,
            expires_at
        } = req.body;

        // Validate fields
        const validationErrors = [
            validateField(job_title, 'Job title'),
            validateField(hiring_manager, 'Hiring manager'),
            validateField(company_name, 'Company name'),
            validateField(salary, 'Salary'),
            validateField(apply_link, 'Apply link'),
            validateField(location, 'Location'),
            validateField(location_type, 'Location type'),
            validateField(employment_type, 'Employment type'),
        ].filter(Boolean);

        // Check if there are validation errors
        if (validationErrors.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: validationErrors.join(', '),
            });
        }

        // Additional salary validation
        if (salary !== undefined && (isNaN(Number(salary)) || Number(salary) < 0)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Salary must be a non-negative number',
            });
        }

        // Prevent modification of created_at
        if (req.body.hasOwnProperty('created_at')) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'Cannot update created_at field'
            });
        }

        // Prepare update data
        const allowedUpdates = ["job_title", "hiring_manager", "company_name", "salary", "apply_link", "location", "location_type", "employment_type", "expires_at"];
        const updateData = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'No valid fields to update'
            });
        }

        const { error: updateError } = await jobsService.updateJobData(supabase, jobId, updateData);

        if (updateError) {
            console.error('Error updating job:', updateError, { jobId, updateData });
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: updateError.message
            });
        }

        // Return successful update response
        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Job updated successfully',
            data: updateData,  
        });

    } catch (error) {
        console.error('Unexpected error updating job:', error, { jobId, requestBody: req.body });
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || 'An error occurred while updating the job'
        });
    }
};


const deleteJob = (supabase) => async (req, res) => {
    try {
        const { jobId } = req.params;

        // Validate jobId format
        if (!isValidUUID(jobId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: "FAILED",
                message: "Invalid jobId format",
            });
        }

        const { data, error: findError } = await jobsService.fetchJobById(supabase, jobId);

        if (findError || !data) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: "FAILED", 
                message: "Job not found" 
            });
        }


        const { error: deleteError } = await jobsService.deleteJobData(supabase, jobId);

        if (deleteError) {
            console.error(`Error deleting job with ID ${jobId}:`, deleteError);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
                status: "FAILED", 
                message: deleteError.message 
            });
        }

        return res.status(httpStatus.OK).json({
            status: "DELETED",
            message: `Job with ID ${jobId} has been successfully deleted.`,
            data: { jobId },  // Optionally return jobId for clarity
        });
    } catch (error) {
        console.error('Unexpected error during job deletion:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
            status: "FAILED", 
            message: error.message || "An error occurred while deleting the job" 
        });
    }
};

const jobsController = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
};

export default jobsController;