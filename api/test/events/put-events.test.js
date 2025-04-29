import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

describe("PUT /v1/events/:eventId", function() {
  before(() => TestSignIn(gAgent, TestUsers.admin));
  it("should update an event successfully", async function() {
    const eventId = "f9b7efab-003c-44f9-bea7-c856fb1e73cd"; // placeholders for eventId, replace with a valid one

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const eventUpdateData = {
      event_date: new Date("2025-05-16"),
      venue: "Physical Science - ICS UPLB",
      external_link: "https://ediwow.com/haha",
      access_link: "https://ics.uplb.edu.ph/ediwow",
      online: true
    };

    const response = await gAgent
      .put(`/v1/events/${eventId}`)
      .send(eventUpdateData);


    expect(response.status).to.equal(httpStatus.OK);
    expect(response.body).to.be.an("object");

    expect(response.body).to.have.property("status", "UPDATED");
    expect(response.body).to.have.property("message");
  });

  it("should return FORBIDDEN if the user is not authorized", async function() {
    const eventId = "f9b7efab-003c-44f9-bea7-c856fb1e73cd"; // placeholders for eventId, replace with a valid one

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const eventUpdateData = {
      event_id: "389517e7-4a0b-4c96-84f9-3a7080186892",
      event_date: new Date("2025-04-25"),
      venue: "ICS UPLB",
      external_link: "https://ediwow.com/haha",
      access_link: "https://ics.uplb.edu.ph/ediwow",
      online: true
    };

    const response = await gAgent
      .put(`/v1/events/${eventId}`)
      .send(eventUpdateData)
      .expect(httpStatus.FORBIDDEN);

    expect(response.body).to.have.property("status", "FORBIDDEN");
    expect(response.body).to.have.property("message");
  });

  it("should return FAILED if eventId is invalid", async function() {
    const eventId = "f9b7efab-003c-44f9-bea7-c856fb1e73c@";

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const eventUpdateData = {
      eventDate: new Date("2025-04-25"),
      venue: "ICS UPLB",
      externalLink: "https://ediwow.com/haha",
      accessLink: "https://ics.uplb.edu.ph/ediwow",
      online: true
    };

    const response = await gAgent
      .put(`/v1/events/${eventId}`)
      .send(eventUpdateData)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.body).to.have.property("status", "FAILED");
    expect(response.body).to.have.property("message");
  });
  after(() => TestSignOut(gAgent));
});


describe("Alumnus PUT /v1/events/:eventId", function() {
  before(() => TestSignIn(gAgent, TestUsers.alumnus));
  it("should forbidden update of an event", async function() {
    const eventId = "f9b7efab-003c-44f9-bea7-c856fb1e73cd"; // placeholders for eventId, replace with a valid one

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const eventUpdateData = {
      event_date: new Date("2025-04-21"),
      venue: "Physical Science - ICS UPLB",
      external_link: "https://ediwow.com/haha",
      access_link: "https://ics.uplb.edu.ph/ediwow",
      online: true
    };

    const response = await gAgent
      .put(`/v1/events/${eventId}`)
      .send(eventUpdateData);

    expect(response.status).to.equal(httpStatus.FORBIDDEN);
    expect(response.body).to.be.an("object");

    expect(response.body).to.have.property("status", "FORBIDDEN");
    expect(response.body).to.have.property("message");
  });
  after(() => TestSignOut(gAgent));
});