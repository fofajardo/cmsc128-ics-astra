import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Affiliations API Tests", function () {
  describe("PUT /v1/users/:alumId/organizations/:orgId", function () {
    const orgId = "2ec78beb-da60-435d-bbe1-b48f25b29326";    // actual existing org ID
    const alumId = "b4a6b230-20b9-4137-af62-8b535841c391";   //  actual existing alum ID
    const nonExistentAlumId = "b4a6b230-20b9-4137-af62-8b525841c391"; // Non-existent alum ID for testing

    it("should return 200 and update affiliation details", async function () {
      const updatedAffiliation = {
        role: "President",
        joined_date: "2021-07-01"
      };

      const res = await request(app)
        .put(`/v1/users/${alumId}/organizations/${orgId}`)
        .send(updatedAffiliation);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.have.property("status").that.equals("UPDATED");
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return 404 if affiliation does not exist", async function () {
      const res = await request(app)
        .put(`/v1/users/${nonExistentAlumId}/organizations/${orgId}`) // Non-existent
        .send({
          role: "Secretary",
          joined_date: "2022-01-01"
        });

      console.log(res.body.message); // For debugging
      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body).to.have.property("status").that.equals("FAILED");
      expect(res.body).to.have.property("message").that.equals("Affiliation not found");
    });
  });
});
