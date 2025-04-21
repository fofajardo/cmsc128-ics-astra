import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Projects API Tests', function () {

    describe('GET /v1/projects', function () {
        it('should return 200 and a list of projects', async function () {
            const res = await request(app)
                .get('/v1/projects')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'OK');
            expect(res.body).to.have.property('projects').that.is.an('array');
        });
    });

    describe('GET /v1/projects/:projectId', function () {
        it('should return 200 and details of a single project', async function () {
            const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; // Actual project_id
            const res = await request(app).get(`/v1/projects/${projectId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'OK');
            expect(res.body).to.have.property('project').to.be.an('object');

            const projectData = res.body.project;

            expect(projectData).to.have.property('project_id');

            expect(projectData).to.have.property('status').that.is.oneOf([0, 1, 2]);

            expect(projectData).to.have.property('due_date');
            expect(new Date(projectData.due_date).toString()).to.not.equal('Invalid Date');

            expect(projectData).to.have.property('date_completed').that.satisfies(date => date === null || new Date(date).toString() != 'Invalid Date');

            expect(projectData).to.have.property('goal_amount').that.is.a('number');

            expect(projectData).to.have.property('donation_link').that.is.a('string');
        });

        // Test case to verify that the API returns 400 if invalid projectId
        it('should return 400, status FAILED, and a message when projectId is invalid', async function () {
            const invalidProjectId = '00000000-0000-0000-0000-000000000000'; // Invalid project ID
            const res = await request(app).get(`/v1/projects/${invalidProjectId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if the projectId does not exist in the system
        it('should return 404, status FAILED, and a message when project does not exist', async function () {
            const notExistingProjectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb2'; // Non-existing projectId
            const res = await request(app).post(`/v1/projects/${notExistingProjectId}`);

            // console.log(res);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });
    });

    // describe('GET /v1/projects/:projectId/donations', function () {
    //     it('should return 200 and a list of donations to the project', async function () {
    //         const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; // Actual project_id
    //         const res = await request(app).get(`/v1/projects/${projectId}/donations`);

    //         expect(res.status).to.equal(httpStatus.OK);
    //         expect(res.body).to.be.an('object');

    //         expect(res.body).to.have.property('status', 'OK');
    //         expect(res.body).to.have.property('donations').to.be.an('array');
    //     });
    // });
});