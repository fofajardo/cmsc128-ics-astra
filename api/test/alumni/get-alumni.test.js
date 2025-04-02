import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Alumni API Tests', function () {

    describe('GET /v1/alumni', function () {
        it('should return 200 and a list of alumni', async function () {
            const res = await request(app)
                .get('/v1/alumni')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    describe('GET /v1/alumni/:userId', function () {
        it('should return 200 and details of a single alumnus', async function () {
            const userId = '12345'; // Example userId, replace with an actual test user ID
            const res = await request(app).get(`/v1/alumni/${userId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('birthdate');
            expect(new Date(res.body.birthdate).toString()).to.not.equal('Invalid Date');

            expect(res.body).to.have.property('location').that.is.a('string');
            expect(res.body).to.have.property('address').that.is.a('string');
            expect(res.body).to.have.property('gender').that.is.a('string');
            expect(res.body).to.have.property('studentNum').that.is.a('string');
            expect(res.body).to.have.property('citizenship').that.is.a('string');
            expect(res.body).to.have.property('degreeProgram').that.is.a('string');

            expect(res.body).to.have.property('yearGraduated');
            expect(new Date(res.body.yearGraduated).toString()).to.not.equal('Invalid Date');

            expect(res.body).to.have.property('skills').that.is.a('string');
            expect(res.body).to.have.property('field').that.is.a('string');
            expect(res.body).to.have.property('jobTitle').that.is.a('string');
            expect(res.body).to.have.property('company').that.is.a('string');

        });
    });
});
