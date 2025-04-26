import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";

describe("Photos API Tests", function () {
    let photoId;

    // Create a dummy photo for testing
    before(async function () {
        const res = await request(app)
            .post(`/v1/photos`)
            .field("user_id", "6e16d569-627b-4c41-837f-c24653579b46") // dummy ID
            .attach("File", "assets/photos/sample1.png");

        console.log("Test File:", "assets/photos/sample.png");
        console.log("Test Body:", res.body);

        console.log("POST Response:", res.body);

        if (res.body.status === "CREATED") {
            photoId = res.body.photo.id;
            console.log("Successfully created dummy photo");
        } else {
            console.log("Failed to create dummy photo");
        }
    });

    describe("GET /v1/photos", function () {
        it("should return 200 and a list of photos", async function () {
            const res = await request(app).get(`/v1/photos`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("photos").that.is.an("array");
        });
    });

    describe("GET /v1/photos/:id", function () {
        it("should return 200 and the photo details", async function () {
            const res = await request(app).get(`/v1/photos/${photoId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("photo").that.is.an("object");
        });

        it("should return 404 when the photo does not exist", async function () {
            const res = await request(app).get(`/v1/photos/non-existent-id`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.have.property("status", "FAILED");
        });
    });

    describe("DELETE /v1/photos/:id", function () {
        it("should return 200 and delete the photo", async function () {
            const res = await request(app).delete(`/v1/photos/${photoId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property("status", "DELETED");
        });

        it("should return 404 when trying to delete a non-existent photo", async function () {
            const res = await request(app).delete(`/v1/photos/non-existent-id`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.have.property("status", "FAILED");
        });
    });
});