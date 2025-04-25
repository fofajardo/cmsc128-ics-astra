import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { TestSignIn, TestSignOut, TestUsers } from '../auth/auth.common.js';
const gAgent = request.agent(app);

const kRoutePrefix = '/v1/work_experiences';

describe('Work Experiences API Tests', function() {
    this.timeout(4000); // Set timeout to 10 seconds

    before(() => TestSignIn(gAgent, TestUsers.moderator));

    describe('POST /v1/work_experiences', function() {
        const testWorkExperience = {
            user_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
            title: 'Test Title',
            field: 'Test Field',
            company: 'Test Company',
            year_started: new Date('2020-03-01'),
            year_ended: null,
            salary: 40000
        };

        let createdWorkExperienceId = null;

        // ✅ Successfully creates a work experience
        it('should return 201, status CREATED, a message, and an id', async function () {
            const res = await gAgent
                .post(kRoutePrefix)
                .send(testWorkExperience);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('id');

            createdWorkExperienceId = res.body.id;
        });

        // ❌ Required fields missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await gAgent
                .post(kRoutePrefix)
                .send({});

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // ❌ Invalid user_id
        it('should return 500, status FAILED, and a message when user_id is invalid', async function () {
            const res = await gAgent
                .post(kRoutePrefix)
                .send({
                    ...testWorkExperience,
                    user_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID
                });
            
            expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // 🧹 Clean up using DELETE route
        after(async function() {
            if (createdWorkExperienceId) {
                const res = await gAgent
                    .delete(`${kRoutePrefix}/${createdWorkExperienceId}`);
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