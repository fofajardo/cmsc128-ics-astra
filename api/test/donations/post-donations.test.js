import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Donations API Tests', function () {
    describe('POST /v1/donations', function () {
        let donationId;

        after(async function () {
            const res = await request(app)
                .delete(`/v1/donations/${donationId}`);
            if (res.body.status === 'DELETED') {
                console.log('Successfully deleted dummy donation');
            } else
                console.log('Failed to delete dummy donation');
        });

        // Test case to verify that the API returns 400 if required fields are missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await request(app)
                .post(`/v1/donations`)
                .send({});

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').that.is.a('null');
        });

         // Test case to verify that the API returns 400 if invalid projectId
         it('should return 400, status FAILED, and a message when projectId is invalid', async function () {
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const invalidProjectId = '7f857ca0-fcca-9c5b-b619-d0612597dbb1';    // invalid project_id
            const res = await request(app)
                .post(`/v1/donations`)
                .send({
                    user_id: userId,
                    project_id: invalidProjectId,
                    donation_date: new Date('2025-04-13'),
                    reference_num: '1234-abvc-1234',
                    mode_of_payment: 0,
                    amount: 8000
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').that.is.a('null');
        });

        // Test case to verify that the API returns 400 if invalid user_id
        it('should return 400, status FAILED, and a message when user_id is invalid', async function () {
            const invaliduserId = '389517e7-9a0b-9c96-84f9-3a7080186892'; // Invalid alum ID
            const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1';
            const res = await request(app)
                .post(`/v1/donations`)
                .send({
                    user_id: invaliduserId, // invalid user_id
                    project_id: projectId,
                    donation_date: new Date('2025-04-13'),
                    reference_num: '1234-abvc-1234',
                    mode_of_payment: 0,
                    amount: 8000
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').that.is.a('null');
        });

        // Test case to verify that the API returns 400 if invalid date
        it('should return 400, status FAILED, and a message when date is invalid', async function () {
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1';
            const res = await request(app)
                .post(`/v1/donations`)
                .send({
                    user_id: userId,
                    project_id: projectId,
                    donation_date: new Date('invalid-date'),    // invalid date
                    reference_num: '1234-abvc-1234',
                    mode_of_payment: 0,
                    amount: 8000
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').that.is.a('null');
        });

        // Test case to verify that the donation is created successfully
        it('should return 201, status CREATED, a message, and an id', async function () {
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1';
            const res = await request(app)
                .post(`/v1/donations`)
                .send({
                    user_id: userId,
                    project_id: projectId,
                    donation_date: new Date('2025-04-13'),
                    reference_num: '1234-abvc-1234',
                    mode_of_payment: 0,
                    amount: 8000
                });

            console.log(res.body);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').that.is.a('string');
            donationId = res.body['id'];
            console.log(res.body['id']);
        });

        // Test case to verify that the API returns 404 if the projectId does not exist in the system
        it('should return 404, status FAILED, and a message when projectId does not exist', async function () {
            const userId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const notExistingProjectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb2';
            const res = await request(app)
                .post(`/v1/donations`)
                .send({
                    user_id: userId,
                    project_id: notExistingProjectId,
                    donation_date: new Date('2025-04-13'),
                    reference_num: '1234-abvc-1234',
                    mode_of_payment: 0,
                    amount: 8000
                });

            // console.log(res.body);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });

        // Test case to verify that the API returns 404 if the userId does not exist in the system
        it('should return 404, status FAILED, and a message when userId does not exist', async function () {
            const notExistinguserId = 'b7085d72-f174-4b81-b106-ef68b27a48e5';
            const projectId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1';
            const res = await request(app)
                .post(`/v1/donations`)
                .send({
                    user_id: notExistinguserId,
                    project_id: projectId,
                    donation_date: new Date('2025-04-13'),
                    reference_num: '1234-abvc-1234',
                    mode_of_payment: 0,
                    amount: 8000
                });

            // console.log(res.body);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });
    });
});