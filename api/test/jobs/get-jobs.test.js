import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Jobs API Tests', function () {

    describe('GET /v1/jobs', function () {
        it('should return 200 and a list of jobs', async function () {
            const res = await request(app)
                .get('/v1/jobs')
                .query();

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');

            // Validate jobs
            if (res.body.list.length > 0) {
                const job = res.body.list[0];
                expect(job).to.have.property('job_id').that.is.a('string');
                expect(job).to.have.property('job_title').that.is.a('string');
                expect(job).to.have.property('hiring_manager').that.is.a('string');
                expect(job).to.have.property('company_name').that.is.a('string');
                expect(job).to.have.property('salary').that.is.a('number');
                expect(job).to.have.property('apply_link').that.is.a('string');
                expect(job).to.have.property('location').that.is.a('string');
                expect(job).to.have.property('location_type').that.is.a('number').and.to.be.an('integer');
                expect(job).to.have.property('employment_type').that.is.a('number').and.to.be.an('integer');
                expect(new Date(job.created_at).toString()).to.not.equal('Invalid Date');
                expect(new Date(job.expires_at).toString()).to.not.equal('Invalid Date');
            }
        });

        it('should return filtered results based on created_at date range', async function () {
            const dateFrom = '2025-01-01T00:00:00.000Z';
            const dateTo = '2025-01-31T23:59:59.999Z';
            const res = await request(app)
                .get('/v1/jobs')
                .query({
                    created_at_from: dateFrom,
                    created_at_to: dateTo,
                });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');

            // Validate that the job items are within the date range
            if (res.body.list.length > 0) {
                res.body.list.forEach(job => {
                    const createdAt = new Date(job.created_at);
                    const from = new Date(dateFrom);
                    const to = new Date(dateTo);
                    expect(createdAt).to.be.greaterThan(from);
                    expect(createdAt).to.be.lessThan(to);
                });
            }
        });

        it('should return filtered results based on job title search', async function () {
            const titleSearch = 'Software Engineer';
            const res = await request(app)
                .get('/v1/jobs')
                .query({
                    job_title: titleSearch,
                });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');

            // Validate that all job items' titles contain the search string
            if (res.body.list.length > 0) {
                res.body.list.forEach(job => {
                    expect(job.job_title).to.include(titleSearch);
                });
            }
        });

        it('should return filtered results based on employment type', async function () {
            const employmentTypeSearch = 1;  // Example employment type (e.g., full-time)
            const res = await request(app)
                .get('/v1/jobs')
                .query({ employment_type: employmentTypeSearch });  // Pass employment type as a number

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');

            // Validate that all job items' employment type matches the search criteria
            if (res.body.list.length > 0) {
                res.body.list.forEach(job => {
                    expect(job.employment_type).to.equal(employmentTypeSearch);
                });
            }
        });

        it('should return sorted results based on salary', async function () {
            const res = await request(app)
                .get('/v1/jobs')
                .query({
                    sort_by: 'salary',
                    order: 'desc',
                });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');

            // Validate sorting by salary
            if (res.body.list.length > 0) {
                let prevSalary = res.body.list[0].salary;
                res.body.list.forEach(job => {
                    expect(job.salary).to.be.at.most(prevSalary);
                    prevSalary = job.salary;
                });
            }
        });
    });

    describe('GET /v1/jobs/:jobId', function () {
        it('should return 200 and details of a single job', async function () {
            const jobId = '800c7d53-20f3-4f55-9d1e-5e7855596348'; 
            const res = await request(app).get(`/v1/jobs/${jobId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('job').that.is.an('object');

            const job = res.body.job;

            expect(job).to.have.property('job_id').that.equals(jobId);
            expect(job).to.have.property('job_title').that.is.a('string');
            expect(job).to.have.property('hiring_manager').that.is.a('string');
            expect(job).to.have.property('company_name').that.is.a('string');
            expect(job).to.have.property('salary').that.is.a('number');
            expect(job).to.have.property('apply_link').that.is.a('string');
            expect(job).to.have.property('location').that.is.a('string');
            expect(job).to.have.property('location_type').that.is.a('number').and.to.be.an('integer');
            expect(job).to.have.property('employment_type').that.is.a('number').and.to.be.an('integer');
            expect(new Date(job.created_at).toString()).to.not.equal('Invalid Date');
            expect(new Date(job.expires_at).toString()).to.not.equal('Invalid Date');
        });
    });
});
