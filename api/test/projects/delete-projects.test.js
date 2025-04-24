import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import {TestSignIn, TestSignOut, TestUsers} from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe('Projects API Tests', function () {
    before(() => TestSignIn(gAgent, TestUsers.moderator));

    const projectId = '389517e7-4a0b-4c96-84f9-3a7080186892'; // Actual projectId

    // Create a new dummy data for deletion test
    before(async function () {
    const res = await gAgent
        .post(`/v1/projects`)
        .send({
            project_id: projectId,
            status: 0,
            due_date: new Date('2025-04-01'),
            date_completed: null,
            goal_amount: 100000,
            donation_link: 'astra.com/amis-server-upgrade',
        });
    if (res.body.status === 'CREATED')
        console.log('Successfully created dummy project');
    else
        console.log('Failed to create dummy project');
    });

    describe('DELETE /v1/projects/:projectId', function () {
        it('should return 200, a status DELETED, and a message', async function () {
            const res = await gAgent
                .delete(`/v1/projects/${projectId}`)

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'DELETED');
        });

        it('should return 404, status FAILED, and a message when fetching the deleted project', async function () {
            const res = await gAgent.post(`/v1/projects/${projectId}`);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });

        it('should return 400 when projectId is not a valid UUID', async function () {
            const res = await gAgent
                .delete('/v1/projects/not-a-valid-id');

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        it('should return 404, a status FAILED, and a message when deleting a non-existing project', async function () {
            const nonExistentId = '389517e7-4a0b-4c96-84f9-3a7080186892';   // non-existing id
            const res = await gAgent
                .delete(`/v1/projects/${nonExistentId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        it('should return 404 when trying to delete already-deleted project', async function () {
            // First deletion
            await gAgent.delete(`/v1/projects/${projectId}`);

            // Second deletion attempt
            const res = await gAgent.delete(`/v1/projects/${projectId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    after(() => TestSignOut(gAgent));
});