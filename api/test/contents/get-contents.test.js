import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Contents API Tests", function() {

  describe("GET /v1/contents", function() {
    it("should return 200 and a list of content items", async function() {
      const res = await request(app)
        .get("/v1/contents")
        .query();

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");

      // Validate contents
      if (res.body.list.length > 0) {
        const content = res.body.list[0];
        expect(content).to.have.property("id").that.is.a("string");
        expect(content).to.have.property("user_id").that.is.a("string");
        expect(content).to.have.property("title").that.is.a("string");
        expect(content).to.have.property("details").that.is.a("string");
        expect(new Date(content.created_at).toString()).to.not.equal("Invalid Date");
        expect(new Date(content.updated_at).toString()).to.not.equal("Invalid Date");
      }
    });

    it("should return filtered results based on created_at date range", async function() {
      const dateFrom = "2025-01-01T00:00:00.000Z";
      const dateTo = "2025-01-31T23:59:59.999Z";
      const res = await request(app)
        .get("/v1/contents")
        .query({
          created_at_from: dateFrom,
          created_at_to: dateTo,
        });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");

      // Validate that the content items are within the date range
      if (res.body.list.length > 0) {
        res.body.list.forEach(content => {
          const createdAt = new Date(content.created_at);
          const from = new Date(dateFrom);
          const to = new Date(dateTo);
          expect(createdAt).to.be.greaterThan(from);
          expect(createdAt).to.be.lessThan(to);
        });
      }
    });

    it("should return filtered results based on title search", async function() {
      const titleSearch = "AMIS";
      const res = await request(app)
        .get("/v1/contents")
        .query({
          title: titleSearch,
        });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");

      // Validate that all content items' titles contain the search string
      if (res.body.list.length > 0) {
        res.body.list.forEach(content => {
          expect(content.title).to.include(titleSearch);
        });
      }
    });

    it("should return filtered results based on tags", async function() {
      const tagSearch = "tag1";  // Example tag to filter by
      const res = await request(app)
        .get("/v1/contents")
        .query({ tags: "{tag1, tag2}" });  // Pass tags as an array

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");

      // Validate that all content items' tags contain the search tag
      if (res.body.list.length > 0) {
        res.body.list.forEach(content => {
          expect(content.tags).to.include(tagSearch);
        });
      }
    });



    it("should return sorted results based on views", async function() {
      const res = await request(app)
        .get("/v1/contents")
        .query({
          sort_by: "views",
          order: "desc",
        });

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("list").that.is.an("array");

      // Validate sorting by views
      if (res.body.list.length > 0) {
        let prevViews = res.body.list[0].views;
        res.body.list.forEach(content => {
          expect(content.views).to.be.at.most(prevViews);
          prevViews = content.views;
        });
      }
    });
  });

  describe("GET /v1/contents/:contentId", function() {
    it("should return 200 and details of a single content item", async function() {
      const contentId = "7f857ca0-fcca-4c5b-b619-d0612597dbb1";
      const res = await request(app).get(`/v1/contents/${contentId}`);

      expect(res.status).to.equal(httpStatus.OK);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("status").that.is.oneOf(["OK", "FAILED"]);
      expect(res.body).to.have.property("content").to.be.an("object");

      const content = res.body.content;

      expect(content).to.have.property("id").that.equals(contentId);
      expect(content).to.have.property("user_id").that.is.a("string");
      expect(content).to.have.property("title").that.is.a("string");
      expect(content).to.have.property("details").that.is.a("string");
    });
  });
});
