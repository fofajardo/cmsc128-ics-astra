import httpStatus from "http-status-codes";
import eventsService from "../services/eventsService.js";
import { isValidUUID } from "../utils/validators.js";

const getEvents = (supabase) => async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { data, error } = await eventsService.fetchEvents(supabase, page, limit);

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

const getEventById = (supabase) => async (req, res) => {
    try {
        const { eventId } = req.params;

        const { data, error } = await eventsService.fetchEventById(supabase, eventId);

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

const createEvent = (supabase) => async (req, res) => {
    try {

        const requiredFields = [
            "event_date",
            "venue",
            "external_link",
            "access_link",
            "interested_count",
            "going_count",
            "not_going_count",
            "online"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const {
            event_date,
            venue,
            external_link,
            access_link,
            interested_count,
            going_count,
            not_going_count,
            online
        } = req.body;

        const { data: existingEvents, error: checkError } = await eventsService.checkExistingEvent(supabase, event_date, venue);

        if (checkError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: checkError
            });
        }

        if (existingEvents.length > 0) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Event date and venue already exists'
            });
        }

        const { data, error } = await eventsService.insertEvent(supabase, {
            event_date,
            venue,
            external_link,
            access_link,
            interested_count,
            going_count,
            not_going_count,
            online
        });

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Event successfully created',
            id: data[0].id
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const updateEvent = (supabase) => async (req, res) => {
    try {
        const eventId = req.params.eventId;

        if (!isValidUUID(eventId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid eventId format'
            });
        }
        const { data: existingEvent, error: fetchError } = await eventsService.findEvent(supabase, eventId);

        if (fetchError || !existingEvent) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Event not found'
            });
        }

        const {
            event_date,
            venue,
            external_link,
            access_link,
            interested_count,
            going_count,
            not_going_count,
            online
        } = req.body;


        const updateData = {};
        if (event_date !== undefined) updateData.event_date = event_date;
        if (venue !== undefined) updateData.venue = venue;
        if (external_link !== undefined) updateData.external_link = external_link;
        if (access_link !== undefined) updateData.access_link = access_link;
        if (interested_count !== undefined) updateData.interested_count = interested_count;
        if (going_count !== undefined) updateData.going_count = going_count;
        if (not_going_count !== undefined) updateData.not_going_count = not_going_count;
        if (online !== undefined) updateData.online = online;

        if (Object.keys(updateData).length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'No valid fields to update'
            });
        }

        const { error: updateError } = await eventsService.updateEventData(supabase, eventId, updateData);

        if (updateError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: updateError.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Event updated successfully'
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || 'An error occurred while updating the event'
        });
    }
};

const deleteEvent = (supabase) => async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!isValidUUID(eventId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid eventId format'
            });
        }
        const { error } = await eventsService.deleteEvent(supabase, eventId);

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
    deleteEvent
};

export default eventsController;