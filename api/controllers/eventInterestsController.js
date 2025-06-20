import httpStatus from "http-status-codes";
import eventInterestsService from "../services/eventInterestsService.js";
import { isValidUUID } from "../utils/validators.js";
import { Actions, Subjects } from "../../common/scopes.js";

// const userId = "38f98c8d-af8d-4cef-ab9b-8a5d80e9c8b1"; //Only using this since userid is needed

const getEventInterests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user.data.id;
    //const currentUserId = userId;
    console.log("current userId: ",currentUserId);

    if (req.you.cannotAs(Actions.MANAGE, Subjects.EVENT_INTEREST,{alum_id:currentUserId})) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to view event interests"
      });
    }
    const { data, error } = await eventInterestsService.fetchEventInterests(req.supabase, page, limit);

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

const getEventInterestByAlumnId = async (req, res) => {
  try {
    const { alumnId } = req.params;
    const currentUserId = req.user?.data?.id;
    //const currentUserId = userId;


    console.log("current userId: ",currentUserId);

    const { data, error } = await eventInterestsService.fetchEventInterestByAlumnId(req.supabase, alumnId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Event interests not found"
      });
    }


    if (req.you.cannotAs(Actions.MANAGE, Subjects.EVENT_INTEREST, {alum_id:currentUserId})) {
      console.log("dont have permission");
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to view event interests"
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || []
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getEventInterestByContentId = async (req, res) => {
  try {
    const { contentId } = req.params;
    //const currentUserId = req.user?.data?.id;
    ///  const currentUserId = userId;

    //    console.log("current userId: ",currentUserId);

    if (req.you.cannotAs(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to view event interests"
      });
    }
    const { data, error } = await eventInterestsService.fetchEventInterestByContentId(req.supabase, contentId);

    if (error && error.code !== "RESOURCE_NOT_FOUND") {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      message: "Successfully fetched the user interested",
      list: data || []
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getEventInterestStats = async(req,res)=>{
  try {
    const { contentId } = req.params;

    //const currentUserId = req.user?.data?.id;
    //const currentUserId = userId;

    if (!isValidUUID(contentId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Invalid eventId format.${contentId}, ${req?.params}`
      });
    }

    if (req.you.cannotAs(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
      console.log("dont have permission");
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to view event interests"
      });
    }

    const { data, error } = await eventInterestsService.fetchEventInterestStat(req.supabase, contentId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }
    return res.status(httpStatus.OK).json({
      status: "OK",
      message: "Successfully fetched the user interested",
      list: data[0] || []
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: `${error.message}, at catch`
    });
  }
};

const createEventInterest = async (req, res) => {
  try {
    const currentUserId = req.body.user_id;
    //const currentUserId = userId;

    console.log("current userId: ",currentUserId);
    if (req.you.cannotAs(Actions.MANAGE, Subjects.EVENT_INTEREST, {alum_id:currentUserId})) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to create event interests"
      });
    }
    const requiredFields = [
      "user_id",
      "content_id",
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      user_id,
      content_id
    } = req.body;

    if (!isValidUUID(user_id)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid alumnId format."
      });
    }

    if (!isValidUUID(content_id)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid contentId format."
      });
    }

    const { data: existingEvents, error: checkError } = await eventInterestsService.checkExistingEventInterest(req.supabase, user_id, content_id);

    if (checkError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: `error after checking existing Event Interst: ${checkError}`
      });
    }

    if (existingEvents.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Event interest already exists"
      });
    }

    const { data, error } = await eventInterestsService.insertEventInterest(req.supabase, {
      user_id,
      content_id
    });

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Event successfully created",
      data: data[0]
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: `at catch ${error.message}`
    });
  }
};

const deleteEmptyEventInterest = async (req, res) => {
  if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You do not have permission to delete event interests"
    });
  }

  return res.status(httpStatus.BAD_REQUEST).json({
    status: "FAILED",
    message: "Invalid deletion. AlumId and contentId parameters are missing"
  });
};

const deleteEventInterest = async (req, res) => {
  try {
    const {alumId, contentId} = req.params;

    if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to delete event interests"
      });
    }

    if (!isValidUUID(alumId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid alumnId format"
      });
    }
    if (!isValidUUID(contentId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid contentId format"
      });
    }

    const { data: existingEventInterest, error: checkError } = await eventInterestsService.checkExistingEventInterest(req.supabase, alumId, contentId);

    if (checkError || existingEventInterest.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Event interest not found"
      });
    }

    const { error } = await eventInterestsService.deleteEventInterest(req.supabase, alumId, contentId);

    if (error) {
      console.log("unable to delete");
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Event interest for alumnus ${alumId} and content ${contentId} has been successfully deleted.`
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const eventInterestsController = {
  getEventInterests,
  getEventInterestByAlumnId,
  getEventInterestByContentId,
  getEventInterestStats,
  createEventInterest,
  deleteEmptyEventInterest,
  deleteEventInterest
};

export default eventInterestsController;