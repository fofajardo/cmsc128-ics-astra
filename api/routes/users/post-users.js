import express from 'express';
import httpStatus from 'http-status-codes';

const postUserRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            // TODO Check if username, email already exists

            // check required fields
            const requiredFields = [
                // "id",
                "username",
                "email",
                "password",
                "salt",
                "role",
                "is_enabled",
                "first_name",
                "middle_name",
                "last_name",
                "created_at",
                // "deleted_at",
                "updated_at",
            ];

            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            // insert data to supabase
            const {
                // id,
                username,
                email,
                password,
                salt,
                role,
                isEnabled,
                firstName,
                middleName,
                lastName,
                createdAt,
                updatedAt
            } = req.body;

            const { data, error } = await supabase
                .from('users')
                .insert({
                    "username": username,
                    "email": email,
                    "password": password,
                    "salt": salt,
                    "role": role,
                    "is_enabled": isEnabled,
                    "first_name": firstName,
                    "middle_name": middleName,
                    "last_name": lastName,
                    "created_at": createdAt,
                    "updated_at": updatedAt
                });

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'User successfully created',
                id: data.id
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }
    });

    return router;
};

export default postAlumniRouter;