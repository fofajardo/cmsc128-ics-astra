import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Contents API - PUT /v1/contents/:contentId', function () {

    const contentId = '7f857ca0-fcca-4c5b-b619-d0612597dbb1'; 
    const alumId = '713a81be-4988-4163-896c-71d5c3066d63'; 

    it('should return 200 and update valid content fields', async function () {
        const updatePayload = {
            title: 'Updated Test Title',
            details: 'This is an updated version of the content.'
        };

        const res = await request(app)
            .put(`/v1/contents/${contentId}`)
            .send(updatePayload);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').that.equals('UPDATED');
        expect(res.body).to.have.property('message').that.is.a('string');

        //GET to verify update
        const verifyRes = await request(app).get(`/v1/contents/${contentId}`);
        expect(verifyRes.body.content.title).to.equal(updatePayload.title);
        expect(verifyRes.body.content.details).to.equal(updatePayload.details);
    });

    it('should return 400 when title is empty', async function () {
        const res = await request(app)
            .put(`/v1/contents/${contentId}`)
            .send({
                title: '',
                details: 'Valid details'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('title');
    });

    it('should return 400 when details is empty', async function () {
        const res = await request(app)
            .put(`/v1/contents/${contentId}`)
            .send({
                title: 'Valid title',
                details: ''
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('details');
    });

    it('should return 400 when alum_id is included (not allowed to edit)', async function () {
        const res = await request(app)
            .put(`/v1/contents/${contentId}`)
            .send({
                alum_id: alumId, //Changing alumId is not allowed
                title: 'New Title',
                details: 'New Details'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('alum_id');
    });

    it('should return 404 if contentId does not exist', async function () {
        const fakeId = '00000000-0000-0000-0000-000000000000';
        const res = await request(app)
            .put(`/v1/contents/${fakeId}`)
            .send({
                title: 'Test Title',
                details: 'Test Details'
            });

        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('not found');
    });

    it('should return 400 if contentId is invalid UUID', async function () {
        const res = await request(app)
            .put('/v1/contents/invalid-id')
            .send({
                title: 'Title',
                details: 'Details'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('contentId');
    });
});
