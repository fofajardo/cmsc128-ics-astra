import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Donations API Tests', function () {

    describe('PUT /v1/donations/:donationId', function () {
        it('should return 200 and update valid donation details', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91'; // Actual donationId
            const alumId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/donations/${donationId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await request(app).get(`/v1/donations/${donationId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.donation).to.be.an('object');
            expect(verifyRes.body.donation).to.have.property('alum_id', validUpdateData.alum_id);
            expect(verifyRes.body.donation).to.have.property('project_id', validUpdateData.project_id);
            expect(verifyRes.body.donation).to.have.property('donation_date', dateString);
            expect(verifyRes.body.donation).to.have.property('reference_num', validUpdateData.reference_num);
            expect(verifyRes.body.donation).to.have.property('mode_of_payment', validUpdateData.mode_of_payment);
            expect(verifyRes.body.donation).to.have.property('amount', validUpdateData.amount);
        });

        // Test case to verify that the API returns 200 for partial updates
        it('should return 200 and update donation modeOfPayment', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91'; // Actual donationId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/donations/${donationId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const validUpdateData = {
                mode_of_payment: 0,
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'UPDATED');
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await request(app).get(`/v1/donations/${donationId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body).to.be.an('object');

            // Ensures data is correctly updated
            expect(verifyRes.body.donation).to.be.an('object');
            expect(verifyRes.body.donation).to.have.property('mode_of_payment', validUpdateData.mode_of_payment);
        });

        // Test case to verify that the API returns 400 if invalid donationId
        it('should return 400, status FAILED, and a message when invalid donationId', async function () {
            const donationId = 'invalid-donation-id';       // invalid donationId
            const alumId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 400 if invalid alumId
        it('should return 400, status FAILED, and a message when invalid alumId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91';
            const alumId = 'invalid-alum-id';       // invalid alumId
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 400 if invalid projectId
        it('should return 400, status FAILED, and a message when invalid projectId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91';
            const alumId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = 'invalid-project-id';     // invalid projectId

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if non-existing donationId
        it('should return 404, status FAILED, and a message when non-existing donationId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f92';  // non-existing donationId
            const alumId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if non-existing projectId
        it('should return 404, status FAILED, and a message when non-existing projectId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91'; // Actual donationId
            const alumId = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73ce';   // non-existing projectId

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/donations/${donationId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if non-existing alumId
        it('should return 404, status FAILED, and a message when non-existing alumId', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91'; // Actual donationId
            const alumId = 'b7085d72-f174-4b81-b106-ef68b27a48ef';      // non-existing alumId
            const projectId = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';

            //Precondition: Ensure the row exists before updating
            const preCheckRes = await request(app).get(`/v1/donations/${donationId}`);
            expect(preCheckRes.status).to.equal(httpStatus.OK);
            expect(preCheckRes.body).to.be.an('object');

            // console.log(preCheckRes.body);

            const dateString = '2025-04-13';

            const validUpdateData = {
                alum_id: alumId,
                project_id: projectId,
                donation_date: new Date(dateString).toISOString(),
                reference_num: '4321-cvba-4321',
                mode_of_payment: 1,
                amount: 5000
            };

            const res = await request(app)
                .put(`/v1/donations/${donationId}`)
                .send(validUpdateData);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });
});