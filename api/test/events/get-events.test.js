import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

describe("Alumni API Tests", function() {
  //before(() => TestSignIn(gAgent, TestUsers.alumnus));
  before(() => TestSignIn(gAgent, TestUsers.admin));
  describe("GET /v1/events", function() {
    it("should return 200 for GET /v1/events", async function() {
      const res = await gAgent
        .get("/v1/events")
        .query({ page: 1, limit: 10 });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED","FORBIDDEN"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });

  describe("GET /v1/events", function() {
    it("should return sorted by event date range count for GET /v1/events", async function() {
      const dateFrom = "2025-04-20T00:00:00.000Z";  // Optional to include time
      const dateTo = "2025-04-30T23:59:59.999Z";
      const res = await gAgent
        .get("/v1/events")
        .query({
          event_date_from: dateFrom,
          event_date_to: dateTo
        });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED","FORBIDDEN"]);
      expect(res.body).to.have.property("list").that.is.an("array");
    });
  });


  describe("GET /v1/events/:eventId", function() {
    it("should return 200 for GET /v1/events/eventId", async function() {

      const event_id = "f9b7efab-003c-44f9-bea7-c856fb1e73cd";
      const res = await gAgent.get(`/v1/events/${event_id}`);

      expect(res.body).to.be.an("object");

      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED","FORBIDDEN"]);
      expect(res.status).to.equal(httpStatus.OK);

      expect(res.body).to.have.property("event").that.is.an("object");

      const eventData = res.body.event;

      expect(eventData).to.have.property("event_date");

      const eventDate = eventData.event_date;

      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
      expect(isoDateRegex.test(eventDate)).to.be.true;

      expect(eventData).to.have.property("venue").that.is.a("string");
      expect(eventData).to.have.property("external_link").that.is.a("string");
      expect(eventData).to.have.property("access_link").that.is.a("string");
      expect(eventData).to.have.property("online").that.is.a("boolean");

    });
  });
  after(() => TestSignOut(gAgent));
});