import express from 'express';
import httpStatus from 'http-status-codes';

const getOrganizationAffiliationsRouter = (supabase) => {
    const router = express.Router();

    router.get("/:alumId/organizations", async (req, res) => {
        try {
            const { alumId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + Number(limit) - 1;

            const { data, error } = await supabase
                .from("organization_affiliations")
                .select()
                .eq("alum_id", alumId)
                .range(startIndex, endIndex);

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
    });

//     router.get("/:id", async (req, res) => {
//         try {
//             const { id } = req.params;

//             console.log(id);

//             const { data, error } = await supabase
//                 .from("organizations")
//                 .select()
//                 .eq("id", id)
//                 .single();

//             if (error) {
//                 return res.status(httpStatus.NOT_FOUND).json({
//                     status: "FAILED",
//                     message: "User not found"
//                 });
//             }

//             console.log(data);

//             return res.status(httpStatus.OK).json({
//                 status: "OK",
//                 organization: data
//             });
// S
//         } catch (error) {
//             return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//                 status: "FAILED",
//                 message: error.message
//             });
//         }
//     });

    return router;
};

export default getOrganizationAffiliationsRouter;