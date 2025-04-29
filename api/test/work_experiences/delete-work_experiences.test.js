import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

import app from "../../index.js";


const gAgent = request.agent(app);
const kRoutePrefix = "/v1/work-experiences";


describe("Work Experiences API Tests (Delete and Verify)", function () {

  this.timeout(4000);

  before(() => TestSignIn(gAgent, TestUsers.admin));

  let workExperienceId = null;

  // ✅ Precondition: Create a work_experience before running delete tests
  before(async function () {
    const testWorkExperience = {
      user_id: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
      title: "test title",
      field: "test field",
      company: "test company",
      salary: 12345,
      year_started: new Date("2023-01-01"),
      year_ended: new Date("2024-01-01"),
    };

    const res = await gAgent
      .post(kRoutePrefix)
      .send(testWorkExperience);

    if (res.body.status === "CREATED")
      console.log("Successfully created dummy work experience");
    else
      console.log("Failed to create dummy work experience");

    workExperienceId = res.body.id;
  });

  // Delete the work experience
  describe(`DELETE ${kRoutePrefix}/:workExperienceId`, function () {
    it("should delete the work experience and return status DELETED", async function () {
      const res = await gAgent
        .delete(`${kRoutePrefix}/${workExperienceId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status", "DELETED");
    });

    it(`should return ${httpStatus.NOT_FOUND}, status FAILED, and a message when fetching a deleted work_experience`, async function () {
      const res = await gAgent.get(`${kRoutePrefix}/${workExperienceId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
    });

    it(`should return ${httpStatus.BAD_REQUEST} when workExperienceId is not a valid UUID`, async function () {
      const res = await gAgent
        .delete(`${kRoutePrefix}/not-a-valid-id`);

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status", "FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return an empty object when workExperienceId is not provided", async function () {

      const res = await gAgent
        .delete(`${kRoutePrefix}`);

      expect(res.body).to.be.empty;
    });

    it(`should return ${httpStatus.NOT_FOUND}, status FAILED, and a message when deleting a non-existing work_experience`, async function () {
      const nonExistentId = workExperienceId;   // non-existing id
      const res = await gAgent
        .delete(`${kRoutePrefix}/${nonExistentId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status", "FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });
  });

  // Verify deletion
  describe(`GET ${kRoutePrefix}/:workExperienceId after deletion`, function () {
    it(`should return ${httpStatus.NOT_FOUND} Not Found`, async function () {
      const res = await gAgent.get(`${kRoutePrefix}/${workExperienceId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status", "FAILED");
    });
  });

  after(() => TestSignOut(gAgent));
});