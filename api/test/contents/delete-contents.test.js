import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Contents API - DELETE /v1/contents/:contentId', function () {

    let createdContentId;

    beforeEach(async function () {
        //Create a content item to delete
        const createRes = await request(app)
            .post('/v1/contents')
            .send({
                alum_id: '713a81be-4988-4163-896c-71d5c3066d63', 
                title: 'To Be Deleted',
                details: 'This content is for deletion test'
            });

        createdContentId = createRes.body.content.id;
    });

    it('should delete an existing content and return 200', async function () {
        const res = await request(app)
            .delete(`/v1/contents/${createdContentId}`);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body.status).to.equal('DELETED');
        expect(res.body.message).to.include('successfully');
    });

    it('should return 404 when trying to delete non-existent content', async function () {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
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
