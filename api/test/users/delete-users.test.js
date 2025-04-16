import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";

import app from "../../index.js";

// TODO: would be nice to reference the route prefix in a constants
// file instead.
const kRoutePrefix = "/v1/users/";

describe('Users API - Delete and Verify Deletion', function () {
    let userId = null;

    // ✅ Precondition: Create a user before running delete tests
    before(async function () {
        const testUser = {
            username: 'delete_test_user',
            email: 'delete_test_user@example.com',
            password: 'testpassword',
            salt: 'randomsalt1234',
            is_enabled: true,
            first_name: 'Delete',
            middle_name: 'Test',
            last_name: 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'alumnus'
        };

        const res = await request(app)
            .post(kRoutePrefix)
            .send(testUser);

        expect(res.status).to.equal(httpStatus.CREATED);
        userId = res.body.id;
    });

    describe(`DELETE ${kRoutePrefix}:userId (Soft Delete)`, function () {
        it('should soft delete the user and return status DELETED', async function () {
            const res = await request(app)
                .delete(`${kRoutePrefix}${userId}`)
                .query({ hard: false });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'DELETED');
        });
    });

    describe(`GET ${kRoutePrefix}:userId after soft deletion`, function () {
        it('should return user data with deleted_at field set', async function () {
            const res = await request(app).get(`${kRoutePrefix}${userId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body.user).to.have.property('deleted_at').that.is.not.empty;
        });
    });

    describe(`DELETE ${kRoutePrefix}:userId (Hard Delete)`, function () {
        it('should hard delete the user and return status DELETED', async function () {
            const res = await request(app)
                .delete(`${kRoutePrefix}${userId}`)
                .query({ hard: true });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'DELETED');
        });
    });

    describe(`GET ${kRoutePrefix}:userId after hard deletion`, function () {
        it('should return 404 Not Found', async function () {
            const res = await request(app).get(`${kRoutePrefix}${userId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'FAILED');
        });
    });
});