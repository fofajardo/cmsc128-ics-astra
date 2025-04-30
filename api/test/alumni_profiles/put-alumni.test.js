import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import nationalities from "i18n-nationality";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe("Alumni API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.admin));

  describe("PUT /v1/alumni-profiles/:userId", function() {

    it("should return 200, status UPDATED, a message, and persist updated details", async function() {
      const userId = "75b6e610-9d0b-4884-b405-1e682e3aa3de";

      // Confirm alumni profile exists before update
      const preCheckRes = await gAgent.get(`/v1/alumni-profiles/${userId}`);
      expect(preCheckRes.status).to.equal(httpStatus.OK);
      expect(preCheckRes.body).to.be.an("object");

      const validUpdateData = {
        location: "Los Banos",
        address: "Batong Malake",
        gender: "Female",
        skills: "JavaScript, Python",
        honorifics: "Dr.",
        citizenship: nationalities.getAlpha3Code("Filipino", "en")
      };

      const res = await gAgent
        .put(`/v1/alumni-profiles/${userId}`)
        .send(validUpdateData);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("UPDATED");
      expect(res.body).to.have.property("message").that.is.a("string");

      // Re-fetch profile to verify persisted changes
      const verifyRes = await gAgent.get(`/v1/alumni-profiles/${userId}`);
      expect(verifyRes.status).to.equal(httpStatus.OK);
      expect(verifyRes.body.alumniProfile).to.include(validUpdateData);
    });

    it("should return 403, status FORBIDDEN, and a message when trying to update birthdate or student_num", async function() {
      const userId = "75b6e610-9d0b-4884-b405-1e682e3aa3de";

      const invalidUpdateData = {
        birthdate: "2000-01-01",
        student_num: "12345",
      };

      const res = await gAgent
        .put(`/v1/alumni-profiles/${userId}`)
        .send(invalidUpdateData);

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("FORBIDDEN");
      expect(res.body).to.have.property("message").that.equals("Editing birthdate or student_num is not allowed");
    });

  });

  after(() => TestSignOut(gAgent));
});
