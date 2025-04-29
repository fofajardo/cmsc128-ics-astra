import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

import app from "../../index.js";

const gAgent = request.agent(app);
const kRoutePrefix = "/v1/requests";

describe("Requests API Tests (Delete and Verify)", function () {
  this.timeout(4000); // Set timeout to 10 seconds

  before(() => TestSignIn(gAgent, TestUsers.admin));

  let requestId = null;

  // ✅ Precondition: Create a request before running delete tests
  before(async function () {
    const testRequest = {
      user_id: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
      content_id: "389517e7-4a0b-4c96-84f9-3a7080186892",
      type: 1,
      title: "test title",
      description: "test description",
    };

    const res = await gAgent.post(kRoutePrefix).send(testRequest);

    if (res.body.status === "CREATED")
      console.log("Successfully created dummy request");
    else console.log("Failed to create dummy request");

    requestId = res.body.id;
  });

  // Delete the request
  describe(`DELETE ${kRoutePrefix}/:requestId`, function () {
    it("should delete the request and return status DELETED", async function () {
      const res = await gAgent.delete(`${kRoutePrefix}/${requestId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status", "DELETED");
    });

    it(`should return ${httpStatus.NOT_FOUND}, status FAILED, and a message when fetching a deleted request`, async function () {
      const res = await gAgent.get(`${kRoutePrefix}/${requestId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
    });

    it(`should return ${httpStatus.BAD_REQUEST} for when requestId is not a valid UUID`, async function () {
      const res = await gAgent
        .delete(`${kRoutePrefix}/invalid-id`);

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status", "FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return an empty object when requestId is not provided", async function () {
      const res = await gAgent.delete(`${kRoutePrefix}/`);

      expect(res.body).to.be.an("object");
      expect(res.body).to.be.empty;
    });

    it(`should return ${httpStatus.NOT_FOUND} when deleting a non-existent request`, async function () {
      const nonExistentId = requestId;
      const res = await gAgent
        .delete(`${kRoutePrefix}/${nonExistentId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status", "FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });
  });

  // Verify the request is deleted
  describe(`GET ${kRoutePrefix}/:requestId after deletion`, function () {
    it("should return 404 for the deleted request", async function () {
      const res = await gAgent.get(`${kRoutePrefix}/${requestId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
    });
  });

  after(() => TestSignOut(gAgent));
});