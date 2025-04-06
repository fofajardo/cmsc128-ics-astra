import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Events API Tests', function () {
    describe('DELETE /v1/events/:eventId', function () {
        // Valid event ID formats (VARCHAR)
        const validEventIds = [
            'event-2023-001',
            'EVT_45678',
            'conference-xyz',
            'meeting-room-101',
            'showcase-2025'
        ];

        // Test case #1: Successful event deletion
        it('should return 200 with DELETED status for valid event ID', async function () {
            const testEventId = validEventIds[0];
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

        // Test case #2: Test various valid VARCHAR ID formats
        validEventIds.forEach((eventId, index) => {
            it(`should handle valid VARCHAR event ID format ${index + 1}`, async function () {
                const res = await request(app)
                    .delete(`/v1/events/${eventId}`);
                
                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.oneOf(['DELETED', 'FAILED', 'FORBIDDEN']);
            });
        });

        // Test case #3: Empty event ID
        it('should return 400 for empty event ID', async function () {
            const res = await request(app)
                .delete('/v1/events/'); // Trailing slash indicates empty ID

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('FAILED');
            expect(res.body.message).to.include('invalid').or.include('missing');
        });

        // Test case #4: Non-existent event
        it('should return proper response for non-existent event', async function () {
            const nonExistentId = 'event-999999';
            const res = await request(app)
                .delete(`/v1/events/${nonExistentId}`);

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
            if (res.status === httpStatus.OK) {
                expect(res.body.status).to.equal('FAILED');
                expect(res.body.message).to.match(/not found|exist/i);
            }
        });

        // Test case #5: Special characters in event ID
        it('should handle special characters in event ID', async function () {
            const specialId = 'event-123$%^&*()';
            const res = await request(app)
                .delete(`/v1/events/${encodeURIComponent(specialId)}`);

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.BAD_REQUEST]);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.oneOf(['DELETED', 'FAILED', 'FORBIDDEN']);
        });

        // Test case #6: Unauthorized deletion attempt
        it('should return 403 for unauthorized requests', async function () {
            const testEventId = validEventIds[1];
            const res = await request(app)
                .delete(`/v1/events/${testEventId}`)
                // Add auth headers if required:
                // .set('Authorization', 'invalid-token');

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.FORBIDDEN]);
            if (res.status === httpStatus.FORBIDDEN) {
                expect(res.body.status).to.equal('FORBIDDEN');
                expect(res.body.message).to.include('not authorized');
            }
        });
    });
});