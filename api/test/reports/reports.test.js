// test/routes/reports.test.js
import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { isValidUUID } from '../../utils/validators.js';
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe('Reports API Tests', function () {
    before(() => TestSignIn(gAgent, TestUsers.admin));

    let createdReportId = null;

    const validReporterId = 'b4a6b230-20b9-4137-af62-8b535841c391'; // Replace with a valid test UUID

    describe('POST /v1/reports', function () {
        it('should create a report and return 201', async function () {
            expect(isValidUUID(validReporterId)).to.be.true;

            const res = await gAgent
                .post('/v1/reports')
                .send({
                    reporter_id: validReporterId,
                    content_id: null,
                    type: 2,
                    details: 'This post is clearly spam.',
                    status: 0
                });

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.have.property('status').that.equals('CREATED');
            expect(res.body).to.have.property('id');

            // Validate that the ID returned is also a valid UUID
            createdReportId = res.body.id;
            expect(isValidUUID(createdReportId)).to.be.true;
        });

        it('should return 400 when required fields are missing', async function () {
            const res = await gAgent
                .post('/v1/reports')
                .send({});

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body.status).to.equal('FAILED');
        });
    });

    describe('GET /v1/reports', function () {
        it('should return a list of reports', async function () {
            const res = await gAgent
                .get('/v1/reports')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    describe('GET /v1/reports/:id', function () {
        it('should return a specific report by id', async function () {
            expect(isValidUUID(createdReportId)).to.be.true;

            const res = await gAgent
                .get(`/v1/reports/${createdReportId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property('report');
            expect(res.body.report).to.include({ type: 2 });
        });

        it('should return 404 for non-existent report id', async function () {
            const fakeId = '84f4c991-3f7c-4f75-b2b3-25dbf1d4b95f';
            expect(isValidUUID(fakeId)).to.be.true;

            const res = await gAgent
                .get(`/v1/reports/${fakeId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
        });
    });

    describe('PUT /v1/reports/:id', function () {
        it('should update report status', async function () {
            const updatedFields = { status: 1 };

            const res = await gAgent
                .put(`/v1/reports/${createdReportId}`)
                .send(updatedFields);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body.status).to.equal('UPDATED');
        });
    });

    describe('DELETE /v1/reports/:id', function () {
        it('should delete a report', async function () {
            const res = await gAgent
                .delete(`/v1/reports/${createdReportId}`);

            expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
        });

        it('should return 404 after deletion', async function () {
            const res = await gAgent
                .get(`/v1/reports/${createdReportId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
        });
    });

    after(() => TestSignOut(gAgent));
});
