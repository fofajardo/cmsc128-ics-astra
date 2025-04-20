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

    describe('GET /v1/organizations/:id', function () {
        it('should return 200 and details of a single project', async function () {
            const id = '2ec78beb-da60-435d-bbe1-b48f25b29326'; // Actual id
            const res = await request(app).get(`/v1/organizations/${id}`);
            console.log(res.body);
            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);

            const orgData = res.body.organization;

            expect(orgData).to.have.property('name').that.is.a('string');
            expect(orgData).to.have.property('acronym').that.is.a('string');
            expect(orgData).to.have.property('type').that.is.a('number');
            expect(orgData).to.have.property('founded_date').that.satisfies(date => date === null || new Date(date).toString() != 'Invalid Date');
           expect(orgData).to.have.property('created_at');
        });


        // Test case to verify that the API returns 404 if the id does not exist in the system
        it('should return 404, status FAILED, and a message when organization does not exist', async function () {
            const notExistingid = '7f857ca0-fcca-4c5b-b619-d0612597dbb2'; // Non-existing id
            const res = await request(app).get(`/v1/organizations/${notExistingid}`);

            // console.log(res);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    // describe('GET /v1/organizations/:id/alumni', function () {
    //     it('should return 200 and a list of alumni affiliated to the organization', async function () {
    //         const id = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; // Actual alumId
    //         const res = await request(app).get(`/v1/organizations/${id}/alumni`);

    //         expect(res.status).to.equal(httpStatus.OK);
    //         expect(res.body).to.be.an('object');

    //         expect(res.body).to.have.property('status', 'OK');
    //         expect(res.body).to.have.property('alumni').to.be.an('array');
    //     });
    // });
});