import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import httpStatus from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';

describe("Degree Programs API Tests", function () {
    let degreeProgramId;
    const nonExistentId = uuidv4(); // Generate a valid UUID for non-existent ID tests

    // Create a dummy degree program for testing
    before(async function () {
        const res = await request(app)
            .post(`/v1/degree-programs`)
            .send({
                name: "Testing lang degree program",
                level: 69,
            });

        console.log("POST Response:", res.body);

        if (res.body.status === "CREATED") {
            degreeProgramId = res.body.degreeProgram.id;
            console.log("Successfully created dummy degree program");
        } else {
            console.log("Failed to create dummy degree program");
        }
    });

    describe("GET /v1/degree-programs/:id", function () {
        it("should return 200 and the degree program details", async function () {
            const res = await request(app).get(`/v1/degree-programs/${degreeProgramId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("degreeProgram").that.is.an("object");
        });

        it("should return 404 when the degree program does not exist", async function () {
            const res = await request(app).get(`/v1/degree-programs/${nonExistentId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.have.property("status", "FAILED");
        });
    });

    describe("PUT /v1/degree-programs/:id", function () {
        it("should return 200 and update the degree program", async function () {
            const res = await request(app)
                .put(`/v1/degree-programs/${degreeProgramId}`)
                .send({
                    name: "Master of Science in Computer Science",
                    level: 2,
                });

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property("status", "UPDATED");
        });

        it("should return 404 when trying to update a non-existent degree program", async function () {
            const res = await request(app)
                .put(`/v1/degree-programs/${nonExistentId}`)
                .send({
                    name: "Master of Science in Computer Science",
                    level: 2,
                });

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.have.property("status", "FAILED");
        });
    });

    describe("DELETE /v1/degree-programs/:id", function () {
        it("should return 200 and delete the degree program", async function () {
            const res = await request(app).delete(`/v1/degree-programs/${degreeProgramId}`);

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.have.property("status", "DELETED");
        });

        it("should return 404 when trying to delete a non-existent degree program", async function () {
            const res = await request(app).delete(`/v1/degree-programs/${nonExistentId}`);

            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.have.property("status", "FAILED");
        });
    });
});