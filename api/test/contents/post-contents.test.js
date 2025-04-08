import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Contents API - POST /v1/contents', function () {

    const validContent = {
        alum_id: '713a81be-4988-4163-896c-71d5c3066d63', 
        title: 'Valid Content Title',
        details: 'This is a valid content body.'
    };

    it('should create a new content and return 201 with content object', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send(validContent);

        expect(res.status).to.equal(httpStatus.CREATED);
        expect(res.body).to.have.property('status', 'CREATED');
        expect(res.body.content).to.include({
            alum_id: validContent.alum_id,
            title: validContent.title,
            details: validContent.details
        });
        expect(res.body.content).to.have.property('id').that.is.a('string');
    });

    it('should return 400 when alum_id is missing', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                title: 'Missing Alum ID',
                details: 'No alum_id provided.'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('alum_id');
    });

    it('should return 400 when title is missing', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                alum_id: validContent.alum_id,
                details: 'No title provided.'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('title');
    });

    it('should return 400 when details is missing', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                alum_id: validContent.alum_id,
                title: 'No details here'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('details');
    });

    it('should return 400 for empty strings in title or details', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                alum_id: validContent.alum_id,
                title: '',
                details: ''
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('required');
    });

    it('should return 400 when alum_id is not a valid UUID', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                alum_id: 'not-a-uuid',
                title: 'Bad Alum ID Format',
                details: 'Trying to submit with an invalid alum_id'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('alum_id');
    });

    it('should reject unexpected extra fields', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                ...validContent,
                created_at: '2022-01-01T00:00:00Z', 
                random_field: 'not allowed'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.match(/(created_at|random_field)/i);
    });
});
