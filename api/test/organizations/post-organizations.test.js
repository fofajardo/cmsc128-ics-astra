import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Organizations API Tests', function () {
    describe('POST /v1/organizations/', function () {
        const testOrg = {
            name: 'UPLB University Student Council',
            acronym: 'USC',
            type: 0,
            founded_date: '2005-10-20'
        };

        let createdUserId = null;

        // ✅ Successfully creates an org
        it('should return 201, status CREATED, a message, and an id', async function () {
            const res = await request(app)
                .post(`/v1/organizations/`)
                .send(testOrg);

            console.log(res.body);

            expect(res.status).to.equal(httpStatus.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('CREATED');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('id');

            createdUserId = res.body.id;
        });

        // ❌ Required fields missing
        it('should return 400, status FAILED, and a message when required fields are missing', async function () {
            const res = await request(app)
                .post(`/v1/organizations/`)
                .send({});

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // ❌ Duplicate organization
        it('should return 409, status FAILED, and a message when username or email already exists', async function () {
            const res = await request(app)
                .post(`/v1/organizations/`)
                .send(testOrg); // sending same org as before

            expect(res.status).to.equal(httpStatus.CONFLICT);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').to.equal('Organization already exists');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
            if (createdUserId) {
                const res = await request(app)
                    .delete(`/v1/organizations/${createdUserId}`);
                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
            }
        });
    });
});