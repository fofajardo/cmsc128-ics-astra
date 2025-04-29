import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe("Degree Programs API Tests", function() {
  let degreeProgramId;

  const nonExistentId = uuidv4();
  // const sampleUserid = '6e16d569-627b-4c41-837f-c24653579b46';

  let sampleUserid;

  before(async function() {
    sampleUserid = "19a54ed6-5a0e-4850-8193-e013140d6111";

    console.log("Sample User ID:", sampleUserid);

    await TestSignIn(gAgent, TestUsers.admin);

    // Create a dummy degree program for testing
    const res = await gAgent
      .post("/v1/degree-programs")
      .send({
        name: "Testing lang degree program",
        level: "MS",
        user_id: sampleUserid,
        institution: "Test University",
        year_started: "2022-01-01",
        year_graduated: "2024-05-15",
      });

    console.log("POST /v1/degree-programs response:", res.status, res.body);

    if (res.body.status === "CREATED") {
      degreeProgramId = res.body.degreeProgram.id;
    } else {
      throw new Error(`Failed to create degree program: ${res.body.message}`);
    }
  });

  describe("Authenticated Scenarios", function() {
    describe("GET /v1/degree-programs/:id", function() {
      it("should return 200 and the degree program details", async function() {
        const res = await request(app).get(`/v1/degree-programs/${degreeProgramId}`);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("degreeProgram").that.is.an("object");
        expect(res.body.degreeProgram).to.have.property("institution", "Test University");
        expect(res.body.degreeProgram).to.have.property("year_started", "2022-01-01");
        expect(res.body.degreeProgram).to.have.property("year_graduated", "2024-05-15");
      });

      it("should return 404 when the degree program does not exist", async function() {
        const res = await request(app).get(`/v1/degree-programs/${nonExistentId}`);

        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("status", "FAILED");
      });
    });

    describe("PUT /v1/degree-programs/:id", function() {
      it("should return 200 and update the degree program", async function() {
        const res = await request(app)
          .put(`/v1/degree-programs/${degreeProgramId}`)
          .send({
            name: "Testing lang degree program",
            level: "MS",
            institution: "Updated University",
            year_started: "2022-01-01",
            year_graduated: "2025-06-30",
          });

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.have.property("status", "UPDATED");
        expect(res.body.degreeProgram).to.have.property("institution", "Updated University");
        expect(res.body.degreeProgram).to.have.property("year_started", "2022-01-01");
        expect(res.body.degreeProgram).to.have.property("year_graduated", "2025-06-30");
      });
    });

    describe("DELETE /v1/degree-programs/:id", function() {
      it("should return 200 and delete the degree program", async function() {
        const res = await request(app).delete(`/v1/degree-programs/${degreeProgramId}`);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.have.property("status", "DELETED");
      });
    });
  });

  after(() => {
    console.log("Signing out...");
    TestSignOut(gAgent);
    console.log("Signed out successfully.");
  });

  describe("Unauthenticated Scenarios", function() {
    it("should return 403 when accessing any endpoint without authentication", async function() {
      const res = await request(app).get(`/v1/degree-programs/${degreeProgramId}`);

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.body).to.have.property("status", "FORBIDDEN");
      expect(res.body.message).to.include("You are not allowed to access this resource.");
    });
  });
});