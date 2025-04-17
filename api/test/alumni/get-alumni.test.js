import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { isValidAlpha3Citizenship } from '../../utils/validators.js';

describe('Alumni Profile API Tests', function () {

    describe('GET /v1/alumniProfiles', function () {
        it('should return 200 and a list of alumni', async function () {
            const res = await request(app)
                .get('/v1/alumniProfiles')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    describe('GET /v1/alumniProfiles/:userId', function () {
        it('should return 200 and details of a single alumni profile', async function () {
            const userId = 'b4a6b230-20b9-4137-af62-8b535841c391';
            const res = await request(app).get(`/v1/alumniProfiles/${userId}`);

            console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('alumniProfile').to.be.an('object');

            const alumniProfile = res.body.alumniProfile;

            expect(alumniProfile).to.have.property('birthdate');
            expect(new Date(alumniProfile.birthdate).toString()).to.not.equal('Invalid Date');

            expect(alumniProfile).to.have.property('location').that.is.a('string');
            expect(alumniProfile).to.have.property('address').that.is.a('string');
            expect(alumniProfile).to.have.property('gender').that.is.a('string');
            expect(alumniProfile).to.have.property('student_num').that.is.a('string');
            expect(alumniProfile).to.have.property('degree_program').that.is.a('string');
            // TODO check if degree program is an id of a degree program
            
            expect(alumniProfile).to.have.property('year_graduated');
            expect(new Date(alumniProfile.year_graduated).toString()).to.not.equal('Invalid Date');
            
            expect(alumniProfile).to.have.property('skills').that.is.a('string');
            expect(alumniProfile).to.have.property('honorifics').that.is.a('string');

            expect(alumniProfile).to.have.property('citizenship').that.is.a('string');
            expect(isValidAlpha3Citizenship(alumniProfile.citizenship)).to.be.true;

            expect(alumniProfile).to.have.property('sex').that.is.oneOf([0, 1]);

            expect(alumniProfile).to.have.property('primary_work_experience_id').that.is.a('string');
            // TODO check if primary work experience exists

        });
    });
});