import express from 'express';
import { check, validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all user transactions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions/monthly
// @desc    Get user transactions by month
// @access  Private
router.get('/monthly', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions
// @desc    Create transaction
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('type', 'Type must be income, expense, or transfer').isIn([
        'income',
        'expense',
        'transfer',
      ]),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { amount, description, category, date, type } = req.body;
      
      const transaction = new Transaction({
        amount,
        description,
        category,
        date,
        type,
        userId: req.user._id,
      });
      
      await transaction.save();
      
      res.status(201).json(transaction);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { amount, description, category, date, type } = req.body;
    
    // Check if transaction exists
    let transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check user owns transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update transaction
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: { amount, description, category, date, type } },
      { new: true }
    );
    
    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if transaction exists
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check user owns transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await Transaction.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;