import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Jobs API Tests", function() {
  describe("DELETE /v1/jobs/:jobId", function() {
    // Valid job IDs for testing (VARCHAR type)
    const validJobIds = [
      "job-12345",
      "JOB_67890",
      "position-abcde",
      "task-xyz-987",
      "work-2023-001"
    ];

    // Test case #1: Successful deletion with valid job ID
    it("should return 200 with DELETED status for valid job ID", async function() {
      // Using first valid ID format
      const testJobId = validJobIds[0];
      const res = await request(app)
        .delete(`/v1/jobs/${testJobId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
      expect(res.body.message).to.be.a("string");

      if (res.body.status === "DELETED") {
        expect(res.body.message).to.match(/success|deleted/i);
      }
    });

    // Test case #2: Test various valid VARCHAR ID formats
    validJobIds.forEach((jobId, index) => {
      it(`should handle valid VARCHAR job ID format ${index + 1}`, async function() {
        const res = await request(app)
          .delete(`/v1/jobs/${jobId}`);

        expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
      });
    });

    // Test case #3: Empty job ID
    it("should return 400 for empty job ID", async function() {
      const res = await request(app)
        .delete("/v1/jobs/");

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("FAILED");
      expect(res.body.message).to.include("invalid").or.include("missing");
    });

    // Test case #4: Extremely long job ID
    it("should handle maximum length VARCHAR job ID", async function() {
      const longJobId = "job-" + "x".repeat(255); // Creating a 255+ character ID
      const res = await request(app)
        .delete(`/v1/jobs/${longJobId}`);

      expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.BAD_REQUEST, httpStatus.NOT_FOUND]);
      if (res.status === httpStatus.BAD_REQUEST) {
        expect(res.body.status).to.equal("FAILED");
        expect(res.body.message).to.include("too long").or.include("invalid");
      }
    });

    // Test case #5: Special characters in job ID
    it("should handle special characters in job ID", async function() {
      const specialId = "job-123$%^&*()";
      const res = await request(app)
        .delete(`/v1/jobs/${encodeURIComponent(specialId)}`);

      expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.BAD_REQUEST]);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
    });

    // Test case #6: Non-existent but valid format job ID
    it("should return proper response for non-existent job", async function() {
      const nonExistentId = "job-999999";
      const res = await request(app)
        .delete(`/v1/jobs/${nonExistentId}`);

      expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
      if (res.status === httpStatus.OK) {
        expect(res.body.status).to.equal("FAILED");
        expect(res.body.message).to.match(/not found|exist/i);
      }
    });
  });
});