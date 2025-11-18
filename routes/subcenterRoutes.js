// routes/centerRoutes.js
import express from 'express';
import { 
    getSubCenterByCenter, 
    createSubCenter, 
    getCenterSummary 
} from '../controllers/centerController.js';

const router = express.Router();

router.route('/getById')
    .post(getSubCenterByCenter)
router.route('/')
    .post(createSubCenter)



export default router;