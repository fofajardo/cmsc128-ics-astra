import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";

const gAgent = request.agent(app);

describe("POST /v1/events", function() {
  this.timeout(10000);

  before(async () => {
    await TestSignIn(gAgent, TestUsers.admin);
  });

  it("should return 200 and a status", async function() {
    // Fix the email format - separate emails properly in array
    const res = await gAgent
      .post("/v1/events/send-event-email")
      .send({
        "emails": ["camanzanido@up.edu.ph"],
        "subject": "Resume Review Session",
        "content": "<h1>This is a blast email</h1><p>Hope you're well.</p>"
      });

    console.log("Response:", res.body);

    expect(res.status).to.equal(httpStatus.OK);
    expect(res.body.status).to.equal("OK");
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  after(async () => {
    await TestSignOut(gAgent);
  });
});