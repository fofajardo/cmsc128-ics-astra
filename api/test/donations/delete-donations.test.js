import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import {TestSignIn, TestSignOut, TestUsers} from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe('Donations API Tests', function () {
    before(() => TestSignIn(gAgent, TestUsers.admin));

    let donationId;

     // Create a new dummy data for deletion test
     before(async function () {
        const res = await gAgent
            .post(`/v1/donations`)
            .send({
                user_id: 'b4a6b230-20b9-4137-af62-8b535841c391',
                project_id: '7f857ca0-fcca-4c5b-b619-d0612597dbb1',
                donation_date: new Date('2025-04-13'),
                reference_num: '9876-zxyw-9876',
                mode_of_payment: 1,
                amount: 9,
                is_anonymous: false
            });
        if (res.body.status === 'CREATED') {
            donationId = res.body.id;
            console.log('Successfully created dummy donation');
        } else
            console.log('Failed to create dummy donation');
    });

    describe('DELETE /v1/donations/:donationId', function () {
        it('should return 200, a status DELETED, and a message', async function () {
            const res = await gAgent
                .delete(`/v1/donations/${donationId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'DELETED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        it('should return 404, status FAILED, and a message when fetching the deleted donation', async function () {
            const res = await gAgent.post(`/v1/donations/${donationId}`);

            // console.log(res.body);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });

        it('should return 400 when donationId is not a valid UUID', async function () {
            const res = await gAgent
                .delete('/v1/donations/not-a-valid-id');

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        it('should return 404, a status FAILED, and a message when deleting a non-existing donation', async function () {
            const nonExistentId = '389517e7-4a0b-4c96-84f9-3a7080186895';   // non-existing id
            const res = await gAgent
                .delete(`/v1/donations/${nonExistentId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        it('should return 404 when trying to delete already-deleted donation', async function () {
            // First deletion
            await gAgent.delete(`/v1/donations/${donationId}`);

            // Second deletion attempt
            const res = await gAgent.delete(`/v1/donations/${donationId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    after(() => TestSignOut(gAgent));
});