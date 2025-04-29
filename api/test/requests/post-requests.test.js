import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

const kRoutePrefix = "/v1/requests";

describe("Requests API Tests (POST)", function() {

  before(() => TestSignIn(gAgent, TestUsers.admin));

  describe(`POST ${kRoutePrefix}`, function() {
    const testRequest = {
      user_id: "b7085d72-f174-4b81-b106-ef68b27a48ee",
      content_id: "f9b7efab-003c-44f9-bea7-c856fb1e73cd",
      type: 0,
      title: "Test Title",
      description: "Test Description",
    };

    let createdRequestId = null;

    // ✅ Successfully creates a request
    it("should return 201, status CREATED, a message, and an id", async function () {
      const res = await gAgent
        .post(kRoutePrefix)
        .send(testRequest);

      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").to.equal("CREATED");
      expect(res.body).to.have.property("message");
      expect(res.body).to.have.property("id");

      createdRequestId = res.body.id;
    });

    // ❌ Required fields missing
    it(`should return ${httpStatus.BAD_REQUEST}, status FAILED, and a message when required fields are missing`, async function () {
      const res = await gAgent
        .post(kRoutePrefix)
        .send({});

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").to.equal("FAILED");
      expect(res.body).to.have.property("message");
    });

    // ❌ Unexpected fields present
    it(`should return ${httpStatus.BAD_REQUEST}, status FAILED, and a message when unexpected fields are present`, async function () {
      const res = await gAgent
        .post(kRoutePrefix)
        .send({
          ...testRequest,
          date_reviewed: new Date().toISOString(), // Unexpected field
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").to.equal("FAILED");
      expect(res.body).to.have.property("message");
    });

    // ❌ Invalid user_id
    it(`should return ${httpStatus.BAD_REQUEST}, status FAILED, and a message when user_id is invalid`, async function () {
      const res = await gAgent
        .post(kRoutePrefix)
        .send({
          ...testRequest,
          user_id: "00000000-0000-0000-0000-00000000000", // Invalid UUID
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").to.equal("FAILED");
      expect(res.body).to.have.property("message");
    });

    // ❌ Invalid content_id
    it(`should return ${httpStatus.BAD_REQUEST}, status FAILED, and a message when content_id is invalid`, async function () {
      const res = await gAgent
        .post(kRoutePrefix)
        .send({
          ...testRequest,
          content_id: "00000000-0000-0000-0000-00000000000", // Invalid UUID
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").to.equal("FAILED");
      expect(res.body).to.have.property("message");
    });

    // ❌ Invalid type
    it(`should return ${httpStatus.BAD_REQUEST}, status FAILED, and a message when type is invalid`, async function () {
      const res = await gAgent
        .post(kRoutePrefix)
        .send({
          ...testRequest,
          type: "Invalid Type", // Invalid type
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").to.equal("FAILED");
      expect(res.body).to.have.property("message");
    });

    // 🧹 Clean up using DELETE route
    after(async function() {
      if (createdRequestId) {
        const res = await gAgent
          .delete(`${kRoutePrefix}/${createdRequestId}`);

        if (res.body.status === "DELETED") {
          console.log("Successfully deleted test request.");
        }
        else {
          console.log("Failed to delete test request.");
        }
      }
    });
  });

  after(() => TestSignOut(gAgent));
});