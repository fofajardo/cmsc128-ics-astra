import httpStatus from "http-status-codes";
import eventInterestsService from "../services/eventInterestsService.js";
import { isValidUUID } from "../utils/validators.js";

const getEventInterests = (supabase) => async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
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

        const requiredFields = [
            "alum_id",
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
            alum_id,
            content_id
        } = req.body;

        if (!isValidUUID(alum_id)) {
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

        const { data: existingEvents, error: checkError } = await eventInterestsService.checkExistingEventInterest(supabase, alum_id, content_id);

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
            alum_id,
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


const deleteEventInterest = (supabase) => async (req, res) => {
    try {
        const {alumnId, contentId} = req.params;

        if (!isValidUUID(alumnId)) {
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

        const { data: existingEventInterest, error: checkError } = await eventInterestsService.checkExistingEventInterest(supabase, alumnId, contentId);

        if (checkError || !existingEventInterest) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Event interest not found'
            });
        }
        const { error } = await eventInterestsService.deleteEventInterest(supabase, alumnId, contentId);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'DELETED',
            message: `Event interest for alumnus ${alumnId} and content ${contentId} has been successfully deleted.`
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
    deleteEventInterest
};

export default eventInterestsController;