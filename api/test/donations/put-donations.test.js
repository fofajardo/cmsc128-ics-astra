import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import {TestSignIn, TestSignOut, TestUsers} from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe('Donations API Tests', function () {
    before(() => TestSignIn(gAgent, TestUsers.admin));

    const userId = 'b4a6b230-20b9-4137-af62-8b535841c391';
    const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1';

    describe('PUT /v1/donations/:donationId', function () {
        it('should return 200 and update valid donation details', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91'; // Actual donationId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await gAgent.get(`/v1/donations/${donationId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const dateString = '2025-04-13';

            const validUpdateData = {
                user_id: userId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await gAgent
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await gAgent.get(`/v1/donations/${donationId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.donation).to.be.an('object');
            expect(verifyRes.body.donation).to.have.property('user_id', validUpdateData.user_id);
            expect(verifyRes.body.donation).to.have.property('project_id', validUpdateData.project_id);
            expect(verifyRes.body.donation).to.have.property('donation_date', dateString);
            expect(verifyRes.body.donation).to.have.property('reference_num', validUpdateData.reference_num);
            expect(verifyRes.body.donation).to.have.property('mode_of_payment', validUpdateData.mode_of_payment);
            expect(verifyRes.body.donation).to.have.property('amount', validUpdateData.amount);
        });

        // Test case to verify that the API returns 200 for partial updates
        it('should return 200 and update donation modeOfPayment', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91'; // Actual donationId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await gAgent.get(`/v1/donations/${donationId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const validUpdateData = {
                mode_of_payment: 0,
            };

            const res = await gAgent
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await gAgent.get(`/v1/donations/${donationId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.donation).to.be.an('object');
            expect(verifyRes.body.donation).to.have.property('mode_of_payment', validUpdateData.mode_of_payment);
        });

        // Test case to verify that the API returns 400 if invalid donationId
        it('should return 400, status FAILED, and a message when invalid donationId', async function () {
            const donationId = 'invalid-donation-id';       // invalid donationId

            const dateString = '2025-04-13';

            const validUpdateData = {
                user_id: userId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await gAgent
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 403 if trying to edit userId
        it('should return 403, status FORBIDDEN, and a message when trying to edit userId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91';
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';

            const dateString = '2025-04-13';

            const validUpdateData = {
                user_id: userId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await gAgent
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.FORBIDDEN);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FORBIDDEN');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 403 if trying to edit projectId
        it('should return 403, status FORBIDDEN, and a message when trying to edit projectId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91';
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            const dateString = '2025-04-13';

            const validUpdateData = {
                user_id: userId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await gAgent
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.FORBIDDEN);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FORBIDDEN');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if non-existing donationId
        it('should return 404, status FAILED, and a message when non-existing donationId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f92';  // non-existing donationId
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            const dateString = '2025-04-13';

            const validUpdateData = {
                user_id: userId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await gAgent
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    after(async function () {
        const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91';
        const originalData = {
            user_id: userId,
            project_id: projectId,
            donation_date: new Date('2025-04-06').toISOString(),
            reference_num: '1234-abvc-1234',
            mode_of_payment: 0,
            amount: 10000
        };

        const res = await gAgent
            .put(`/v1/donations/${donationId}`)
            .send(originalData);
        if (res.body.status === 'UPDATED') {
            console.log('Successfully revert donation fields');
        } else
            console.log('Failed to revert donation fields');
    });

    after(() => TestSignOut(gAgent));
});