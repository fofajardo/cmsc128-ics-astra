import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js';
import httpStatus from 'http-status-codes';

describe('Alumni API Tests', function () {

    describe('PUT /v1/alumni/:userId', function () {
        it('should return 200 and update valid alumni details', async function () {
            const userId = '12345'; //Example userId
            const validUpdateData = {
                location: 'Los Banos',
                address: 'Batong Malake',
                gender: 'Male',
                citizenship: 'Filipino',
                degreeProgram: 'Computer Science',
                yearGraduated: '2020-08-01',
                skills: 'JavaScript, Python',
                field: 'Software Development',
                jobTitle: 'Software Engineer',
                company: 'Microsoft'
            };

            const res = await request(app)
                .put(`/v1/alumni/${userId}`)
                .send(validUpdateData);

            expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['UPDATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        it('should not allow editing of birthdate or studentNumber', async function () {
            const userId = '12345';         // Example userId
            const invalidUpdateData = {
                birthdate: '2000-01-01',    // Attempt to change birthdate
                studentNumber: '12345'      // Attempt to change student number
            };

            const res = await request(app)
                .put(`/v1/alumni/${userId}`)
                .send(invalidUpdateData);

            expect(res.status).to.equal(httpStatus.FORBIDDEN); // Ensures update is not allowed
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
            expect(res.body).to.have.property('message').that.includes('Editing birthdate or studentNumber is not allowed');
        });
    });
});
