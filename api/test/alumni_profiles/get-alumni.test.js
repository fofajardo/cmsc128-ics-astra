import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { isValidAlpha3Citizenship } from "../../utils/validators.js";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe("Alumni Profile API Tests", function () {
  before(() => TestSignIn(gAgent, TestUsers.admin));

  describe("GET /v1/alumni-profiles", function () {
    it("should return 200 and a list of alumni profiles", async function () {
      const res = await gAgent
        .get("/v1/alumni-profiles")
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });

  describe("GET /v1/alumni-profiles/:userId", function () {
    it("should return 200 and details of a single alumni profile", async function () {
      const userId = "75b6e610-9d0b-4884-b405-1e682e3aa3de"; // You might want to dynamically create/find a real ID
      const res = await gAgent.get(`/v1/alumni-profiles/${userId}`);

      console.log(res.body);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("alumniProfile").that.is.an("object");

      const alumniProfile = res.body.alumniProfile;

      expect(alumniProfile).to.have.property("birthdate");
      expect(new Date(alumniProfile.birthdate).toString()).to.not.equal("Invalid Date");

      expect(alumniProfile).to.have.property("location").that.is.a("string");
      expect(alumniProfile).to.have.property("address").that.is.a("string");
      expect(alumniProfile).to.have.property("gender").that.is.a("string");
      expect(alumniProfile).to.have.property("student_num").that.is.a("string");

      expect(alumniProfile).to.have.property("skills").that.is.a("string");
      expect(alumniProfile).to.have.property("honorifics").that.is.a("string");

      expect(alumniProfile).to.have.property("citizenship").that.is.a("string");
      expect(isValidAlpha3Citizenship(alumniProfile.citizenship)).to.be.true;

      expect(alumniProfile).to.have.property("sex").that.is.oneOf([0, 1]);
      expect(alumniProfile).to.have.property("civil_status").that.is.a("number");

      expect(alumniProfile).to.have.property("primary_work_experience_id").that.is.a("string");

      expect(alumniProfile).to.have.property("first_name").that.is.a("string");
      expect(alumniProfile).to.have.property("middle_name").that.is.a("string");
      expect(alumniProfile).to.have.property("last_name").that.is.a("string");

      expect(alumniProfile).to.have.property("id").that.is.a("string");

      expect(alumniProfile).to.have.property("created_at");
      expect(new Date(alumniProfile.created_at).toString()).to.not.equal("Invalid Date");

      expect(alumniProfile).to.have.property("is_profile_public").that.is.a("boolean");
    });
  });

  after(() => TestSignOut(gAgent));
});
