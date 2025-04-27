import express from 'express';
import requestsController from '../controllers/requestsController.js';

const requestsRouter = (supabase) => {
    const router = express.Router();

    router.get('/', requestsController.getRequests(supabase));
    router.get('/:requestId', requestsController.getRequestById(supabase));
    router.get('/alum/:userId', requestsController.getRequestsByUserId(supabase));
    router.get('/content/:contentId', requestsController.getRequestsByContentId(supabase));
    router.post('/', requestsController.createRequest(supabase));
    router.put('/:requestId', requestsController.updateRequest(supabase));
    router.delete('/:requestId', requestsController.deleteRequest(supabase));

    return router;
}

export default requestsRouter;