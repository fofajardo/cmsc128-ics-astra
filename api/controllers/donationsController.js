import httpStatus from "http-status-codes";
import donationsService from "../services/donationsService.js";
import { isValidUUID, isValidDate } from "../utils/validators.js";
import {Actions, Subjects} from "../../common/scopes.js";
import alumniService from "../services/alumniProfilesService.js";
import usersService from "../services/usersService.js";
import projectsService from "../services/projectsService.js";
import contentsService from "../services/contentsService.js";

const getDonations = async (req, res) => {
  if (req.you.cannot(Actions.READ, Subjects.DONATION)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    const { requester_id = null, ...filters } = req.query;

    let isAdmin = false;

    if (requester_id) {
      const { data: requesterData, requesterError } = await usersService.fetchUserById(req.supabase, requester_id);

      if (requesterError || !requesterData) {
        // console.log(requesterError.message);
        isAdmin = false;
      } else {
        if (requesterData.role === "admin") isAdmin = true;
        console.log("Admin perms");
      }
    }

    const completeFilters = {
      ...filters,
      page: -1, // Get all donations
    };
    const { data, error } = await donationsService.fetchDonations(req.supabase, completeFilters);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    const projectIds = data.map(donation => donation.project_id);
    const { data: contentData, error: contentError } = await contentsService.fetchContentByFilter(req.supabase, { id: projectIds, page: -1 });

    const userIds = data.map(donation => donation.user_id);
    const { data: alumniData, error: alumniError } = await alumniService.fetchAlumniProfilesByFilter(req.supabase, { alum_id: userIds, page: -1 });

    const { data: userData, error: userError } = await usersService.fetchUsersByFilter(req.supabase, { id: userIds, page: -1 });

    const donationsWithDonors = data.map(donation => {
      const alum = alumniData.find(a => a.alum_id === donation.user_id);
      const user = userData.find(u => u.id === donation.user_id);
      const content = contentData.find(c => c.id === donation.project_id);

      let full_name;
      if (user.role === "moderator") {    // TODO: Clarify if moderator/admin users will have profiles (and names)
        full_name = "Moderator";
      } else if (user.role === "admin") {
        full_name = "Admin";
      } else if (!alum) {
        full_name = "Deleted user";
      } else {
        full_name = [alum.first_name, alum.last_name]
          .filter(Boolean) // remove undefined/null/empty values
          .join(" ");
      };

      return {
        ...donation,
        project_title: content ? content.title : "Deleted Project",
        donor: donation.is_anonymous ? (isAdmin ? full_name : "Anonymous") : full_name,
      };
    });

    return res.status(httpStatus.OK).json({
      status: "OK",
      donations: donationsWithDonors || [],
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;

    if (!isValidUUID(donationId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid donationId format"
      });
    }

    const { data, error } = await donationsService.fetchDonationById(req.supabase, donationId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Donation not found"
      });
    }

    if (req.you.cannotAs(Actions.READ, Subjects.DONATION, data)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      donation: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getDonationsSummary = async (req, res) => {
  try {
    const { data, error } = await donationsService.fetchDonationsSummary(req.supabase);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Donation summary not found",
      });
    }

    if (req.you.cannotAs(Actions.READ, Subjects.DONATION, data)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      summary: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const createDonation = async (req, res) => {
  if (req.you.cannot(Actions.CREATE, Subjects.DONATION)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You are not allowed to access this resource."
    });
  }

  try {
    // Validate request body format and required fields
    const requiredFields = [
      "user_id",
      "project_id",
      "donation_date",
      "reference_num",
      "mode_of_payment",
      "amount",
      "is_anonymous"
    ];

    const missingFields = requiredFields.filter(field =>
      req.body[field] === undefined ||
            req.body[field] === null ||
            (typeof req.body[field] === "string" && req.body[field].trim() === "")
    );

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`,
        id: null
      });
    }

    const {
      user_id,
      project_id,
      donation_date,
      reference_num,
      mode_of_payment,
      amount,
      comment = null,
      is_anonymous = true
    } = req.body;

    const userId = user_id;
    const projectId = project_id;
    const donationDate = donation_date;
    const referenceNum = reference_num;
    const modeOfPayment = mode_of_payment;
    const isAnonymous = is_anonymous;

    // Validate data types
    if (!isValidUUID(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid userId format",
        id: null
      });
    }

    if (!isValidUUID(projectId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid projectId format",
        id: null
      });
    }

    if ((typeof modeOfPayment !== "number" || ![0, 1].includes(modeOfPayment)) ||
            !isValidDate(donationDate) ||
            typeof amount !== "number" ||
            typeof referenceNum !== "string" ||
            (comment !== null && typeof comment !== "string") ||
            typeof isAnonymous !== "boolean"
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid field values",
        id: null
      });
    }

    // Check if userId and projectId exists
    const { data: userData, error: userError } = await usersService.fetchUserById(req.supabase, userId);

    if (userError || !userData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: userError.message,
      });
    }

    const { data: projectData, error: projectError } = await projectsService.fetchProjectById(req.supabase, projectId);

    if (projectError || !projectData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: projectError.message,
      });
    }

    const { data, error } = await donationsService.insertDonation(req.supabase, {
      user_id: userId,
      project_id: projectId,
      donation_date: donationDate,
      reference_num: referenceNum,
      mode_of_payment: modeOfPayment,
      amount: amount,
      comment,
      is_anonymous: isAnonymous
    });

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Donation successfully created",
      id: data["id"]
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const updateDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const projectId = req.body.project_id;
    const userId = req.body.user_id;

    // Check if donationId exists in the request params
    if (!donationId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Missing donationId in params",
      });
    }

    // Validate if donationId is a valid UUID
    if (!isValidUUID(donationId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid donationId format",
      });
    }

    if (projectId && !isValidUUID(projectId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid projectId format",
      });
    }

    if (userId && !isValidUUID(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid userId format",
      });
    }

    // Check if the donation exists in the database
    const { data: donationData, error: fetchError } = await req.supabase
      .from("donations")
      .select()
      .eq("id", donationId)
      .single();

    // If donation does not exist, return NOT_FOUND
    if (fetchError || !donationData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Donation not found",
      });
    }

    if (req.you.cannotAs(Actions.MANAGE, Subjects.DONATION, donationData)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    // Check if the user exists in the database
    if (userId) {
      const { data: existingAlum, error: alumFetchError } = await req.supabase
        .from("alumni_profiles")
        .select()
        .eq("alum_id", userId)
        .single();

      // If user does not exist, return NOT_FOUND
      if (alumFetchError || !existingAlum) {
        return res.status(httpStatus.NOT_FOUND).json({
          status: "FAILED",
          message: "User not found",
        });
      }
    }

    // Check if the project exists in the database
    if (projectId) {
      const { data: existingProject, error: projectFetchError } = await req.supabase
        .from("projects")
        .select()
        .eq("project_id", projectId)
        .single();

      // If project does not exist, return NOT_FOUND
      if (projectFetchError || !existingProject) {
        return res.status(httpStatus.NOT_FOUND).json({
          status: "FAILED",
          message: "Project not found",
        });
      }
    }

    // Disallow edits to user_id and project_id
    if (
      ("user_id" in req.body && req.body.user_id !== donationData.user_id) ||
            ("project_id" in req.body && req.body.project_id !== donationData.project_id)
    ) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "Editing of user_id or project_id is not allowed"
      });
    }

    // Update only allowed fields
    const {
      user_id,
      project_id,
      donation_date,
      reference_num,
      mode_of_payment,
      amount,
      comment,
      is_anonymous,
      is_verified,
      verified_by_user_id
    } = req.body;

    const updateData = {
      // user_id,
      // project_id,
      donation_date,
      reference_num,
      mode_of_payment,
      amount,
      comment,
      is_anonymous,
      is_verified,
      verified_by_user_id,
      updated_at: new Date().toISOString()
    };

    // Remove undefined fields to avoid overwriting with nulls
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Validate request body
    const allowedFields = ["user_id", "project_id", "donation_date", "reference_num", "mode_of_payment", "amount", "comment", "is_anonymous", "is_verified", "verified_by_user_id"];

    allowedFields.forEach(field => {
      if (!(field in req.body)) {
        return;
      }; // skip if field is not present

      const value = req.body[field];

      if ((field === "mode_of_payment" && (typeof value !== "number" || ![0, 1].includes(value))) ||
                (field === "donation_date" && (value !== null && !isValidDate(value))) ||
                (field === "amount" && typeof value !== "number") ||
                (field === "reference_num" && typeof value !== "string") ||
                (field === "is_anonymous" && typeof value !== "boolean")
      ) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: "Invalid field values",
        });
      }
    });

    const { data, error } = await donationsService.updateDonationData(req.supabase, donationId, updateData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Donation successfully updated",
      id: donationId
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const { donationId } = req.params;

    if (!isValidUUID(donationId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid donationId format"
      });
    }

    // Check if donation exists
    const { data: donationData, error: donationError } = await donationsService.fetchDonationById(req.supabase, donationId);

    if (donationError || !donationData) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Donation not found"
      });
    }

    if (req.you.cannotAs(Actions.MANAGE, Subjects.DONATION, donationData)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You are not allowed to access this resource."
      });
    }

    const { verified_by_user_id } = req.body;

    // console.log(verified_by_user_id);

    const updateData = {
      is_verified: false,
      updated_at: new Date().toISOString(),
      verified_by_user_id,
      deleted_at: new Date().toISOString()
    };

    const { data, error } = await donationsService.updateDonationData(req.supabase, donationId, updateData);

    // const { error } = await donationsService.deleteDonation(req.supabase, donationId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Donation ${donationId} has been deleted.`
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const donationsController = {
  getDonations,
  getDonationById,
  getDonationsSummary,
  createDonation,
  updateDonation,
  deleteDonation
};

export default donationsController;