import httpStatus from "http-status-codes";
import eventsService from "../services/eventsService.js";
import { isValidUUID, isValidDate } from "../utils/validators.js";
import { Actions, Subjects } from "../../common/scopes.js";

const getEvents = async (req, res) => {
  try {
  //  console.log("User role:", req.user?.role);
    //console.log("Permissions check:", req.you.can(Actions.READ, Subjects.EVENT)); //Fix: alumnus permission results to false here
    const filters = req.query;

    if (req.you.cannot(Actions.READ, Subjects.EVENT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to view events"

      });
    }

    const { data, count, error } = await eventsService.fetchEvents(req.supabase, filters);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      list: data || [],
      total: count || 0

    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const getEventById = async (req, res) => {
  try {
    console.log("User role:", req.user?.role);
    console.log("Permissions check:", req.you.can(Actions.READ, Subjects.EVENT));
    if (req.you.cannot(Actions.READ, Subjects.EVENT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to view events"

      });
    }
    const { eventId } = req.params;

    const { data, error } = await eventsService.fetchEventById(req.supabase, eventId);

    if (error) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Event not found"
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      event: data
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};
const createEvent = async (req, res) => {
  try {
    if (req.you.cannot(Actions.MANAGE, Subjects.EVENT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to create events"
      });
    }
    const requiredFields = [
      "event_id",
      "event_date",
      "venue",
      "external_link",
      "access_link",
      "online"
    ];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const {
      event_id,
      event_date,
      venue,
      external_link,
      access_link,
      online
    } = req.body;

    const parsedDate = new Date(event_date);
    const datetime = parsedDate.toISOString();

    const isValidTypes =
            typeof event_id === "string" &&
            isValidDate(event_date) &&
            typeof venue === "string" &&
            typeof external_link === "string" &&
            typeof access_link === "string" &&
            typeof online === "boolean";

    if (!isValidTypes) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid data type for one or more fields."
      });
    }

    if (!isValidUUID(event_id)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid eventId format"
      });
    }
    const { data: existingEvents, error: checkError } = await eventsService.checkExistingEvent(req.supabase, datetime, venue);

    if (checkError && existingEvents.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Event date and venue already exists"
      });
    }

    if (checkError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: checkError
      });
    }

    const { data, error } = await eventsService.insertEvent(req.supabase, {
      event_id,
      event_date: datetime,
      venue,
      external_link,
      access_link,
      online
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
      id: data[0].event_id
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || error
    });
  }
};


const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (req.you.cannot(Actions.MANAGE, Subjects.EVENT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to update events"
      });
    }

    if (!isValidUUID(eventId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid eventId format"
      });
    }

    const { data: existingEvent, error: fetchError } = await eventsService.findEvent(req.supabase, eventId);

    if (fetchError || !existingEvent) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Event not found"
      });
    }

    if ("event_id" in req.body && req.body.event_id !== existingEvent.event_id) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "Editing of alum_id or project_id is not allowed"
      });
    }

    const {
      event_date,
      venue,
      external_link,
      access_link,
      online
    } = req.body;



    const updateData = {
      event_date,
      venue,
      external_link,
      access_link,
      online
    };
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });


    const { error: updateError } = await eventsService.updateEventData(req.supabase, eventId, updateData);

    if (updateError) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: updateError.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "UPDATED",
      message: "Event updated successfully",
      id: eventId
    });

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message || "An error occurred while updating the event"
    });
  }
};

const deleteEmptyEvent = async (req, res) => {
  if (req.you.cannot(Actions.MANAGE, Subjects.EVENT)) {
    return res.status(httpStatus.FORBIDDEN).json({
      status: "FORBIDDEN",
      message: "You do not have permission to delete events"
    });
  }
  return res.status(httpStatus.BAD_REQUEST).json({
    status: "FAILED",
    message: "Invalid deletion. Event id parameter is missing"
  });
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log("User role:", req.user?.role);
    console.log("Permissions check:", req.you.can(Actions.READ, Subjects.EVENT));

    if (req.you.cannot(Actions.MANAGE, Subjects.EVENT)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "FORBIDDEN",
        message: "You do not have permission to delete events"
      });
    }

    if (!isValidUUID(eventId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid eventId format"
      });
    }

    const { data: existingEvent, error: checkError } = await eventsService.checkExistingEventById(req.supabase, eventId);

    if (checkError || existingEvent.length === 0) {

      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Event interest not found"
      });
    }
    const { error } = await eventsService.deleteEvent(req.supabase, eventId);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message
      });
    }

    return res.status(httpStatus.OK).json({
      status: "DELETED",
      message: `Event ${eventId} has been deleted.`
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message
    });
  }
};

const eventsController = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEmptyEvent,
  deleteEvent
};

export default eventsController;