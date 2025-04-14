import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Organizations API Tests', function () {

    describe('GET /v1/organizations', function () {
        it('should return 200 and a list of organizations', async function () {
            const res = await request(app)
                .get('/v1/organizations')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'OK');
            expect(res.body).to.have.property('organization').that.is.an('array');
        });
    });

    describe('GET /v1/organizations/:orgId', function () {
        it('should return 200 and details of a single project', async function () {
            const orgId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; // Actual orgId
            const res = await request(app).get(`/v1/organizations/${orgId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);

            const orgData = res.body.organization;

            expect(orgData).to.have.property('name').that.is.a('string');
            expect(orgData).to.have.property('acronym').that.is.a('string');
            expect(orgData).to.have.property('type').that.is.a('number');
            expect(orgData).to.have.property('founded_date').that.satisfies(date => date === null || new Date(date).toString() != 'Invalid Date');
           // expect(orgData).to.have.property('created_at').that.satisfies(date => date === null || new Date(date).toString() != 'Invalid Date');
        });

        // Test case to verify that the API returns 400 if invalid orgId
        it('should return 400, status FAILED, and a message when projectId is invalid', async function () {
            const invalidOrgId = '00000000-0000-0000-0000-000000000000'; // Invalid org ID
            const res = await request(app).get(`/v1/organizations/${invalidOrgId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if the orgId does not exist in the system
        it('should return 404, status FAILED, and a message when organization does not exist', async function () {
            const notExistingOrgId = '7f857ca0-fcca-4c5b-b619-d0612597dbb2'; // Non-existing orgId
            const res = await request(app).get(`/v1/projects/${notExistingOrgId}`);

            // console.log(res);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    describe('GET /v1/organizations/:orgId/alumni', function () {
        it('should return 200 and a list of donations to the project', async function () {
            const orgId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; // Actual alumId
            const res = await request(app).get(`/v1/organizations/${orgId}/alumni`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'OK');
            expect(res.body).to.have.property('alumni').to.be.an('array');
        });
    });
});