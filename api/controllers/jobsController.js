import httpStatus from "http-status-codes";
import jobsService from "../services/jobsService.js";
import contentsService from "../services/contentsService.js";
import { isValidUUID } from "../utils/validators.js";
import { validateField } from "../utils/validators.js";
import { v4 as uuvidv4 } from "uuid";

const getJobs = async (req, res) => {
  try {
    const filters = req.query;

    const { data, error } = await jobsService.fetchJobs(req.supabase, filters);

    if (error) {
      console.log(error);
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
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getJobById  = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { data, error } = await jobsService.fetchJobById(req.supabase, jobId);

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

const createJob = async (req, res) => {
  try {
    const allowedFields = [
      "job_title",
      "hiring_manager",
      "company_name",
      "salary",
      "apply_link",
      "location",
      "location_type",
      "employment_type",
      "created_at",
      "expires_at",
      "details",
      "views",
      "tags",
      "requirements",
      "user_id",
    ];

    const providedFields = Object.keys(req.body);
    const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field));
    if (unexpectedFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Unexpected fields: ${unexpectedFields.join(", ")}`
      });
    }

    const requiredFields = [
      "job_title",
      "company_name",
      "salary",
      "apply_link",
      "location",
      "location_type",
      "expires_at",
      "details" ,
      "requirements",
      "user_id"
    ];
    const missingFields = requiredFields.filter(field => req.body[field] == null);
    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      job_title,
      hiring_manager = req.body.company_name,
      company_name,
      salary,
      apply_link,
      location,
      location_type,
      employment_type = 1,
      created_at = new Date().toISOString(),
      expires_at,
      details,
      views = 0,
      tags = [],
      requirements,
      user_id,
    } = req.body;

    if (isNaN(Number(salary)) || Number(salary) < 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Salary must be a non-negative number"
      });
    }

    // 1. Check if job already exists
    const { data: existingJobs, error: checkError } = await jobsService.checkExistingJob(
      req.supabase, job_title, company_name, location
    );
    if (checkError) {
      console.error("Check Existing Job Error:", checkError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: checkError.message
      });
    }
    if (existingJobs?.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Job already exists"
      });
    }

    // 2. Insert into contents table first
    const content_id = uuvidv4();

    if (!user_id) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: "FAILED",
        message: "Unauthorized: missing user ID"
      });
    }

    const { data: contentData, error: contentError } = await contentsService.insertContent(req.supabase, {
      id: content_id,
      user_id: user_id,
      title: job_title,
      details: details,
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
    }

    // 3. Insert into jobs table
    const { data: jobData, error: jobError } = await jobsService.insertJob(req.supabase, {
      job_id: content_id,
      job_title,
      hiring_manager,
      company_name,
      salary,
      apply_link,
      location,
      location_type,
      employment_type,
      requirements,
      created_at,
      expires_at,
    });

    if (jobError) {
      console.error("Insert Job Error:", jobError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: jobError.message,
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Job and Content successfully created",
      data: { content_id, job_title, company_name, location, expires_at },
    });

  } catch (error) {
    console.error("Unexpected error creating job:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An unexpected error occurred while creating the job"
    });
  }
};




const updateJob =  async (req, res) => {
  const jobId = req.params.jobId;
  try {

    // Validate job format
    if (!isValidUUID(jobId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid jobId format",
      });
    }

    // Fetch existing job
    const { data: existingJob, error: fetchError } = await jobsService.fetchJobById(req.supabase, jobId);

    if (fetchError || !existingJob) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Job not found"
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
      validateField(job_title, "Job title"),
      validateField(hiring_manager, "Hiring manager"),
      validateField(company_name, "Company name"),
      validateField(salary, "Salary"),
      validateField(apply_link, "Apply link"),
      validateField(location, "Location"),
      validateField(location_type, "Location type"),
      validateField(employment_type, "Employment type"),
    ].filter(Boolean);

    // Check if there are validation errors
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: validationErrors.join(", "),
      });
    }

    // Additional salary validation
    if (salary !== undefined && (isNaN(Number(salary)) || Number(salary) < 0)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Salary must be a non-negative number",
      });
    }

    // Prevent modification of created_at
    if ("created_at" in req.body) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "Cannot update created_at field"
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
        status: "FAILED",
        message: "No valid fields to update"
      });
    }

    const { error: updateError } = await jobsService.updateJobData(req.supabase, jobId, updateData);

    if (updateError) {
      console.error("Error updating job:", updateError, { jobId, updateData });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: updateError.message
      });
    }

    // Return successful update response
    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Job updated successfully",
      data: updateData,
    });

  } catch (error) {
    console.error("Unexpected error updating job:", error, { jobId, requestBody: req.body });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the job"
    });
  }
};


const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate jobId format
    if (!isValidUUID(jobId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid jobId format",
      });
    }

    // Check if job exists
    const { data, error: findError } = await jobsService.fetchJobById(req.supabase, jobId);
    if (findError || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Job not found",
      });
    }

    // 1. Delete from jobs table
    const { error: deleteJobError } = await jobsService.deleteJobData(req.supabase, jobId);
    if (deleteJobError) {
      console.error(`Error deleting job with ID ${jobId}:`, deleteJobError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: deleteJobError.message,
      });
    }

    // 2. Delete from contents table
    const { error: deleteContentError } = await contentsService.deleteContentData(req.supabase, jobId);
    if (deleteContentError) {
      console.error(`Error deleting content with ID ${jobId}:`, deleteContentError);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: deleteContentError.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Job and content with ID ${jobId} have been successfully deleted.`,
    });

  } catch (error) {
    console.error("Unexpected error during job deletion:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while deleting the job",
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