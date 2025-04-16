import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import nationalities from 'i18n-nationality';

describe('Alumni API Tests', function () {
    describe('POST /v1/alumni/:userId', function () {
        // Test case to verify that the alumni profile is created successfully
        it('should return 201, status CREATED, a message, and an id', async function () {
            const userId = '75b6e610-9d0b-4884-b405-1e682e3aa3de'; // Actual test user ID
            const res = await request(app)
                .post(`/v1/alumni/${userId}`)
                .send({
                    alum_id: userId,
                    birthdate: new Date('1981-01-01').toISOString(),
                    location: 'Laguna',
                    address: 'Los Banos',
                    gender: 'Male',
                    student_num: '199901234',
                    degree_program: '904b3aaa-87f3-4493-b994-e5681d4f06a9',
                    year_graduated: new Date('2003-11-19').toISOString(),
                    skills: 'Management',
                    field: 'Human Resources',
                    job_title: 'Head of HR',
                    company: 'XYZ Company',
                    citizenship: nationalities.getAlpha3Code("Filipino", "en"),
                    sex: 0
                });

            console.log(res.body.message);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('id').to.equal(userId);
        });

        // Test case to verify that the API returns 400 if fields are missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const userId = 'fa8d0d20-5e72-4288-9c62-5a959d7adf02'; // Actual test user ID
            const res = await request(app)
                .post(`/v1/alumni/${userId}`)
                .send({});

            // console.log(res.body.message);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // Test case to verify that the API returns 400 if the userId format is invalid
        it('should return 400, status FAILED, and a message when userId format is invalid', async function () {
            const invalidUserId = '00000000-0000-0000-0000-000000000000'; // Example userId, replace with an invalid test user ID
            const res = await request(app)
                .post(`/v1/alumni/${invalidUserId}`);

            // console.log(res.body.message);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // Test case to verify that the API returns 404 if the userId does not exist in the system
        it('should return 404, status FAILED, and a message when user does not exist', async function () {
            const notExistingUserId = 'f3d7e6b2-8c9f-4a1b-9c7b-6b0a1c0e937d'; // Non-existing user ID
            const res = await request(app)
                .post(`/v1/alumni/${notExistingUserId}`);

            // console.log(res.body.message);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // Test case to verify that the API returns 409 if the user already has an alumni profile
        it('should return 409, status FAILED, and a message when the user already has an alumni profile', async function () {
            const userId = '75b6e610-9d0b-4884-b405-1e682e3aa3de'; // Recently created actual user ID
            const res = await request(app)
                .post(`/v1/alumni/${userId}`)
                .send({
                    alum_id: userId,
                    birthdate: new Date('1981-01-01').toISOString(),
                    location: 'Laguna',
                    address: 'Los Banos',
                    gender: 'Male',
                    student_num: '199901234',
                    degree_program: '904b3aaa-87f3-4493-b994-e5681d4f06a9',
                    year_graduated: new Date('2003-11-19').toISOString(),
                    skills: 'Management',
                    field: 'Human Resources',
                    job_title: 'Head of HR',
                    company: 'XYZ Company',
                    citizenship: nationalities.getAlpha3Code("Filipino", "en"),
                    sex: 0
                });

            // console.log(res.body.message);

            expect(res.status).to.equal(httpStatus.CONFLICT);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });
    });
});