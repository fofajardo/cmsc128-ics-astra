import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js';
import httpStatus from 'http-status-codes';

describe('Alumni API Tests', function () {

    describe('PUT /v1/alumni/:userId', function () {
        it('should return 200 and update valid alumni details', async function () {
            const userId = '75b6e610-9d0b-4884-b405-1e682e3aa3de';

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/alumni/${userId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');
            
            const validUpdateData = {
                location: 'Los Banos',
                address: 'Batong Malake',
                gender: 'Male',
                citizenship: 'Filipino',
                degree_program: 'Computer Science', 
                year_graduated: '2020-08-01', 
                skills: 'JavaScript, Python',
                field: 'Software Development',
                job_title: 'Software Engineer', 
                company: 'Microsoft',
                honorifics: 'Dr.'
            };

            const res = await request(app)
                .put(`/v1/alumni/${userId}`)
                .send(validUpdateData);

            expect(res.status).to.equal(httpStatus.OK); //Ensures valid update
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['UPDATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');

            //GET request to verify update
            const verifyRes = await request(app).get(`/v1/alumni/${userId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.include(validUpdateData); //Ensures data is correctly updated
        });

        it('should not allow editing of birthdate or student_num', async function () {
            const userId = '75b6e610-9d0b-4884-b405-1e682e3aa3de';
            const invalidUpdateData = {
                birthdate: '2000-01-01', //Attempt to change birthdate
                student_num: '12345' //Attempt to change student number
            };

            const res = await request(app)
                .put(`/v1/alumni/${userId}`)
                .send(invalidUpdateData);

            expect(res.status).to.equal(httpStatus.FORBIDDEN); //Ensures update is not allowed
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
            expect(res.body).to.have.property('message').that.includes('Editing birthdate or student_num is not allowed');
        });
    });
});
