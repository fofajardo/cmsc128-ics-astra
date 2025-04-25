import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { v4 as uuvidv4 } from "uuid";

describe('Contents API - POST /v1/contents', function () {

    let contentId = uuvidv4(); // Generate a new UUID for the content ID

    const validContent = {
        id: contentId, 
        user_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de', 
        title: 'My own content 10',
        details: 'This is a valid content body.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0
    };

    it('should create a new content and return 201 with content object', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send(validContent);
    
        expect(res.status).to.equal(httpStatus.CREATED);
        expect(res.body).to.have.property('status', 'CREATED');
        expect(res.body.content).to.include({
            id: validContent.id,
            user_id: validContent.user_id,
            title: validContent.title,
            details: validContent.details,
            created_at: validContent.created_at,
            updated_at: validContent.updated_at,
            views: validContent.views,
        });
    });

    it('should return 400 when user_id is missing', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                title: 'Missing User ID',
                details: 'No user_id provided.'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('user_id');
    });

    it('should return 400 when title is missing', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                user_id: validContent.user_id,
                details: 'No title provided.'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('title');
    });

    it('should return 400 when details is missing', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                user_id: validContent.user_id,
                title: 'No details here'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('details');
    });

    it('should return 400 for empty strings in title or details', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                user_id: validContent.user_id,
                title: '',
                details: ''
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('required');
    });

    it('should return 400 when user_id is not a valid UUID', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                id: contentId,
                user_id: 'not-a-uuid',
                title: 'Bad User ID Format',
                details: 'Trying to submit with an invalid user_id',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                views: 0
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('user_id');
    });

    it('should reject unexpected extra fields', async function () {
        const res = await request(app)
            .post('/v1/contents')
            .send({
                ...validContent,
                random_field: 'not allowed'
            });

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.message).to.match(/(created_at|random_field)/i);
    });
});
