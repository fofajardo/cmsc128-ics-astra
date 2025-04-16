import express from 'express';
import httpStatus from 'http-status-codes';

const postUsersRouter = (supabase) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            // Check required fields
            const requiredFields = [
                "username",
                "email",
                "password",
                "salt",
                "is_enabled",
                "first_name",
                "middle_name",
                "last_name",
                "created_at",
                "updated_at",
                "role"
            ];

            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: `Missing required fields: ${missingFields.join(", ")}`
                });
            }

            const {
                username,
                email,
                password,
                salt,
                is_enabled,
                first_name,
                middle_name,
                last_name,
                created_at,
                updated_at,
                role
            } = req.body;

            // Check if username or email already exists
            const { data: existingUsers, error: checkError } = await supabase
                .from('users')
                .select('id')
                .or(`username.eq.${username},email.eq.${email}`);

            if (checkError) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: 'FAILED',
                    message: checkError
                });
            }

            if (existingUsers.length > 0) {
                return res.status(httpStatus.CONFLICT).json({
                    status: 'FAILED',
                    message: 'Username or email already exists'
                });
            }

            // Insert new user
            const { data, error } = await supabase
                .from('users')
                .insert({
                    username,
                    email,
                    password,
                    salt,
                    is_enabled: is_enabled,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    created_at: created_at,
                    updated_at: updated_at,
                    role
                })
                .select('id') // Select to return the ID

            if (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    status: "FAILED",
                    message: error
                });
            }

            return res.status(httpStatus.CREATED).json({
                status: 'CREATED',
                message: 'User successfully created',
                id: data[0].id
            });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error.message || error
            });
        }
    });

    return router;
};

export default postUsersRouter;