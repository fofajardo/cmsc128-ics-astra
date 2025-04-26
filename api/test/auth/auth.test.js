import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";
import app from "../../index.js";

const gAgent = request.agent(app);

// TODO: would be nice to reference the route prefix in a constants
// file instead.
const kAuthPrefix = "/v1/auth";
const kSampleCredentials = {
    username: 'fdof@mudspring.uplb.edu.ph',
    password: 'admin'
};

describe('Auth API', function () {
    describe(`POST ${kAuthPrefix}/sign-in`, function () {
        it('should sign in with valid credentials and return user data', async function () {
            const res = await gAgent
                .post(`${kAuthPrefix}/sign-in`)
                .send(kSampleCredentials);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property('id', '6e16d569-627b-4c41-837f-c24653579b46');
            expect(res.body).to.have.property('username', 'fdof');
            expect(res.body).to.have.property('email', 'fdof@mudspring.uplb.edu.ph');
            expect(res.body).to.have.property('role', 'alumnus');
            expect(res.body).to.have.property('is_enabled', true);
        });
    });

    describe(`GET ${kAuthPrefix}/signed-in-user`, function () {
        it('should return 200 and user data if signed in or 204 if not', async function () {
            // Simulate login
            await gAgent.post(`${kAuthPrefix}/sign-in`).send(kSampleCredentials);

            const res = await gAgent.get(`${kAuthPrefix}/signed-in-user`);
            expect([httpStatus.OK, httpStatus.NO_CONTENT]).to.include(res.status);
        });
    });

    describe(`POST ${kAuthPrefix}/sign-out`, function () {
        it('should sign out the user and return 200 OK', async function () {
            await gAgent.post(`${kAuthPrefix}/sign-in`).send(kSampleCredentials);

            const res = await gAgent.post(`${kAuthPrefix}/sign-out`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property('status', 'OK');
        });
    });
});