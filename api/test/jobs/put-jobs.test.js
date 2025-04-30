import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("PUT /v1/jobs/:jobId", function() {
  it("should update a job successfully", async function() {
    const jobId = "12345";          //replace with legit jobId para dynamic

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const jobUpdateData = {
      jobTitle: "Software Engineer",      // hardcoded
      hiringManager: "Jonner Camara",     // change to user input (can be a variable)
      companyName: "Adonis",              // to make the update dynamic
      salary: 75000,
      applyLink: "https://ics.uplb.edu.ph/ediwow"
    };

    const response = await request(app)
      .put(`/v1/jobs/${jobId}`)
      .send(jobUpdateData)
      .expect(httpStatus.OK);

    expect(response.body).to.have.property("status", "UPDATED");    // check if the status is UPDATED
    expect(response.body).to.have.property("message");              // value should change
  });                                                               // since eto lang yung success

  it("should return FORBIDDEN if the user is not authorized", async function() {
    const jobId = "67890";          //replace with legit jobId para dynamic

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const jobUpdateData = {
      jobTitle: "Software Engineer",          //same goes here
      hiringManager: "Jonner Camara",
      companyName: "Adonis",
      salary: 75000,
      applyLink: "https://ics.uplb.edu.ph/ediwow"
    };

    const response = await request(app)
      .put(`/v1/jobs/${jobId}`)
      .send(jobUpdateData)
      .expect(httpStatus.FORBIDDEN);

    expect(response.body).to.have.property("status", "FORBIDDEN");  // check if the status is FORBIDDEN
    expect(response.body).to.have.property("message");              // value should not change
  });

  it("should return FAILED if jobId is invalid", async function() {
    const jobId = "invalid-id";         //replace with legit jobId para dynamic

    // replace the hardcoded values with user input
    // e.g. getters of user inputs
    const jobUpdateData = {
      jobTitle: "Software Engineer",
      hiringManager: "Jonner Camara",
      companyName: "Adonis",
      salary: 75000,
      applyLink: "https://ics.uplb.edu.ph/ediwow"
    };

    const response = await request(app)
      .put(`/v1/jobs/${jobId}`)
      .send(jobUpdateData)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.body).to.have.property("status", "FAILED"); // check if the status is FAILED
    expect(response.body).to.have.property("message");          // value should not change
  });
});
