import httpStatus from 'http-status-codes';
import donationsService from '../services/donationsService.js';
import { isValidUUID, isValidDate } from '../utils/validators.js';
import {Actions, Subjects} from "../../common/scopes.js";

const getDonations = (supabase) => async (req, res) => {
    if (req.you.cannot(Actions.READ, Subjects.DONATION)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: "FORBIDDEN",
            message: "You are not allowed to access this resource."
        });
    }

    try {
        const { page = 1, limit = 10 } = req.query;
        const { data, error } = await donationsService.fetchDonations(supabase, page, limit);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            donations: data || [],
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const getDonationById = (supabase) => async (req, res) => {
    try {
        const { donationId } = req.params;

        if (!isValidUUID(donationId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid donationId format'
            });
        }

        const { data, error } = await donationsService.fetchDonationById(supabase, donationId);

        if (error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Donation not found'
            });
        }

        if (req.you.cannotAs(Actions.READ, Subjects.DONATION, data)) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: "FORBIDDEN",
                message: "You are not allowed to access this resource."
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'OK',
            donation: data
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const createDonation = (supabase) => async (req, res) => {
    if (req.you.cannot(Actions.CREATE, Subjects.DONATION)) {
        return res.status(httpStatus.FORBIDDEN).json({
            status: "FORBIDDEN",
            message: "You are not allowed to access this resource."
        });
    }

    try {
        // Validate request body format and required fields
        const requiredFields = [
            'alum_id',
            'project_id',
            'donation_date',
            'reference_num',
            'mode_of_payment',
            'amount',
            'is_anonymous'
        ];

        const missingFields = requiredFields.filter(field =>
            req.body[field] === undefined ||
            req.body[field] === null ||
            (typeof req.body[field] === 'string' && req.body[field].trim() === '')
        );

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(', ')}`,
                id: null
            });
        }

        const {
            alum_id,
            project_id,
            donation_date,
            reference_num,
            mode_of_payment,
            amount,
            is_anonymous
        } = req.body;

        const alumId = alum_id;
        const projectId = project_id;
        const donationDate = donation_date;
        const referenceNum = reference_num;
        const modeOfPayment = mode_of_payment;
        const isAnonymous = is_anonymous;

        // Validate data types
        if (!isValidUUID(alumId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid alumId format',
                id: null
            });
        }

        if (!isValidUUID(projectId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid projectId format',
                id: null
            });
        }

        if ((typeof modeOfPayment !== 'number' || ![0, 1].includes(modeOfPayment)) ||
            !isValidDate(donationDate) ||
            typeof amount !== 'number' ||
            typeof referenceNum !== 'string' ||
            typeof isAnonymous !== 'boolean'
        ) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid field values',
                id: null
            });
        }

        // Check if alumId and projectId exists
        const alumIdResponse = await supabase
            .from('alumni_profiles')
            .select('alum_id')
            .eq('alum_id', alumId)
            .single();

        if (!alumIdResponse.data && alumIdResponse.error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: alumIdResponse.error.message,
                id: null
            });
        }

        const projectIdResponse = await supabase
            .from('projects')
            .select('project_id')
            .eq('project_id', projectId)
            .single();

        if (!projectIdResponse.data && projectIdResponse.error) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: projectIdResponse.error.message,
                id: null
            });
        }


        const { data, error } = await donationsService.insertDonation(supabase, {
            alum_id: alumId,
            project_id: projectId,
            donation_date: donationDate,
            reference_num: referenceNum,
            mode_of_payment: modeOfPayment,
            amount: amount,
            is_anonymous: isAnonymous
        });

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Donation successfully created',
            id: data['id']
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const updateDonation = (supabase) => async (req, res) => {
    try {
        const { donationId } = req.params;
        const projectId = req.body.project_id
        const alumId = req.body.alum_id

        // Check if donationId exists in the request params
        if (!donationId) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Missing donationId in params',
            });
        }

        // Validate if donationId is a valid UUID
        if (!isValidUUID(donationId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid donationId format',
            });
        }

        if (projectId && !isValidUUID(projectId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid projectId format',
            });
        }

        if (alumId && !isValidUUID(alumId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid alumId format',
            });
        }

        // Check if the donation exists in the database
        const { data: donationData, error: fetchError } = await supabase
            .from('donations')
            .select()
            .eq('id', donationId)
            .single();

        // If donation does not exist, return NOT_FOUND
        if (fetchError || !donationData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Donation not found',
            });
        }

        if (req.you.cannotAs(Actions.MANAGE, Subjects.DONATION, donationData)) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: "FORBIDDEN",
                message: "You are not allowed to access this resource."
            });
        }

        // Check if the alumnus exists in the database
        if (alumId) {
            const { data: existingAlum, error: alumFetchError } = await supabase
                .from('alumni_profiles')
                .select()
                .eq('alum_id', alumId)
                .single();

            // If alumnus does not exist, return NOT_FOUND
            if (alumFetchError || !existingAlum) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Alumnus not found',
                });
            }
        }

        // Check if the project exists in the database
        if (projectId) {
            const { data: existingProject, error: projectFetchError } = await supabase
                .from('projects')
                .select()
                .eq('project_id', projectId)
                .single();

            // If project does not exist, return NOT_FOUND
            if (projectFetchError || !existingProject) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'FAILED',
                    message: 'Project not found',
                });
            }
        }

        // Disallow edits to alum_id and project_id
        if (
            ('alum_id' in req.body && req.body.alum_id !== donationData.alum_id) ||
            ('project_id' in req.body && req.body.project_id !== donationData.project_id)
        ) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FORBIDDEN',
                message: 'Editing of alum_id or project_id is not allowed'
            });
        }

        // Update only allowed fields
        const {
            alum_id,
            project_id,
            donation_date,
            reference_num,
            mode_of_payment,
            amount
        } = req.body;

        const updateData = {
            // alum_id,
            // project_id,
            donation_date,
            reference_num,
            mode_of_payment,
            amount
        };

        // Remove undefined fields to avoid overwriting with nulls
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // Validate request body
        const allowedFields = ['alum_id', 'project_id', 'donation_date', 'reference_num', 'mode_of_payment', 'amount'];

        allowedFields.forEach(field => {
            if (!(field in req.body)) {
                return;
            }; // skip if field is not present

            const value = req.body[field];

            if ((field === 'mode_of_payment' && (typeof value !== 'number' || ![0, 1].includes(value))) ||
                (field === 'donation_date' && (value !== null && !isValidDate(value))) ||
                (field === 'amount' && typeof value !== 'number') ||
                (field === 'reference_num' && typeof value !== 'string')
            ) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid field values',
                });
            }
        })

        const { data, error } = await donationsService.updateDonationData(supabase, donationId, updateData)

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: 'Donation successfully updated',
            id: donationId
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const deleteDonation = (supabase) => async (req, res) => {
    try {
        const { donationId } = req.params;

        if (!isValidUUID(donationId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid donationId format'
            });
        }

        // Check if donation exists
        const { data: donationData, error: donationError } = await donationsService.fetchDonationById(supabase, donationId);

        if (donationError || !donationData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Donation not found'
            });
        }

        if (req.you.cannotAs(Actions.MANAGE, Subjects.DONATION, donationData)) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: "FORBIDDEN",
                message: "You are not allowed to access this resource."
            });
        }

        const { error } = await donationsService.deleteDonation(supabase, donationId);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'DELETED',
            message: `Donation ${donationId} has been deleted.`
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const donationsController = {
    getDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation
};

export default donationsController;