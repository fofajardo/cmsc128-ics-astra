import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';


describe('Alumni API Tests', function () {

    describe('GET /v1/events', function () {
        it('should return 200 for GET /v1/events', async function () {
            const res = await request(app)
                .get('/v1/events')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    describe('GET /v1/events/:eventId', function () {
        it('should return 200 for GET /v1/events/eventId', async function () {

            const event_id = 'f9b7efab-003c-44f9-bea7-c856fb1e73cd';
            const res = await request(app).get(`/v1/events/${event_id}`);

            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.status).to.equal(httpStatus.OK);

            expect(res.body).to.have.property('event').that.is.an('object');

            const eventData = res.body.event;

            expect(eventData).to.have.property('event_date');

            const eventDate = eventData.event_date;

            const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
            expect(isoDateRegex.test(eventDate)).to.be.true;

            expect(eventData).to.have.property('venue').that.is.a('string');
            expect(eventData).to.have.property('external_link').that.is.a('string');
            expect(eventData).to.have.property('access_link').that.is.a('string');
            expect(eventData).to.have.property('interested_count').that.is.a('number');
            expect(eventData).to.have.property('going_count').that.is.a('number');
            expect(eventData).to.have.property('not_going_count').that.is.a('number');
            expect(eventData).to.have.property('online').that.is.a('boolean');

        });
    });
});