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
            const userId = 'b4a6b230-20b9-4137-af62-8b535841c391'; // Example userId, replace with an actual test user ID
            const res = await request(app).get(`/v1/alumni/${userId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('alumni').to.be.an('object');

            const alumniData = res.body.alumni;

            expect(alumniData).to.have.property('birthdate');
            expect(new Date(alumniData.birthdate).toString()).to.not.equal('Invalid Date');

            expect(alumniData).to.have.property('location').that.is.a('string');
            expect(alumniData).to.have.property('address').that.is.a('string');
            expect(alumniData).to.have.property('gender').that.is.a('string');
            expect(alumniData).to.have.property('student_num').that.is.a('string');
            expect(alumniData).to.have.property('citizenship').that.is.a('string');
            expect(alumniData).to.have.property('degree_program').that.is.a('string');

            expect(alumniData).to.have.property('year_graduated');
            expect(new Date(alumniData.year_graduated).toString()).to.not.equal('Invalid Date');

            expect(alumniData).to.have.property('skills').that.is.a('string');
            expect(alumniData).to.have.property('field').that.is.a('string');
            expect(alumniData).to.have.property('job_title').that.is.a('string');
            expect(alumniData).to.have.property('company').that.is.a('string');

        });
    });
});