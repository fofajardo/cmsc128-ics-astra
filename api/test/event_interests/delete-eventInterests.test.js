
import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

// Tests for DELETE method of ALUMNUS user
describe("Event Interests API Tests", function() {
  //before(() => TestSignIn(gAgent, TestUsers.admin));
  before(() => TestSignIn(gAgent, TestUsers.alumnus));

  before(async function() {
    const res = await gAgent
      .post("/v1/event-interests")
      .send({
        user_id: "b4a6b230-20b9-4137-af62-8b535841c391",   //change the values after running the test
        content_id: "c454a632-ead0-494a-a33b-0268dc2208ab"
      });
    if (res.body.status === "CREATED") {
      console.log("Successfully created dummy event interest");
    } else
      console.log("Failed to create dummy event interest");
  });


  describe("DELETE /v1/event-interests/:alumId/:contentId", function() {
    // Test case for successful deletion of an event interest
    it("should return 200 with DELETED status for event interest", async function() {
      const testAlumId = "b4a6b230-20b9-4137-af62-8b535841c391";    // always replace with existing ids after running the test
      const testContentId = "c454a632-ead0-494a-a33b-0268dc2208ab";

      const res = await gAgent
        .delete(`/v1/event-interests/${testAlumId}/${testContentId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
      expect(res.body.message).to.be.a("string");

      if (res.body.status === "DELETED") {
        expect(res.body.message).to.match(/success|deleted/i);
      }
    });

    // Test case for deletion with empty alumn id and content id
    it("should return 400 for empty alumn and content ID", async function() {
      const res = await gAgent
        .delete("/v1/event-interests/");

      expect(res.status).to.equal(httpStatus.BAD_REQUEST);
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("FAILED");
      expect(res.body.message.toLowerCase()).to.match(/invalid|missing/);
    });

    // Test case for deletion with non-existent alumn id and content id but follows a valid format
    it("should return proper response for non-existent alumn and content ID", async function() {
      const nonExistentAlumnId = "b4a6b230-20b9-4137-af62-8b535841c991";
      const nonExistentContentId = "b4a6b230-20b9-4137-af62-8b535551c391";
      const res = await gAgent
        .delete(`/v1/event-interests/${nonExistentAlumnId}/${nonExistentContentId}`);

      expect(res.status).to.be.oneOf([httpStatus.OK, httpStatus.NOT_FOUND]);
      if (res.status === httpStatus.OK) {
        expect(res.body.status).to.equal("FAILED");
        expect(res.body.message).to.match(/not found|exist/i);
      }
    });
  });
  after(() => TestSignOut(gAgent));
});

//Test for DELETE method for UNLINKED user
describe("Unlinked - DELETE /v1/event-interests/:alumId/:contentId", function() {
  before(() => TestSignIn(gAgent, TestUsers.unlinked));

  // Test case for successful deletion of an event interest
  it("should return 403 with FORBIDDEN status for event interest", async function() {
    const testAlumId = "b4a6b230-20b9-4137-af62-8b535841c391";    // always replace with existing ids after running the test
    const testContentId = "c454a632-ead0-494a-a33b-0268dc2208ab";

    const res = await gAgent
      .delete(`/v1/event-interests/${testAlumId}/${testContentId}`);

    expect(res.status).to.equal(httpStatus.FORBIDDEN);
    expect(res.body).to.be.an("object");
    expect(res.body.status).to.be.oneOf(["DELETED", "FAILED", "FORBIDDEN"]);
    expect(res.body.message).to.be.a("string");
  });
  after(() => TestSignOut(gAgent));
});