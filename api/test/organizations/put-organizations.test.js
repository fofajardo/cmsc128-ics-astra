import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Organizations API Tests", function() {
  describe("PUT /v1/organizations/:orgId", function() {
    let orgId = null;

    // ✅ Precondition: Create an org before running put tests
    before(async function() {
      const testOrg = {
        name: "Test Org",
        acronym: "TO",
        type: 0,
        founded_date: "2005-10-20"
      };

      const res = await request(app)
        .post("/v1/organizations/")
        .send(testOrg);

      expect(res.status).to.equal(httpStatus.CREATED);
      orgId = res.body.id;
    });

    it("should return 200 and update valid org details", async function() {
      const validUpdateData = {
        name: "Success Test",
        acronym: "ST",
        type: 1,
        founded_date: "2005-10-25"
      };

      const res = await request(app)
        .put(`/v1/organizations/${orgId}`)
        .send(validUpdateData);

      // console.log(res.body);

      expect(res.status).to.equal(httpStatus.OK); // Ensures valid update
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["UPDATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");

      // GET request to verify update
      const verifyRes = await request(app).get(`/v1/organizations/${orgId}`);
      expect(verifyRes.status).to.equal(httpStatus.OK);
      expect(verifyRes.body.organization).to.include(validUpdateData); // Ensures data is correctly updated
    });

    // it('should not allow editing of name and role', async function() {
    //     const invalidUpdateData = {
    //         first_name: "User",  // Attempt to change name
    //         middle_name: 'User',
    //         last_name: 'User',
    //         role: "User", // Attempt to change role
    //     };

    //     const res = await request(app)
    //         .put(`/v1/users/${orgId}`)
    //         .send(invalidUpdateData);

    //     expect(res.status).to.equal(httpStatus.FORBIDDEN); // Ensures update is not allowed
    //     expect(res.body).to.be.an('object');
    //     expect(res.body).to.have.property('status').that.equals('FORBIDDEN');
    //     expect(res.body).to.have.property('message').that.is.a('string');
    // });

    // 🧹 Clean up using DELETE route
    after(async function() {
      if (orgId) {
        const res = await request(app)
          .delete(`/v1/organizations/${orgId}`);

        expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NO_CONTENT]);
      }
    });
  });
});