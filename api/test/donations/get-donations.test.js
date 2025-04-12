import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Donations API Tests', function () {

    describe('GET /v1/donations', function () {
        it('should return 200 and a list of donations', async function () {
            const res = await request(app)
                .get('/v1/donations')
                .query({ page: 1, limit: 10 });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'OK');
            expect(res.body).to.have.property('donations').that.is.an('array');
        });
    });

    describe('GET /v1/donations/:donationId', function () {
        it('should return 200 and details of a single donation', async function () {
            const donationId = '39f817bf-7301-4a60-bb59-7f29c05d7f91';  // Actual donationId
            const res = await request(app).get(`/v1/donations/${donationId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status', 'OK');
            expect(res.body).to.have.property('donation').to.be.an('object');

            const donationData = res.body.donation;

            expect(donationData).to.have.property('id');

            expect(donationData).to.have.property('alum_id');

            expect(donationData).to.have.property('project_id');

            expect(donationData).to.have.property('donation_date');
            expect(new Date(donationData.donation_date).toString()).to.not.equal('Invalid Date');

            expect(donationData).to.have.property('reference_num').that.is.a('string');

            expect(donationData).to.have.property('mode_of_payment').that.is.oneOf([0, 1]);

            expect(donationData).to.have.property('amount').that.is.a('number');
        });

        // Test case to verify that the API returns 400 if invalid donationId
        it('should return 400, status FAILED, and a message when donationId is invalid', async function () {
            const invalidDonationId = '00000000-0000-0000-0000-000000000000'; // Invalid project ID
            const res = await request(app).get(`/v1/donations/${invalidDonationId}`);

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case to verify that the API returns 404 if the donationId does not exist in the system
        it('should return 404, status FAILED, and a message when project does not exist', async function () {
            const notExistingDonationId = '39f817bf-7301-4a60-bb59-7f29c05d7f92'; // Non-existing donationId
            const res = await request(app).post(`/v1/donations/${notExistingDonationId}`);

            // console.log(res.body);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });
    });
});