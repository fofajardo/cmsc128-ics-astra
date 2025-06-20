import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

// Tests for GET method of ALUMNUS user
describe("Event Interest API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.alumnus));
  // Test case for getting all the instance of event interests
  describe("GET /v1/event-interests", function() {
    it("should return 200 for GET /v1/event-interests", async function() {
      const res = await gAgent
        .get("/v1/event-interests")
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });

  // Test case for getting all the contents that an alumnus interested
  describe("GET /v1/event-interests/alumnus/:alumnId", function() {
    it("should return 200 for GET /v1/event-interests/alumnus/:alumnId", async function() {

      const alumn_id = "b7085d72-f174-4b81-b106-ef68b27a48ee";
      const res = await gAgent.get(`/v1/event-interests/alumnus/${alumn_id}`).query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });

  // Test case for getting all the alumni interested in a content
  describe("GET /v1/event-interests/content/:contentId", function() {
    it("should return 200 for GET /v1/event-interests/content/:contentId", async function() {

      const content_id = "c454a632-ead0-494a-a33b-0268dc2208ab";
      const res = await gAgent
        .get(`/v1/event-interests/content/${content_id}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });
  after(() => TestSignOut(gAgent));
});

// Test for GET method of ADMIN user
describe("Admin - GET /v1/event-interests", function() {
  before(() => TestSignIn(gAgent, TestUsers.admin));
  it("should return 200 for GET /v1/event-interests", async function() {
    const res = await gAgent
      .get("/v1/event-interests")
      .query({ page: 1, limit: 10 });

    expect(res.status).to.equal(httpStatus.OK);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
    expect(res.body).to.have.property("list").that.is.an("array");
  });
  after(() => TestSignOut(gAgent));
});

// Test for GET method of MODERATOR user
describe("Moderator - Event Interest API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.moderator));
  // Test case for getting all the instance of event interests
  describe("GET /v1/event-interests", function() {
    it("should return 403 for GET /v1/event-interests", async function() {
      const res = await gAgent
        .get("/v1/event-interests")
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED","FORBIDDEN"]);
      //expect(res.body).to.have.property('list').that.is.an('array');
    });
  });
  after(() => TestSignOut(gAgent));
});

// Test for GET method of UNLINKED user
describe("Unlinked - Event Interest API Tests", function() {
  before(() => TestSignIn(gAgent, TestUsers.unlinked));
  // Test case for getting all the instance of event interests
  describe("GET /v1/event-interests", function() {
    it("should return 403 for GET /v1/event-interests", async function() {
      const res = await gAgent
        .get("/v1/event-interests")
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED","FORBIDDEN"]);
      //expect(res.body).to.have.property('list').that.is.an('array');
    });
  });
  after(() => TestSignOut(gAgent));
});