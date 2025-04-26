import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import {TestSignIn, TestSignOut, TestUsers} from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe('Projects API Tests', function () {
    before(() => TestSignIn(gAgent, TestUsers.moderator));

    const contentId = '318c8aab-0564-42f8-aba6-5785d0e66288';

    describe('POST /v1/projects', function () {
        const contentId = '389517e7-4a0b-4c96-84f9-3a7080186892';

        after(async function () {
            const res = await request(app)
                .delete(`/v1/projects/${contentId}`);
            if (res.body.status === 'DELETED') {
                console.log('Successfully deleted dummy project');
            } else
                console.log('Failed to delete dummy project');
        });

        // Test case to verify that the API returns 400 if required fields are missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await gAgent
                .post(`/v1/projects`)
                .send({});

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 400 if invalid status
        it('should return 400, status FAILED, and a message when status is invalid', async function () {
            const res = await gAgent
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    project_status: '0',    // should be int
                    due_date: new Date('2025-04-01'),
                    date_completed: null,
                    goal_amount: 100000,
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 400 if invalid date
        it('should return 400, status FAILED, and a message when date is invalid', async function () {
            const res = await gAgent
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    project_status: 0,
                    due_date: new Date('invalid-date-string'),  // invalid date
                    date_completed: null,
                    goal_amount: 100000,
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // // Test case to verify that the project is created successfully
        it('should return 201, status CREATED, a message, and an id', async function () {
            const res = await gAgent
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    project_status: 0,
                    due_date: new Date('2025-04-01'),
                    date_completed: null,
                    goal_amount: 100000,
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            console.log(res.body);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').to.equal(contentId);
        });

        // Test case to verify that the API returns 400 if invalid contentId
        it('should return 400, status FAILED, and a message when projectId is invalid', async function () {
            const invalidContentId = '00000000-0000-0000-0000-000000000000'; // Invalid content ID
            const res = await gAgent
                .post(`/v1/projects`)
                .send({
                    project_id: invalidContentId,
                    project_status: 0,
                    due_date: new Date('2025-04-01'),
                    date_completed: null,
                    goal_amount: 100000,
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if the contentId does not exist in the system
        it('should return 404, status FAILED, and a message when contentId does not exist', async function () {
            const nonExistentId = '389517e7-4a0b-4c96-84f9-3a7080186893'; // Non-existing content ID
            const res = await gAgent
                .post(`/v1/projects`)
                .send({
                    project_id: nonExistentId,
                    project_status: 0,
                    due_date: new Date('2025-04-01'),
                    date_completed: null,
                    goal_amount: 100000,
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });

        // Test case to verify that the API returns 409 if the contentId has duplicate
        it('should return 409, status FAILED, and a message when contentId has duplicate', async function () {
            const res = await gAgent
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    project_status: 0,
                    due_date: new Date('2025-04-01'),
                    date_completed: null,
                    goal_amount: 100000,
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.CONFLICT);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    after(async function () {
        const res = await gAgent
            .delete(`/v1/projects/${contentId}`);
        if (res.body.status === 'DELETED') {
            console.log('Successfully deleted dummy project');
        } else
            console.log('Failed to delete dummy project');
    });

    after(() => TestSignOut(gAgent));
});