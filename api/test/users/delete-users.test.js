import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";

import app from "../../index.js";

// TODO: would be nice to reference the route prefix in a constants
// file instead.
const kRoutePrefix = "/v1/users/";

describe('Alumni API - Delete and Verify Deletion', function () {
    // TODO: there should be a precondition for creating the test user.
    const userId = '12345'; // Replace with an actual test user ID

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
        it('should return user data with deletedAt field set', async function () {
            const res = await request(app).get(`${kRoutePrefix}${userId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('deletedAt').that.is.not.empty;
        });
    });
});