import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

describe("Events API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.admin));
  //before(() => TestSignIn(gAgent, TestUsers.alumnus));

  describe("POST /v1/events", function() {
    // Test case #1: Succesful Event Creation
    it("should return 201 and a status", async function() {
      const res = await gAgent
        .post("/v1/events")
        .send({
          event_id : "885b0b2e-ced1-4c0f-8aac-1fb6857548ec", // event_id is reference from content_id
          event_date: new Date("2025-04-15"),
          venue: "Lecture Hall 4",
          external_link: "bit.ly/PalICSihan-FBPage",
          access_link: "",
          online: false
        });

      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED", "FORBIDDEN"]);
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body).to.have.property("id").that.is.a("string");
    });

    // Test case #2: Failed Event Creation due to missing required fields
    it("should return 400 if a field is missing", async function() {
      const res = await gAgent
        .post("/v1/events")
        .send({
          event_id:"f9b7efab-003c-44f9-bea7-c856fb1e73cd",
          event_date: new Date("2025-08-14"),
          venue: "NCAS Auditorium",
          external_link: "bit.ly/info-link",
          access_link: "",
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED", "FORBIDDEN"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    // Test case #3: Failed Event Creation due to invalid data type in fields
    it("should return 400 if field/s have wrong data type", async function() {
      const res = await gAgent
        .post("/v1/events")
        .send({
          event_id: "f9b7efab-003c-44f9-bea7-c856fb1e73cd", // event_id is reference from content_id
          event_date: new Date("2025-08-14"),
          venue: "NCAS Auditorium",
          external_link: "bit.ly/info-link",
          access_link: "",
          online: "yes" // invalid data type
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED", "FORBIDDEN"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

  });
  after(() => TestSignOut(gAgent));
});



describe("POST /v1/events", function() {
  before(() => TestSignIn(gAgent, TestUsers.alumnus));
  // Test case #1: Succesful Event Creation
  it("should return 403 and a status", async function() {
    const res = await gAgent
      .post("/v1/events")
      .send({
        event_id : "885b0b2e-ced1-4c0f-8aac-1fb6857548ec", // event_id is reference from content_id
        event_date: new Date("2025-04-15"),
        venue: "Lecture Hall 4",
        external_link: "bit.ly/PalICSihan-FBPage",
        access_link: "",
        online: false
      });

    expect(res.status).to.equal(httpStatus.FORBIDDEN);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED", "FORBIDDEN"]);
    expect(res.body).to.have.property("message").that.is.a("string");
  });
  after(() => TestSignOut(gAgent));
});
