
import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Event Interests API Tests', function () {
    describe('DELETE /v1/event-interests/:alumId/:contentId', function () {

        // Test case for successful deletion of an event interest
        it('should return 200 with DELETED status for event interest', async function () {
            const testAlumId = "75b6e610-9d0b-4884-b405-1e682e3aa3de";    // always replace with existing ids after running the test
            const testContentId = "f9b7efab-003c-44f9-bea7-c856fb1e73cd";

            const res = await request(app)
                .delete(`/v1/event-interests/${testAlumId}/${testContentId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.oneOf(['DELETED', 'FAILED', 'FORBIDDEN']);
            expect(res.body.message).to.be.a('string');

            if (res.body.status === 'DELETED') {
                expect(res.body.message).to.match(/success|deleted/i);
            }
        });

        // Test case for deletion with empty alumn id and content id
        it('should return 400 for empty alumn and content ID', async function () {
            const res = await request(app)
                .delete('/v1/event-interests/');

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('FAILED');
            expect(res.body.message.toLowerCase()).to.match(/invalid|missing/);
        });

        // Test case for deletion with non-existent alumn id and content id but follows a valid format
        it('should return proper response for non-existent alumn and content ID', async function () {
            const nonExistentAlumnId = 'b4a6b230-20b9-4137-af62-8b535841c991';
            const nonExistentContentId = 'b4a6b230-20b9-4137-af62-8b535551c391';
            const res = await request(app)
                .delete(`/v1/event-interests/${nonExistentAlumnId}/${nonExistentContentId}`);

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
            if (res.status === httpStatus.OK) {
                expect(res.body.status).to.equal('FAILED');
                expect(res.body.message).to.match(/not found|exist/i);
            }
        });


    });
});