import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Contents API - DELETE /v1/contents/:contentId', function () {

    let createdContentId;

    // Create a new dummy data for deletion test
    before(async function () {
        const createRes = await request(app)
            .post('/v1/contents')
            .send({
                user_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de', 
                title: 'To Be Deleted',
                details: 'This content is for deletion test',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        console.log(createRes.body);
        createdContentId = createRes.body.content.id;
    });
    
    it('should delete an existing content and return 200', async function () {
        const res = await request(app)

            .delete(`/v1/contents/${createdContentId}`);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body.status).to.equal('DELETED');
        expect(res.body.message).to.include('successfully deleted');
    });

    it('should return 404 when trying to delete non-existent content', async function () {
        const nonExistentId = '38c2ba8e-2202-4bb8-b0fd-87595d7eb6aa'; //currently not in the database
        const res = await request(app)
            .delete(`/v1/contents/${nonExistentId}`);

        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('not found');
    });

    it('should return 400 when contentId is not a valid UUID', async function () {
        const res = await request(app)
            .delete('/v1/contents/not-a-valid-id');

        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('contentId');
    });

    it('should return 404 when trying to delete already-deleted content', async function () {
        // First deletion
        await request(app).delete(`/v1/contents/${createdContentId}`);

        // Second deletion attempt
        const res = await request(app).delete(`/v1/contents/${createdContentId}`);
        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body.status).to.equal('FAILED');
        expect(res.body.message).to.include('not found');
    });
});
