import httpStatus from "http-status-codes";
import eventInterestsService from "../services/eventInterestsService.js";
import { isValidUUID } from "../utils/validators.js";
import { Actions, Subjects } from "../../common/scopes.js";
const getEventInterests = (supabase) => async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        // if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
        //     return res.status(httpStatus.FORBIDDEN).json({
        //         status: 'FORBIDDEN',
        //         message: 'You do not have permission to view event interests'
        //     });
        // }
        const { data, error } = await eventInterestsService.fetchEventInterests(supabase, page, limit);

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

const getEventInterestByAlumnId = (supabase) => async (req, res) => {
    try {
        const { alumnId } = req.params;

        // if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
        //     return res.status(httpStatus.FORBIDDEN).json({
        //         status: 'FORBIDDEN',
        //         message: 'You do not have permission to view event interests'
        //     });
        // }
        const { data, error } = await eventInterestsService.fetchEventInterestByAlumnId(supabase, alumnId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "Event interests not found"
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

const getEventInterestByContentId = (supabase) => async (req, res) => {
    try {
        const { contentId } = req.params;

        // if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
        //     return res.status(httpStatus.FORBIDDEN).json({
        //         status: 'FORBIDDEN',
        //         message: 'You do not have permission to view event interests'
        //     });
        // }
        const { data, error } = await eventInterestsService.fetchEventInterestByContentId(supabase, contentId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "Event interests not found"
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

const createEventInterest = (supabase) => async (req, res) => {
    try {
        // if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
        //     return res.status(httpStatus.FORBIDDEN).json({
        //         status: 'FORBIDDEN',
        //         message: 'You do not have permission to create event interests'
        //     });
        // }
        const requiredFields = [
            "user_id",
            "content_id",
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const {
            user_id,
            content_id
        } = req.body;

        if (!isValidUUID(user_id)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid alumnId format.'
            });
        }

        if (!isValidUUID(content_id)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid contentId format.'
            });
        }

        const { data: existingEvents, error: checkError } = await eventInterestsService.checkExistingEventInterest(supabase, user_id, content_id);

        if (checkError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: checkError
            });
        }

        if (existingEvents.length > 0) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Event interest already exists'
            });
        }

        const { data, error } = await eventInterestsService.insertEventInterest(supabase, {
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
            status: 'CREATED',
            message: 'Event successfully created',
            data: data[0]
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const deleteEmptyEventInterest = () => async (req, res) => {
    if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: 'FORBIDDEN',
            message: 'You do not have permission to delete event interests'
        });
    }
    return res.status(httpStatus.BAD_REQUEST).json({
        status: 'FAILED',
        message: 'Invalid deletion. AlumId and contentId parameters are missing'
    });
};

const deleteEventInterest = (supabase) => async (req, res) => {
    try {
        const {alumId, contentId} = req.params;

        if (req.you.cannot(Actions.MANAGE, Subjects.EVENT_INTEREST)) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'You do not have permission to delete event interests'
            });
        }

        if (!isValidUUID(alumId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid alumnId format'
            });
        }
        if (!isValidUUID(contentId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid contentId format'
            });
        }

        const { data: existingEventInterest, error: checkError } = await eventInterestsService.checkExistingEventInterest(supabase, alumId, contentId);

        if (checkError || existingEventInterest.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Event interest not found'
            });
        }

        const { error } = await eventInterestsService.deleteEventInterest(supabase, alumId, contentId);

        if (error) {
            console.log("unable to delete");
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'DELETED',
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
    createEventInterest,
    deleteEmptyEventInterest,
    deleteEventInterest
};

export default eventInterestsController;