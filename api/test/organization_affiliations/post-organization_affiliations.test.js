import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Organization Affiliations API Tests', function () {

    const alumId = 'b4a6b230-20b9-4137-af62-8b535841c391'; // should be a real alum_id
    const routePrefix = `/v1/users/${alumId}/organizations`;

    describe(`POST ${routePrefix}`, function () {
        const testAffiliation = {
            org_id: '7cfb8d38-5606-42fd-835d-0f420620709c', // should be a real org_id 
            role: 'member',
            joined_date: new Date('2023-10-20').toISOString(),
        };

        // ✅ Successfully creates an org
        it('should return 201, status CREATED, a message', async function () {
            const res = await request(app)
                .post(routePrefix)
                .send(testAffiliation);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message');

        });

        // ❌ Required fields missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await request(app)
                .post(routePrefix)
                .send({});

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // ❌ Duplicate affiliation
        it('should return 409, status FAILED, and a message when alum is already affiliated', async function () {
            const res = await request(app)
                .post(routePrefix)
                .send(testAffiliation); // sending same org as before

            expect(res.status).to.equal(httpStatus.CONFLICT);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
                const res = await request(app)
                    .delete(`/v1/users/${alumId}/organizations/${testAffiliation.org_id}`);
                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
        });

    });
});