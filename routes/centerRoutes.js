// routes/centerRoutes.js
import express from 'express';
import { 
    getAllCenters, 
    createCenter, 
    getCenterSummary 
} from '../controllers/centerController.js';

const router = express.Router();

router.route('/')
    .get(getAllCenters)
    .post(createCenter);

router.route('/summary')
    .get(getCenterSummary); // For dashboard stats

export default router;