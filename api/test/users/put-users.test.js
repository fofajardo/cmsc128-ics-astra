import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('User API Tests', function () {

    describe('PUT /v1/users/:userId', function () {
        it('should return 200 and update valid user details', async function () {
            const userId = '12345'; //Example userId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/users/${userId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');
            
            const validUpdateData = {
                username: "user",
                email: "email@email.com",
                password: "password",
            };

            const res = await request(app)
                .put(`/v1/users/${userId}`)
                .send(validUpdateData);

            expect(res.status).to.equal(httpStatus.OK); //Ensures valid update
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['UPDATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');

            //GET request to verify update
            const verifyRes = await request(app).get(`/v1/users/${userId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.include(validUpdateData); //Ensures data is correctly updated
        });

        it('should not allow editing of name and role', async function () {
            const userId = '12345'; //Example userId
            const invalidUpdateData = {
                firstName: "User",  // attempt to change name
                middleName: 'User',  
                lastName: 'User',  
                role: "User", //attempt to change role
            };

            const res = await request(app)
                .put(`/v1/users/${userId}`)
                .send(invalidUpdateData);

            expect(res.status).to.equal(httpStatus.FORBIDDEN); //Ensures update is not allowed
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });
});