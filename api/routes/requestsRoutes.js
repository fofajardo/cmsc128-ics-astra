import express from 'express';
import requestsController from '../controllers/requestsController.js';

const requestsRouter = () => {
    const router = express.Router();

    router.get('/', requestsController.getRequests);
    router.get('/:requestId', requestsController.getRequestById);
    router.get('/alum/:userId', requestsController.getRequestsByUserId);
    router.get('/content/:contentId', requestsController.getRequestsByContentId);
    router.post('/', requestsController.createRequest);
    router.put('/:requestId', requestsController.updateRequest);
    router.delete('/:requestId', requestsController.deleteRequest);

    return router;
}

export default requestsRouter;