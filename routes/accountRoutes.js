// routes/accountRoutes.js
import express from 'express';
import { 
    getWalletSummary, 
    getAllTransactions 
} from '../controllers/accountController.js';

const router = express.Router();

router.get('/summary', getWalletSummary);
router.get('/transactions', getAllTransactions);

// router.post('/deposit', addDepositTransaction); // Endpoint to handle new deposits

export default router;