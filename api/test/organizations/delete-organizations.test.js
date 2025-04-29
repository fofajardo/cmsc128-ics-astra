import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";

import app from "../../index.js";

// TODO: would be nice to reference the route prefix in a constants
// file instead.
const kRoutePrefix = "/v1/organizations/";

describe("Organizations API - Delete and Verify Deletion", function () {
  let orgId = null;

  // ✅ Precondition: Create a user before running delete tests
  before(async function () {
    const testOrg = {
      name: "UPLB University Student Council",
      acronym: "USC",
      type: 0,
      founded_date: "2005-10-20"
    };

    const res = await request(app)
      .post(kRoutePrefix)
      .send(testOrg);

    expect(res.status).to.equal(httpStatus.CREATED);
    orgId = res.body.id;
  });

  describe(`DELETE ${kRoutePrefix}:orgId `, function () {
    it("should hard delete the user and return status DELETED", async function () {
      const res = await request(app)
        .delete(`${kRoutePrefix}${orgId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status", "DELETED");
    });
  });

  describe(`GET ${kRoutePrefix}:orgId after hard deletion`, function () {
    it("should return 404 Not Found", async function () {
      const res = await request(app).get(`${kRoutePrefix}${orgId}`);

      expect(res.status).to.equal(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status", "FAILED");
    });
  });
});