import request from 'supertest';
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('Users API Tests', function () {
    describe('PUT /v1/users/:userId', function () {
        let userId = null;
      
        // ✅ Precondition: Create a user before running put tests
        before(async function () {
            const testUser = {
                username: 'put_test_user',
                email: 'put_test_user@example.com',
                password: 'testpassword',
                salt: 'randomsalt1234',
                is_enabled: true,
                first_name: 'Put',
                middle_name: 'Test',
                last_name: 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                role: 'alumnus'
            };
          
            const res = await request(app)
                .post('/v1/users/')
                .send(testUser);

            expect(res.status).to.equal(httpStatus.CREATED);
            userId = res.body.id;
        });

        it('should return 200 and update valid user details', async function () {
            const validUpdateData = {
                username: "user",
                email: "email@email.com",
                password: "password",
            };

            const res = await request(app)
                .put(`/v1/users/${userId}`)
                .send(validUpdateData);
            
            // console.log(res.body);

            expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.is.oneOf(['UPDATED', 'FAILED']);
            expect(res.body).to.have.property('message').that.is.a('string');

            // GET request to verify update
            const verifyRes = await request(app).get(`/v1/users/${userId}`);
            expect(verifyRes.status).to.equal(httpStatus.OK);
            expect(verifyRes.body.user).to.include(validUpdateData); // Ensures data is correctly updated
        });

        it('should not allow editing of name and role', async function () {
            const invalidUpdateData = {
                first_name: "User",  // Attempt to change name
                middle_name: 'User',
                last_name: 'User',
                role: "User", // Attempt to change role
            };

            const res = await request(app)
                .put(`/v1/users/${userId}`)
                .send(invalidUpdateData);

            expect(res.status).to.equal(httpStatus.FORBIDDEN); // Ensures update is not allowed
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
            expect(res.body).to.have.property('message').that.is.a('string');
        });

        // 🧹 Clean up using DELETE route
        after(async function () {
            if (userId) {
                const res = await request(app)
                    .delete(`/v1/users/${userId}?hard=true`);

                expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
            }
        });
    });
});