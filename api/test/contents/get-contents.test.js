import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Contents API Tests', function () {

    describe('GET /v1/contents', function () {
        it('should return 200 and a list of content items', async function () {
            const res = await request(app)
                .get('/v1/contents')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');

            //Validate contents
            if (res.body.list.length > 0) {
                const content = res.body.list[0];
                expect(content).to.have.property('id').that.is.a('string');
                expect(content).to.have.property('user_id').that.is.a('string');
                expect(content).to.have.property('title').that.is.a('string');
                expect(content).to.have.property('details').that.is.a('string');
                expect(new Date(content.created_at).toString()).to.not.equal('Invalid Date');
                expect(new Date(content.updated_at).toString()).to.not.equal('Invalid Date');
            }
        });
    });

    describe('GET /v1/contents/:contentId', function () {
        it('should return 200 and details of a single content item', async function () {
            const contentId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; 
            const res = await request(app).get(`/v1/contents/${contentId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('content').to.be.an('object');

            const content = res.body.content;

            expect(content).to.have.property('id').that.equals(contentId);
            expect(content).to.have.property('user_id').that.is.a('string');
            expect(content).to.have.property('title').that.is.a('string');
            expect(content).to.have.property('details').that.is.a('string');
        });
    });
});
