import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe('Users API Tests', function () {
    before(() => TestSignIn(gAgent, TestUsers.admin));

    describe('GET /v1/users', function () {
        it('should return 200 for GET /v1/users', async function () {
            const res = await gAgent
                .get('/v1/users')
                .query({ page: 1, limit: 10 });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            expect(res.body).to.have.property('list').that.is.an('array');
        });
    });

    describe('GET /v1/users/:userId', function () {
        it('should return 200 for GET /v1/users/userId', async function () {
            const userId = '75b6e610-9d0b-4884-b405-1e682e3aa3de';
            const res = await gAgent.get(`/v1/users/${userId}`);

            // console.log(res);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');

            expect(res.body).to.have.property('status').that.is.oneOf(['OK', 'FAILED']);
            // expect(res.body).to.have.property('user').to.be.an('object');
            const userData = res.body.user;

            expect(userData).to.have.property('username').that.is.a('string');
            expect(userData).to.have.property('email').that.is.a('string');
            expect(userData).to.have.property('password').that.is.a('string');
            expect(userData).to.have.property('salt').that.is.a('string');
            expect(userData).to.have.property('is_enabled').that.is.a('boolean');

            expect(userData).to.have.property('created_at').to.satisfy(
                val => val === null || new Date(userData.created_at).toString() !== 'Invalid Date');

            expect(userData).to.have.property('deleted_at').to.satisfy(
                val => val === null || new Date(userData.deleted_at).toString() !== 'Invalid Date');

            expect(userData).to.have.property('updated_at').to.satisfy(
                val => val === null || new Date(userData.updated_at).toString() !== 'Invalid Date');

            expect(userData).to.have.property('role').that.is.a('string');
        });
    });

    after(() => TestSignOut(gAgent));
});