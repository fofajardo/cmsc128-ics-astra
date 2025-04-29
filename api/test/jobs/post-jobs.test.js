import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Jobs API Tests", function () {
  describe("POST /v1/jobs", function () {
    // Test case #1: Succesful Job Creation
    it("should return 201 and a status", async function () {
      const res = await request(app)
        .post("/v1/jobs")
        .send({
          title: "Hiring Now",
          details: "Welcome to Fresh Grads",
          user_id: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
          job_title: "Junior Frontend Developer",
          hiring_manager: "Juan dela Cruz",
          company_name: "Astra Devs",
          salary: 37500,
          apply_link: "bit.ly/applyAtAstra"
        });

      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("id").that.is.a("string");
    });

    // Test case #2: Failed Job Creation due to missing required fields
    it("should return 400 if a field is missing", async function () {
      const res = await request(app)
        .post("/v1/jobs")
        .send({
          title: "Hiring Now",
          details: "Welcome to Fresh Grads",
          user_id: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
          hiring_manager: "Juan dela Cruz", // job title is missing
          company_name: "Astra Devs",
          salary: 37500,
          apply_link: "bit.ly/applyAtAstra"
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    // Test case #3: Failed Job Creation due to invalid data type in fields
    it("should return 400 if field/s have wrong data type", async function () {
      const res = await request(app)
        .post("/v1/jobs")
        .send({
          title: "Hiring Now",
          details: "Welcome to Fresh Grads",
          user_id: "75b6e610-9d0b-4884-b405-1e682e3aa3d", // invalid user_id
          job_title: "UI/UX Designer",
          hiring_manager: "Anish Guru",
          company_name: "Astra Devs",
          salary: 37500,
          apply_link: 21 // invalid data tyoe
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

  });
});