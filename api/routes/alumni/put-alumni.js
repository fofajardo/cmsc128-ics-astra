router.put('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate UUID
        const isValidUUID = (id) => {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        };

        if (!isValidUUID(userId)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'FAILED',
                message: 'Invalid userId format'
            });
        }

        // Check if user exists
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();

        if (userError || !userData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'User not found'
            });
        }

        // Check if alumni profile exists
        const { data: alumniData, error: alumniError } = await supabase
            .from('alumni_profiles')
            .select('alum_id, birthdate, student_num')
            .eq('alum_id', userId)
            .single();

        if (alumniError || !alumniData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'FAILED',
                message: 'Alumni profile not found'
            });
        }

        // Disallow edits to birthdate and student_num
        if (
            ('birthdate' in req.body && req.body.birthdate !== alumniData.birthdate) ||
            ('student_num' in req.body && req.body.student_num !== alumniData.student_num)
        ) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'FAILED',
                message: 'Editing birthdate or student number is not allowed'
            });
        }

        // Update only allowed fields
        const {
            location,
            address,
            gender,
            degree_program,
            year_graduated,
            skills,
            field,
            job_title,
            company,
            citizenship,
            honorifics
        } = req.body;

        const updatePayload = {
            location,
            address,
            gender,
            degree_program,
            year_graduated,
            skills,
            field,
            job_title,
            company,
            citizenship,
            honorifics
        };

        // Remove undefined fields to avoid overwriting with nulls
        Object.keys(updatePayload).forEach(key => {
            if (updatePayload[key] === undefined) {
                delete updatePayload[key];
            }
        });

        const { data, error } = await supabase
            .from('alumni_profiles')
            .update(updatePayload)
            .eq('alum_id', userId);

        if (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'FAILED',
                message: error
            });
        }

        return res.status(httpStatus.OK).json({
            status: 'SUCCESS',
            message: 'Alumni profile successfully updated',
            id: userId
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'FAILED',
            message: error.message || error
        });
    }
});