import httpStatus from "http-status-codes";
import alumniProfilesService from "../services/alumniProfilesService.js";

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

        const { data, error } = await alumniProfilesService.fetchAlumniProfilesById(supabase, userId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: "FAILED",
                message: "Alumni profile not found"
            });
        }

        return res.status(httpStatus.OK).json({
            status: "OK",
            alumni: data
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
    } catch (error) {

    }
};