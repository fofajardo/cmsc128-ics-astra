import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Jobs API Tests', function () {
    describe('POST /v1/jobs', function () {
        // Test case #1: Succesful Job Creation
        it('should return 201 and a status', async function () {
            const res = await request(app)
                .post('/v1/jobs')
                .send({
                    job_title: 'Junior Frontend Developer',
                    hiring_manager: 'Juan dela Cruz',
                    company_name: 'Astra Devs',
                    salary: 37500,
                    apply_link: 'bit.ly/applyAtAstra'
                });

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
        });

        // Test case #2: Failed Job Creation due to missing required fields
        it('should return 400 if a field is missing', async function () {
            const res = await request(app)
                .post('/v1/jobs')
                .send({
                    hiring_manager: 'Juan dela Cruz', // job title is missing
                    company_name: 'Astra Devs',
                    salary: 37500,
                    apply_link: 'bit.ly/applyAtAstra'
                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
        });

        // Test case #3: Failed Job Creation due to invalid data type in fields
        it('should return 400 if field/s have wrong data type', async function () {
            const res = await request(app)
                .post('/v1/jobs')
                .send({
                    job_title: 'UI/UX Designer',
                    hiring_manager: 'Anish Guru',
                    company_name: 'Astra Devs',
                    salary: 37500,
                    apply_link: 21 // invalid data tyoe
                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
        });

    });
});