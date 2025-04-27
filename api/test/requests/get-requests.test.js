import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { TestSignIn, TestSignOut, TestUsers } from '../auth/auth.common.js';

const gAgent = request.agent(app);
const kRoutePrefix = '/v1/requests';

describe('Requests API Tests (GET)', function () {
    this.timeout(4000); // Set timeout to 10 seconds

    before(() => TestSignIn(gAgent, TestUsers.admin));

    // Gets all requests
    // Should return 200.
    describe(`GET ${kRoutePrefix}`, function () {
        it(`should return ${httpStatus.OK} for GET ${kRoutePrefix}`, async function () {
            const res = await gAgent
                .get(kRoutePrefix)
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    // Gets the request with the given request ID
    describe(`GET ${kRoutePrefix}/:requestId`, function () {
        it(`should return ${httpStatus.OK} for GET ${kRoutePrefix}/:requestId`, async function () {
            const requestID = '21e869f5-5285-4d1f-8c4d-a49ed021dc92';
            const res = await gAgent.get(`${kRoutePrefix}/${requestID}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);

            const requestData = res.body.request;
            expect(requestData).to.have.property('id').that.is.a('string');
            expect(requestData).to.have.property('user_id').that.is.a('string');
            expect(requestData).to.have.property('content_id').that.is.a('string');
            expect(requestData).to.have.property('type').that.is.a('number');
            expect(requestData).to.have.property('status').that.is.a('number');
            expect(requestData).to.have.property('title').that.is.a('string');
            expect(requestData).to.have.property('description').to.satisfy(
                val => val === null || typeof val === 'string'
            );
            expect(requestData).to.have.property('date_requested').that.is.a('string');
            expect(requestData).to.have.property('date_reviewed').to.satisfy(
                val => val === null || typeof val === 'string'
            );
            expect(requestData).to.have.property('response').to.satisfy(
                val => val === null || typeof val === 'string'
            );
        });
    });

    // Gets the request with a valid request ID, but the ID is non-existent.
    describe(`GET ${kRoutePrefix}/:requestId with non-existent ID`, function () {
        it(`should return ${httpStatus.NOT_FOUND} for GET ${kRoutePrefix}/:requestId with non-existent ID`, async function () {
            const nonExistentRequestID = '00000000-0000-0000-0000-000000000000'; // Non-existent UUID
            const res = await gAgent.get(`${kRoutePrefix}/${nonExistentRequestID}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    // Gets the request with the given request ID, but the ID is invalid.
    // Should return 400.
    describe(`GET ${kRoutePrefix}/:requestId with invalid ID`, function () {
        it(`should return ${httpStatus.BAD_REQUEST} for GET ${kRoutePrefix}/:requestId with invalid ID`, async function () {
            const invalidRequestID = '0000'; // Invalid UUID
            const res = await gAgent.get(`${kRoutePrefix}/${invalidRequestID}`);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });
    });

    // Gets the requests of the given user ID
    // Should return 200.
    describe(`GET ${kRoutePrefix}/alum/:userId`, function () {
        it(`should return ${httpStatus.OK} for GET ${kRoutePrefix}/alum/:userId`, async function () {
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee'; 
            const res = await gAgent.get(`${kRoutePrefix}/alum/${userId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('list').that.is.an('array');

            const requestData = res.body.list[0];
            expect(requestData).to.have.property('id').that.is.a('string');
            expect(requestData).to.have.property('user_id').that.is.a('string');
            expect(requestData).to.have.property('content_id').that.is.a('string');
            expect(requestData).to.have.property('type').that.is.a('number');
            expect(requestData).to.have.property('status').that.is.a('number');
            expect(requestData).to.have.property('title').that.is.a('string');
            expect(requestData).to.have.property('description').to.satisfy(
                val => val === null || typeof val === 'string'
            );
            expect(requestData).to.have.property('date_requested').that.is.a('string');
            expect(requestData).to.have.property('date_reviewed').to.satisfy(
                val => val === null || typeof val === 'string'
            );
            expect(requestData).to.have.property('response').to.satisfy(
                val => val === null || typeof val === 'string'
            );
        });
    });

    // Gets the requests of the given user ID, but the user ID is non-existent.
    describe(`GET ${kRoutePrefix}/alum/:userId with non-existent ID`, function () {
        it(`should return ${httpStatus.NOT_FOUND} for GET ${kRoutePrefix}/alum/:userId with non-existent ID`, async function () {
            const nonExistentUserID = '00000000-0000-0000-0000-000000000000'; // Non-existent UUID
            const res = await gAgent.get(`${kRoutePrefix}/alum/${nonExistentUserID}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    // Gets the requests of the given user ID, but the user ID is invalid.
    // Should return 400.
    describe(`GET ${kRoutePrefix}/alum/:userId with invalid ID`, function () {
        it(`should return ${httpStatus.BAD_REQUEST} for GET ${kRoutePrefix}/alum/:userId with invalid ID`, async function () {
            const invalidUserID = '00000000-0000-0000-0000-00000000000'; // Invalid UUID
            const res = await gAgent.get(`${kRoutePrefix}/alum/${invalidUserID}`);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });
    });

    // Gets the requests of the given content ID
    // Should return 200.
    describe(`GET ${kRoutePrefix}/content/:contentId`, function () {
        it(`should return ${httpStatus.OK} for GET ${kRoutePrefix}/content/:contentId`, async function () {
            const contentId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; 
            const res = await gAgent.get(`${kRoutePrefix}/content/${contentId}`);


            expect(res.status).to.equal(httpStatus.OK); 
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    // Gets the requests of the given content ID, but the content ID is non-existent.
    describe(`GET ${kRoutePrefix}/content/:contentId with non-existent ID`, function () {
        it(`should return ${httpStatus.NOT_FOUND} for GET ${kRoutePrefix}/content/:contentId with non-existent ID`, async function () {
            const nonExistentContentID = '00000000-0000-0000-0000-000000000000'; // Non-existent UUID
            const res = await gAgent.get(`${kRoutePrefix}/content/${nonExistentContentID}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    // Gets the requests of the given content ID, but the content ID is invalid.
    // Should return 400.
    describe(`GET ${kRoutePrefix}/content/:contentId with invalid ID`, function () {
        it(`should return ${httpStatus.BAD_REQUEST} for GET ${kRoutePrefix}/content/:contentId with invalid ID`, async function () {
            const invalidContentID = '00000000-0000-0000-0000-00000000000'; // Invalid UUID
            const res = await gAgent.get(`${kRoutePrefix}/content/${invalidContentID}`);
            
            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        });
    });

});