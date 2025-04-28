import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { v4 as uuvidv4 } from "uuid";

describe('Jobs API - POST /v1/jobs', function () {

    let jobId = uuvidv4(); // Generate a new UUID for the job ID

    const validJob = {
        job_id: jobId,
        user_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
        job_title: 'Software Engineer',
        company_name: 'TechCorp',
        hiring_manager: 'John Doe',
        salary: 90000,
        apply_link: 'https://www.techcorp.com/apply',
        location: 'New York, NY',
        location_type: 1, // 
        employment_type: 1, // 
        created_at: new Date().toISOString(),
        expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    };

    it('should create a new job and return 201 with job object, then delete it', async function () {
        // Create job
        const createRes = await request(app)
            .post('/v1/jobs')
            .send(validJob);

        // Assert the job is created successfully
        expect(createRes.status).to.equal(httpStatus.CREATED);
        expect(createRes.body).to.have.property('status', 'CREATED');
        expect(createRes.body.job).to.include({
            job_id: validJob.job_id,
            user_id: validJob.user_id,
            job_title: validJob.job_title,
            company_name: validJob.company_name,
            hiring_manager: validJob.hiring_manager,
            salary: validJob.salary,
            apply_link: validJob.apply_link,
            location: validJob.location,
            location_type: validJob.location_type,
            employment_type: validJob.employment_type,
            created_at: validJob.created_at,
            expires_at: validJob.expires_at,
        });
    });

    after(async function () {
        const res = await request(app)
            .delete(`/v1/jobs/${jobId}`);

        if (res.body.status === 'DELETED') {
            console.log('Successfully deleted dummy job');
        } else {
            console.log('Failed to delete dummy job');
            console.log(res.body);
        }
    });

    it('should return 400 when user_id is missing', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                job_title: 'Software Engineer',
                company_name: 'TechCorp',
                hiring_manager: 'John Doe',
                salary: 90000,
                apply_link: 'https://www.techcorp.com/apply',
                location: 'New York, NY',
                location_type: 1,
                employment_type: 1,
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('user_id');
    });

    it('should return 400 when job_title is missing', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                user_id: validJob.user_id,
                company_name: validJob.company_name,
                hiring_manager: validJob.hiring_manager,
                salary: validJob.salary,
                apply_link: validJob.apply_link,
                location: validJob.location,
                location_type: validJob.location_type,
                employment_type: validJob.employment_type,
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('job_title');
    });

    it('should return 400 when company_name is missing', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                user_id: validJob.user_id,
                job_title: validJob.job_title,
                hiring_manager: validJob.hiring_manager,
                salary: validJob.salary,
                apply_link: validJob.apply_link,
                location: validJob.location,
                location_type: validJob.location_type,
                employment_type: validJob.employment_type,
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('company_name');
    });

    it('should return 400 when salary is missing', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                user_id: validJob.user_id,
                job_title: validJob.job_title,
                company_name: validJob.company_name,
                hiring_manager: validJob.hiring_manager,
                apply_link: validJob.apply_link,
                location: validJob.location,
                location_type: validJob.location_type,
                employment_type: validJob.employment_type,
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('salary');
    });

    it('should return 400 for empty strings in job_title or company_name', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                user_id: validJob.user_id,
                job_title: '',
                company_name: '',
                hiring_manager: validJob.hiring_manager,
                salary: validJob.salary,
                apply_link: validJob.apply_link,
                location: validJob.location,
                location_type: validJob.location_type,
                employment_type: validJob.employment_type,
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('required');
    });

    it('should return 400 when user_id is not a valid UUID', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                job_id: jobId,
                user_id: 'not-a-uuid',
                job_title: 'Invalid User ID Job',
                company_name: 'TechCorp',
                hiring_manager: 'John Doe',
                salary: 90000,
                apply_link: 'https://www.techcorp.com/apply',
                location: 'New York, NY',
                location_type: 1,
                employment_type: 1,
                created_at: new Date().toISOString(),
                expires_at: new Date().toISOString(),
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('user_id');
    });

    it('should reject unexpected extra fields', async function () {
        const res = await request(app)
            .post('/v1/jobs')
            .send({
                ...validJob,
                random_field: 'not allowed'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.match(/(created_at|random_field)/i);
    });
});
