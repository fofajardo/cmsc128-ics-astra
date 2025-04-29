import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import nationalities from "i18n-nationality";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
const gAgent = request.agent(app);

describe("Alumni API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.admin));

  describe("POST /v1/alumni-profiles/:userId", function() {

    it("should return 201, status CREATED, a message, and an id", async function() {
      const userId = "fa8d0d20-5e72-4288-9c62-5a959d7adf02"; // Valid user ID
      const res = await gAgent
        .post(`/v1/alumni-profiles/${userId}`)
        .send({
          alum_id: userId,
          birthdate: new Date("1981-01-01").toISOString(),
          location: "Laguna",
          address: "Los Baños",
          gender: "Male",
          student_num: "199901234",
          skills: "Management",
          honorifics: "Dr.",
          citizenship: nationalities.getAlpha3Code("Filipino", "en"),
          sex: 0,
          civil_status: 1,
          first_name: "John",
          middle_name: "David",
          last_name: "Smith",
          primary_work_experience_id: "d0f8e077-5ab3-4d21-bd69-b6dd59bc03c3",
          is_profile_public: true
        });

      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("CREATED");
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("id").that.equals(userId);
    });

    it("should return 400, status FAILED, and a message when required fields are missing", async function() {
      const userId = "05a4762d-29ef-4543-824b-9d16f77c6946"; // Valid but test-only user ID
      const res = await gAgent
        .post(`/v1/alumni-profiles/${userId}`)
        .send({});

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return 400, status FAILED, and a message when userId format is invalid", async function() {
      const invalidUserId = "00000000-0000-0000-0000-000000000000"; // Invalid ID
      const res = await gAgent
        .post(`/v1/alumni-profiles/${invalidUserId}`)
        .send({});

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return 404, status FAILED, and a message when user does not exist", async function() {
      const nonExistingUserId = "f3d7e6b2-8c9f-4a1b-9c7b-6b0a1c0e937d"; // Non-existing user
      const res = await gAgent
        .post(`/v1/alumni-profiles/${nonExistingUserId}`)
        .send({
          alum_id: nonExistingUserId,
          first_name: "Jane",
          middle_name: "Marie",
          last_name: "Doe",
          birthdate: new Date("1990-05-10").toISOString(),
          location: "Manila",
          address: "Taguig",
          gender: "Female",
          student_num: "200001234",
          skills: "Software Development",
          honorifics: "",
          citizenship: nationalities.getAlpha3Code("Filipino", "en"),
          sex: 1,
          civil_status: 2,
          primary_work_experience_id: "c779d9f8-535b-4b51-938d-a656057e9512",
          is_profile_public: false
        });

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return 409, status FAILED, and a message when the user already has an alumni profile", async function() {
      const userId = "75b6e610-9d0b-4884-b405-1e682e3aa3de"; // Already existing alumni
      const res = await gAgent
        .post(`/v1/alumni-profiles/${userId}`)
        .send({
          alum_id: userId,
          first_name: "Existing",
          middle_name: "User",
          last_name: "Profile",
          birthdate: new Date("1985-02-15").toISOString(),
          location: "Cebu",
          address: "Lapu-Lapu City",
          gender: "Male",
          student_num: "200501234",
          skills: "Leadership",
          honorifics: "Mr.",
          citizenship: nationalities.getAlpha3Code("Filipino", "en"),
          sex: 0,
          civil_status: 1,
          primary_work_experience_id: "c779d9f8-535b-4b51-938d-a656057e9512",
          is_profile_public: true
        });

      expect(res.status).to.equal(httpStatus.CONFLICT);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.equals("FAILED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

  });

  after(() => TestSignOut(gAgent));
});
