import httpStatus from "http-status-codes";
import organizationAffiliationsService from "../services/organizationAffiliationsService.js";

const getAffiliatedOrganizations = (supabase) => async (req, res) => {
    try {
        const { alumId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const { data, error } = await organizationAffiliationsService.fetchAffiliations(supabase, page, limit, alumId);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error.message
            });
        }

        console.log(data);

        return res.status(httpStatus.OK).json({
            status: "OK",
            affiliated_organizations: data || [],
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: "FAILED",
            message: error.message
        });
    }
};

const affiliateAlumnusToOrganization = (supabase) => async (req, res) => {
    try {

        const { alumId } = req.params;

        // Check required fields
        const requiredFields = [
            "org_id",
            "role",
            "joined_date"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const {
            org_id,
            role,
            joined_date,
        } = req.body;

        // Check if affiliation already exists
        const { data: existingAffiliations, error: checkError } = await organizationAffiliationsService.checkAffiliationIfExisting(supabase, org_id, alumId);

        if (checkError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: checkError
            });
        }

        if (existingAffiliations.length > 0) {
            return res.status(httpStatus.CONFLICT).json({
                status: 'FAILED',
                message: 'Alum is already affiliated with this organization'
            });
        }

        const affiliationData = {   
            org_id: org_id,
            alum_id: alumId,
            role: role,
            joined_date: joined_date,
        };

        // Insert new user
        const { data, error } = await organizationAffiliationsService.createAffiliation(supabase, affiliationData);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "FAILED",
                message: error
            });
        }

        return res.status(httpStatus.CREATED).json({
            status: 'CREATED',
            message: 'Affiliation successfully created',
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
};

const updateAffiliationData = (supabase) => async (req, res) => {
    try {
        const { alumId } = req.params;
        const { orgId } = req.params;
        const { role, joined_date } = req.body;

        // Check if affiliation already exists
        const { data: existingAffiliations, error: checkError } = await organizationAffiliationsService.checkAffiliationIfExisting(supabase, orgId, alumId);
            
        if (checkError) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: checkError
            });
        }

        if (existingAffiliations.length === 0 || existingAffiliations === null) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Affiliation not found'
            });
        }

        const updatedAffiliationData = {
            role: role,
            joined_date: joined_date,
        };
        
        // Update the affiliation
        const { error } = await organizationAffiliationsService.updateAffiliation(supabase, orgId, alumId, updatedAffiliationData);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'UPDATED',
            message: `Affiliation has been updated.`
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
}


const deleteAffiliatedOrganization = (supabase) => async (req, res) => {
    try {
        const { alumId } = req.params;
        const { orgId } = req.params;

            const { error } = await organizationAffiliationsService.deleteAffiliation(supabase, orgId, alumId);

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: error.message
                });
            }

        return res.status(httpStatus.OK).json({
            status: 'DELETED',
            message: `Affiliation has been deleted.`
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message
        });
    }
};

const organizationAffiliationsController = {
    getAffiliatedOrganizations,
    affiliateAlumnusToOrganization,
    deleteAffiliatedOrganization,
    updateAffiliationData,
};

export default organizationAffiliationsController;