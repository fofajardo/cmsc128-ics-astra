import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Alumni API Tests", function() {

  describe("GET /v1/jobs", function() {
    it("should return 200 for GET /v1/jobs", async function() {
      const res = await request(app)
        .get("/v1/jobs")
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });

  describe("GET /v1/jobs/:jobId", function() {
    it("should return 200 for GET /v1/jobs/jobId", async function() {
      const job_id = "5989b548-87d7-4492-b712-5d454581454c";
      const res = await request(app).get(`/v1/jobs/${job_id}`);

      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.status).to.equal(httpStatus.OK);

      expect(res.body).to.have.property("job").that.is.an("object");

      const jobData = res.body.job;

      expect(jobData).to.have.property("job_title").that.is.a("string");
      expect(jobData).to.have.property("hiring_manager").that.is.a("string");
      expect(jobData).to.have.property("company_name").that.is.a("string");
      expect(jobData).to.have.property("salary").that.is.a("number");
      expect(jobData).to.have.property("apply_link").that.is.a("string");

    });
  });
});