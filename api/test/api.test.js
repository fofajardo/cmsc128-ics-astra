import request from "supertest";
import { expect } from "chai";
import app from "../index.js";
import httpStatus from "http-status-codes";

describe("API Tests", function () {
  it("should return 200 for GET /", async function () {
    const res = await request(app).get("/");
    expect(res.status).to.equal(httpStatus.OK);
    expect(res.body).to.be.an("object");
  });
});
