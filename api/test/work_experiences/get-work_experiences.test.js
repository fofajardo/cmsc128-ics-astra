import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { TestSignIn, TestSignOut, TestUsers } from '../auth/auth.common.js';
const gAgent = request.agent(app);

const kRoutePrefix = "/v1/work-experiences";

describe('Work Experiences API Tests', function() {    
    // Sign in as a moderator before running the tests
    before(() => TestSignIn(gAgent, TestUsers.moderator));

    // Gets all work experiences
    // Should return 200.
    describe('GET /v1/work-experiences/', function() {
        it(`should return 200 for GET ${kRoutePrefix}/`, async function() {
            const res = await gAgent

                .get(kRoutePrefix)
                .query({page: 1, limit: 10});
            
            console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    // Gets the work experience with the given ID
    describe(`GET ${kRoutePrefix}/:workExperienceId`, function() {
        it(`should return 200 for GET ${kRoutePrefix}/:workExperienceId`, async function() {
            const workExperienceID = '4d0e7786-f81c-49da-978b-d42443896818';
            const res = await gAgent.get(`${kRoutePrefix}/${workExperienceID}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);

            const workExperienceData = res.body.work_experience;
            expect(workExperienceData).to.have.property('id').that.is.a('string');
            expect(workExperienceData).to.have.property('user_id').that.is.a('string');
            expect(workExperienceData).to.have.property('title').that.is.a('string');
            expect(workExperienceData).to.have.property('field').that.is.a('string');
            expect(workExperienceData).to.have.property('company').that.is.a('string');
            expect(workExperienceData).to.have.property('year_started').that.is.a('string');
            expect(workExperienceData).to.have.property('year_ended').to.satisfy(
                val => val === null || typeof val === 'string');
            expect(workExperienceData).to.have.property('salary').to.satisfy(
                val => val === null || typeof val === 'number');
        });
    });

    // Gets the work experience with the given ID, but the ID is invalid.
    // Should return 404.
    describe(`GET ${kRoutePrefix}/:workExperienceId with invalid ID`, function() {
        it(`should return 404 for GET ${kRoutePrefix}/:workExperienceId with invalid ID`, async function() {
            const invalidWorkExperienceID = '00000000-0000-0000-0000-000000000000'; // Invalid UUID
            const res = await gAgent.get(`${kRoutePrefix}/${invalidWorkExperienceID}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
        });
    });

    // Gets the work experience/s of the given user ID
    // Should return 200.
    describe(`GET ${kRoutePrefix}/alum/:alumId`, function() {
        it(`should return 200 for GET ${kRoutePrefix}/alum/:alumId`, async function() {
            const alumID = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const res = await gAgent.get(`${kRoutePrefix}/alum/${alumID}`);

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

    after(() => TestSignOut(gAgent));

});