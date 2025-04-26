import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { TestSignIn, TestSignOut, TestUsers } from '../auth/auth.common.js';
import { response } from 'express';

const gAgent = request.agent(app);
const kRoutePrefix = '/v1/requests';

describe('Requests API Tests (PUT)', function () {
    this.timeout(4000);

    before(() => TestSignIn(gAgent, TestUsers.admin));

    describe(`PUT ${kRoutePrefix}/:requestId`, function () {
        let requestId = null;

        // ✅ Precondition: Create a request before running put tests
        before(async function () {
            const testRequest = {
                user_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
                content_id: '389517e7-4a0b-4c96-84f9-3a7080186892',
                type: 0,
                title: 'test title',
                description: 'test description',
            };

            const res = await gAgent.post(`${kRoutePrefix}`).send(testRequest);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            requestId = res.body.id;
        });

        // try to update the request with valid data and for valid fields
        it('should return 200 and update valid request details', async function () {
            // Check if row exists before updating
            const preCheckRes = await gAgent
                .get(`${kRoutePrefix}/${requestId}`);

            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            const validUpdateData = {
                status: 1,
                response: 'Updated response',
            };

            const res = await gAgent
                .put(`${kRoutePrefix}/${requestId}`)
                .send(validUpdateData);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            
            const verifyRes = await gAgent
                .get(`${kRoutePrefix}/${requestId}`);

            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            expect(verifyRes.body.request).to.include(validUpdateData);


        });

        // Verify that the API returns 200 for partial updates
        it('should return 200 and update some request details', async function () {
            // Check if row exists before updating
            const preCheckRes = await gAgent
                .get(`${kRoutePrefix}/${requestId}`);

            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');
            
            const partialUpdateData = {
                status: 2,
            };

            const res = await gAgent
                .put(`${kRoutePrefix}/${requestId}`)
                .send(partialUpdateData);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            const verifyRes = await gAgent
                .get(`${kRoutePrefix}/${requestId}`);

            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');
            
            expect(verifyRes.body.request).to.be.an('object');
            expect(verifyRes.body.request).to.have.property('status', partialUpdateData.status);
        });

        // Invalid field values (status)
        it('should return 400 for invalid status value', async function () {
            const invalidUpdateData = {
                status: 'invalid_status',
            };

            const res = await gAgent
                .put(`${kRoutePrefix}/${requestId}`)
                .send(invalidUpdateData);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Try to update a restricted field (user_id)
        it(`should return ${httpStatus.FORBIDDEN} for updating restricted field (user_id)`, async function () {
            const restrictedUpdateData = {
                user_id: '00000000-0000-0000-0000-000000000000', 
            };

            const res = await gAgent
                .put(`${kRoutePrefix}/${requestId}`)
                .send(restrictedUpdateData);

            expect(res.status).to.equal(httpStatus.FORBIDDEN);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
            const res = await gAgent.delete(`${kRoutePrefix}/${requestId}`);

            if (res.body.status === 'DELETED') {
                console.log('Request deleted successfully');
            }
            else {
                console.log('Failed to delete request');
            }
        });

        after(() => TestSignOut(gAgent, TestUsers.admin));
    });
});