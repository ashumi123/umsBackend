// controllers/accountController.js
import Transaction from '../models/Transaction.js';

// @route   GET /api/v1/accounts/summary
// @desc    Get overall wallet balance, deposits, and usage
export const getWalletSummary = async (req, res) => {
    try {
        // Aggregation to sum deposits and usage
        const transactions = await Transaction.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        let totalDeposits = 0;
        let totalUsage = 0;
        
        transactions.forEach(txn => {
            if (txn._id === 'Deposit') {
                totalDeposits = txn.totalAmount;
            } else if (txn._id === 'Usage') {
                totalUsage = txn.totalAmount;
            }
        });

        const currentBalance = totalDeposits - totalUsage;

        // Simple formatting to display as currency (frontend can handle this better)
        const formatCurrency = (amount) => `₹ ${new Intl.NumberFormat('en-IN').format(amount)}`;

        res.status(200).json({
            success: true,
            data: {
                currentBalance: formatCurrency(currentBalance),
                totalDeposits: formatCurrency(totalDeposits),
                totalUsage: formatCurrency(totalUsage),
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @route   GET /api/v1/accounts/transactions
// @desc    Get all transactions, optionally filtering by type (Deposit/Usage)
export const getAllTransactions = async (req, res) => {
    try {
        const { type } = req.query; // Check for ?type=Deposit or ?type=Usage
        let query = {};
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        // Map the results to match the frontend DataTable columns
        const formattedTransactions = transactions.map(t => ({
            id: t.txnId,
            date: t.date.toISOString().split('T')[0],
            type: t.type,
            center: t.center,
            amount: `₹ ${new Intl.NumberFormat('en-IN').format(t.amount)}`,
            reason: t.reason
        }));

        res.status(200).json({ success: true, data: formattedTransactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};