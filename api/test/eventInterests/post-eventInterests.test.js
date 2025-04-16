import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Event Interest API Tests', function () {
    describe('POST /v1/eventInterests/', function () {
        // Test case for succesful event interest creation
        it('should return 201 and a status', async function () {
            const res = await request(app)
                .post('/v1/eventInterests')
                .send({
                    alumnId: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
                    contentId: "4b02a71e-8e52-42ce-b545-a2f0960f1d16"
                });

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case for failed event interests creation due to missing required fields
        it('should return 400 if a field is missing', async function () {
            const res = await request(app)
                .post('/v1/eventInterests')
                .send({
                    alumnId: "75b6e610-9d0b-4884-b405-1e682e3aa3de",

                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case for failed event interests creation due to invalid data type in fields
        it('should return 400 if field/s have wrong data type', async function () {
            const res = await request(app)
                .post('/v1/eventInterests')
                .send({
                    alumnId: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
                    contentId: 0
                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });

    });
});