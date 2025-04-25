import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';


describe('Event Interest API Tests', function () {

    // Test case for getting all the instance of event interests
    describe('GET /v1/event-interests', function () {
        it('should return 200 for GET /v1/event-interests', async function () {
            const res = await request(app)
                .get('/v1/event-interests')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    // Test case for getting all the contents that an alumnus interested
    describe('GET /v1/event-interests/alumnus/:alumnId', function () {
        it('should return 200 for GET /v1/event-interests/alumnus/:alumnId', async function () {

            const alumn_id = 'b7085d72-f174-4b81-b106-ef68b27a48ee';
            const res = await request(app).get(`/v1/event-interests/alumnus/${alumn_id}`).query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    // Test case for getting all the alumni interested in a content
    describe('GET /v1/event-interests/content/:contentId', function () {
        it('should return 200 for GET /v1/event-interests/content/:contentId', async function () {

            const content_id = 'c454a632-ead0-494a-a33b-0268dc2208ab';
            const res = await request(app)
               .get(`/v1/event-interests/content/${content_id}`)
               .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });
});
