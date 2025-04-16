import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Project API Tests', function () {

    describe('PUT /v1/projects/:projectId', function () {
        it('should return 200 and update valid project details', async function () {
            const projectId = '389517e7-4a0b-4c96-84f9-3a7080186892'; // Actual projectId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/projects/${projectId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);
            const dateString = '2025-05-01';

            const validUpdateData = {
                status: 2,
                due_date: new Date(dateString).toISOString(),
                date_completed: new Date(dateString).toISOString(),
                goal_amount: 75000,
                donation_link: 'astra.com/amis-server-upgrade-2',
            };

            const res = await request(app)
                .put(`/v1/projects/${projectId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await request(app).get(`/v1/projects/${projectId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.project).to.be.an('object');
            expect(verifyRes.body.project).to.have.property('status', validUpdateData.status);
            expect(verifyRes.body.project).to.have.property('due_date', dateString);
            expect(verifyRes.body.project).to.have.property('date_completed', dateString);
            expect(verifyRes.body.project).to.have.property('goal_amount', validUpdateData.goal_amount);
            expect(verifyRes.body.project).to.have.property('donation_link', validUpdateData.donation_link);
        });

        // Test case to verify that the API returns 200 for partial updates
        it('should return 200 and update valid project details', async function () {
            const projectId = '389517e7-4a0b-4c96-84f9-3a7080186892'; // Actual projectId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/projects/${projectId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const validUpdateData = {
                status: 1,
                date_completed: null
            };

            const res = await request(app)
                .put(`/v1/projects/${projectId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await request(app).get(`/v1/projects/${projectId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.project).to.be.an('object');
            expect(verifyRes.body.project).to.have.property('status', validUpdateData.status);
            expect(verifyRes.body.project).to.have.property('date_completed', null);
        });

        // Test case to verify that the API returns 400 if invalid field values (status)
        it('should return 400, status FAILED, and a message', async function () {
            const projectId = '389517e7-4a0b-4c96-84f9-3a7080186892'; // Actual projectId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/projects/${projectId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const validUpdateData = {
                status: '2',
            };

            const res = await request(app)
                .put(`/v1/projects/${projectId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 400 if invalid projectId
        it('should return 400, status FAILED, and a message', async function () {
            const invalidProjectId = '389517e7-9a0b-9c96-84f9-3a7080186892'; // Invalid projectId

            const validUpdateData = {
                status: 2,
            };

            const res = await request(app)
                .put(`/v1/projects/${invalidProjectId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if the projectId does not exist in the system
        it('should return 404, status FAILED, and a message', async function () {
            const notExistingProjectId = '389517e7-4a0b-4c96-84f9-3a7080186893'; // Non-existing projectId

            const validUpdateData = {
                goal_amount: 50000,
            };

            const res = await request(app)
                .put(`/v1/projects/${notExistingProjectId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });
});