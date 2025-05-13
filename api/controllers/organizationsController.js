import httpStatus from "http-status-codes";
import organizationsService from "../services/organizationsService.js";

const getOrganizations = async (req, res) => {
  try {

    const {page, limit} = req.query;
    const {data, error} = await organizationsService.fetchOrganizations(req.supabase, page, limit);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    // console.log(data);

    return res.status(httpStatus.OK).json({
      status: "OK",
      organization: data,
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const { orgId } = req.params;
    //console.log(orgId);

    const { data, error } = await organizationsService.fetchOrganizationById(req.supabase, orgId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Organization not found"
      });
    }

    // console.log(data);

    return res.status(httpStatus.OK).json({
      status: "OK",
      organization: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getAlumni = async (req, res) => {
  try{
    const { orgId } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Call the fetchAlumni service
    const { data, error } = await organizationsService.fetchAlumni(req.supabase, orgId, page, limit);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Organization not found"
      });
    }

    //edit data mapping for what data can be sent
    return res.status(httpStatus.OK).json({
      status: "OK",
      alumni: data.map(item => ({
        name: `${item.users.first_name} ${item.users.last_name}`,  // Combine first and last name from users
        email: item.users.email,
        role: item.role, //metadata from organization_affiliations
        joined_date: item.joined_date,
        ...item.alumni_profiles  // Include selected fields from alumni_profiles
      }))
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const createOrganization = async (req, res) => {
  try {
    // Check required fields
    const requiredFields = [
      "name",
      "acronym",
      // "type",
      "founded_date"
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      name,
      acronym,
      type,
      founded_date
    } = req.body;

    // Check if organization exists by name and acronym
    const { data: existingOrgs, error: checkError } = await organizationsService.checkOrganizationIfExistingByNameAndAcronym(req.supabase, name, acronym);

    if (checkError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: checkError
      });
    }

    if (existingOrgs.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Organization already exists"
      });
    }

    const orgData = {
      name: name,
      acronym: acronym,
      type: parseInt(type) || 0, // Default to null if not provided
      founded_date: founded_date
    };

    // Insert new user
    const { data, error } = await organizationsService.insertOrganization(req.supabase, orgData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Organization successfully created",
      id: data[0].id
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;

    // Check if id exists (simplified for test compatibility)
    const { data: existingOrgs, error: fetchError } = await organizationsService.checkOrganizationIfExistingById(req.supabase, orgId);

    if (fetchError || !existingOrgs) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Organization not found"
      });
    }

    // Extract fields from request body
    const {
      name,
      acronym,
      type,
      founded_date,
    } = req.body;


    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (acronym) updateData.acronym = acronym;
    if (type) updateData.type = parseInt(type) || 0; // Default to null if not provided
    if (founded_date) updateData.founded_date = founded_date;


    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "No valid fields to update"
      });
    }


    // Always update the updatedAt field; no updateAt field in organizations table
    // updateData.updated_at = new Date().toISOString();

    // Update user in database
    const { error: updateError } = await organizationsService.updateOrganization(req.supabase, orgId, updateData);

    if (updateError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: updateError.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Organization profile updated successfully"
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the organization"
    });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;

    const { error } = await organizationsService.deleteOrganization(req.supabase, orgId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Organization with id: ${orgId} has been  deleted.`
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getOrganizationStatistics = async (req, res) => {
  try {
    const {data, error} = await organizationsService.fetchOrganizationStatistics(req.supabase);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    // console.log(data);

    return res.status(httpStatus.OK).json({
      status: "OK",
      statistics: data,
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const organizationsController = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getAlumni,
  getOrganizationStatistics
};

export default organizationsController;



