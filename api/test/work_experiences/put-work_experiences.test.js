import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

const kRoutePrefix = '/v1/work_experiences/';

describe ('Work Experiences API Tests', function () {
    describe(`PUT ${kRoutePrefix}:workExperienceId`, function () {
        let workExperienceId = null;

        // ✅ Precondition: Create a work experience before running put tests
        before(async function () {
            const testWorkExperience = {
                alum_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
                title: 'test title',
                field: 'test field',
                company: 'test company',
                year_started: new Date('2020-01-01'),
                year_ended: new Date('2021-01-01'),
            };

            const res = await request(app)
                .post(`${kRoutePrefix}`)
                .send(testWorkExperience);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            workExperienceId = res.body.id;
        });

        // try to update the work experience with valid data and for valid fields
        it('should return 200 and update valid work experience details', async function () {
            const validUpdateData = {
                title: 'Updated Title',
                field: 'Updated Field',
                company: 'Updated Company',
                year_started: new Date('2021-01-01'),
                year_ended: new Date('2022-01-01'),
            };

            const res = await request(app)
                .put(`${kRoutePrefix}${workExperienceId}`)
                .send(validUpdateData);

            expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['UPDATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await request(app).get(`${kRoutePrefix}${workExperienceId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');
            // year_started and year_ended should be in YYYY-MM-DD format
            // verifyRes.body returns those fields with a timezone
            expect(verifyRes.body.work_experience).to.include({
                ...validUpdateData,
                year_started: validUpdateData.year_started.toISOString().split('T')[0],
                year_ended: validUpdateData.year_ended.toISOString().split('T')[0],
            });
        });

        // try to update a restricted field (alum_id)
        it('should return 403 and not allow editing of restricted field alum_id', async function () {
            const invalidUpdateData = {
                alum_id: '00000000-0000-0000-0000-000000000000',  // Attempt to change alum_id
            };

            const res = await request(app)
                .put(`${kRoutePrefix}${workExperienceId}`)
                .send(invalidUpdateData);
            
            expect(res.status).to.equal(httpStatus.FORBIDDEN); // Ensures alum_id cannot be changed
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
            if(workExperienceId) {
                const res = await request(app)
                    .delete(`${kRoutePrefix}${workExperienceId}`);
                
                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
            }           
        });
    });
});