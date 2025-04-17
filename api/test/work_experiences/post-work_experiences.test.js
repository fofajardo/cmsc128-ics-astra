import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Work Experiences API Tests', function() {
    describe('POST /v1/work_experiences/', function() {
        const testWorkExperience = {
            alum_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
            title: 'Test Title',
            field: 'Test Field',
            company: 'Test Company',
            year_started: new Date('2020-03-01'),
            year_ended: null,
        };

        let createdWorkExperienceId = null;

        // ✅ Successfully creates a work experience
        it('should return 201, status CREATED, a message, and an id', async function () {
            const res = await request(app)
                .post(`/v1/work_experiences/`)
                .send(testWorkExperience);

            console.log(res.body);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('id');

            createdWorkExperienceId = res.body.id;
        });

        // ❌ Required fields missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await request(app)
                .post(`/v1/work_experiences/`)
                .send({});

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // ❌ Invalid alum_id
        it('should return 500, status FAILED, and a message when alum_id is invalid', async function () {
            const res = await request(app)
                .post(`/v1/work_experiences/`)
                .send({
                    ...testWorkExperience,
                    alum_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID
                });
            
            console.log(res.body);

            expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // 🧹 Clean up using DELETE route
        after(async function() {
            if (createdWorkExperienceId) {
                const res = await request(app)
                    .delete(`/v1/work_experiences/${createdWorkExperienceId}`);
                
                console.log(res.body);

                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
            }
        });
    });
});