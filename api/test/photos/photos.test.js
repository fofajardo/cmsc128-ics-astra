import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { TestSignIn, TestSignOut, TestUsers } from "../auth/auth.common.js";
import path from "path";
const gAgent = request.agent(app);

describe("Photos API Tests", function() {
  let photoId;

  // Create a dummy photo for testing
  before(async function() {

    await TestSignIn(gAgent, TestUsers.admin);
    console.log("Signed in successfully.");

    const filePath = path.resolve("./assets/photos/sample1.png");



    const res = await request(app)
      .post("/v1/photos")
      .field("user_id", "6e16d569-627b-4c41-837f-c24653579b46") // dummy ID
      .field("type", 1)
      .attach("File", filePath);

    console.log("POST /v1/photos response:", res.status, res.body);

    if (res.body.status === "CREATED") {
      photoId = res.body.photo.id;
    } else {
      console.error("Failed to create photo:", res.body);
    }
  });

  describe("Authenticated Scenarios", function() {
    describe("GET /v1/photos", function() {
      it("should return 200 and a list of photos", async function() {
        const res = await request(app).get("/v1/photos");

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("photos").that.is.an("array");
      });
    });

    describe("GET /v1/photos/:id", function() {
      it("should return 200 and the photo details", async function() {
        const res = await request(app).get(`/v1/photos/${photoId}`);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("photo").that.is.an("object");
      });

      it("should return 404 when the photo does not exist", async function() {
        const res = await request(app).get("/v1/photos/non-existent-id");

        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("status", "FAILED");
      });
    });

    describe("DELETE /v1/photos/:id", function() {
      it("should return 200 and delete the photo", async function() {
        const res = await request(app).delete(`/v1/photos/${photoId}`);

        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.have.property("status", "DELETED");
      });

      it("should return 404 when trying to delete a non-existent photo", async function() {
        const res = await request(app).delete("/v1/photos/non-existent-id");

        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("status", "FAILED");
      });
    });
  });

  after(() => {
    TestSignOut(gAgent);
  });

  describe("Unauthenticated Scenarios", function() {
    it("should return 403 when accessing any endpoint without authentication", async function() {
      const res = await request(app).get("/v1/photos");

      expect(res.status).to.equal(httpStatus.FORBIDDEN);
      expect(res.body).to.have.property("status", "FORBIDDEN");
      expect(res.body.message).to.include("You are not allowed to access this resource.");
    });
  });
});