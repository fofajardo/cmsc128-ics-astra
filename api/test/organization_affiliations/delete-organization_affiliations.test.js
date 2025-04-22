import { expect } from "chai";
import httpStatus from "http-status-codes";
import request from "supertest";

import app from "../../index.js";

// TODO: would be nice to reference the route prefix in a constants
// file instead.

const alumId = 'b4a6b230-20b9-4137-af62-8b535841c391'; // should be a real alum_id
const orgId = '7cfb8d38-5606-42fd-835d-0f420620709c'; // should be a real org_id
const routePrefix = `/v1/users/${alumId}/organizations`;

describe('Organization Affiliations Delete API Test', function () {

    // ✅ Precondition: Create affiliation before running delete tests
    before(async function () {
        const testAffiliation= {
            org_id: orgId, 
            role: 'test role',
            joined_date: new Date('2023-10-20').toISOString(),
        };

        const res = await request(app)
            .post(routePrefix)
            .send(testAffiliation);

        expect(res.status).to.equal(httpStatus.CREATED);
    });
    
    describe(`DELETE ${routePrefix}/:orgId `, function () {
        it('should hard delete the affiliation and return status DELETED', async function () {
            const res = await request(app)
                .delete(`${routePrefix}/${orgId}`)

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'DELETED');
            expect(res.body).to.have.property('message').that.is.a('string');
        });
    });

    // Getting a single organization affiliation is not required based on the documentation

    // describe(`GET ${routePrefix}:orgId after hard deletion`, function () {
    //     it('should return 404 Not Found', async function () {
    //         const res = await request(app).get(`${routePrefix}${orgId}`);

    //         expect(res.status).to.equal(httpStatus.NOT_FOUND);
    //         expect(res.body).to.be.an('object');
    //         expect(res.body).to.have.property('status', 'FAILED');
    //     });
    // });
});