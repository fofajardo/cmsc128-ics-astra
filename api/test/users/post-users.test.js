import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Users API Tests', function () {
    describe('POST /v1/users/', function () {
        const testUser = {
            username: 'jnidv',
            email: 'jnidv@bugok.com',
            password: 'password',
            salt: 'abcd1234',
            is_enabled: true,
            first_name: 'Jan Neal Isaac',
            middle_name: 'De Guzman',
            last_name: 'Villamin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'alumnus'
        };

        let createdUserId = null;

        // ✅ Successfully creates a user
        it('should return 201, status CREATED, a message, and an id', async function () {
            const res = await request(app)
                .post(`/v1/users/`)
                .send(testUser);

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
                .post(`/v1/users/`)
                .send({});

            expect(res.status).to.equal(httpStatus.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message');
        });

        // ❌ Duplicate username/email
        it('should return 409, status FAILED, and a message when username or email already exists', async function () {
            const res = await request(app)
                .post(`/v1/users/`)
                .send(testUser); // sending same user as before

            expect(res.status).to.equal(httpStatus.CONFLICT);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').to.equal('FAILED');
            expect(res.body).to.have.property('message').to.equal('Username or email already exists');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
            if (createdUserId) {
                const res = await request(app)
                    .delete(`/v1/users/${createdUserId}?hard=true`);

                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
            }
        });
    });
});