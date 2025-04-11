import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Projects API Tests', function () {
    describe('POST /v1/projects', function () {
        // Test case to verify that the API returns 400 if required fields are missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await request(app)
                .post(`/v1/projects`)
                .send({});

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').to.equal('');
        });

        // Test case to verify that the project is created successfully
        it('should return 201, status CREATED, a message, and an id', async function () {
            const contentId = '389517e7-4a0b-4c96-84f9-3a7080186892'; // Actual test content ID
            const res = await request(app)
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    status: 0,
                    due_date: new Date('2025-04-01').toISOString(),
                    date_completed: null,
                    goal_amount: '100000',
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').to.equal(contentId);
        });

        // TODO: Test case to verify that the API returns 404 if the contentId does not exist in the system
        it('should return 404, status FAILED, and a message when contentId does not exist', async function () {
            const contentId = '389517e7-4a0b-4c96-84f9-3a7080186893'; // Non-existing content ID
            const res = await request(app)
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    status: 0,
                    due_date: new Date('2025-04-01').toISOString(),
                    date_completed: null,
                    goal_amount: '100000',
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.statusCode).to.equal(httpStatus.NOT_FOUND);
        });

        // Test case to verify that the API returns 409 if the contentId has duplicate
        it('should return 409, status FAILED, and a message when contentId has duplicate', async function () {
            const contentId = '389517e7-4a0b-4c96-84f9-3a7080186892'; // Actual duplicate content ID
            const res = await request(app)
                .post(`/v1/projects`)
                .send({
                    project_id: contentId,
                    status: 0,
                    due_date: new Date('2025-04-01').toISOString(),
                    date_completed: null,
                    goal_amount: '100000',
                    donation_link: 'astra.com/amis-server-upgrade',
                });

            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.CONFLICT);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').that.is.a('string');
            expect(res.body).to.have.property('id').to.equal('');
        });
    });
});