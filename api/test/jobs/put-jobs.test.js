import request from 'supertest'; 
import { expect } from 'chai';
import app from '../../index.js';
import httpStatus from 'http-status-codes';

describe('PUT /v1/jobs/:jobId', function () {
    let validJobId = '800c7d53-20f3-4f55-9d1e-5e7855596348'; 

    const jobUpdateData = {
        jobTitle: 'Software Engineer',
        hiringManager: 'John Doe',
        companyName: 'Adonis',
        salary: 75000,
        applyLink: 'https://ics.uplb.edu.ph/'
    };

    it('should update a job successfully', async function () {
        // Simulate a valid jobId and send job update data
        const response = await request(app)
            .put(`/v1/jobs/${validJobId}`)
            .send(jobUpdateData)
            .expect(httpStatus.OK);

        // Validate the response
        expect(response.body).to.have.property('status', 'UPDATED');
        expect(response.body).to.have.property('message');
    });

    it('should return FAILED if jobId is invalid', async function () {
        const invalidJobId = '12345-67890-abcde-fghij-klmno'; 

        const response = await request(app)
            .put(`/v1/jobs/${invalidJobId}`)
            .send(jobUpdateData)
            .expect(httpStatus.BAD_REQUEST);

        // Validate the response when job ID is invalid
        expect(response.body).to.have.property('status', 'FAILED');
        expect(response.body).to.have.property('message');
    });
});
