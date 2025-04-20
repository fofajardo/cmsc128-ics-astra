import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('PUT /v1/events/:eventId', function () {
    it('should update an event successfully', async function () {
        const eventId = '12345'; // placeholders for eventId, replace with a valid one

        // replace the hardcoded values with user input
        // e.g. getters of user inputs
        const eventUpdateData = {
        eventDate: '2025-06-01',
        venue: 'ICS UPLB',
        externalLink: 'https://ediwow.com/haha',
        accessLink: 'https://ics.uplb.edu.ph/ediwow',
        interestedCount: 100,
        goingCount: 50,
        notGoingCount: 10,
        online: true
        };

        const response = await request(app)
            .put(`/v1/events/${eventId}`)
            .send(eventUpdateData)
            .expect(httpStatus.OK);

        expect(response.body).to.have.property('status', 'UPDATED');
        expect(response.body).to.have.property('message');
    });

    it('should return FORBIDDEN if the user is not authorized', async function () {
        const eventId = '67890'; // placeholders for eventId, replace with a valid one
        
        // replace the hardcoded values with user input
        // e.g. getters of user inputs
        const eventUpdateData = {
        eventDate: '2025-06-01',
        venue: 'ICS UPLB',
        externalLink: 'https://ediwow.com/haha',
        accessLink: 'https://ics.uplb.edu.ph/ediwow',
        interestedCount: 100,
        goingCount: 50,
        notGoingCount: 10,
        online: true
        };

        const response = await request(app)
            .put(`/v1/events/${eventId}`)
            .send(eventUpdateData)
            .expect(httpStatus.FORBIDDEN);

        expect(response.body).to.have.property('status', 'FORBIDDEN');
        expect(response.body).to.have.property('message');
    });

    it('should return FAILED if eventId is invalid', async function () {
        const eventId = 'invalid-id';
        
        // replace the hardcoded values with user input
        // e.g. getters of user inputs
        const eventUpdateData = {
        eventDate: '2025-06-01',
        venue: 'ICS UPLB',
        externalLink: 'https://ediwow.com/haha',
        accessLink: 'https://ics.uplb.edu.ph/ediwow',
        interestedCount: 100,
        goingCount: 50,
        notGoingCount: 10,
        online: true
        };

        const response = await request(app)
            .put(`/v1/events/${eventId}`)
            .send(eventUpdateData)
            .expect(httpStatus.BAD_REQUEST);

        expect(response.body).to.have.property('status', 'FAILED');
        expect(response.body).to.have.property('message');
    });
});
