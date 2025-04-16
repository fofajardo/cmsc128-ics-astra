import express from 'express';
import httpStatus from 'http-status-codes';

const postEventsRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {

            // required fields
            const requiredFields = [
                // required for contents
                "title",
                "details",
                "user_id",
                // required for events
                "event_date",
                "venue",
                "external_link"
            ];
            
            const missingFields = requiredFields.filter(field => !req.body[field]);
            
            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }
            
            // get data from req body
            const {
                title,
                details,
                user_id,
                event_date,
                venue,
                external_link,
                access_link,
                online
            } = req.body;

            const [interested_count, going_count, not_going_count] = [0,0,0];
            // check if online is boolean
            if (typeof online != "boolean") {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Online field expects either true or false'
                });
            }

            // Check if userId valid
            const isValidUUID = (id) => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
            };

            if (!isValidUUID(user_id)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid user_id format'
                });
            }
            // check if date is valid compared to 1970 base
            const isValidTimestamp = new Date(event_date).getTime() > 0 ? true : false;

            if (!isValidTimestamp) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'Invalid event date detected'
                });
            }
            
            // TODO: Implement transaction and rollbacl for better error handling 
            // since there are 2 queries in one API call

            // insert data to contents
            let { data, error } = await supabase
            .from('contents')
                .insert({
                    title: title,
                    details: details,
                    user_id: user_id,
                }).select();

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }
            
            const event_id = data[0].id;

            // insert data to events
            ({ data, error } = await supabase
                .from('events')
                .insert({
                    event_id: event_id,
                    event_date: event_date,
                    venue: venue,
                    external_link: external_link,
                    access_link: access_link,
                    interested_count: interested_count,
                    going_count: going_count,
                    not_going_count: not_going_count,
                    online: online
                }));

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'Event successfully created',
                id: event_id,
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: 'Internal Server Error'
            });
        }
    });

    return router;
};

export default postEventsRouter;