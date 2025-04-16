import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Events API Tests', function () {
    describe('POST /v1/events', function () {
        // Test case #1: Succesful Event Creation
        it('should return 201 and a status', async function () {
            const res = await request(app)
                .post('/v1/events')
                .send({
                    event_date: new Date('2025-04-14'),
                    venue: 'EB Copeland Gym',
                    external_link: 'bit.ly/PalICSihan-FBPage',
                    access_link: '',
                    interested_count: 0,
                    going_count: 0,
                    not_going_count: 0,
                    online: false
                });

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').that.is.a('string');
        });

        // Test case #2: Failed Event Creation due to missing required fields
        it('should return 400 if a field is missing', async function () {
            const res = await request(app)
                .post('/v1/events')
                .send({
                    event_date: new Date('2025-08-14'),
                    venue: 'NCAS Auditorium',
                    external_link: 'bit.ly/info-link',
                    access_link: '',
                    interested_count: 0,
                    going_count: 0,
                    not_going_count: 0 // missing online field
                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // Test case #3: Failed Event Creation due to invalid data type in fields
        it('should return 400 if field/s have wrong data type', async function () {
            const res = await request(app)
                .post('/v1/events')
                .send({
                    event_date: new Date('2025-08-14'),
                    venue: 'NCAS Auditorium',
                    external_link: 'bit.ly/info-link',
                    access_link: '',
                    interested_count: 0,
                    going_count: 0,
                    not_going_count: 0,
                    online: 'yes' // invalid data type
                });

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['CREATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');
        });

    });
});