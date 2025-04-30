import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

// Tests for POST method of ALUMNUS user
describe("Event Interest API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.alumnus));

  describe("POST /v1/event-interests/", function() {
    // Test case for succesful event interest creation
    it("should return 201 and a status", async function() {
      const res = await gAgent
        .post("/v1/event-interests")
        .send({
          user_id: "b4a6b230-20b9-4137-af62-8b535841c391",   //change the values after running the test
          content_id: "c454a632-ead0-494a-a33b-0268dc2208ab"
        });

      expect(res.status).to.equal(httpStatus.CREATED);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    // Test case for failed event interests creation due to missing required fields
    it("should return 400 if a field is missing", async function() {
      const res = await gAgent
        .post("/v1/event-interests")
        .send({
          alum_id: "75b6e610-9d0b-4884-b405-1e682e3aa3de",

        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    // Test case for failed event interests creation due to invalid data type in fields
    it("should return 400 if field/s have wrong data type", async function() {
      const res = await gAgent
        .post("/v1/event-interests")
        .send({
          alum_id: "75b6e610-9d0b-4884-b405-1e682e3aa3de",
          content_id: 0
        });

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED"]);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

  });
  after(() => TestSignOut(gAgent));
});

// Test for POST method od UNLINKED user
describe("Unlinked - POST /v1/event-interests/", function() {
  before(() => TestSignIn(gAgent, TestUsers.unlinked));
  // Test case for succesful event interest creation
  it("should return 201 and a status", async function() {
    const res = await gAgent
      .post("/v1/event-interests")
      .send({
        user_id: "b4a6b230-20b9-4137-af62-8b535841c391",   //change the values after running the test
        content_id: "c454a632-ead0-494a-a33b-0268dc2208ab"
      });

    expect(res.status).to.equal(httpStatus.FORBIDDEN);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("status").that.is.oneOf(["CREATED", "FAILED", "FORBIDDEN"]);
    expect(res.body).to.have.property("message").that.is.a("string");
  });
  after(() => TestSignOut(gAgent));
});