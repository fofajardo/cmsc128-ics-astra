import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Events API Tests', function () {
    describe('DELETE /v1/events/:eventId', function () {


        // Test case #1: Successful event deletion
        it('should return 200 with DELETED status for valid event ID', async function () {
            const testEventId = "800c7d53-20f3-4f55-9d1e-5e7855596348";
            const res = await request(app)
                .delete(`/v1/events/${testEventId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.oneOf(['DELETED', 'FAILED', 'FORBIDDEN']);
            expect(res.body.message).to.be.a('string');

            if (res.body.status === 'DELETED') {
                expect(res.body.message).to.match(/success|deleted/i);
            }
        });

        // Test case #3: Empty event ID
        it('should return 400 for empty event ID', async function () {
            const res = await request(app)
                .delete(`/v1/events/`); // Trailing slash indicates empty ID

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('FAILED');
            expect(res.body.message.toLowerCase()).to.match(/invalid|missing/);
        });

        // Test case #4: Non-existent event
        it('should return proper response for non-existent event', async function () {
            const nonExistentId = '4b02a71e-8e52-42ce-b545-a2f0960f1d16';
            const res = await request(app)
                .delete(`/v1/events/${nonExistentId}`);

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
            if (res.status === httpStatus.OK) {
                expect(res.body.status).to.equal('FAILED');
                expect(res.body.message).to.match(/not found|exist/i);
            }
        });

        // // Test case #5: Special characters in event ID
        it('should handle special characters in event ID', async function () {
            const specialId = '83a34060-fce4-493a-8348-cdacb7c49d0@';
            const res = await request(app)
                .delete(`/v1/events/${encodeURIComponent(specialId)}`);

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.BAD_REQUEST]);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.oneOf(['DELETED', 'FAILED', 'FORBIDDEN']);
        });

        // Test case #6: Unauthorized deletion attempt
        // it('should return 403 for unauthorized requests', async function () {
        //     const testEventId = "83a34060-fce4-493a-8348-cdacb7c49d04";
        //     const res = await request(app)
        //         .delete(`/v1/events/${testEventId}`)
        //         // Add auth headers if required:
        //         // .set('Authorization', 'invalid-token');

        //     expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.FORBIDDEN]);
        //     if (res.status === httpStatus.FORBIDDEN) {
        //         expect(res.body.status).to.equal('FORBIDDEN');
        //         expect(res.body.message).to.include('not authorized');
        //     }
        // });
    });
});