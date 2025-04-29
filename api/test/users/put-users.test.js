import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import {TestSignIn, TestSignOut, TestUsers} from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe("Users API Tests", function () {
  before(() => TestSignIn(gAgent, TestUsers.admin));

  describe("PUT /v1/users/:userId", function () {
    let userId = null;

    // ✅ Precondition: Create a user before running put tests
    before(async function () {
      const testUser = {
        username: "put_test_user",
        email: "put_test_user@example.com",
        password: "testpassword",
        salt: "randomsalt1234",
        is_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: "alumnus"
      };

      const res = await gAgent
        .post("/v1/users/")
        .send(testUser);

      expect(res.status).to.equal(httpStatus.CREATED);
      userId = res.body.id;
    });

    it("should return 200 and update valid user details", async function () {
      const validUpdateData = {
        username: "user",
        email: "email@email.com",
        password: "password",
      };

      const res = await gAgent
        .put(`/v1/users/${userId}`)
        .send(validUpdateData);

      // console.log(res.body);

      expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["UPDATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");

      // GET request to verify update
      const verifyRes = await gAgent.get(`/v1/users/${userId}`);
      expect(verifyRes.status).to.equal(httpStatus.OK);
      expect(verifyRes.body.user).to.include(validUpdateData); // Ensures data is correctly updated
    });

    it("should not allow editing of name and role", async function () {
      const invalidUpdateData = {
        role: "User", // Attempt to change role
      };

      const res = await gAgent
        .put(`/v1/users/${userId}`)
        .send(invalidUpdateData);

      expect(res.status).to.equal(httpStatus.FORBIDDEN); // Ensures update is not allowed
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("FORBIDDEN");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    // 🧹 Clean up using DELETE route
    after(async function () {
      if (userId) {
        const res = await gAgent
          .delete(`/v1/users/${userId}?hard=true`);

        expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
      }
    });

    after(() => TestSignOut(gAgent));
  });
});