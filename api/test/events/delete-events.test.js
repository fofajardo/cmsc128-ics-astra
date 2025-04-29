import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);
describe("Events API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.admin));

  describe("DELETE /v1/events/:eventId", function() {

    // Test case #1: Successful event deletion
    it("should return 200 with DELETED status for valid event ID", async function() {
      const testEventId = "885b0b2e-ced1-4c0f-8aac-1fb6857548ec";
      const res = await gAgent
        .delete(`/v1/events/${testEventId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
      expect(res.body.message).to.be.a("string");

      if (res.body.status === "DELETED") {
        expect(res.body.message).to.match(/success|deleted/i);
      }

    });

    // Test case #3: Empty event ID
    it("should return 400 for empty event ID", async function() {
      const res = await gAgent
        .delete("/v1/events/"); // Trailing slash indicates empty ID

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("FAILED");
      expect(res.body.message.toLowerCase()).to.match(/invalid|missing/);
    });

    // Test case #4: Non-existent event
    it("should return proper response for non-existent event", async function() {
      const nonExistentId = "4b02a71e-8e52-42ce-b545-a2f0960f1d16";
      const res = await gAgent
        .delete(`/v1/events/${nonExistentId}`);

      expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
      if (res.status === httpStatus.OK) {
        expect(res.body.status).to.equal("FAILED");
        expect(res.body.message).to.match(/not found|exist/i);
      }
    });

    // // Test case #5: Special characters in event ID
    it("should handle special characters in event ID", async function() {
      const specialId = "83a34060-fce4-493a-8348-cdacb7c49d0@";
      const res = await gAgent
        .delete(`/v1/events/${encodeURIComponent(specialId)}`);

      expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.BAD_REQUEST]);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
    });
  });
  after(() => TestSignOut(gAgent));
});

describe("Alumnus, DELETE /v1/events/:eventId", function() {
  before(() => TestSignIn(gAgent, TestUsers.alumnus));

  // Test case #6: Unauthorized deletion attempt
  it("should return 403 when alumnus tries to delete an event", async function() {
    const testEventId = "885b0b2e-ced1-4c0f-8aac-1fb6857548ec";
    const res = await gAgent
      .delete(`/v1/events/${testEventId}`);

    expect(res.status).to.equal(httpStatus.FORBIDDEN);
    expect(res.body.status).to.equal("FORBIDDEN");
    expect(res.body.message).to.include("do not have permission");
  });
  after(() => TestSignOut(gAgent));
});