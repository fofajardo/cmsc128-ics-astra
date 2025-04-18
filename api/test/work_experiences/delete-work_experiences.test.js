import { expect } from 'chai';
import httpStatus from 'http-status-codes';
import request from 'supertest';

import app from '../../index.js';

const kRoutePrefix = '/v1/work_experiences/';

describe('Work Experiences API - Delete and Verify Deletion', function () {
    this.timeout(4000);

    let workExperienceId = null;

    // ✅ Precondition: Create a work_experience before running delete tests
    before(async function () {
        const testWorkExperience = {
            alum_id: '75b6e610-9d0b-4884-b405-1e682e3aa3de',
            title: 'test title',
            field: 'test field',
            company: 'test company',
            year_started: new Date('2020-01-01'),
            year_ended: new Date('2021-01-01'),
        };

        const res = await request(app)
            .post(kRoutePrefix)
            .send(testWorkExperience);

        expect(res.status).to.equal(httpStatus.CREATED);
        workExperienceId = res.body.id;
    });

    // Delete the work experience
    describe(`DELETE ${kRoutePrefix}:workExperienceId`, function () {
        it('should delete the work experience and return status DELETED', async function () {
            const res = await request(app)
                .delete(`${kRoutePrefix}${workExperienceId}`)

            expect(res.status).to.equal(httpStatus.OK);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'DELETED');
        });
    });

    // Verify deletion
    describe(`GET ${kRoutePrefix}:workExperienceId after deletion`, function () {
        it('should return 404 Not Found', async function () {
            const res = await request(app).get(`${kRoutePrefix}${workExperienceId}`);
            
            expect(res.status).to.equal(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status', 'FAILED');
        });
    });
});