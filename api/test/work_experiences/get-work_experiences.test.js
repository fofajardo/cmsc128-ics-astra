import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

const kRoutePrefix = '/v1/work_experiences';

describe('Work Experiences API Tests', function() {    
    // Gets all work experiences
    // Should return 200.
    describe('GET /v1/work_experiences', function() {
        it(`should return 200 for GET ${kRoutePrefix}`, async function() {
            const res = await request(app)
                .get(kRoutePrefix)
                .query({page: 1, limit: 10});
            
            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    // Gets the work experience with the given ID
    describe(`GET ${kRoutePrefix}/:workExperienceId`, function() {
        it(`should return 200 for GET ${kRoutePrefix}/:workExperienceId`, async function() {
            const workExperienceID = '28820f4b-cef4-440a-a65f-f54b763b7e41';
            const res = await request(app).get(`${kRoutePrefix}/${workExperienceID}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);

            const workExperienceData = res.body.work_experience;
            expect(workExperienceData).to.have.property('id').that.is.a('string');
            expect(workExperienceData).to.have.property('alum_id').that.is.a('string');
            expect(workExperienceData).to.have.property('title').that.is.a('string');
            expect(workExperienceData).to.have.property('field').that.is.a('string');
            expect(workExperienceData).to.have.property('company').that.is.a('string');
            expect(workExperienceData).to.have.property('year_started').that.is.a('string');
            expect(workExperienceData).to.have.property('year_ended').to.satisfy(
                val => val === null || typeof val === 'string');
        });
    });

    // Gets the work experience with the given ID, but the ID is invalid.
    // Should return 404.
    describe(`GET ${kRoutePrefix}/:workExperienceId with invalid ID`, function() {
        it(`should return 404 for GET ${kRoutePrefix}/:workExperienceId with invalid ID`, async function() {
            const invalidWorkExperienceID = '00000000-0000-0000-0000-000000000000'; // Invalid UUID
            const res = await request(app).get(`${kRoutePrefix}/${invalidWorkExperienceID}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
        });
    });

    // Gets the work experience/s of the given alum ID
    // Should return 200.
    describe(`GET ${kRoutePrefix}/alum/:alumId`, function() {
        it(`should return 200 for GET ${kRoutePrefix}/alum/:alumId`, async function() {
            const alumID = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const res = await request(app).get(`${kRoutePrefix}/alum/${alumID}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('work_experiences').that.is.an('array');
        });
    });

    // Gets the work experience/s of the given alum ID, but the alum ID is invalid.
    // Should return 404.
    describe(`GET ${kRoutePrefix}/alum/:alumId with invalid ID`, function() {
        it(`should return 404 for GET ${kRoutePrefix}/alum/:alumId with invalid ID`, async function() {
            const invalidAlumID = '00000000-0000-0000-0000-000000000000'; // Invalid UUID
            const res = await request(app).get(`${kRoutePrefix}/${invalidAlumID}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
        });
    });

});