import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Contents API - PUT /v1/contents/:contentId', function () {

    const contentId = '4b02a71e-8e52-42ce-b545-a2f0960f1d16'; 
    const userId = '75b6e610-9d0b-4884-b405-1e682e3aa3de'; 

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
        expect(res.body.message).to.include('Title cannot be empty');
    });

    it('should return 400 when details is empty', async function () {
        const res = await request(app)
            .put(`/v1/contents/${contentId}`)
            .send({
                title: 'Valid title',
                details: ''
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('Details cannot be empty');
    });

    it('should return 400 when user_id is included (not allowed to edit)', async function () {
        const res = await request(app)
            .put(`/v1/contents/${contentId}`)
            .send({
                user_id: userId, //Changing userId is not allowed
                title: 'New Title',
                details: 'New Details'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('Updating user_id is not allowed');
    });

    it('should return 404 if contentId does not exist', async function () {
        const fakeId = 'e1ed08c9-7545-4572-bfed-968085897950'; //Currently not in database
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
        expect(res.body.message).to.include('Invalid contentId format');
    });
});
