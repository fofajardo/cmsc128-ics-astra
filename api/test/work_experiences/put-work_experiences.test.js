import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { TestSignIn, TestSignOut, TestUsers } from '../auth/auth.common.js';
const gAgent = request.agent(app);

const kRoutePrefix = '/v1/work_experiences';

describe ('Work Experiences API Tests', function () {

    before(() => TestSignIn(gAgent, TestUsers.moderator));

    describe(`PUT ${kRoutePrefix}/:workExperienceId`, function () {
        
        let workExperienceId = null;

        // ✅ Precondition: Create a work experience before running put tests
        before(async function () {
            const testWorkExperience = {
                user_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
                title: 'test title',
                field: 'test field',
                company: 'test company',
                year_started: new Date('2020-01-01'),
                year_ended: new Date('2021-01-01'),
                salary: 50000
            };

            const res = await gAgent
                .post(`${kRoutePrefix}`)
                .send(testWorkExperience);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            workExperienceId = res.body.id;
        });

        // try to update the work experience with valid data and for valid fields
        it('should return 200 and update valid work experience details', async function () {
            // Check if row exists before updating
            const preCheckRes = await gAgent.get(`${kRoutePrefix}/${workExperienceId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');
            
            const validUpdateData = {
                title: 'Updated Title',
                field: 'Updated Field',
                company: 'Updated Company',
                year_started: new Date('2021-01-01'),
                year_ended: new Date('2022-01-01'),
                salary: 60000,
            };

            const res = await gAgent
                .put(`${kRoutePrefix}${workExperienceId}`)
                .send(validUpdateData);

            expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
            expect(res.body).to.be.an('object');

            // GET request to verify update
            const verifyRes = await gAgent.get(`${kRoutePrefix}${workExperienceId}`);
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

        // Test case to verify that the API returns 200 for partial update
        it('should return 200 and update some work experience details', async function () {
            // Check if row exists before updating
            const preCheckRes = await gAgent.get(`${kRoutePrefix}/${workExperienceId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            const partialValidUpdateData = {
                title: 'Partially Updated Title',
            };

            const res = await gAgent
                .put(`${kRoutePrefix}/${workExperienceId}`)
                .send(partialValidUpdateData);

            expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.equals('UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await gAgent.get(`${kRoutePrefix}/${workExperienceId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.work_experience).to.be.an('object');
            expect(verifyRes.body.work_experience).to.have.property('title', partialValidUpdateData.title);
        });

        // Invalid field values (year_started, year_ended, salary)
        it('should return 400, status FAILED, and a message when invalid field values are provided', async function () {
            // Check if row exists before updating
            const preCheckRes = await gAgent.get(`${kRoutePrefix}/${workExperienceId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            const invalidUpdateData = {
                year_started: 'invalid-date',  // Invalid date format
                year_ended: 'invalid-date',    // Invalid date format
                salary: 'not-a-number',        // Invalid number format
            };

            const res = await gAgent
                .put(`${kRoutePrefix}${workExperienceId}`)
                .send(invalidUpdateData);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST); // Ensures invalid update
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.equals('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // try to update a restricted field (user_id)
        it('should return 403 and not allow editing of restricted field user_id', async function () {
            const invalidUpdateData = {
                user_id: '00000000-0000-0000-0000-000000000000',  // Attempt to change user_id
            };

            const res = await gAgent
                .put(`${kRoutePrefix}/${workExperienceId}`)
                .send(invalidUpdateData);
            
            expect(res.status).to.equal(httpStatus.FORBIDDEN); // Ensures user_id cannot be changed
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
            if(workExperienceId) {
                const res = await gAgent
                    .delete(`${kRoutePrefix}/${workExperienceId}`);
                
                if (res.body.status === 'DELETED') {
                    console.log('Successfully deleted test work experience.');
                }
                else {
                    console.log('Failed to delete test work experience.');
                }
            }           
        });

        after(() => TestSignOut(gAgent, TestUsers.moderator));
    });
});